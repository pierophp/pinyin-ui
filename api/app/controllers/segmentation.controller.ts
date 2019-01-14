import * as express from 'express';
// @ts-ignore
import * as UnihanSearch from '../services/UnihanSearch';

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/segment', (req, res) => {
  const ideogramsCuted = UnihanSearch.segment(req.body.ideograms);
  res.send({ ideograms: ideogramsCuted });
});

module.exports = router;
