describe('example test', function () {

    beforeEach(module('app'));
    var _filesAPI = null;
    beforeEach(inject(function (filesAPI) {
        _filesAPI = filesAPI;
    }))

    it('should be true', inject(function (filesAPI) {
        expect('foo').toBe(_filesAPI.parseClipboard('5 Nà 那 shíhou  时候 mángrén 盲人'));
    }));
});