describe('Parse Clipboard', function () {

    beforeEach(module('app'));
    
    var _filesAPI = null;
    
    beforeEach(inject(function (filesAPI) {
        _filesAPI = filesAPI;
    }));

    it('Clipboard 01', inject(function (filesAPI) {
        
        var expectParsed = [{'p': '5', 'c': ''},{'p': 'Nà', 'c': '那'}, {'p': 'shíhou', 'c': '时候'}, {'p': 'mángrén?', 'c': '盲人？'}];
        var result = _filesAPI.parseClipboard01('5 Nà 那 shíhou  时候 mángrén? 盲人？');
        
        expect(JSON.stringify(expectParsed)).toBe(JSON.stringify(result));
        
    }));
    
    
    it('Clipboard 02', inject(function (filesAPI) {
        var expectParsed = [
            {'p': 'Nǐ', 'c': '你'}, 
            {'p': 'xiǎng', 'c': '想'}, 
            {'p': 'bu', 'c': '不'},
            {'p': 'xiǎng', 'c': '想'},
            {'p': 'zhīdao', 'c': '知道'},
            {'p': 'zhèige', 'c': '这个'},
            {'p': 'wèntí', 'c': '问题'},
            {'p': 'de', 'c': '的'},
            {'p': 'dá\'àn？', 'c': '答案？'}
            
        ];
        
        var result = _filesAPI.parseClipboard02("你想不想知道这个问题的答案？ \nNǐ xiǎng bu xiǎng zhīdao zhèige wèntí de dá'àn？");
        expect(JSON.stringify(expectParsed)).toBe(JSON.stringify(result));
    }));
});