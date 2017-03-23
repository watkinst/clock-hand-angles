var gulp = require('gulp');
var del = require('del');

// Clean out the dist folder
gulp.task('clean', function () {
  return del([
    'dist/index.html',
    'dist/css/*',
    'dist/js/*'
  ]);
});

gulp.task('default', ['clean']);