const express = require('express');
const CcCeDictDatabaseParser = require('../services/CcCeDictDatabaseParser');
// const knex = require('../services/knex');
const fs = require('fs');
const wget = require('wget');
const AdmZip = require('adm-zip');
const env = require('../../env');

const router = express.Router();
const databaseParser = new CcCeDictDatabaseParser();
let storagePath = `${__dirname}/../../storage/`;
if (env.storage_path) {
  storagePath = env.storage_path;
}

router.get('/load', (req, res) => {
  const filename = `${storagePath}cedict_ts.u8`;
  const filenameZip = `${storagePath}cedict_1_0_ts_utf-8_mdbg.zip`;

  const importFile = function importFile() {
    databaseParser.loadFile(filename);
    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
  };

  const unzipFile = function unzipFile() {
    const zip = new AdmZip(filenameZip);
    zip.extractAllTo(storagePath, true);
    importFile();
  };

  const downloadFile = function downloadFile() {
    const src = 'http://www.mdbg.net/chindict/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip';

    fs.statSync(filenameZip);
    fs.unlinkSync(filenameZip);

    const download = wget.download(src, filenameZip);

    download.on('error', () => {
      res.setHeader('Content-Type', 'application/json');
      res.send('Error');
    });

    download.on('end', () => {
      unzipFile();
    });
  };

  // Remove This

  try {
    fs.statSync(filename);
    importFile();
  } catch (e) {
    downloadFile();
  }


  /*

  knex('cjk')
      .count('id as total')
      .where({
          type: 'W'
      })
      .then(function (data) {

          if (data[0]['total'] > 0) {
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
  */
});

module.exports = router;
