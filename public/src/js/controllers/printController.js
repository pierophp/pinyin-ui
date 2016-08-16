angular.module("app").controller("printController", function ($scope, $routeParams, $sce, file, filename, filesAPI) {

    $scope.file = file.data;
    $scope.filename = filename;
    $scope.class = '';
    if ($routeParams['size'] == 'larger') {
        $scope.class = 'larger-print';
    }

    $scope.printTonesColors = function(block){

        var pinyin = filesAPI.separatePinyinInSyllables(block.p).split(' ');

        //console.log(pinyin);
        var chars = block.c.toString();
        
        let charsColored = '';
        for(let i = 0; i < chars.length; i++){
            charsColored += '<span class="tone-' + filesAPI.extractPinyinTone(pinyin[i]) + '">' + chars[i] + '</span>';
        }

        return $sce.trustAsHtml(charsColored);
    };
});