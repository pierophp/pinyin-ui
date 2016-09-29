const express = require('express');
const UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
const UnihanSearch = require('../services/UnihanSearch');
const knex = require('../services/knex');
const Promise = require('bluebird');
const fs = require('fs');
const wget = require('wget');
const AdmZip = require('adm-zip');
const env = require('../../env');

const router = express.router();
const udp = new UnihanDatabaseParser();
const unihanSearch = new UnihanSearch();

let storagePath = `${__dirname}/../../storage/`;
if (env.storage_path) {
  storagePath = env.storage_path;
}

router.get('/load', (req, res) => {
  const filename = `${storagePath}ucd.unihan.flat.xml`;
  const filenameZip = `${storagePath}ucd.unihan.flat.zip`;

  const importFile = function importFile() {
    udp.loadFile(filename);
    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
  };

  const unzipFile = function unzipFile() {
    const zip = new AdmZip(filenameZip);
    zip.extractAllTo(storagePath, true);
    importFile();
  };

  const downloadFile = function downloadFile() {
    const src = 'http://www.unicode.org/Public/UCD/latest/ucdxml/ucd.unihan.flat.zip';

    fs.statSync(filenameZip);
    fs.unlinkSync(filenameZip);

    const download = wget.download(src, filenameZip);

    download.on('error', (err) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(`Error${err}`);
    });

    download.on('end', () => {
      unzipFile();
    });
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
