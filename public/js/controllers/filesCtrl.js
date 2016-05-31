angular.module("app").controller("filesCtrl", function ($scope, $http, files) {
    $scope.files = files.data;
});