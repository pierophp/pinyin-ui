const express = require('express');
const nodejieba = require('nodejieba');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/segment', (req, res) => {
  const ideogramsCuted = nodejieba.cut(req.body.ideograms);
  res.send({ ideograms: ideogramsCuted });
});

module.exports = router;

