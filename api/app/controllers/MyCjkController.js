const express = require('express');
const knex = require('../services/knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => {
  knex('my_cjk')
    .select('my_cjk.id', 'cjk.ideogram', 'cjk.frequency', 'cjk.pronunciation')
    .join('cjk', 'cjk.id', '=', 'my_cjk.cjk_id')
    .where({
      user_id: req.user.id,
    })
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .then((result) => {
      res.send({ ideograms: result });
    });
});

router.get('/report', (req, res) => {
  knex('cjk')
    .select(knex.raw('cjk.frequency, count(*) as total, COUNT(my_cjk.id) total_my, round(COUNT(my_cjk.id) / count(*) * 100) percent'))
    .leftJoin('my_cjk', function leftJoin() {
      this.on('my_cjk.cjk_id', '=', 'cjk.id').on('my_cjk.user_id', '=', req.user.id);
    })
    .where({
      type: 'C',
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

router.post('/', (req, res) => {
  const ideogramConverted = req.body.ideogram.charCodeAt(0).toString(16);

  knex('cjk')
    .where({
      ideogram: ideogramConverted,
      type: 'C',
    })
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .select('id')
    .then(result =>
      knex('my_cjk')
      .insert({
        cjk_id: result[0].id,
        user_id: req.user.id,
      })
    )
    .then(() => {
      res.send({ status: 'SUCCESS' });
    })
    .catch((e) => {
      res.status(500);
      res.send({
        status: 'ERROR',
        message: e.message,
      });
    });
});

router.delete('/', (req, res) => {
  const ideogramConverted = req.body.ideogram.charCodeAt(0).toString(16);

  knex('cjk')
    .where({
      ideogram: ideogramConverted,
      type: 'C',
    })
    .orderBy('frequency', 'ASC')
    .orderBy('usage', 'DESC')
    .select('id')
    .then(result =>
      knex('my_cjk')
      .where({
        cjk_id: result[0].id,
        user_id: req.user.id,
      })
      .del()
    )
    .then(() => {
      res.send({ status: 'SUCCESS' });
    })
    .catch(() => {
      res.send({ status: 'ERROR' });
    });
});

module.exports = router;
