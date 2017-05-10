const Promise = require('bluebird');
const cheerio = require('cheerio');
const axios = require('axios');
const knex = require('./knex');
const replaceall = require('replaceall');
const replaceIdeogramsToSpace = require('../helpers/special-ideograms-chars');
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

  static async download(url, language) {
    let response = await axios.get(this.encodeUrl(url));
    let $ = cheerio.load(response.data);
    const parsedDownload = await this.parseDownload($, true);

    if (language) {
      const translateLink = $(`link[hreflang="${language}"]`);
      if (translateLink.length > 0) {
        const link = `https://www.jw.org${translateLink.attr('href')}`;
        response = await axios.get(link);
        $ = cheerio.load(response.data);
        const parsedDownloadLanguage = await this.parseDownload($, false);
        parsedDownloadLanguage.text.forEach((item, i) => {
          if (item.type === 'img') {
            return;
          }

          if (item.type === 'box-img') {
            return;
          }

          if (!parsedDownload.text[i]) {
            parsedDownload.text[i] = {};
          }

          parsedDownload.text[i].trans = item.text;
        });
      }
    }

    return parsedDownload;
  }

  static async parseDownload($, isChinese) {
    const downloadResponse = {};
    this.text = [];
    this.isChinese = isChinese;
    this.figcaptionsText = [];

    downloadResponse.audio = null;
    let media = $('.jsAudioPlayer a');
    if (isChinese && media.length > 0) {
      downloadResponse.audio = media.attr('href');
    } else if (isChinese) {
      media = $('.jsAudioFormat a');
      if (media.length > 0) {
        try {
          let titleWithoutSpaces = replaceall(' ', '', this.getText($, $('article header h1')));
          replaceIdeogramsToSpace.forEach((item) => {
            titleWithoutSpaces = replaceall(item, '', titleWithoutSpaces);
          });
          const responseAudio = await axios.get(this.encodeUrl(media.attr('data-jsonurl')));
          responseAudio.data.files.CHS.MP3.some((file) => {
            let audioTitleWithoutSpaces = replaceall(' ', '', file.title);
            replaceIdeogramsToSpace.forEach((item) => {
              audioTitleWithoutSpaces = replaceall(item, '', audioTitleWithoutSpaces);
            });

            if (titleWithoutSpaces === audioTitleWithoutSpaces) {
              downloadResponse.audio = file.file.url;
              return true;
            }

            return false;
          });
        } catch (e) {
          // eslint-disable-next-line
          console.log(e.message);
        }
      }
    }

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
      } else if ($(children).hasClass('article')) {
        $(children).children().each((j, subChildren) => {
          if ($(subChildren).hasClass('questions')) {
            $(subChildren).children().each((k, subChildren02) => {
              if ($(subChildren02).get(0).tagName === 'h2') {
                this.text.push({
                  text: this.getText($, subChildren02),
                  type: 'box-h2',
                });
              } else if ($(subChildren02).get(0).tagName === 'ul') {
                $(subChildren02).children().each((l, subChildren03) => {
                  this.parseContent($, subChildren03, 'box');
                });
              } else {
                this.parseContent($, subChildren02, 'box');
              }
            });
          } else {
            this.parseBlock($, subChildren);
          }
        });
      } else {
        this.parseBlock($, children);
      }
    });

    downloadResponse.text = this.text;
    return downloadResponse;
  }

  static parseBlock($, element) {
    if ($(element).attr('class') && $(element).attr('class').indexOf('boxSupplement') !== -1) {
      //
      const boxFigure = $(element).find('.fullBleed figure');
      if (boxFigure.length) {
        this.text.push({
          type: 'box-img',
          large: $(boxFigure).find('span').attr('data-zoom'),
          small: $(boxFigure).find('span').attr('data-img-size-lg'),
        });
      }

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

    if ($(element).hasClass('stdPullQuote')) {
      type = 'box';
    }

    let footnote = null;
    if (type === 'foot') {
      footnote = replaceall('footnote', '', $(element).attr('id'));
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

      let large = $(figure).find('span').attr('data-zoom');
      let small = $(figure).find('span').attr('data-img-size-lg');

      if (!large) {
        large = $(figure).find('img').attr('src');
      }

      if (!small) {
        small = $(figure).find('img').attr('src');
      }

      this.text.push({
        type: imgType,
        large,
        small,
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

      if (footnote) {
        item.footnote = footnote;
      }

      this.text.push(item);
    });
  }

  static getText($, element) {
    let text = $(element).html();
    if (text === null) {
      return '';
    }

    // asterisk
    const footNotes = $(element).find('.footnoteLink');
    let footNoteId = null;
    if (footNotes.length > 0 && this.isChinese) {
      footNotes.each((i, footNote) => {
        footNoteId = replaceall('#footnote', '', $(footNote).attr('data-anchor')).trim();
        text = replaceall($.html(footNote), `#FOOTNOTE${$(footNote).html()}`, text);
      });
    }

    const numberRegex = new RegExp('^[0-9]+$');

    text = replaceall('<strong>', '//STRONG-OPEN//', text);
    text = replaceall('</strong>', '//STRONG-CLOSE//', text);
    text = replaceall('<wbr>', ' ', text);
    text = replaceall('<p>', '\r\n<p>', text);
    text = replaceall('<li>', '\r\n<li>', text);
    text = $('<textarea />').html(text).text();
    text = text.replace(/[\u200B-\u200D\uFEFF]/g, ' '); // replace zero width space to space
    text = replaceall(String.fromCharCode(160), ' ', text); // Convert NO-BREAK SPACE to SPACE

    text = replaceall('//STRONG-OPEN//', '<b>', text);
    text = replaceall('//STRONG-CLOSE//', '</b>', text);

    if (!this.isChinese) {
      return this.trim(text);
    }

    const lines = text.trim().split('\r\n');

    let newText = '';
    lines.forEach((line) => {
      let lineText = '';
      let verifyText = line;
      replaceIdeogramsToSpace.forEach((item) => {
        verifyText = replaceall(`${item} `, item, verifyText);
      });

      if (verifyText.trim().split(' ').length === 1) {
        let segementedText = UnihanSearch.segment(line).join(' ');
        segementedText = replaceall('< b >', '<b>', segementedText);
        segementedText = replaceall('< / b >', '</b>', segementedText);
        lineText = segementedText;
      } else {
        lineText = line;
      }

      lineText = replaceall('<b>', ' <b> ', lineText);
      lineText = replaceall('</b>', ' </b> ', lineText);

      const specialWord = 'JOIN_SPECIAL';

      // separate by numbers
      lineText = lineText
          .split(/(\d+)/)
          .map((item) => {
            if (numberRegex.test(item)) {
              item = ` ${item}${specialWord} `;
            }
            return item;
          })
          .join('');

      replaceIdeogramsToSpace.forEach((item) => {
        lineText = replaceall(item, ` ${item}${specialWord} `, lineText);
      });
      // remove double spaces
      if (lineText) {
        lineText = lineText.replace(/\s{2,}/g, ' ').trim();
      }

      const ideograms = lineText.split(' ');
      const ideogramsFiltered = [];

      let joinSpecial = '';

      ideograms.forEach((ideogram) => {
        if (ideogram === specialWord) {
          return;
        }

        if (ideogram.substring(ideogram.length - specialWord.length) === specialWord) {
          joinSpecial += ideogram.replace(specialWord, '');
          return;
        } else if (joinSpecial) {
          ideogramsFiltered.push(joinSpecial);
          joinSpecial = '';
        }

        ideogramsFiltered.push(ideogram);
      });

      if (joinSpecial) {
        ideogramsFiltered.push(joinSpecial);
      }

      lineText = ` ${ideogramsFiltered.join(' ')} `;

      const wordsToReplace = [
        '各地',
        '可见',
      ];
      wordsToReplace.forEach((word) => {
        const replaceWord = ` ${word.split('').join(' ')} `;
        lineText = replaceall(replaceWord, ` ${word} `, lineText);
      });

      if (footNoteId) {
        lineText = replaceall('#FOOTNOTE', `#FOOTNOTE-${footNoteId}-`, lineText);
      }

      newText += `${lineText}\r\n`;
    });

    text = newText;
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
