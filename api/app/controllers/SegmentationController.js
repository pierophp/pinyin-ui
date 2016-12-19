const express = require('express');
const nodejieba = require('nodejieba');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/segment', () => {
  nodejieba.cut('听从上帝得永生');
});

module.exports = router;

