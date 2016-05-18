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
| TODO: Removed Template Cache - rewrite view, remove concat for dev watch
|
----------------------------------------------------------------------------- */

'use strict';

//---------------------------
// LIBRARY INCLUDES
//---------------------------
var gulp       = require('gulp'), 
templateCache  = require('gulp-angular-templatecache'),
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
viewPath        = './app/**/*.html',
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
  
  gulp.src('app/index.html')
    .pipe(gulp.dest(buildPath))
    .on('error', gutil.log);

  return gulp.src(['!app/index.html', viewPath])
    .pipe(templateCache({
      standalone: true
    }))
    .pipe(gulp.dest('app/common'))
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
        baseDir: buildPath, 
        middleware: [history({})]
      },
      port: 9000,
      https: true
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
