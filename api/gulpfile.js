const gulp = require('gulp');
const $ = require('gulp-load-plugins')();
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require("fs"));

gulp.task('lint', () => {
  return gulp.src(['app/**/*.js'])
    .pipe($.eslint())
    .pipe($.eslint.format())
    // .pipe($.eslint.failAfterError())
    ;
});
gulp.task('nodemon', function (done) {
  fs.readFileAsync('nodemon.json', 'utf8').then(function (content) {

    let nodemonConfig = JSON.parse(content);

    $.nodemon({
      script: 'server.js',
      ext: 'js css',
      ignore: nodemonConfig.ignore,
      env: {
        'NODE_ENV': 'development'
      }
    });

    done();

  });
});

gulp.task('default', ['nodemon', 'lint'], () => {
  gulp.watch('app/**/*.js', ['lint']);
  $.livereload.listen();
});

gulp.task('eslint', ['lint'], () => {
  gulp.watch('app/**/*.js', ['lint']);
});
