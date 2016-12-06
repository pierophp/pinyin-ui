angular.module("app").controller("printController", function ($scope, $routeParams, $sce, file, filename, filesAPI) {

  const myCjk = ['上', '的', '我', '人', '不'];

  $scope.file = file.data;
  $scope.filename = filename;
  $scope.class = '';
  if ($routeParams['size'] == 'larger') {
    $scope.class = 'larger-print';
  }

  $scope.printPinyin = function (block) {
    const pinyin = filesAPI.separatePinyinInSyllables(block.p).split(' ');
    const chars = block.c.toString();
    let newPinyin = '';
    for (let i = 0; i < pinyin.length; i++) {
      if (myCjk.indexOf(chars[i]) > -1) {
        newPinyin += '<span class="hide-pinyin"> </span>';
        continue;
      }

      newPinyin += pinyin[i];
    }

    return $sce.trustAsHtml(newPinyin);
  };

  $scope.printTonesColors = function (block) {
    const pinyin = filesAPI.separatePinyinInSyllables(block.p).split(' ');

    const chars = block.c.toString();

    let charsColored = '';
    for (let i = 0; i < chars.length; i++) {
      const tone = filesAPI.extractPinyinTone(pinyin[i]);
      charsColored += '<span class="tone-' + tone + '">' + chars[i] + '</span>';
    }

    return $sce.trustAsHtml(charsColored);
  };
});
