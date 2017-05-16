const knex = require('./knex');
const UnihanSearch = require('../services/UnihanSearch');
const separatePinyinInSyllables = require('../helpers/separate-pinyin-in-syllables');
const extractPinyinTone = require('../helpers/extract-pinyin-tone');
const removeDiacritics = require('diacritics').remove;

module.exports = class Pleco {
  static async export() {
    const result = await knex('cjk').whereRaw('definition_pt IS NOT NULL AND id IN(249822, 249821, 249820)').limit(10);
    let resultFile = '';
    result.forEach((entry) => {
      let definition = JSON.parse(entry.definition_pt);
      // definition = definition.join(String.fromCharCode(60081));
      definition = definition.join(' ');
      const pinyin = separatePinyinInSyllables(entry.pronunciation);
      let pinyinTones = '';
      pinyin.split(' ').forEach((syllable) => {
        let tone = extractPinyinTone(syllable);
        if (tone === 0) {
          tone = 5;
        }
        pinyinTones += `${removeDiacritics(syllable)}${tone}`;
      });
      const ideograms = UnihanSearch.convertUtf16ToIdeograms(entry.ideogram);
      resultFile += `${ideograms}\t${pinyinTones}\t${definition}\n`;
    });
    // eslint-disable-next-line
    console.log(resultFile);
  }
};
