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

        let changeToneRules = {
            '不': {
                4: 'bú'
            },
            '一': {
                1: 'yì',
                2: 'yì',
                3: 'yì',
                4: 'yí'
            }
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
        };

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
        };

        let extractPinyinTone = function (pinyin) {

            let tones = [{
                tone: 1,
                letters: ['ā', 'ē', 'ī', 'ō', 'ū', 'ǖ']
            }, {
                tone: 2,
                letters: ['á', 'é', 'í', 'ó', 'ú', 'ǘ']
            }, {
                tone: 3,
                letters: ['ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ', 'ǚ']
            }, {
                tone: 4,
                letters: ['à', 'è', 'ì', 'ò', 'ù', 'ǜ']
            }];

            for (let tone of tones) {

                for (let letter of tone.letters) {
                    if (pinyin.indexOf(letter) > -1) {
                        return tone.tone;
                    }
                }
            }

            return 0;
        };

        let parseResultByIdeograms = function (ideogramsList, ideograms) {

            let result = {};

            result.pinyin = '';

            let i = 0;

            for (let ideogram of ideogramsList) {

                let character = ideograms[i];

                if (ideogram.length == 0) {
                    if (specialsChars[character]) {
                        result.pinyin += specialsChars[character];
                    } else {
                        result.pinyin += "__";
                    }

                } else {

                    if (changeToneRules[character] && ideogramsList[i + 1] && ideogramsList[i + 1][0]) {

                        let tone = extractPinyinTone(ideogramsList[i + 1][0].pronunciation);

                        if (changeToneRules[character][tone]) {
                            result.pinyin += changeToneRules[character][tone];
                        } else {
                            result.pinyin += ideogram[0].pronunciation;
                        }

                    } else {
                        result.pinyin += ideogram[0].pronunciation;
                    }

                }

                i++;
            }

            return result;
        };

        return new Promise(function (resolve, reject) {

            searchByWord(ideograms).then(function (words) {
                let result = {};

                if (words.length > 0) {
                    result.pinyin = words[0].pronunciation;
                    resolve(result);
                } else {

                    searchByIdeograms(ideograms).then(function (ideogramsList) {
                        resolve(parseResultByIdeograms(ideogramsList, ideograms));
                    });
                }
            });

        });
    }

    pinyinTonesNumbersToAccents(text) {

        function getUpperCaseIndices(str) {
            var indices = [];
            for (var i = 0; i < str.length; i++) {
                if (str[i] === str[i].toUpperCase()) {
                    indices.push(i);
                }
            }
            return indices;
        }

        function revertToUpperCase(str, indices) {
            var chars = str.split('');
            indices.map(function (idx) {
                chars[idx] = chars[idx].toUpperCase();
            });
            return chars.join('');
        }

        var tonePtn = /([aeiouvüAEIOUVÜ]{1,2}(n|ng|r|\'er|N|NG|R|\'ER){0,1}[1234])/g;
        var toneMap = {
            a: ['ā', 'á', 'ǎ', 'à'],
            ai: ['āi', 'ái', 'ǎi', 'ài'],
            ao: ['āo', 'áo', 'ǎo', 'ào'],
            e: ['ē', 'é', 'ě', 'è'],
            ei: ['ēi', 'éi', 'ěi', 'èi'],
            i: ['ī', 'í', 'ǐ', 'ì'],
            ia: ['iā', 'iá', 'iǎ', 'ià'],
            ie: ['iē', 'ié', 'iě', 'iè'],
            io: ['iō', 'ió', 'iǒ', 'iò'],
            iu: ['iū', 'iú', 'iǔ', 'iù'],
            o: ['ō', 'ó', 'ǒ', 'ò'],
            ou: ['ōu', 'óu', 'ǒu', 'òu'],
            u: ['ū', 'ú', 'ǔ', 'ù'],
            ua: ['uā', 'uá', 'uǎ', 'uà'],
            ue: ['uē', 'ué', 'uě', 'uè'],
            ui: ['uī', 'uí', 'uǐ', 'uì'],
            uo: ['uō', 'uó', 'uǒ', 'uò'],
            v: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
            ve: ['üē', 'üé', 'üě', 'üè'],
            ü: ['ǖ', 'ǘ', 'ǚ', 'ǜ'],
            üe: ['üē', 'üé', 'üě', 'üè'],
        };
        var tones = text.match(tonePtn);
        if (tones) {
            tones.forEach(function (coda, idx, arr) {
                var toneIdx = parseInt(coda.slice(-1)) - 1;
                var vowel = coda.slice(0, -1);
                var suffix = vowel.match(/(n|ng|r|\'er|N|NG|R|\'ER)$/);
                vowel = vowel.replace(/(n|ng|r|\'er|N|NG|R|\'ER)$/, '');
                var upperCaseIdxs = getUpperCaseIndices(vowel);
                vowel = vowel.toLowerCase();
                var replacement = suffix && toneMap[vowel][toneIdx] + suffix[0] || toneMap[vowel][toneIdx];
                text = text.replace(coda, revertToUpperCase(replacement, upperCaseIdxs));
            });
        }

        return text;
    }
}