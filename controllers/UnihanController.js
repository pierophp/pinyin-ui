var express = require('express');
var router = express.Router();
var UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
var UnihanSearch = require('../services/UnihanSearch');
var udp = new UnihanDatabaseParser();
var unihanSearch = new UnihanSearch();
var knex = require('../services/knex');
var Promise = require('bluebird');
var fs = require('fs');
var wget = require('wget');
var AdmZip = require('adm-zip');

router.get('/load', function (req, res) {

    let filename = __dirname + '/../storage/ucd.unihan.flat.xml';
    let filenameZip = __dirname + '/../storage/ucd.unihan.flat.zip';

    let importFile = function () {
        udp.loadFile(filename);
        res.setHeader('Content-Type', 'application/json');
        res.send('Status 200');
    };

    let downloadFile = function () {

        let src = 'http://www.unicode.org/Public/UCD/latest/ucdxml/ucd.unihan.flat.zip';

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
        zip.extractAllTo(__dirname + '/../storage', true);
        importFile();
    };

    knex('cjk').count('id as total').then(function (data) {

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



});

router.get('/search', function (req, res) {

    var pinyin = req.query.pinyin.toLowerCase();

    var mostUsedPromise = knex('cjk')
        .where({
            pronunciation: pinyin
        })
        .where('frequency', '<=', 5)
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

    var lessUsedPromise = knex('cjk')
        .where({
            pronunciation: pinyin
        })
        .where('frequency', '>', 5)
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

    Promise.join(mostUsedPromise, lessUsedPromise,
        function (mostUsed, lessUsed) {
            var result = {};
            result.items = mostUsed;
            result.lessUsed = lessUsed;
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
});

router.get('/to_pinyin', function (req, res) {

    var ideograms = req.query.ideograms;

    unihanSearch.toPinyin(ideograms).then(function (result) {
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(result));
    });


});

module.exports = router;