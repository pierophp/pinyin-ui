var express = require('express');
var router = express.Router();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));
var env = require('../../env');
var dirname = __dirname + '/../../storage/files/';
if (env.storage_path) {
    dirname = env.storage_path + 'files/';
}

router.get('/', function (req, res) {

    let filesPath = dirname + req.user.id + '/';
    
    let getFiles = function () {
        fs.readdirAsync(filesPath, 'utf8').then(function (files) {
            res.setHeader('Content-Type', 'application/json');
            res.send(files);
        });
    };

    fs.statAsync(filesPath)
        .then(function () {
            getFiles();
        })
        .error(function () {
            fs.mkdirAsync(filesPath).then(function () {
                getFiles();
            });
        });


});

router.get('/file', function (req, res) {

    var filename = req.query.filename;

    var filesPath = dirname + req.user.id + '/';

    fs.readFileAsync(filesPath + filename, 'utf8').then(function (content) {
        res.setHeader('Content-Type', 'application/json');
        res.send(content);
    });
});

router.post('/save', function (req, res) {
    var filename = req.query.filename;
    var content = req.body.content;
    var filesPath = dirname + req.user.id + '/';
    fs.writeFileAsync(filesPath + filename, content).then(function () {
        res.setHeader('Content-Type', 'application/json');
        res.send({});
    });
});

module.exports = router;