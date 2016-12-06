const express = require('express');
const UnihanSearch = require('../services/UnihanSearch');
const knex = require('../services/knex');
const Promise = require('bluebird');

// eslint-disable-next-line new-cap
const router = express.Router();
router.get('/search', (req, res) => {
  const pinyin = req.query.pinyin.toLowerCase();

  const mostUsedPromise = knex('cjk')
    .where({
      pronunciation: pinyin,
    })
    .where('frequency', '<=', 5)
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

  const lessUsedPromise = knex('cjk')
    .where({
      pronunciation: pinyin,
    })
    .where('frequency', '>', 5)
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .select('id', 'pronunciation', 'ideogram', 'frequency', 'usage');

  Promise.join(mostUsedPromise, lessUsedPromise,
    (mostUsed, lessUsed) => {
      const result = {};
      result.items = mostUsed;
      result.lessUsed = lessUsed;
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify(result));
    });
});

router.get('/to_pinyin', (req, res) => {
  const ideograms = req.query.ideograms;

  UnihanSearch.toPinyin(ideograms).then((result) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(result));
  });
});

router.get('/my_cjkj', () => {
});

module.exports = router;
