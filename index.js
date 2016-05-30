var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use('/auth', require('./controllers/AuthController'));
app.use('/files', require('./controllers/FilesController'));

app.listen(9000, function() {
    console.log('Pinyin app listening on port 9000!');
});