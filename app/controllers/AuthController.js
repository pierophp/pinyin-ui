const express = require('express');
const router = express.Router();
const passport = require('passport');

router.get('/is_logged_in', (req, res) => {
  const user = {};

  if (req.isAuthenticated()) {
    user.id = req.user.id;
    user.name = req.user.name;
    user.email = req.user.email;
  }

  const response = {
    isAuthenticated: req.isAuthenticated(),
    user,
  };

  res.setHeader('Content-Type', 'application/json');
  res.send(response);
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback',

    passport.authenticate('google', { failureRedirect: '/' }),

    (req, res) => {
      res.redirect('/');
    });

module.exports = router;
