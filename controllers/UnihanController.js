var express = require('express');
var router = express.Router();
var UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
var udp = new UnihanDatabaseParser();
var knex = require('../services/knex');
var Promise = require('bluebird');

router.get('/load', function (req, res) {

    udp.loadFile(__dirname + '/../storage/ucd.unihan.flat.xml');

    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
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
    var ideogramPromises = [];

    for (let i = 0; i < ideograms.length; i++) {

        var ideogramConverted = ideograms[i].charCodeAt(0).toString(16);

        ideogramPromises.push(knex('cjk')
            .where({
                ideogram: ideogramConverted
            })
            .orderBy('frequency', 'ASC')
            .orderBy('usage', 'DESC')
            .select('id', 'pronunciation')
        );
    }

    Promise.all(ideogramPromises).then(

        function (ideograms) {
            var result = {};

            result.pinyin = '';

            for (let ideogram of ideograms) {
                if (ideogram.length == 0) {
                    result.pinyin += "__";
                } else {
                    result.pinyin += ideogram[0].pronunciation;
                }
            }

            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(result));
        });
});

module.exports = router;