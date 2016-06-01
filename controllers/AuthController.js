var express = require('express');
var router = express.Router();
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var env = require('../env');

passport.use(new GoogleStrategy({
    clientID: env.google_client_id,
    clientSecret: env.google_client_secret,
    callbackURL: "http://local.nodejs.org:9000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        //return done(err, user);
    }
));

router.get('/google',
    passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        
        console.log('Google Callback');
        
        res.redirect('/');
    });

module.exports = router;