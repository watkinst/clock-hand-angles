var gulp = require('gulp');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var runSequence = require('run-sequence');

// Clean out the dist folder
gulp.task('clean', function () {
  return del([
    'dist/index.html',
    'dist/css/*',
    'dist/js/*'
  ]);
});

// Minify the css.
gulp.task('minify-css', function () {
  return gulp.src('src/css/*.css')
    // Minify
    .pipe(cleanCSS())
    // Rename
    .pipe(rename('cha.min.css'))
    // Write to dist folder.
    .pipe(gulp.dest('dist/css'));
});

gulp.task('default', function (done) {
  return runSequence(
      'clean',
      'minify-css',
      done
  );
});