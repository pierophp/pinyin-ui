
const knex = require('./knex');
const removeDiacritics = require('diacritics').remove;
const Promise = require('bluebird');

module.exports = class UnihanDatabaseParser {

  constructor() {

  }

  saveWord(pinyin, ideograms) {
    let ideogramsConverted = '';

    for (let i = 0; i < ideograms.length; i++) {
      ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
    }

    return new Promise((resolve, reject) => {
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
        reject();
      });
    });
  }

  loadFile(file) {
    const fs = require('fs');
    const xml2js = require('xml2js');
    const parser = new xml2js.Parser();
    const data = fs.readFileSync(file);

    parser.parseString(data, (err, result) => {
      const chars = result.ucd.repertoire[0].char;

      Promise.map(chars, (char) => {
        if (!char.$.kMandarin) {
          return false;
        }

        let frequency = char.$.kFrequency;

        if (!frequency) {
          frequency = 999;
        }

        let definition = char.$.kDefinition;
        if (definition) {
          definition = definition.substr(0, 255);
        }

        return knex('cjk').insert({
          ideogram: char.$.cp,
          pronunciation: char.$.kMandarin,
          pronunciation_unaccented: removeDiacritics(char.$.kMandarin),
          definition,
          frequency,
          language_id: 1,
          type: 'C',
          usage: 0,
          created_at: new Date(),
        });
      }, { concurrency: 10 }).then(() => {

      });
    });
  }
};
