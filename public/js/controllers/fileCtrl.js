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

    $scope.openModal = function (size, line) {

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

        modalInstance.result.then(function (text, line) {
            line = _.concat(line, filesAPI.parseClipboard(text));
        }, function () {

        });
    };
});

angular.module('app').controller('ModalFileCtrl', function ($scope, $uibModalInstance, line) {

    $scope.line = line;
    $scope.text;

    $scope.ok = function () {
        $uibModalInstance.close($scope.text, line);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});