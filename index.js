if (process.env.NODE_ENV == 'production') {
    require('newrelic');
}

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/auth', require('./controllers/AuthController'));
app.use('/files', require('./controllers/FilesController'));
app.use('/unihan', require('./controllers/UnihanController'));

app.listen(9090, function () {
    console.log('Pinyin app listening on port 9090!');
});