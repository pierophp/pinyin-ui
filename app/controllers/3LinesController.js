const express = require('express');
const router = express.Router();
const UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
const UnihanSearch = require('../services/UnihanSearch');
const udp = new UnihanDatabaseParser();
const unihanSearch = new UnihanSearch();
const knex = require('../services/knex');
const Promise = require('bluebird');
const fs = require('fs');
const wget = require('wget');
const AdmZip = require('adm-zip');
const env = require('../../env');

let storage_path = `${__dirname}/../../storage/`;
if (env.storage_path) {
  storage_path = env.storage_path;
}

router.get('/load', (req, res) => {
  const filename = `${storage_path}ucd.unihan.flat.xml`;
  const filenameZip = `${storage_path}ucd.unihan.flat.zip`;

  const importFile = function () {
    udp.loadFile(filename);
    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
  };

  const downloadFile = function () {
    const src = 'http://www.unicode.org/Public/UCD/latest/ucdxml/ucd.unihan.flat.zip';

    try {
      fs.statSync(filenameZip);
      fs.unlinkSync(filenameZip);
    } catch (e) {

    }

    const download = wget.download(src, filenameZip);

    download.on('error', (err) => {
      res.setHeader('Content-Type', 'application/json');
      res.send('Error');
    });

    download.on('end', (output) => {
      unzipFile();
    });
  };

  let unzipFile = function () {
    const zip = new AdmZip(filenameZip);
    zip.extractAllTo(storage_path, true);
    importFile();
  };

  knex('cjk')
        .count('id as total')
        .where({
          type: 'C',
        })
        .then((data) => {
          if (data[0].total > 0) {
            res.setHeader('Content-Type', 'application/json');
            res.send('Data already imported');
          } else {
            try {
              fs.statSync(filename);
              importFile();
            } catch (e) {
              downloadFile();
            }
          }
        });
});

router.get('/search', (req, res) => {
  const pinyin = req.query.pinyin.toLowerCase();

  const mostUsedPromise = knex('cjk')
        .where({
          pronunciation: pinyin,
        })
        .where('frequency', '<=', 5)
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

  const lessUsedPromise = knex('cjk')
        .where({
          pronunciation: pinyin,
        })
        .where('frequency', '>', 5)
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

  Promise.join(mostUsedPromise, lessUsedPromise,
        (mostUsed, lessUsed) => {
          const result = {};
          result.items = mostUsed;
          result.lessUsed = lessUsed;
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify(result));
        });
});

router.get('/to_pinyin', (req, res) => {
  const ideograms = req.query.ideograms;

  unihanSearch.toPinyin(ideograms).then((result) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});

module.exports = router;
