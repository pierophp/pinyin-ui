const express = require('express');
const router = express.Router();
const CcCeDictDatabaseParser = require('../services/CcCeDictDatabaseParser');
const databaseParser = new CcCeDictDatabaseParser();
const knex = require('../services/knex');
const fs = require('fs');
const wget = require('wget');
const AdmZip = require('adm-zip');
const env = require('../../env');

let storage_path = `${__dirname}/../../storage/`;
if (env.storage_path) {
  storage_path = env.storage_path;
}

router.get('/load', (req, res) => {
  const filename = `${storage_path}cedict_ts.u8`;
  const filenameZip = `${storage_path}cedict_1_0_ts_utf-8_mdbg.zip`;

  const importFile = function () {
    databaseParser.loadFile(filename);
    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
  };

  const downloadFile = function () {
    const src = 'http://www.mdbg.net/chindict/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip';

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
