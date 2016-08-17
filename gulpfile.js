/* -----------------------------------------------------------------------------
|
| GULP BUILD SCRIPT
|
| TASKS:
| - gulp watch - starts the browser sync server
| - gulp lint - runs jslint
| - gulp csslink - runs csslint
| - gulp build - compiles a build for prod
|
----------------------------------------------------------------------------- */

'use strict';

//---------------------------
// LIBRARY INCLUDES
//---------------------------
var gulp       = require('gulp'),
templateCache  = require("gulp-ng-html2js"),
browserSync    = require('browser-sync'),
runSequence    = require('run-sequence'),
changed        = require('gulp-changed'),
gulpif         = require('gulp-if'),
gutil          = require('gulp-util'),
rename         = require('gulp-rename'),
concat         = require('gulp-concat'),
clean          = require('gulp-clean'),
autoprefixer   = require('gulp-autoprefixer'),
sourcemaps     = require('gulp-sourcemaps'),
sass           = require('gulp-sass'),
scsslint       = require('gulp-scss-lint'),
scssLintStyle  = require('gulp-scss-lint-stylish'),
jshint         = require('gulp-jshint'),
jshintStyle    = require('jshint-stylish'),
uglify         = require('gulp-uglify'),
ngAnnotate     = require('gulp-ng-annotate'),
wiredep        = require('wiredep').stream

//---------------------------
//CONFIG VARIABLES
//---------------------------
var buildPath   = './build',
stylePath       = './app/assets/styles/**/*.scss',
imagePath       = './app/assets/images/**/*',
scriptPath      = './app/**/*.js',
viewPath        = './app/assets/views/*.html',
reload          = browserSync.reload({stream: true}),
prod            = false;


//---------------------------
// SCRIPT TASKS
//---------------------------
gulp.task('lint', function() {
    return gulp.src(scriptPath)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('scripts:dev', function () {
  gulp.src(scriptPath)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildPath + '/assets/js'))
    .pipe(reload)
    .on('error', gutil.log);
});

gulp.task('scripts:prod', function () {
  gulp.src(scriptPath)
      .pipe(concat('app.js'))
      .pipe(ngAnnotate())
      .pipe(uglify())
    .pipe(gulp.dest(buildPath + '/assets/js'))
    .on('error', gutil.log);
});

gulp.task('bower', function () {
  gulp.src('./app/index.html')
    .pipe(wiredep())
    .pipe(gulp.dest(buildPath));

  return gulp.src('./bower_components/**/*.*')
    .pipe(changed(buildPath))
    .pipe(gulp.dest(buildPath + '/bower_components'))
    .on('error', gutil.log);
});

//---------------------------
// STYLE TASKS
//---------------------------
gulp.task('csslint', function() {
    gulp.src(stylePath)
        .pipe(scsslint({ customReport: scssLintStyle }));
});

gulp.task('styles:dev', function () {
  return gulp.src(stylePath)
    .pipe(sourcemaps.init())
    .pipe(sass({ outputStyle:'expanded' })
      .on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(buildPath + '/assets/styles'))
    .pipe(gulpif(browserSync.active, reload));
});

gulp.task('styles:prod', function () {
  return gulp.src(stylePath)
    .pipe(sass({ outputStyle: 'compressed' })
      .on('error', sass.logError))
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(buildPath + '/assets/styles'));
});

//---------------------------
// VIEW TASKS
//---------------------------
gulp.task('views', function() {
  return gulp.src(viewPath)
    .pipe(changed(buildPath + '/assets/views'))
    .pipe(gulp.dest(buildPath + '/assets/views'))
    .on('error', gutil.log);
});

//---------------------------
// IMAGE TASKS
//---------------------------
gulp.task('images', function() {
  return gulp.src(imagePath)
    .pipe(changed(buildPath + '/assets/images'))
    .pipe(gulp.dest(buildPath + '/assets/images'))
    .on('error', gutil.log);
});

//---------------------------
// BUILD TASKS
//---------------------------
gulp.task('clean', function () {
  return gulp.src(buildPath, { read: false })
    .pipe(clean())
    .on('error', gutil.log);
});

gulp.task('watch', function(callback) {
  callback = callback || function() {};
  runSequence('clean', ['bower', 'views', 'lint', 'scripts:dev', 'styles:dev', 'images'], callback);

  var server = require("browser-sync").create();
  server.init({
      server: {
        baseDir: buildPath
        //middleware: [history({})]
      },
      port: 9000,
      https: false
  });

  gulp.watch(viewPath,   ['views']).on('change', browserSync.reload);
  gulp.watch(scriptPath, ['lint']);
  gulp.watch(scriptPath, ['scripts:dev']);
  gulp.watch(stylePath,  ['styles:dev']);
  gulp.watch(imagePath,  ['images']);
});

gulp.task('build', function(callback) {
  callback = callback || function() {};
  prod = true;
  runSequence('clean', ['bower', 'views', 'lint', 'scripts:prod', 'styles:prod', 'images'], callback);
});
