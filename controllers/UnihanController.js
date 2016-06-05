var express = require('express');
var router = express.Router();
var UnihanDatabaseParser = require('../services/UnihanDatabaseParser');
var udp = new UnihanDatabaseParser();
var knex = require('../services/knex');

router.get('/load', function (req, res) {

    //udp.loadFile(__dirname + '/../tests/server/resources/UnihanDatabase.xml');
    udp.loadFile('/Users/piero/Downloads/ucd.unihan.flat.xml');

    res.setHeader('Content-Type', 'application/json');
    res.send('Status 200');
});


router.get('/search', function (req, res) {

    //var char = '人';
    //console.log(char.charCodeAt(0).toString(16));

    knex('cjk')
        .where({
            pronunciation: 'rén'
        })
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage')
        .then(function (data) {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data));
        });

});

module.exports = router;