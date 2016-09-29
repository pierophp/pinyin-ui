const express = require('express');
const router = express.Router();

router.get('/segment', (req, res) => {
  const nodejieba = require('nodejieba');
  const result = nodejieba.cut('听从上帝得永生');
  console.log(result);
});

module.exports = router;
