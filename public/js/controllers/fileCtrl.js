angular.module("app").controller("fileCtrl", function ($scope, file, filename, filesAPI, $uibModal) {

    $scope.file = file.data;
    $scope.filename = filename;

    $scope.addBlock = function (line) {
        line.push({ "p": "", "c": "" });
    };

    $scope.addLine = function () {
        $scope.file.push([]);
    };

    $scope.save = function () {
        filesAPI.save($scope.filename, $scope.file);
    };
    
    $scope.currentLineIndex;

    $scope.openModal = function (size, line, lineIndex) {

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
            $scope.file.lines[$scope.currentLineIndex] = _.concat(data.line, filesAPI.parseClipboard(data.text));
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