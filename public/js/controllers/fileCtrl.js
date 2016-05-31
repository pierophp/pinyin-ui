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

    $scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
            templateUrl: 'view/modals/filePaste.html',
            controller: 'ModalFileCtrl',
            size: size,
            resolve: {
                items: function () {
                    return $scope.items;
                }
            }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {

        });
    };
});

angular.module('app').controller('ModalFileCtrl', function ($scope, $uibModalInstance) {

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});