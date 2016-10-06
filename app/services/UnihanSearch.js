const Promise = require('bluebird');
const knex = require('./knex');

module.exports = class UnihanSearch {

  static searchByIdeograms(ideograms) {
    const ideogramPromises = [];

    for (let i = 0; i < ideograms.length; i += 1) {
      const ideogramConverted = ideograms[i].charCodeAt(0).toString(16);

      ideogramPromises.push(knex('cjk')
        .where({
          ideogram: ideogramConverted,
          type: 'C',
        })
        .orderBy('frequency', 'ASC')
        .orderBy('usage', 'DESC')
        .select('id', 'pronunciation')
      );
    }

    return Promise.all(ideogramPromises);
  }

  static convertIdeograms(ideograms) {
    let ideogramsConverted = '';
    for (let i = 0; i < ideograms.length; i += 1) {
      ideogramsConverted += ideograms[i].charCodeAt(0).toString(16);
    }

    return ideogramsConverted;
  }

  static searchByWord(ideograms) {
    return knex('cjk')
      .where({
        ideogram: UnihanSearch.convertIdeograms(ideograms),
        type: 'W',
      })
      .orderBy('frequency', 'ASC')
      .orderBy('usage', 'DESC')
      .select('id', 'pronunciation');
  }

  static extractPinyinTone(pinyin) {
    const tones = [{
      tone: 1,
      letters: ['ā', 'ē', 'ī', 'ō', 'ū', 'ǖ'],
    }, {
      tone: 2,
      letters: ['á', 'é', 'í', 'ó', 'ú', 'ǘ'],
    }, {
      tone: 3,
      letters: ['ǎ', 'ě', 'ǐ', 'ǒ', 'ǔ', 'ǚ'],
    }, {
      tone: 4,
      letters: ['à', 'è', 'ì', 'ò', 'ù', 'ǜ'],
    }];

    for (const tone of tones) {
      for (const letter of tone.letters) {
        if (pinyin.indexOf(letter) > -1) {
          return tone.tone;
        }
      }
    }

    return 0;
  }

  static parseResultByIdeograms(ideogramsList, ideograms) {
    const specialsChars = {
      '。': '.',
      '？': '?',
      '、': ',',
      '：': ':',
      1: '1',
      2: '2',
      3: '3',
      4: '4',
      5: '5',
      6: '6',
      7: '7',
      8: '8',
      9: '9',
      0: '0',
    };

    const changeToneRules = {
      不: {
        4: 'bú',
      },
      一: {
        1: 'yì',
        2: 'yì',
        3: 'yì',
        4: 'yí',
      },
    };

    const result = {};
    result.pinyin = '';

    let i = 0;

    for (const ideogram of ideogramsList) {
      const character = ideograms[i];

      if (ideogram.length === 0) {
        if (specialsChars[character]) {
          result.pinyin += specialsChars[character];
        } else {
          result.pinyin += '__';
        }
      } else if (changeToneRules[character] && ideogramsList[i + 1] && ideogramsList[i + 1][0]) {
        const tone = UnihanSearch.extractPinyinTone(ideogramsList[i + 1][0].pronunciation);
        if (changeToneRules[character][tone]) {
          result.pinyin += changeToneRules[character][tone];
        } else {
          result.pinyin += ideogram[0].pronunciation;
        }
      } else {
        result.pinyin += ideogram[0].pronunciation;
      }

      i += 1;
    }

    return result;
  }

  static toPinyin(ideograms) {
    return new Promise((resolve) => {
      UnihanSearch.searchByWord(ideograms).then((words) => {
        const result = {};
        if (words.length > 0) {
          result.pinyin = words[0].pronunciation;
          resolve(result);
        } else {
          UnihanSearch.searchByIdeograms(ideograms).then((ideogramsList) => {
            resolve(UnihanSearch.parseResultByIdeograms(ideogramsList, ideograms));
          });
        }
      });
    });
  }

  static pinyinTonesNumbersToAccents(text) {
    function getUpperCaseIndices(str) {
      const indices = [];
      for (let i = 0; i < str.length; i += 1) {
        if (str[i] === str[i].toUpperCase()) {
          indices.push(i);
        }
      }
      return indices;
    }

    function revertToUpperCase(str, indices) {
      const chars = str.split('');
      for (const idx of indices) {
        chars[idx] = chars[idx].toUpperCase();
      }
      return chars.join('');
    }

    const tonePtn = /([aeiouvüAEIOUVÜ]{1,2}(n|ng|r|'er|N|NG|R|'ER){0,1}[1234])/g;
    const toneMap = {
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
    const tones = text.match(tonePtn);
    if (tones) {
      for (const coda of tones) {
        const toneIdx = parseInt(coda.slice(-1), 10) - 1;
        let vowel = coda.slice(0, -1);
        const suffix = vowel.match(/(n|ng|r|'er|N|NG|R|'ER)$/);
        vowel = vowel.replace(/(n|ng|r|'er|N|NG|R|'ER)$/, '');
        const upperCaseIdxs = getUpperCaseIndices(vowel);
        vowel = vowel.toLowerCase();
        let replacement = toneMap[vowel][toneIdx];
        if (suffix) {
          replacement = toneMap[vowel][toneIdx] + suffix[0];
        }

        text = text.replace(coda, revertToUpperCase(replacement, upperCaseIdxs));
      }
    }

    return text;
  }
};
