var gulp = require('gulp');
var del = require('del');
var cleanCSS = require('gulp-clean-css');
var runSequence = require('run-sequence');
var uglify = require('gulp-uglify');
var pump = require('pump');
var sourcemaps = require('gulp-sourcemaps');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');

// Clean out the dist folder and sub-folders
gulp.task('clean', function () {
  return del([
    './dist/index.html',
    './dist/css/*',
    './dist/js/*'
  ]);
});

// Copy the index.html
gulp.task('copy-html', function () {
  return gulp.src('./src/index.html').pipe(gulp.dest('./dist'));
});

// Minify the css.
gulp.task('minify-css', function () {
  return gulp.src('./src/css/cha.css')
    // Minify
    .pipe(cleanCSS())
    // Write to dist folder
    .pipe(gulp.dest('./dist/css'));
});

// Uglify the JS.
gulp.task('uglify-js', function (cb) {
  // Using pump for better error handling
  pump([
      tsProject.src(),
      sourcemaps.init(),
      tsProject(),
      uglify(),
      sourcemaps.write('.'),
      gulp.dest('./dist/js')
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

// Watch files
gulp.task('watch', function () {
    gulp.watch('./src/css/cha.css', ['minify-css']);
    gulp.watch('./src/index.html', ['copy-html']);
    gulp.watch('./src/ts/*.ts', ['uglify-js']);
});

// Perform dev tasks
gulp.task('dev', function (done) {
  runSequence(
    'default',
    'watch',
    done
  )
});