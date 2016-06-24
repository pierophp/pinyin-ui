'use strict';
var knex = require('./knex');
var removeDiacritics = require('diacritics').remove;
var Promise = require('bluebird');

module.exports = class UnihanDatabaseParser {

    constructor() {

    }

    saveWord(pinyin, ideograms) {

        let ideogramsConverted = '';

        for (let i = 0; i < ideograms.length; i++) {
            ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
        }

        return new Promise(function (resolve, reject) {

            knex('cjk').insert({
                ideogram: ideogramsConverted,
                pronunciation: pinyin,
                pronunciation_unaccented: removeDiacritics(pinyin),
                definition: '',
                frequency: 1,
                language_id: 1,
                type: 'W',
                usage: 0,
                created_at: new Date()
            }).then(function () {
                resolve();
            });


        });
    }

    loadFile(file) {

        var fs = require('fs');
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser();
        var data = fs.readFileSync(file);

        parser.parseString(data, function (err, result) {

            var chars = result.ucd.repertoire[0].char;

            Promise.map(chars, function (char) {

                if (!char.$.kMandarin) {
                    return false;
                }

                var frequency = char.$.kFrequency;

                if (!frequency) {
                    frequency = 999;
                }

                var definition = char.$.kDefinition;
                if (definition) {
                    definition = definition.substr(0, 255);
                }

                return knex('cjk').insert({
                    ideogram: char.$.cp,
                    pronunciation: char.$.kMandarin,
                    pronunciation_unaccented: removeDiacritics(char.$.kMandarin),
                    definition: definition,
                    frequency: frequency,
                    language_id: 1,
                    type: 'C',
                    usage: 0,
                    created_at: new Date()
                });

            }, { concurrency: 10 }).then(function () {

            });

        });

    }
}