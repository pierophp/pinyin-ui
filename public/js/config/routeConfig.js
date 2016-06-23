angular.module("app").config(function ($routeProvider) {


    $routeProvider
        .when('/', {
            templateUrl: 'view/files.html',
            controller: 'filesCtrl',
            resolve: {
                files: function (filesAPI, $route) {
                    return filesAPI.getFiles();
                }
            }
        })
        .when('/files/file/:filename', {
            templateUrl: 'view/file.html',
            controller: 'fileCtrl',
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
            controller: 'printCtrl',
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