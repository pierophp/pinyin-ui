'use strict';

if (process.env.NODE_ENV == 'production') {
    require('newrelic');
}

var express = require('express');
var session = require('express-session');
var app = express();
var bodyParser = require('body-parser');
var passport = require('passport');
var env = require('./env');

var sessionKey = 'my_session_key';
if (env.session_key) {
    sessionKey = env.session_key;
}

var sessionConfig = {
    secret: sessionKey,
    name: 'PINYIN',
    resave: true,
    saveUninitialized: true
};

if (env.redis_host) {
    var RedisStore = require('connect-redis')(session);
    sessionConfig.store = new RedisStore({
        host: env.redis_host,
        port: env.redis_port,
        db: env.redis_db
    });
}

app.use(session(sessionConfig));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());

require('./app/routes')(app, passport);
require('./app/config/passport')(passport);

module.exports = app;
