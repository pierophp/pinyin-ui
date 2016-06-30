var Promise = require('bluebird');
var knex = require('./knex');

module.exports = class UnihanSearch {

    constructor() {

    }

    toPinyin(ideograms) {
 
        let specialsChars = {
            "。": ".",
            "？": "?",
            "、": ",",
            "：": ":",
            "1": "1",
            "2": "2",
            "3": "3",
            "4": "4",
            "5": "5",
            "6": "6",
            "7": "7",
            "8": "8",
            "9": "9",
            "0": "0"
        };

        let searchByWord = function (ideograms) {

            let ideogramsConverted = '';
            for (let i = 0; i < ideograms.length; i++) {
                ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
            }

            return knex('cjk')
                .where({
                    ideogram: ideogramsConverted,
                    type: 'W'
                })
                .orderBy('frequency', 'ASC')
                .orderBy('usage', 'DESC')
                .select('id', 'pronunciation');
        }

        let searchByIdeograms = function (ideograms) {

            let ideogramPromises = [];

            for (let i = 0; i < ideograms.length; i++) {

                let ideogramConverted = ideograms[i].charCodeAt(0).toString(16);

                ideogramPromises.push(knex('cjk')
                    .where({
                        ideogram: ideogramConverted,
                        type: 'C'
                    })
                    .orderBy('frequency', 'ASC')
                    .orderBy('usage', 'DESC')
                    .select('id', 'pronunciation')
                );
            }

            return Promise.all(ideogramPromises);
        }


        return new Promise(function (resolve, reject) {

            searchByWord(ideograms).then(function (words) {
                let result = {};

                if (words.length > 0) {
                    result.pinyin = words[0].pronunciation;
                    resolve(result);
                } else {

                    searchByIdeograms(ideograms).then(function (ideogramsList) {

                        var result = {};

                        result.pinyin = '';

                        let i = 0;
                        for (let ideogram of ideogramsList) {
                            if (ideogram.length == 0) {

                                let character = ideograms[i];

                                if (specialsChars[character]) {
                                    result.pinyin += specialsChars[character];
                                } else {
                                    result.pinyin += "__";
                                }


                            } else {
                                result.pinyin += ideogram[0].pronunciation;
                            }

                            i++;
                        }

                        resolve(result);

                    });
                }
            });

        });
    }
}