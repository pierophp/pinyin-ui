'use strict';

const app = angular.module('app');

app.filter('ideogram', () => {
  return (input) => {
    return String.fromCodePoint(parseInt(input, 16));
  }
});
