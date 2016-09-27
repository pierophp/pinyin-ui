var express = require('express');
var router = express.Router();

router.get('/segment', function (req, res) {

    var nodejieba = require("nodejieba");
    var result = nodejieba.cut("听从上帝得永生");
    console.log(result);

});

module.exports = router;