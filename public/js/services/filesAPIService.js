angular.module("app").factory("filesAPI", function ($http) {

    var _getFiles = function () {
        return $http.get("/files");
    };

    var _getFile = function (filename) {
        return $http.get("/files/file?filename=" + filename);
    };
    
    var _save = function (filename, content) {
        return $http.post("/files/save?filename=" + filename, {content: angular.toJson(content)});
    };
    
    var _parseClipboard = function (content) {
        
        var parts = _.compact(content.split(' '));
        
        for(part in parts){
            console.log(part);
        }
        
        return content;
    };

    return {
        getFiles: _getFiles,
        getFile: _getFile,
        save: _save,
        parseClipboard: _parseClipboard
    };
});