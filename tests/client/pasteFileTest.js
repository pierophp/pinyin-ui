describe('example test', function () {

    beforeEach(module('app'));
    var _filesAPI = null;
    beforeEach(inject(function (filesAPI) {
        _filesAPI = filesAPI;
    }))

    it('should be true', inject(function (filesAPI) {
        
        var expectParsed = [{'p': '5', 'c': ''},{'p': 'Nà', 'c': '那'}, {'p': 'shíhou', 'c': '时候'}, {'p': 'mángrén', 'c': '盲人'}];
        var result = _filesAPI.parseClipboard('5 Nà 那 shíhou  时候 mángrén 盲人');
        expect(JSON.stringify(expectParsed)).toBe(JSON.stringify(result));
        
    }));
});