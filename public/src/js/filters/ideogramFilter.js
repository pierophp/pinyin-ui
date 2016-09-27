'use strict';

var app = angular.module('app');

app.filter('ideogram', function () {

    return function (input) {

        var output = String.fromCharCode(parseInt(input, 16));

        return output;

    }
});