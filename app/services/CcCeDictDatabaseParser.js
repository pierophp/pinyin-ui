'use strict';
var knex = require('./knex');
var removeDiacritics = require('diacritics').remove;
var Promise = require('bluebird');
var UnihanSearch = require('../services/UnihanSearch');
var unihanSearch = new UnihanSearch();

module.exports = class CcCeDictDatabaseParser {

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
        var lineReader = require('readline').createInterface({
            input: require('fs').createReadStream(file)
        });

        lineReader.on('line', function (line) {

            if (line[0] == '#') {
                return;
            }

            let parts = line.split('/');
            let ideogram = parts[0].split(' ')[1];

            parts = line.split('/');

            let pronunciation = parts[0].split('[')[1].replace(']', '').toLowerCase().replace(new RegExp(' ', 'g'), '');
            let pronunciationUnaccented = pronunciation.replace(new RegExp('[12345]', 'g'), '');
            pronunciation = unihanSearch.pinyinTonesNumbersToAccents(pronunciation).replace(new RegExp('5', 'g'), '');

            parts.shift();
            let description = parts[0];
            let measureWords = [];
            for (let part of parts) {
                if (part.substr(0, 3) != 'CL:') {
                    continue;
                }

                let measureWordsTmp = part.replace('CL:', '').split(',');
                for (let measureWord of measureWordsTmp) {
                    measureWord = measureWord.split('[')[0].split('|');
                    if (measureWord[1] != undefined) {
                        measureWord = measureWord[1];
                    } else {
                        measureWord = measureWord[0];
                    }

                    measureWords.push(measureWord)
                }
            }

            console.log(measureWords);

        });

    }
}