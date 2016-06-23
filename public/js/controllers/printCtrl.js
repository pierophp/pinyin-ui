angular.module("app").controller("printCtrl", function ($scope, $routeParams, file, filename) {

    $scope.file = file.data;
    $scope.filename = filename;
    $scope.class = '';
    if ($routeParams['size'] == 'larger') {
        $scope.class = 'larger-print';
    }
});