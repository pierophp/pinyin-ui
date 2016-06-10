
var app = angular.module('autocomplete', []);

app.directive('autocomplete', function ($parse) {

  return {
    require: 'ngModel',
    scope: {
      searchParam: '=ngModel',
      autocompleteCallback: '&',
      autocompleteOutput: '=',
      autocompleteSuggestions: '='
    },
    restrict: 'A',
    link: function (scope, element, attrs) {

      var stopWatch = function () { };

      element[0].addEventListener('focus', function (e) {

        stopWatch = scope.$watch('searchParam', function (newValue, oldValue) {

          if (newValue) {
            scope.autocompleteCallback()(newValue).then(function (response) {
              scope.autocompleteSuggestions  = response.data;
            });

          }
        }, true);
      });

      element[0].addEventListener('blur', function (e) {
        stopWatch();
      });

      element[0].addEventListener('keydown', function (e) {
        var keycode = e.keyCode || e.which;
      });

      var key = { left: 37, up: 38, right: 39, down: 40, enter: 13, esc: 27, tab: 9 };

    }
  };
});