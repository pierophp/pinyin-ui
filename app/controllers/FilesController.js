const express = require('express');
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const env = require('../../env');

const router = express.router();
let dirname = `${__dirname}/../../storage/files/`;
if (env.storage_path) {
  dirname = `${env.storage_path}files/`;
}

router.get('/', (req, res) => {
  const filesPath = `${dirname + req.user.id}/`;

  const getFiles = function getFiles() {
    fs.readdirAsync(filesPath, 'utf8').then((files) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(files);
    });
  };

  fs.statAsync(filesPath)
        .then(() => {
          getFiles();
        })
        .error(() => {
          fs.mkdirAsync(filesPath).then(() => {
            getFiles();
          });
        });
});

router.get('/file', (req, res) => {
  const filename = req.query.filename;

  const filesPath = `${dirname + req.user.id}/`;

  fs.readFileAsync(filesPath + filename, 'utf8').then((content) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(content);
  });
});

router.post('/save', (req, res) => {
  const filename = req.query.filename;
  const content = req.body.content;
  const filesPath = `${dirname + req.user.id}/`;
  fs.writeFileAsync(filesPath + filename, content).then(() => {
    res.setHeader('Content-Type', 'application/json');
    res.send({});
  });
});

module.exports = router;
