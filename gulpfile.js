var gulp = require('gulp');
var concat = require("gulp-concat");
var uglify = require("gulp-uglify");
var connect = require("gulp-connect");
var minifycss = require("gulp-minify-css");
var Server = require("karma").Server;
var jshint = require("gulp-jshint");


// concat the application JavaScript files and place them in dist folder
gulp.task("buildApp", function(){
  return gulp.src("src/js/**/*.js")
    .pipe(concat("app.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())
});

// concat the vendor JavaScript files and place them in dist folder
gulp.task("buildVendors", function(){
  return gulp.src([
    "bower_components/jquery/dist/jquery.min.js",
    "bower_components/bootstrap/dist/js/bootstrap.min.js",
    "bower_components/angular/angular.min.js"])
    .pipe(concat("vendors.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())
});

// move HTML files to dist folder
gulp.task("buildHTML", function(){
  return gulp.src("src/index.html")
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())
});

// concat all CSS files and place them in dist folder
gulp.task("buildCSS", function(){
  return gulp.src([
    "bower_components/bootstrap/dist/css/bootstrap.css",
    "src/css/**/*.css"])
    .pipe(concat("styles.css"))
    .pipe(minifycss())
    .pipe(gulp.dest("dist"))
    .pipe(connect.reload())
});

// run all build taks
gulp.task("build", ["buildApp", "buildVendors", "buildHTML", "buildCSS"]);

// run Karma tests
gulp.task("karma", function(done){
  new Server({
    configFile: __dirname + "/karma.conf.js",
    singleRun: true
  }, done).start();
});

// run JSHint on application JavaScript
gulp.task("jshint", function(){
  return gulp.src("src/**/*.js")
    .pipe(jshint())
    .pipe(jshint.reporter("jshint-stylish"))
});

// run all test tasks
gulp.task("test", ["karma", "jshint"]);

// watch the application JavaScript, HTML, and CSS files
gulp.task("watch", function(){
  gulp.watch("src/js/**/*.js", ["buildApp", "test"]);
  gulp.watch("src/index.html", ["buildHTML", "test"]);
  gulp.watch("src/css/**/*.css", ["buildCSS", "test"]);
  gulp.watch("src/tests/**/*.js", ["test"]);
});

// set up build on localhost
gulp.task("connect", function(){
  connect.server({
    root: "dist",
    livereload: true
  });
});

// run all gulp tasks by default
gulp.task("default", ["build", "test", "watch", "connect"]);
