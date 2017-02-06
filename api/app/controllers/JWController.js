const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/download', (req, res) => {
  const url = 'https://www.jw.org/cmn-hans/%E5%87%BA%E7%89%88%E7%89%A9/%E6%9D%82%E5%BF%97/%E5%AE%88%E6%9C%9B%E5%8F%B0%E7%A0%94%E8%AF%BB%E7%89%882016%E5%B9%B412%E6%9C%88/%E5%9B%A0%E5%88%86%E5%A4%96%E6%81%A9%E5%85%B8%E8%80%8C%E5%BE%97%E4%BA%AB%E8%87%AA%E7%94%B1/';

  axios.get(url).then((response) => {
    const $ = cheerio.load(response.data);
    console.log($('article header h1').text());
    console.log($('article .docSubContent').text());
    res.send({ });
  });
});

module.exports = router;

