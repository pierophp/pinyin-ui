angular.module("app").factory("filesAPI", function ($http) {

    var _getFiles = function () {
        return $http.get("/files");
    };

    var _getFile = function (filename) {
        return $http.get("/files/file?filename=" + filename);
    };

    var _save = function (filename, content) {
        return $http.post("/files/save?filename=" + filename, { content: angular.toJson(content) });
    };

    var _parseClipboard01 = function (content) {
        
        content = content.replace(/(\r\n|\n|\r)/gm, ' ');
        
        console.log(content);
            
        var parts = _.compact(content.split(' '));
        var row = [];
        var block = {};
        var char = '';
        var pinyin = '';

        parts.forEach(function (part) {

            if (_isChinese(part)) {
                char = part;
                row.push({ "p": pinyin, "c": char });
                char = '';
                pinyin = '';
            } else {

                if (pinyin) {
                    row.push({ "p": pinyin, "c": char });
                    char = '';
                }

                pinyin = part;
            }
        });

        if (pinyin) {
            row.push({ "p": pinyin, "c": char });
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
            words.forEach(function(word){
                var hanziWord = hanziLine.substr(i, 1);
                pinyin += word;
                char += hanziWord;
                i++;
            });
            
            row.push({ "p": pinyin, "c": char});
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
        
    ];

    var _isChinese = function (str) {

        var charCode;
        var flag;
        var range;

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

        return true;
    }

    var _separatePinyinInSyllables = function (pinyin) {

        var vowels = 'aāáǎàeēéěèiīíǐìoōóǒòuūúǔù';

        return pinyin
            .replace(new RegExp('([' + vowels + '])([^' + vowels + 'nr\w\s])'), '$1 $2')
            .replace(new RegExp('(\w)([csz]h)'), '$1 $2')
            .replace(new RegExp('(n)([^' + vowels + 'vg\w\s])'), '$1 $2')
            .replace(new RegExp('([' + vowels + 'v])([^' + vowels + '\w\s])([' + vowels + 'v])'), '$1 $2$3')
            .replace(new RegExp('([' + vowels + 'v])(n)(g)([' + vowels + 'v])'), '$1$2 $3$4')
            .replace(new RegExp('([gr])([^' + vowels + '\w\s])'), '$1 $2')
            .replace(new RegExp('([^e\w\s])(r)'), '$1 $2');
    };

    return {
        getFiles: _getFiles,
        getFile: _getFile,
        save: _save,
        parseClipboard01: _parseClipboard01,
        parseClipboard02: _parseClipboard02
    };
});