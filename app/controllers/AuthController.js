var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/is_logged_in', function (req, res) {

    var user = {};

    if (req.isAuthenticated()) {
        user.id = req.user.id;
        user.name = req.user.name;
        user.email = req.user.email;
    }

    var response = {
        isAuthenticated: req.isAuthenticated(),
        user: user
    };

    res.setHeader('Content-Type', 'application/json');
    res.send(response);
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',

    passport.authenticate('google', { failureRedirect: '/' }),
    
    function (req, res) {
        res.redirect('/');
    });

module.exports = router;