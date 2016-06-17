var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var env = require('../env');


if (env.google_client_id && env.google_client_secret) {

    passport.use(new GoogleStrategy({
        clientID: env.google_client_id,
        clientSecret: env.google_client_secret,
        callbackURL: env.base_url + "/auth/google/callback"
    },
        function (accessToken, refreshToken, profile, done) {
            //return done(err, user);
        }
    ));
} else {
    console.log('define google_client_id and google_client_secret in your env.js file');
}

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {

        console.log('Google Callback');

        res.redirect('/');
    });

module.exports = router;