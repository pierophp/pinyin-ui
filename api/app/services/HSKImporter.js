const Promise = require('bluebird');
const axios = require('axios');
const cheerio = require('cheerio');
const knex = require('./knex');
const UnihanSearch = require('../services/UnihanSearch');


module.exports = class HSKImporter {
  static async import() {
    for (let i = 1; i <= 6; i += 1) {
      // eslint-disable-next-line
      console.log(i);
      const response = await axios.get(`http://www.hsk.academy/en/hsk_${i}`);
      const $ = cheerio.load(response.data);
      const elements = $('.theme_label__UH5A4');
      const words = [];

      elements.each((j, element) => {
        $(element).text().split('…').forEach((item) => {
          if (item) {
            words.push(item);
          }
        });
      });

      await Promise.map(words, async (word) => {
        const items = await knex('cjk')
              .select('id', 'hsk')
              .where({
                ideogram: UnihanSearch.convertIdeogramsToUtf16(word),
              });

        if (items.length === 0) {
          // eslint-disable-next-line
          console.log('Not Found');
          // eslint-disable-next-line
          console.log(word);
        }

        await Promise.map(items, async (item) => {
          if (item.hsk) {
            return;
          }

          await knex('cjk')
              .where('id', '=', item.id)
              .update({
                hsk: i,
              });
        });
      });
    }
  }
};
