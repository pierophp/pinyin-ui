angular.module("app").controller("loginController", function ($scope, $http, $location) {
  $scope.showLogin = false;
  $http.get("/auth/is_logged_in").success(function (data) {
    if (data.isAuthenticated) {
      $location.path('/files')
    } else {
      $scope.showLogin = true;
    }
  });
});
