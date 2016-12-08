angular.module("app").factory("filesAPI", function ($http) {

  let _extractPinyinTone = function (pinyin) {

    if(pinyin === undefined){
      return 0;
    }

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

  return {
    getFiles: _getFiles,
    getFile: _getFile,
    save: _save,
    toPinyin: _toPinyin,
    parseClipboard01: _parseClipboard01,
    parseClipboard02: _parseClipboard02,
    separatePinyinInSyllables: _separatePinyinInSyllables,
    extractPinyinTone: _extractPinyinTone
  };
});
