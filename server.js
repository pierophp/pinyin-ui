'use strict';

var app = require('./');
var port = 'PORT' in process.env ? process.env.PORT : 9090;

app.listen(port, function () {
    console.log('Pinyin app listening on port 9090!');
});