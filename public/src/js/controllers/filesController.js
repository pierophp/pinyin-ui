angular.module("app").controller("filesController", function ($scope, files, $uibModal, filesAPI) {

    $scope.files = files.data;

    $scope.addFile = function (size) {

        var modalInstance = $uibModal.open({
            templateUrl: 'view/modals/newFile.html',
            controller: 'ModalNewFileController',
            size: size
        });

        modalInstance.result.then(function (data) {
            var filename = data.text + '.json';
            var fileContent = {
                lines: []
            };
            filesAPI.save(filename, fileContent);
        }, function () {

        });
    };

});

angular.module('app').controller('ModalNewFileController', function ($scope, $uibModalInstance) {
    $scope.text;

    $scope.ok = function () {
        $uibModalInstance.close({
            text: $scope.text
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
});