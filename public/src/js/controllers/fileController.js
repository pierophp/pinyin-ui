angular.module("app").controller("fileController", function ($scope, $http, $filter, file, filename, filesAPI, $uibModal) {

  $scope.file = file.data;
  $scope.filename = filename;
  $scope.autocomplete = '';

  $scope.addBlock = function (line) {
    line.push({
      "p": "",
      "c": ""
    });
  };

  $scope.addLine = function () {
    $scope.file.lines.push([]);
  };

  $scope.removeLine = function (lineIndex) {
    _.pullAt($scope.file.lines, [lineIndex]);
  };

  $scope.removeBlock = function (line, blockIndex) {
    _.pullAt(line, [blockIndex]);
  };

  $scope.save = function () {
    filesAPI.save($scope.filename, $scope.file);
  };

  $scope.pinyinAutocomplete = function (value) {

    let syllables = filesAPI.separatePinyinInSyllables(value).split(' ');

    let lastSyllable = syllables[syllables.length - 1];

    return $http.get("/unihan/search?pinyin=" + lastSyllable);
  };

  $scope.pinyinSelectAutocomplete = function (block, value, autocomplete) {
    block.c += $filter('ideogram')(value);
    autocomplete.items = [];
  };

  $scope.currentLineIndex;

  $scope.convertToPinyin = function (line) {

    for (let block of line) {

      (function () {

        var pinyinBlock = block;

        filesAPI.toPinyin(block.c).then(function (response) {
          pinyinBlock.p = response.data.pinyin;
        });
      })();
    }

  };

  $scope.openModalClipBoard01 = function (size, line, lineIndex) {

    $scope.currentLineIndex = lineIndex;

    var modalInstance = $uibModal.open({
      templateUrl: 'view/modals/filePaste.html',
      controller: 'ModalFileController',
      size: size,
      resolve: {
        line: function () {
          return line;
        }
      }
    });

    modalInstance.result.then(function (data) {
      $scope.file.lines[$scope.currentLineIndex] = _.concat(data.line, filesAPI.parseClipboard01(data.text));
    }, function () {

    });
  };


  $scope.openModalClipBoard02 = function (size, line, lineIndex) {

    $scope.currentLineIndex = lineIndex;

    var modalInstance = $uibModal.open({
      templateUrl: 'view/modals/filePaste.html',
      controller: 'ModalFileController',
      size: size,
      resolve: {
        line: function () {
          return line;
        }
      }
    });

    modalInstance.result.then(function (data) {
      $scope.file.lines[$scope.currentLineIndex] = _.concat(data.line, filesAPI.parseClipboard02(data.text));
    }, function () {

    });
  };
});

angular.module('app').controller('ModalFileController', function ($scope, $uibModalInstance, line) {

  $scope.line = line;
  $scope.text;

  $scope.ok = function () {
    $uibModalInstance.close({
      text: $scope.text,
      line: $scope.line
    });
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});
