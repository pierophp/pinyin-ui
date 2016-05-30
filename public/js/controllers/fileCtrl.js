angular.module("app.pinyin").controller("fileCtrl", function ($scope, $http, file, filename, filesAPI) {
    
    $scope.file = file.data;
    $scope.filename = filename;
    
    $scope.addBlock = function(line){
        line.push({"p": "", "c": ""});
    };
    
    $scope.addLine = function(){
        $scope.file.push([]);
    };
    
    $scope.save = function(){
        filesAPI.save($scope.filename, $scope.file);
    };
});