var express = require('express');
var router = express.Router();
var CcCeDictDatabaseParser = require('../services/CcCeDictDatabaseParser');
var databaseParser = new CcCeDictDatabaseParser();
var knex = require('../services/knex');
var fs = require('fs');
var wget = require('wget');
var AdmZip = require('adm-zip');
var env = require('../../env');

var storage_path = __dirname + '/../../storage/';
if (env.storage_path) {
    storage_path = env.storage_path;
}

router.get('/load', function (req, res) {

    let filename = storage_path + 'cedict_ts.u8';
    let filenameZip = storage_path + 'cedict_1_0_ts_utf-8_mdbg.zip';

    let importFile = function () {
        databaseParser.loadFile(filename);
        res.setHeader('Content-Type', 'application/json');
        res.send('Status 200');
    };

    let downloadFile = function () {

        let src = 'http://www.mdbg.net/chindict/export/cedict/cedict_1_0_ts_utf-8_mdbg.zip';

        try {
            fs.statSync(filenameZip);
            fs.unlinkSync(filenameZip);
        } catch (e) {

        }

        let download = wget.download(src, filenameZip);

        download.on('error', function (err) {
            res.setHeader('Content-Type', 'application/json');
            res.send('Error');
        });

        download.on('end', function (output) {
            unzipFile();
        });
    };

    let unzipFile = function () {
        let zip = new AdmZip(filenameZip);
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