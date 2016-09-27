angular.module("app").factory("filesAPI", function ($http) {

    var _getFiles = function () {
        return $http.get("/files");
    };

    var _getFile = function (filename) {
        return $http.get("/files/file?filename=" + filename);
    };

    var _save = function (filename, content) {
        return $http.post("/files/save?filename=" + filename, {
            content: angular.toJson(content)
        });
    };

    var _toPinyin = function (ideograms) {
        return $http.get("/unihan/to_pinyin?ideograms=" + ideograms);
    };

    var _parseClipboard01 = function (content) {

        content = content.replace(/(\r\n|\n|\r)/gm, ' ');

        var parts = _.compact(content.split(' '));
        var row = [];
        var block = {};
        var char = '';
        var pinyin = '';

        parts.forEach(function (part) {

            if (_isChinese(part)) {
                char = part;
                row.push({
                    "p": pinyin,
                    "c": char
                });
                char = '';
                pinyin = '';
            } else {

                if (pinyin) {
                    row.push({
                        "p": pinyin,
                        "c": char
                    });
                    char = '';
                }

                pinyin = part;
            }
        });

        if (pinyin) {
            row.push({
                "p": pinyin,
                "c": char
            });
        }

        return row;
    };

    var _parseClipboard02 = function (content) {

        var row = [];
        var lines = _.compact(content.split('\n'));

        var hanziLine = lines[0];
        var pinyinLine = lines[1];

        var pinyinWords = pinyinLine.split(' ');

        var i = 0;

        pinyinWords.forEach(function (pinyinWord) {

            var syllables = _separatePinyinInSyllables(pinyinWord);
            var words = syllables.split(' ');
            var pinyin = '';
            var char = '';

            words.forEach(function (word) {
                var hanziWord = hanziLine.substr(i, 1);
                pinyin += word;
                char += hanziWord;
                i++;
            });

            row.push({
                "p": pinyin,
                "c": char
            });
        });

        return row;
    };

    var chineseRange = [
        [0x4e00, 0x9fff], // CJK Unified Ideographs
        [0x3400, 0x4dbf], // CJK Unified Ideographs Extension A
        [0x20000, 0x2a6df], // CJK Unified Ideographs Extension B
        [0x2a700, 0x2b73f], // CJK Unified Ideographs Extension C
        [0x2b740, 0x2b81f], // CJK Unified Ideographs Extension D
        [0x2b820, 0x2ceaf], // CJK Unified Ideographs Extension E
        [0xf900, 0xfaff], // CJK Compatibility Ideographs

        [0x3300, 0x33ff], // https://en.wikipedia.org/wiki/CJK_Compatibility
        [0xfe30, 0xfe4f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Forms
        [0xf900, 0xfaff], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs
        [0x2f800, 0x2fa1f], // https://en.wikipedia.org/wiki/CJK_Compatibility_Ideographs_Supplement
        [65311, 65311], // ponctuation ？
        [12289, 12290], // 、。
        [65306, 65306], // ：
    ];

    var _isChinese = function (str) {

        var charCode;
        var flag = false;
        var range;

        str = str
            .replace(1, '')
            .replace(2, '')
            .replace(3, '')
            .replace(4, '')
            .replace(5, '')
            .replace(6, '')
            .replace(7, '')
            .replace(8, '')
            .replace(9, '')
            .replace(0, '');

        for (var i = 0; i < str.length;) {

            charCode = str.codePointAt(i);

            flag = false;

            for (var j = 0; j < chineseRange.length; j++) {
                range = chineseRange[j];
                if (charCode >= range[0] && charCode <= range[1]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                return false;
            }

            if (charCode <= 0xffff) {
                i++
            } else {
                i += 2
            }
        }

        return flag;
    };

    var _separatePinyinInSyllables = function (pinyin) {

        var vowels = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔùüǖǘǚǜ';

        return pinyin
            .replace(new RegExp('([' + vowels + '])([^' + vowels + 'nr])', 'g'), '$1 $2') // This line does most of the work
            .replace(new RegExp('(\w)([csz]h)'), '$1 $2') // double-consonant initials
            .replace(new RegExp('(n)([^' + vowels + 'vg])'), '$1 $2') // cleans up most n compounds
            .replace(new RegExp('([' + vowels + 'v])([^' + vowels + '\w\s])([' + vowels + 'v])'), '$1 $2$3') // assumes correct Pinyin (i.e., no missing apostrophes)
            .replace(new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])'), '$1$2 $3$4') // assumes correct Pinyin, i.e. changan = chan + gan
            .replace(new RegExp('([gr])([^' + vowels + '])'), '$1 $2') // fixes -ng and -r finals not followed by vowels


        //            .replace(new RegExp('([^e\w\s])(r)'), '$1 $2'); // r an initial, except in er
    };

    let _extractPinyinTone = function (pinyin) {

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