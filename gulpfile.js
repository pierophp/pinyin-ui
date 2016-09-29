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

gulp.task('minify-css', function () {
  return gulp.src('public/src/css/*.css')
    .pipe($.sourcemaps.init())
    .pipe($.cleanCss({
      compatibility: 'ie8'
    }))
    .pipe($.sourcemaps.write())
    .pipe($.livereload())
    .pipe($.concat('all.css'))
    .pipe(gulp.dest('public/dist/css/'));
});

gulp.task('minify-js', function () {

  return gulp.src([
      'public/src/js/directives/*.js',
      'public/src/js/ng-pinyin.js',
      'public/src/js/app.js',
      'public/src/js/controllers/*.js',
      'public/src/js/filters/*.js',
      'public/src/js/services/*.js',
      'public/src/js/config/*.js',
    ])
    .pipe($.sourcemaps.init())
    .pipe($.babel({
      presets: ['es2015']
    }))
    .pipe($.uglify({
      mangle: false
    }))
    .pipe($.livereload())
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest('public/dist/js/'));
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

gulp.task('default', ['minify-css', 'minify-js', 'lint', 'nodemon'], function () {
  gulp.watch('public/src/css/**/*.css', ['minify-css']);
  gulp.watch('public/src/js/**/*.js', ['minify-js']);
  gulp.watch('app/**/*.js', ['lint']);
  $.livereload.listen();
});

gulp.task('eslint', ['lint'], function () {
  gulp.watch('app/**/*.js', ['lint']);
});
