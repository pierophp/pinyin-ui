const Promise = require('bluebird');
const fs = require('fs');
const moment = require('moment');
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
      /*
      const writableStream = fs.createWriteStream(`${storagePath}sentences_import.csv`);
      const fileWriteStream = fastCsv.createWriteStream({
        headers: false,
        delimiter: ';',
      });
      fileWriteStream.pipe(writableStream);
      */
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
          dateUpdatedAt = moment().format('Y-MM-DD HH:mm:ss');
        }

        if (dateUpdatedAt === '0000-00-00 00:00:00') {
          dateUpdatedAt = moment().format('Y-MM-DD HH:mm:ss');
        }

        if (dateCreatedAt === '\\N') {
          dateCreatedAt = moment().format('Y-MM-DD HH:mm:ss');
        }

        if (dateCreatedAt === '0000-00-00 00:00:00') {
          dateCreatedAt = moment().format('Y-MM-DD HH:mm:ss');
        }

        if (languages[languageCode] === undefined) {
          data = null;
          parser.resume();
          return;
        }

        i += 1;
        if (i % 100 === 1) {
          profiler(`Start ${i} `, true);
        }
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
          // provider: 'tatoeba',
          // created_at: new Date(),
        };

        // fileWriteStream.write(phraseData);

        // await PhraseRepository.save(phraseData, skipUpdate);
        if (i % 100 === 1) {
          profiler(`End ${i}`, true);
        }

        data = null;
        phraseData = null;


        if (i % 10000 === 1) {
          console.log('Clean Pinyin Cache');
          await UnihanSearch.cleanPinyinCache();
        }

        if (i % 1000 === 1) {
          console.log('Clean GC');
          global.gc();
        }


       //if (i === 100 || i === 200) {
       //   heapdump.writeSnapshot('/home/pgiusti/heapdump/' + Date.now() + '.heapsnapshot');
      //    process.kill(process.pid, 'SIGUSR2');
       // }


        parser.resume();
      })
      .on('end', async () => {
        fileWriteStream.end();
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
