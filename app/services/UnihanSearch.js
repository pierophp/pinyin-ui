var Promise = require('bluebird');
var knex = require('./knex');

module.exports = class UnihanSearch {

    constructor() {

    }

    toPinyin(ideograms) {

        let ideogramPromises = [];
        let ideogramsConverted = '';
        let searchByWord = function (ideogramsConverted) {
            return knex('cjk')
                .where({
                    ideogram: ideogramsConverted,
                    type: 'W'
                })
                .orderBy('frequency', 'ASC')
                .orderBy('usage', 'DESC')
                .select('id', 'pronunciation');
        }

        for (let i = 0; i < ideograms.length; i++) {
            ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
        }

        return new Promise(function (resolve, reject) {

            searchByWord(ideogramsConverted).then(function (words) {
                let result = {};

                if (words.length > 0) {
                    result.pinyin = words[0].pronunciation;
                    resolve(result);
                } else {

                    for (let i = 0; i < ideograms.length; i++) {

                        var ideogramConverted = ideograms[i].charCodeAt(0).toString(16);

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

                    Promise.all(ideogramPromises).then(

                        function (ideograms) {

                            var result = {};

                            result.pinyin = '';

                            for (let ideogram of ideograms) {
                                if (ideogram.length == 0) {
                                    result.pinyin += "__";
                                } else {
                                    result.pinyin += ideogram[0].pronunciation;
                                }
                            }

                            resolve(result);

                        });
                }
            });

        });
    }
}