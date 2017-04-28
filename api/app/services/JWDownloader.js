const Promise = require('bluebird');
const cheerio = require('cheerio');
const axios = require('axios');
const knex = require('./knex');
const replaceall = require('replaceall');
const UnihanSearch = require('../services/UnihanSearch');

module.exports = class JwDownloader {
  static async loadTracks() {
    const response = await axios.get('https://mediator.jw.org/v1/categories/CHS/VideoOnDemand?detailed=1');
    const categories = response.data.category.subcategories;
    await Promise.map(categories, async (category) => {
      const res = await axios.get(`https://mediator.jw.org/v1/categories/CHS/${category.key}?detailed=1`);
      const subcategories = res.data.category.subcategories;

      await Promise.map(subcategories, async (subcategory) => {
        if (subcategory.key.substr(-8) === 'Featured') {
          return;
        }
        const url = `https://mediator.jw.org/v1/categories/CHS/${subcategory.key}?detailed=0`;
        try {
          const subRes = await axios.get(url);

          await Promise.map(subRes.data.category.media, async (media) => {
            if (media.files[0].subtitles !== undefined) {
              const urlParts = media.files[0].progressiveDownloadURL.split('/');
              const video = urlParts[urlParts.length - 1].replace(/_r(.*)P/g, '').replace('.mp4', '');
              const videoTrack = await knex('video_track').where({ video });
              if (videoTrack.length === 0) {
                await knex('video_track').insert({
                  video,
                  track_url: media.files[0].subtitles.url,
                  description: media.title,
                  created_at: new Date(),
                });
                // eslint-disable-next-line
                console.log(video);
                // eslint-disable-next-line
                console.log(media.title);
                // eslint-disable-next-line
                console.log(media.files[0].subtitles.url);
              }
            }
          });
        } catch (e) {
          // eslint-disable-next-line
          console.log(url);
          // eslint-disable-next-line
          console.log(e);
          return;
        }
      });
    });
  }
  static async track(url) {
    const urlParts = url.split('/');
    const filename = urlParts[urlParts.length - 1].replace(/_r(.*)P/g, '').replace('.mp4', '');
    const videoTrack = await knex('video_track').where({ video: filename });

    if (videoTrack.length === 0) {
      return '';
    }

    const response = await axios.get(this.encodeUrl(videoTrack[0].track_url));
    const lines = response.data.split('\n');
    let i = 0;
    const trackList = await Promise.map(lines, async (line) => {
      const lineSplit = line.split('-->');
      if (lineSplit.length > 1) {
        i += 1;
        return line;
      }

      if (i > 0) {
        if (line.trim()) {
          const ideograms = UnihanSearch.segment(line);
          const pinyinList = await UnihanSearch.toPinyin(ideograms);
          let newLine = '<ruby>';
          pinyinList.forEach((pinyin) => {
            newLine += `${pinyin.ideogram}`;
            newLine += ` <rt>${pinyin.pinyin.trim()}</rt> `;
          });
          newLine += '</ruby>';


          return newLine;
        }

        return line;
      }

      return line;
    });

    return trackList.join('\n');
  }

  static download(url) {
    return axios.get(this.encodeUrl(url))
      .then((response) => {
        const $ = cheerio.load(response.data);
        this.text = [];
        this.figcaptionsText = [];

        const mainImage = $('.lsrBannerImage');
        if (mainImage.length) {
          this.text.push({
            large: $(mainImage).find('span').attr('data-zoom'),
            small: $(mainImage).find('span').attr('data-img-size-lg'),
            type: 'img',
          });
        }

        this.text.push({
          text: this.getText($, $('article header h1')),
          type: 'h1',
        });

        $('article .docSubContent').children().each((i, children) => {
          if ($(children).hasClass('blockTeach')) {
            const boxH2 = $(children).find('aside h2');
            if (boxH2 && $(boxH2).text()) {
              this.text.push({
                text: this.getText($, boxH2),
                type: 'h2',
              });

              this.parseBlock($, $(children).find('.boxContent'));
            }
          } else if ($(children).hasClass('bodyTxt')) {
            $(children).children().each((j, subChildren) => {
              const boxH2 = $(subChildren).children('h2');
              if (boxH2 && $(boxH2).text()) {
                this.text.push({
                  text: this.getText($, boxH2),
                  type: 'h2',
                });
              }

              $(subChildren).children('div').children().each((k, subChildren02) => {
                this.parseBlock($, subChildren02);
              });
            });
          } else {
            this.parseBlock($, children);
          }
        });

        return this.text;
      });
  }

  static parseBlock($, element) {
    if ($(element).attr('class') && $(element).attr('class').indexOf('boxSupplement') !== -1) {
      const boxH2 = $(element).find('h2');
      if (boxH2 && $(boxH2).text()) {
        this.text.push({
          text: this.getText($, boxH2),
          type: 'box-h2',
        });
      }

      if ($(element).find('.boxContent').length > 0) {
        $(element).find('.boxContent').children().each((i, subChildren) => {
          if ($(subChildren).get(0).tagName === 'ul') {
            $(subChildren).children().each((j, subChildrenLi) => {
              $(subChildrenLi).children().each((k, subChildrenLiContent) => {
                this.parseContent($, subChildrenLiContent, 'box');
              });
            });
          } else {
            this.parseContent($, subChildren, 'box');
          }
        });
      } else {
        const subBoxH2 = $(element).find('table caption');
        if (subBoxH2 && $(subBoxH2).text()) {
          this.text.push({
            text: this.getText($, subBoxH2),
            type: 'box',
          });
        }

        $(element).find('table tr').each((j, subChildrenTr) => {
          this.parseContent($, subChildrenTr, 'box');
        });
      }
    } else if ($(element).attr('class') && $(element).attr('class').indexOf('groupFootnote') !== -1) {
      $(element).children().each((l, subChildren) => {
        this.parseContent($, subChildren, 'foot');
      });
    } else {
      this.parseContent($, element);
    }
  }

  static parseContent($, element, type) {
    if ($(element).hasClass('qu')) {
      type = 'qu';
    }

    const figure = $(element).find('figure');

    if (figure.length && $(element).get(0).tagName === 'aside') {
      return;
    }

    if (figure.length) {
      let imgType;
      if (type) {
        imgType = `${type}-img`;
      } else {
        imgType = 'img';
      }

      this.text.push({
        type: imgType,
        large: $(figure).find('span').attr('data-zoom'),
        small: $(figure).find('span').attr('data-img-size-lg'),
      });

      const figcaption = $(figure).find('figcaption');
      if (figcaption.length) {
        let imgCaption;
        if (type) {
          imgCaption = `${type}-imgcaption`;
        } else {
          imgCaption = 'imgcaption';
        }

        const text = this.getText($, figcaption);
        this.figcaptionsText.push(text);

        this.text.push({
          type: imgCaption,
          text,
        });
      }

      return;
    }

    let text = this.trim($(element).text());
    if (!text) {
      return;
    }

    text = this.getText($, element);

    if (this.figcaptionsText.indexOf(text) > -1) {
      return;
    }

    this.explodeLines(text).forEach((line) => {
      if (!line) {
        return;
      }

      const item = {
        text: line,
      };

      if (type) {
        item.type = type;
      }

      this.text.push(item);
    });
  }

  static getText($, element) {
    let text = $(element).html();
    if (text === null) {
      return '';
    }

    text = replaceall('<strong>', '//STRONG-OPEN//', text);
    text = replaceall('</strong>', '//STRONG-CLOSE//', text);
    text = replaceall('<wbr>', ' ', text);
    text = $('<textarea />').html(text).text();
    text = text.replace(/[\u200B-\u200D\uFEFF]/g, ' '); // replace zero width space to space
    text = replaceall('//STRONG-OPEN//', '<b>', text);
    text = replaceall('//STRONG-CLOSE//', '</b>', text);
    text = this.trim(text);
    return text;
  }

  static explodeLines(text) {
    return text.split('\r\n').map(s => this.trim(s));
  }

  static trim(s) {
    return s.trim();
  }

  static encodeUrl(url) {
    let newUrl = 'https://www.jw.org/';
    if (url.substr(0, newUrl.length) !== newUrl) {
      return url;
    }

    const urlParts = url.replace(newUrl, '').split('/');
    urlParts.forEach((urlPart) => {
      newUrl += encodeURIComponent(urlPart);
      newUrl += '/';
    });
    return newUrl;
  }
};
