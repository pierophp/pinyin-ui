const knex = require('./knex');
const removeDiacritics = require('diacritics').remove;
const Promise = require('bluebird');
const UnihanSearch = require('../services/UnihanSearch');
const readline = require('readline');
const fs = require('fs');
const lineReader = require('line-reader');
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
        Promise.map(promises, promiseImport => promiseImport, {
          concurrency: 2,
        }).then(() => {
          resolve();
        }).error(() => {
          reject();
        });
      }

      function closeReader(reader) {
        reader.close((err) => {
          if (err) {
            reject(err);
          }
          resolve();
        });
      }

      function readLine(reader, line) {

        if (line[0] === '#') {
          nextLine(reader);
          return;
        }

        const importPromise = new Promise((resolveImport, rejectImport) => {
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

          ideogram = UnihanSearch.convertIdeogramsToUtf16(ideogram);

          knex('cjk')
            .select('id')
            .where({
              ideogram,
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
                    console.log(err);
                    rejectImport();
                  });
              } else {
                resolveImport();
                return;
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

        promises.push(importPromise);
        nextLine(reader);
      }

      function nextLine(reader) {
        if (reader.hasNextLine()) {
          reader.nextLine((readerErr, line) => {
            try {
              if (readerErr) {
                throw readerErr;
              }
              readLine(reader, line);
            } catch (err) {
              closeReader(reader);
            }
          });
        } else {
          closeReader(reader);
          processPromisses();
        }
      }

      lineReader.open(file, (err, reader) => {
        if (err) {
          reject(err);
          return;
        }

        nextLine(reader);
      });




      /*



            const lineReader = readline.createInterface({
              input: fs.createReadStream(file),
            });

            let i = 0;

            lineReader.on('close', () => {
              console.log('Ends');
              console.log(i);
              resolve();
            });

            lineReader.on('line', (line) => {
              if (line[0] === '#') {
                return;
              }
              console.log('line');
              i += i;
              return;

              console.log('Importing line');


            });

            */
    });
  }
};
