'use strict';

module.exports = class UnihanDatabaseParser {

    constructor() {

    }

    loadFile(file) {
        
        var fs = require('fs');
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        var data = fs.readFileSync(file);

        parser.parseString(data, function (err, result) {

            var chars = result.ucd.repertoire[0].char;
            
            for (let char of chars) {
                console.log(String.fromCharCode(parseInt(char.$.cp, 16)));
                console.log(char.$.kMandarin);
            }
        });

    }
}