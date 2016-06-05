'use strict';
var knex = require('./knex');
var removeDiacritics = require('diacritics').remove;

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

                if (!char.$.kMandarin) {
                    continue;
                }

                var frequency = char.$.kFrequency;

                if (!frequency) {
                    frequency = 999;
                }

                knex('cjk').insert({
                    ideogram: char.$.cp,
                    pronunciation: char.$.kMandarin,
                    pronunciation_unaccented: removeDiacritics(char.$.kMandarin),
                    definition: char.$.kDefinition,
                    frequency: frequency,
                    language_id: 1,
                    usage: 0,
                    created_at: new Date()
                }).then(function (id) {
                    
                });
            }
        });

    }
}