angular.module("app.pinyin").controller("filesCtrl", function ($scope, $http, files) {
    $scope.files = files.data;
});