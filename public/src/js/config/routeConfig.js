angular.module("app").config(function ($routeProvider) {


    $routeProvider
        .when('/', {
            templateUrl: 'view/login.html',
            controller: 'loginController',
            resolve: {
                files: function (filesAPI, $route) {
                    return filesAPI.getFiles();
                }
            }
        })
        .when('/files', {
            templateUrl: 'view/files.html',
            controller: 'filesController',
            resolve: {
                files: function (filesAPI, $route) {
                    return filesAPI.getFiles();
                }
            }
        })
        .when('/files/file/:filename', {
            templateUrl: 'view/file.html',
            controller: 'fileController',
            resolve: {
                file: function (filesAPI, $route) {

                    var filename = $route.current.params.filename;

                    return filesAPI.getFile(filename);
                },
                filename: function ($route) {

                    return $route.current.params.filename;
                }
            }
        }).when('/files/print/:filename', {
            templateUrl: 'view/print.html',
            controller: 'printController',
            resolve: {
                file: function (filesAPI, $route) {
                    
                    var filename = $route.current.params.filename;

                    return filesAPI.getFile(filename);
                },
                filename: function ($route) {

                    return $route.current.params.filename;
                }
            }
        });

});