'use strict';

if (process.env.NODE_ENV == 'production') {
    require('newrelic');
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/auth', require('./app/controllers/AuthController'));
app.use('/files', require('./app/controllers/FilesController'));
app.use('/unihan', require('./app/controllers/UnihanController'));

module.exports = app;
