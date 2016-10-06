if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('newrelic');
}

const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const env = require('./env');

const app = express();

let sessionKey = 'my_session_key';
if (env.session_key) {
  sessionKey = env.session_key;
}

const sessionConfig = {
  secret: sessionKey,
  name: 'PINYIN',
  resave: true,
  saveUninitialized: true,
};

if (env.redis_host) {
  const RedisStore = require('connect-redis')(session);
  sessionConfig.store = new RedisStore({
    host: env.redis_host,
    port: env.redis_port,
    db: env.redis_db,
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
