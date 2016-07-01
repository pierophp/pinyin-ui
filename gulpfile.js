var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var Promise = require('bluebird');
var fs = Promise.promisifyAll(require("fs"));

gulp.task('minify-css', function () {
    return gulp.src('public/src/css/*.css')
        .pipe($.sourcemaps.init())
        .pipe($.cleanCss({ compatibility: 'ie8' }))
        .pipe($.sourcemaps.write())
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
        .pipe($.concat('all.js'))
        .pipe($.sourcemaps.write('.'))
        .pipe(gulp.dest('public/dist/js/'));
});

gulp.task('nodemon', function (done) {

    fs.readFileAsync('nodemon.json', 'utf8').then(function (content) {

        let nodemonConfig = JSON.parse(content);

        $.nodemon({
            script: 'server.js'
            , ext: 'js css'
            , ignore: nodemonConfig.ignore
            , env: { 'NODE_ENV': 'development' }
        });

        done();
    });
});

gulp.task('default', ['minify-css', 'minify-js', 'nodemon'], function () {

    gulp.watch('public/src/css/**/.css', ['minify-css']);
    gulp.watch('public/src/js/**/*.js', ['minify-js']);

});