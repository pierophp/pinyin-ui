'use strict';

module.exports = class UnihanDatabaseParser {

    constructor() {

    }

    loadFile(file) {
        var fs = require('fs');
        var xml2js = require('xml2js');

        var parser = new xml2js.Parser();
        fs.readFile(file, function (err, data) {
            parser.parseString(data, function (err, result) {

                var chars = result.ucd.repertoire[0].char;

                chars.forEach(function (char) {
                    console.log(String.fromCharCode(parseInt(char.$.cp, 16)));
                    console.log(char.$.kMandarin);
                });
            });
        });
    }
}