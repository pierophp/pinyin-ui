const knex = require('./knex');
const removeDiacritics = require('diacritics').remove;
const Promise = require('bluebird');
const UnihanSearch = require('../services/UnihanSearch');
const readline = require('readline');
const fs = require('fs');
const replaceall = require('replaceall');

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
    return new Promise((resolve, reject) => {
      const promises = [];

      function processPromisses() {
        // eslint-disable-next-line
        console.log('Promise process init');
        Promise.map(promises, promiseImport =>
          promiseImport()
        , {
          concurrency: 2,
        }).then(() => {
          resolve();
        }).error(() => {
          reject();
        });
      }

      const ideogramList = [];

      function readLine(line) {
        if (!line) {
          return null;
        }

        let parts = line.split('/');
        let ideogram = parts[0].split(' ')[1];
        parts = line.split('/');

        let pronunciation = '';
        const pronunciationList = parts[0]
                      .split('[')[1]
                      .replace(']', '')
                      .toLowerCase()
                      .split(' ');

        const vogals = ['a', 'e', 'o'];
        pronunciationList.forEach((p, index) => {
          if (index > 0) {
            if (vogals.indexOf(p[0]) > -1) {
              pronunciation += "'";
            }
          }
          pronunciation += p;
        });

        pronunciation = replaceall('u:', 'ü', pronunciation);

        const pronunciationUnaccented = pronunciation.replace(new RegExp('[12345]', 'g'), '');
        pronunciation = UnihanSearch
                            .pinyinTonesNumbersToAccents(pronunciation)
                            .replace(new RegExp('5', 'g'), '');

        const key = ideogram + pronunciation;

        if (ideogramList.indexOf(key) !== -1) {
          return null;
        }

        ideogramList.push(key);
        const importPromise = () => {
          return new Promise((resolveImport, rejectImport) => {
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

            ideogram = UnihanSearch.convertIdeogramsToUtf16(ideogram);

            knex('cjk')
              .select('id')
              .where({
                ideogram,
                pronunciation,
              })
              .then((dataCjk) => {
                if (dataCjk.length === 0) {
                  const toInsert = {
                    ideogram,
                    pronunciation,
                    pronunciation_unaccented: pronunciationUnaccented,
                    definition_cedict: JSON.stringify(descriptions),
                    language_id: 1,
                    measure_words: JSON.stringify(measureWords),
                    type: 'W',
                    usage: 0,
                    created_at: new Date(),
                  };

                  knex('cjk')
                    .insert(toInsert)
                    .then(() => {
                      resolveImport();
                    })
                    .error((err) => {
                      // eslint-disable-next-line
                      console.log(err);
                      rejectImport();
                    });
                } else {
                  knex('cjk')
                    .where('id', '=', dataCjk[0].id)
                    .update({
                      definition_cedict: JSON.stringify(descriptions),
                      measure_words: JSON.stringify(measureWords),
                    })
                    .then(() => {
                      resolveImport();
                    })
                    .error(() => {
                      rejectImport();
                    });
                }
              })
              .error(() => {
                rejectImport();
              });
          });
        };

        return importPromise;
      }

      const lineReader = readline.createInterface({
        input: fs.createReadStream(file),
      });

      lineReader.on('close', () => {
        processPromisses();
      });

      lineReader.on('line', (line) => {
        if (line[0] === '#') {
          return;
        }

        const importPromisse = readLine(line);
        if (!importPromisse) {
          return;
        }

        promises.push(importPromisse);
        return;
      });
    });
  }
};

