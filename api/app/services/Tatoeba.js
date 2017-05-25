const Promise = require('bluebird');
const fs = require('fs');
const fastCsv = require('fast-csv');
const env = require('../../env');
const isChinese = require('../../../shared/helpers/is-chinese');
const LanguageRepository = require('../repository/LanguageRepository');
const PhraseRepository = require('../repository/PhraseRepository');
const UnihanSearch = require('../services/UnihanSearch');
const profiler = require('../helpers/profiler');
const opencc = require('node-opencc');
const separatePinyinInSyllables = require('../../../shared/helpers/separate-pinyin-in-syllables');

module.exports = class Tatoeba {
  static async import() {
    let storagePath = `${__dirname}/../../storage/`;
    if (env.storage_path) {
      storagePath = env.storage_path;
    }

    const languages = {
      por: 'pt',
      eng: 'en',
      spa: 'es',
      cmn: 'cmn-hans',
    };

    let i = 0;

    return new Promise(async (resolve) => {
      const skipUpdate = true;
      const fileStream = fs.createReadStream(`${storagePath}sentences_detailed.csv`);
      const parser = fastCsv
      .fromStream(fileStream, {
        delimiter: '\t',
        ignoreEmpty: true,
        quote: '',
        escape: '',
      })
      .on('data', async (data) => {
        parser.pause();
        const id = data[0];
        const languageCode = data[1];
        let phrase = data[2];
        let dateCreatedAt = data[4];
        let dateUpdatedAt = data[5];

        if (dateUpdatedAt === '\\N') {
          dateUpdatedAt = new Date();
        }

        if (dateUpdatedAt === '0000-00-00 00:00:00') {
          dateUpdatedAt = new Date();
        }

        if (dateCreatedAt === '\\N') {
          dateCreatedAt = new Date();
        }

        if (dateCreatedAt === '0000-00-00 00:00:00') {
          dateCreatedAt = new Date();
        }

        if (languages[languageCode] === undefined) {
          data = null;
          parser.resume();
          return;
        }

        i += 1;
        profiler(`Start ${i} `, true);

        let pronunciation = '';

        if (languageCode === 'cmn') {
          phrase = await opencc.traditionalToSimplified(phrase);
          const ideograms = UnihanSearch.segment(phrase);
          const ideogramsList = [];
          let ideogramsTemp = '';
          ideograms.forEach((ideogram) => {
            if (isChinese(ideogram)) {
              if (ideogramsTemp) {
                ideogramsList.push(ideogramsTemp);
                ideogramsTemp = '';
              }
              ideogramsList.push(ideogram);
            } else {
              ideogramsTemp += ideogram;
            }
          });

          if (ideogramsTemp) {
            ideogramsList.push(ideogramsTemp);
          }

          const pinyin = await UnihanSearch.toPinyin(ideogramsList);
          const pinyinList = [];
          pinyin.forEach((item) => {
            const pinyinConverted = separatePinyinInSyllables(item.pinyin).split(' ').join(String.fromCharCode(160));
            pinyinList.push(pinyinConverted);
          });

          pronunciation = pinyinList.join('|');
        }

        const language = await LanguageRepository.findOneByCode(languages[languageCode]);
        let phraseData = {
          phrase,
          pronunciation,
          language_id: language.id,
          provider_created_at: dateCreatedAt,
          provider_updated_at: dateUpdatedAt,
          provider_id: id,
          provider: 'tatoeba',
          created_at: new Date(),
        };

        await PhraseRepository.save(phraseData, skipUpdate);

        profiler(`End ${i}`, true);
        if (i % 100 === 1) {
          console.log('Clean GC');
          global.gc();
        }

        parser.resume();
      })
      .on('end', async () => {
        resolve();
      });
    });
  }

  static async references() {
    let storagePath = `${__dirname}/../../storage/`;
    if (env.storage_path) {
      storagePath = env.storage_path;
    }

    return new Promise(async (resolve) => {
      const fileStream = fs.createReadStream(`${storagePath}links.csv`);
      fastCsv
      .fromStream(fileStream, {
        delimiter: '\t',
        ignoreEmpty: true,
        quote: '',
        escape: '',
      })
      .transform((data, next) => {
        const fromId = data[0];
        const toId = data[1];

        return new Promise(async () => {
          const phraseReference = {
            fromId,
            toId,
            provider: 'tatoeba',
          };

          await PhraseRepository.saveReference(phraseReference);

          next(null);
        });
      })
      .on('data', () => {
      })
      .on('end', () => {
        resolve();
      });
    });
  }
};
