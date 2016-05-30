var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var dirname = __dirname + '/../storage/files/';

router.get('/', function (req, res) {

    fs.readdirAsync(dirname, 'utf8').then(function (files) {
        res.setHeader('Content-Type', 'application/json');
        res.send(files);
    });
    
});

router.get('/file', function (req, res) {
    var filename = req.query.filename;
    fs.readFileAsync(dirname + filename, 'utf8').then(function (content) {
        res.setHeader('Content-Type', 'application/json');
        res.send(content);
    });
});

router.post('/save', function (req, res) {
    var filename = req.query.filename;
    var content = req.body.content;
    fs.writeFileAsync(dirname + filename, content).then(function () {
        res.setHeader('Content-Type', 'application/json');
        res.send({});
    });
});

module.exports = router;