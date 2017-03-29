if (process.env.NODE_ENV === 'production') {
  // eslint-disable-next-line global-require
  require('newrelic');
}

const express = require('express');
const env = require('./env');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const jwt = require('express-jwt');

const app = express();

app.use(cors());
app.use(jwt({ secret: env.jwt_key }).unless({ path: [
  '/',
  '/auth/google',
  '/auth/google/callback',
  '/unihan/to_pinyin',
  '/unihan/dictionary',
  '/segmentation/segment',
  '/jw/download',
  '/chinese-tools',
] }));
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json');
  return next();
});

app.use(express.static('public'));
app.use(passport.initialize());
app.use(bodyParser.json({ limit: '5mb' }));

require('./app/routes')(app, passport);
require('./app/config/passport')(passport);

module.exports = app;
