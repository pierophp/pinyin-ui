const express = require('express');
const nodejieba = require('nodejieba');

const router = express.router();

router.get('/segment', () => {
  const result = nodejieba.cut('听从上帝得永生');
});

module.exports = router;
