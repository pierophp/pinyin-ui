const cheerio = require('cheerio');
const axios = require('axios');

module.exports = class JwDownloader {
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
          text: this.trim($('article header h1').text()),
          type: 'h1',
        });

        $('article .docSubContent').children().each((i, children) => {
          if ($(children).hasClass('blockTeach')) {
            const boxH2 = $(children).find('aside h2');
            if (boxH2) {
              this.text.push({
                text: this.trim($(boxH2).text()),
                type: 'h2',
              });

              this.parseBlock($, $(children).find('.boxContent'));
            }
          } else if ($(children).hasClass('bodyTxt')) {
            $(children).children().each((j, subChildren) => {
              const boxH2 = $(subChildren).children('h2');
              if (boxH2 && $(boxH2).text()) {
                this.text.push({
                  text: this.trim($(boxH2).text()),
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
          text: this.trim($(boxH2).text()),
          type: 'box-h2',
        });
      }

      $(element).find('.boxContent').children().each((l, subChildren) => {
        this.parseContent($, subChildren, 'box');
      });
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

        const text = this.trim($(figcaption).text());
        this.figcaptionsText.push(text);

        this.text.push({
          type: imgCaption,
          text,
        });
      }

      return;
    }

    const text = this.trim($(element).text());
    if (!text) {
      return;
    }

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
