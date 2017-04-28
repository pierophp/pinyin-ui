const express = require('express');
const knex = require('../services/knex');
const UnihanSearch = require('../services/UnihanSearch');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', async (req, res) => {
  const result = await knex('my_cjk')
    .select('my_cjk.id', 'cjk.ideogram', 'cjk.frequency', 'cjk.pronunciation')
    .join('cjk', 'cjk.id', '=', 'my_cjk.cjk_id')
    .where({
      user_id: req.user.id,
    })
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC');

  const ideograms = [];
  result.forEach((item) => {
    item.ideogram = UnihanSearch.convertUtf16ToIdeograms(item.ideogram);
    ideograms.push(item);
  });

  res.send({ ideograms });
});

router.get('/report', (req, res) => {
  knex('cjk')
    .select(knex.raw('cjk.frequency, COUNT(*) as total, COUNT(my_cjk.id) total_my, round(COUNT(my_cjk.id) / COUNT(*) * 100) percent'))
    .leftJoin('my_cjk', function leftJoin() {
      this.on('my_cjk.cjk_id', '=', 'cjk.id').on('my_cjk.user_id', '=', req.user.id);
    })
    .where({
      type: 'C',
      main: 1,
      simplified: 1,
    })
    .groupBy('cjk.frequency')
    .then((report) => {
      let total = 0;
      report.forEach((item) => {
        total += item.total_my;
      });
      res.send({ total, report });
    });
});

router.get('/report_words', async (req, res) => {
  const report = await knex('cjk')
    .select(knex.raw('cjk.hsk, COUNT(cjk.id) as total, COUNT(my_cjk.id) total_my, round(COUNT(my_cjk.id) / COUNT(*) * 100) percent'))
    .leftJoin('my_cjk', function leftJoin() {
      this.on('my_cjk.cjk_id', '=', 'cjk.id').on('my_cjk.user_id', '=', req.user.id);
    })
    .where({
      main: 1,
      simplified: 1,
    })
    .groupBy('cjk.hsk');

  let total = 0;
  report.forEach((item) => {
    total += item.total_my;
  });

  res.send({ total, report });
});

router.get('/report_unknown', (req, res) => {
  knex('cjk')
    .select('my_cjk.id', 'cjk.ideogram', 'cjk.frequency', 'cjk.pronunciation')
    .leftJoin('my_cjk', function leftJoin() {
      this.on('my_cjk.cjk_id', '=', 'cjk.id').on('my_cjk.user_id', '=', req.user.id);
    })
    .where({
      type: 'C',
      simplified: 1,
      frequency: req.query.frequency,
    })
    .whereNull('my_cjk.id')
    .limit(2000)
    .then((result) => {
      res.send({ ideograms: result });
    });
});

router.post('/', async (req, res) => {
  try {
    const ideogramConverted = UnihanSearch.convertIdeogramsToUtf16(req.body.ideogram);

    let result = await knex('cjk')
      .where({
        main: 1,
        ideogram: ideogramConverted,
        type: 'C',
      })
      .orderBy('frequency', 'ASC')
      .orderBy('usage', 'DESC')
      .select('id');

    if (result.length === 0) {
      result = await knex('cjk')
      .where({
        ideogram: ideogramConverted,
      })
      .orderBy('frequency', 'ASC')
      .orderBy('usage', 'DESC')
      .select('id');
    }

    await knex('my_cjk')
      .insert({
        cjk_id: result[0].id,
        user_id: req.user.id,
      });

    res.send({ status: 'SUCCESS' });
  } catch (e) {
    res.status(500);
    res.send({
      status: 'ERROR',
      message: e.message,
    });
  }
});

router.delete('/', async (req, res) => {
  try {
    const ideogramConverted = UnihanSearch.convertIdeogramsToUtf16(req.body.ideogram);
    const result = await knex('cjk')
    .where({
      ideogram: ideogramConverted,
    })
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .select('id');


    const ids = [];
    result.forEach((item) => {
      ids.push(item.id);
    });

    await knex('my_cjk')
      .whereIn('cjk_id', ids)
      .where({
        user_id: req.user.id,
      })
      .del();

    res.send({ status: 'SUCCESS' });
  } catch (e) {
    res.status(500);
    res.send({
      status: 'ERROR',
      message: e.message,
    });
  }
});

module.exports = router;
