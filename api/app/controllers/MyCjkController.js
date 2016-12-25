const express = require('express');
const knex = require('../services/knex');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/', (req, res) => {
  knex('my_cjk')
    .where({
      user_id: req.user.id,
    })
    .join('cjk', 'cjk.id', '=', 'my_cjk.cjk_id')
    .select('my_cjk.id', 'cjk.ideogram', 'cjk.frequency')
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
    .then((result) =>
      knex('my_cjk').insert({
        cjk_id: result[0].id,
        user_id: req.user.id,
      })
    )
    .then(() => {
      res.send({ status: 'SUCCESS' });
    })
    .catch(() => {
      res.send({ status: 'ERROR' });
    });
});

module.exports = router;
