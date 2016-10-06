const knex = require('./knex');
const removeDiacritics = require('diacritics').remove;
const Promise = require('bluebird');
const UnihanSearch = require('../services/UnihanSearch');
const readline = require('readline');
const fs = require('fs');

module.exports = class CcCeDictDatabaseParser {

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
      });
    });
  }

  static loadFile(file) {
    const lineReader = readline.createInterface({
      input: fs.createReadStream(file),
    });

    lineReader.on('line', (line) => {
      if (line[0] === '#') {
        return;
      }

      let parts = line.split('/');
      let ideogram = parts[0].split(' ')[1];

      parts = line.split('/');

      let pronunciation = parts[0].split('[')[1].replace(']', '').toLowerCase().replace(new RegExp(' ', 'g'), '');
      const pronunciationUnaccented = pronunciation.replace(new RegExp('[12345]', 'g'), '');
      pronunciation = UnihanSearch.pinyinTonesNumbersToAccents(pronunciation).replace(new RegExp('5', 'g'), '');

      parts.shift();
      const descriptions = [];
      const measureWords = [];
      for (const part of parts) {
        if (part.substr(0, 3) !== 'CL:') {
          if (part) {
            descriptions.push(part);
          }
          continue;
        }

        const measureWordsTmp = part.replace('CL:', '').split(',');
        for (let measureWord of measureWordsTmp) {
          measureWord = measureWord.split('[')[0].split('|');
          if (measureWord[1] !== undefined) {
            measureWord = measureWord[1];
          } else {
            measureWord = measureWord[0];
          }

          measureWords.push(measureWord);
        }
      }

      ideogram = UnihanSearch.convertIdeograms(ideogram);

      knex('cjk')
        .where({
          ideogram,
        })
        .then((data) => {
          //console.log(data);
        });

      knex('cjk').insert({
        ideogram,
        pronunciation,
        pronunciation_unaccented: pronunciationUnaccented,
        definition_cedict: '',
        language_id: 1,
        type: 'W',
        usage: 0,
        created_at: new Date(),
      });

      /*
      console.log({
        ideogram,
        descriptions,
        pronunciation,
        pronunciationUnaccented,
        measureWords,
      });
      */
    });
  }
};
