const cheerio = require('cheerio');
const axios = require('axios');

module.exports = class JwDownloader {
  static download(url) {
    return axios.get(this.encodeUrl(url))
    .then((response) => {
      const $ = cheerio.load(response.data);
      this.text = [];

      const mainImage = $('.lsrBannerImage');
      if (mainImage.length) {
        this.text.push({
          type: 'img',
          large: $(mainImage).find('span').attr('data-zoom'),
          small: $(mainImage).find('span').attr('data-img-size-lg'),
        });
      }

      this.text.push({
        type: 'h1',
        text: $('article header h1').text(),
      });

      const figcaptionsText = [];

      $('article .docSubContent').children().each((i, children) => {
        let contentText = $(children).text();

        if ($(children).hasClass('blockTeach')) {
          const boxH2 = $(children).find('aside h2');
          if (boxH2) {
            this.text.push({
              type: 'h2',
              text: $(boxH2).text(),
            });

            contentText = $(children).find('.boxContent').text();
          }
        }

        if ($(children).hasClass('bodyTxt')) {
          $(children).children().each((j, subChildren) => {
            const boxH2 = $(subChildren).find('h2');
            if (boxH2 && $(boxH2).text()) {
              this.text.push({
                type: 'h2',
                text: $(boxH2).text(),
              });
            }

            $(subChildren).find('div').children().each((k, subChildren02) => {
              const figure = $(subChildren02).find('figure');
              if (figure.length) {
                this.text.push({
                  type: 'img',
                  large: $(figure).find('span').attr('data-zoom'),
                  small: $(figure).find('span').attr('data-img-size-lg'),
                });

                const figcaption = $(figure).find('figcaption');
                if (figcaption.length) {
                  const text = this.trim($(figcaption).text());
                  figcaptionsText.push(text);

                  this.text.push({
                    type: 'imgcaption',
                    text,
                  });
                }

                return;
              }
              const text = this.trim($(subChildren02).text());
              if (!text) {
                return;
              }

              if (figcaptionsText.indexOf(text) > -1) {
                return;
              }

              this.text.push({
                text,
              });
            });
          });
          return;
        }

        this.explodeLines(contentText).forEach((line) => {
          if (!line) {
            return;
          }

          if (figcaptionsText.indexOf(line) > -1) {
            return;
          }

          this.text.push({
            text: line,
          });
        });
      });

      return this.text;
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
