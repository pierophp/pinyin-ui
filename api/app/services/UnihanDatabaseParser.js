const knex = require('./knex');
const removeDiacritics = require('diacritics').remove;
const Promise = require('bluebird');
const fs = require('fs');
const xml2js = require('xml2js');

module.exports = class UnihanDatabaseParser {

  static saveWord(pinyin, ideograms) {
    let ideogramsConverted = '';

    for (let i = 0; i < ideograms.length; i += 1) {
      ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
    }

    return new Promise((resolve) => {
      knex('cjk').insert({
        ideogram: ideogramsConverted,
        pronunciation: pinyin,
        pronunciation_unaccented: removeDiacritics(pinyin),
        definition: '',
        frequency: 1,
        language_id: 1,
        type: 'W',
        usage: 0,
        created_at: new Date(),
      }).then(() => {
        resolve();
      }).error(() => {
        resolve();
      });
    });
  }

  static loadFile(file) {
    return new Promise((resolve, reject) => {
      knex.raw('SET NAMES utf8mb4;').then(() => {});
      knex.raw('SET character_set_results="utf8mb4";').then(() => {});
      knex.raw('SET character_set_client="utf8mb4";').then(() => {});
      knex.raw('SET character_set_connection="utf8mb4";').then(() => {});

      const parser = new xml2js.Parser();
      const data = fs.readFileSync(file);

      parser.parseString(data, (err, result) => {
        const chars = result.ucd.repertoire[0].char;
        const ideogramList = [];

        Promise.map(chars, (char) => {
          if (!char.$.kMandarin) {
            return false;
          }

          const ideogram = char.$.cp;

          if (ideogramList.indexOf(ideogram) !== -1) {
            return false;
          }

          ideogramList.push(ideogram);

          let frequency = char.$.kFrequency;

          if (!frequency) {
            frequency = 999;
          }

          if (char.$.kSimplifiedVariant) {
            console.log(char.$.kMandarin);
            console.log(char.$.kSimplifiedVariant);
          }

          const definition = char.$.kDefinition;

          return new Promise((resolveItem, rejectItem) => {
            knex('cjk')
              .where({
                ideogram,
              })
              .then((dataCjk) => {
                if (dataCjk.length === 0) {
                  knex('cjk').insert({
                    ideogram,
                    pronunciation: char.$.kMandarin,
                    pronunciation_unaccented: removeDiacritics(char.$.kMandarin),
                    definition_unihan: definition,
                    frequency,
                    language_id: 1,
                    type: 'C',
                    usage: 0,
                    created_at: new Date(),
                  }).then(() => {
                    resolveItem();
                  }).error(() => {
                    rejectItem();
                  });
                } else {
                  resolveItem();
                }
              })
              .error(() => {
                rejectItem();
              });
          });
        }, {
          concurrency: 20,
        }).then(() => {
          resolve();
        }).error(() => {
          reject();
        });
      });
    });
  }
};
