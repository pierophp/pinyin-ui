angular.module("app").controller("fileCtrl", function ($scope, file, filename, filesAPI, $uibModal) {

    $scope.file = file.data;
    $scope.filename = filename;

    $scope.addBlock = function (line) {
        line.push({ "p": "", "c": "" });
    };

    $scope.addLine = function () {
        $scope.file.lines.push([]);
    };
    
    $scope.removeLine = function(lineIndex){
        _.pullAt($scope.file.lines, [lineIndex]);
    };
    
    $scope.removeBlock = function(line, blockIndex){
        _.pullAt(line, [blockIndex]);
    };

    $scope.save = function () {
        filesAPI.save($scope.filename, $scope.file);
    };
    
    $scope.currentLineIndex;

    $scope.openModalClipBoard01 = function (size, line, lineIndex) {

        $scope.currentLineIndex = lineIndex;

        var modalInstance = $uibModal.open({
            templateUrl: 'view/modals/filePaste.html',
            controller: 'ModalFileCtrl',
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
            controller: 'ModalFileCtrl',
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

angular.module('app').controller('ModalFileCtrl', function ($scope, $uibModalInstance, line) {
    
    $scope.line = line;
    $scope.text;

    $scope.ok = function () {
        $uibModalInstance.close({ text: $scope.text, line: $scope.line });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});