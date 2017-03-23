var gulp = require('gulp');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var pump = require('pump');

// Clean out the dist folder
gulp.task('clean', function () {
  return del([
    'dist/index.html',
    'dist/css/*',
    'dist/js/*'
  ]);
});

// Copy the index.html
gulp.task('copy-html', function () {
  return gulp.src('./src/index.html').pipe(gulp.dest('./dist'));
});

// Minify the css.
gulp.task('minify-css', function () {
  return gulp.src('src/css/*.css')
    // Minify
    .pipe(cleanCSS())
    // Rename
    .pipe(rename('cha.css'))
    // Write to dist folder
    .pipe(gulp.dest('dist/css'));
});

// Uglify the JS.
gulp.task('uglify-js', function (cb) {
  // Using pump for better error handling
  pump([
      gulp.src('src/js/*.js'),
      uglify(),
      rename('cha.js'),
      gulp.dest('dist/js')
    ],
    cb
  );
});

gulp.task('default', function (done) {
  return runSequence(
      'clean',
      'copy-html',
      'minify-css',
      'uglify-js',
      done
  );
});