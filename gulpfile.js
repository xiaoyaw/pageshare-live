var gulp = require('gulp');
var browserify = require('browserify');
var babelify = require('babelify');
var vinylSourceStream = require('vinyl-source-stream');
var vinylBuffer = require('vinyl-buffer');
var htmlMinifier = require('gulp-html-minifier');
var uglify = require('gulp-uglify');

gulp.task('live-js-for-development', function () {
  return browserify('./source/js/app.jsx')
        .transform('babelify', { presets: ['react', 'es2015'] })
        .bundle()
        .pipe(vinylSourceStream('app.js'))
        .pipe(gulp.dest('./live/js/'));
});

gulp.task('live-js-for-production', function () {
  return browserify('./source/js/app.jsx')
        .transform('babelify', { presets: ['react', 'es2015'] })
        .bundle()
        .pipe(vinylSourceStream('app.js'))
        .pipe(vinylBuffer())
        .pipe(uglify())
        .pipe(gulp.dest('./live/js/'));
});

gulp.task('live-html-for-development', function () {
  return gulp
        .src('./source/*.html')
        .pipe(gulp.dest('./live'));
});


gulp.task('live-img-for-development', function () {
  return gulp
      .src('./source/img/*.*')
      .pipe(gulp.dest('./live/img'));
});

gulp.task('live-css-for-development', function () {
  return gulp
      .src('./source/css/*.*')
      .pipe(gulp.dest('./live/css'));
});



gulp.task('live-html-for-production', function () {
  return gulp
        .src('./source/*.html')
        .pipe(htmlMinifier({ collapseWhitespace: true }))
        .pipe(gulp.dest('./live'));
});

gulp.task('watch', function () {
  gulp.watch('./source/js/**/*.{jsx,js}', ['live-js-for-development']);
  gulp.watch('./source/**/*.html', ['live-html-for-development']);
  gulp.watch('./source/css/*.css', ['live-css-for-development']);
});

gulp.task('live-for-development', ['live-js-for-development', 'live-html-for-development', 'live-img-for-development','live-css-for-development']);
gulp.task('live-for-production', ['live-js-for-production', 'live-html-for-production']);

gulp.task('default', ['live-for-development', 'watch']);
