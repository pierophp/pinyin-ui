var gulp = require('gulp');
var $ = require('gulp-load-plugins')();

gulp.task('minify-css', function () {
    return gulp.src('public/src/css/*.css')
        .pipe($.sourcemaps.init())
        .pipe($.cleanCss({ compatibility: 'ie8' }))
        .pipe($.sourcemaps.write())
        .pipe(gulp.dest('public/dist/css/'));
});

gulp.task('minify-js', function (cb) {
    gulp.src([
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

gulp.task('default', function () {
    gulp.watch('public/src/css/**/.css', ['minify-css']);
    gulp.watch('public/src/js/**/*.js', ['minify-js']);
});