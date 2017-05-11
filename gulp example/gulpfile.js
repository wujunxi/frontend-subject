var gulp = require("gulp");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var browserify = require('gulp-browserify');
var inlinesource = require('gulp-inline-source');
var connect = require("gulp-connect");
var autoresponse = require("./gulpfile/connect-auto-response");

var configObj = {
    module: "main",
    entry: "index",
    src: "src",
    dest: "build",
    testData: "data"
};

var target = configObj.src + "/" + configObj.module;

gulp.task("build-clean", function() {
    return gulp.src(configObj.dest + "/" + configObj.module).pipe(clean());
});

gulp.task("build-js", function() {
    return gulp.src(["!" + target + "/js/*.bundle.js", target + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/js"));
});

gulp.task("build-html", ["build-js"], function() {
    return gulp.src(target + "/*.html")
        .pipe(inlinesource())
        .pipe(gulp.dest(configObj.dest));
});


gulp.task('connect', function() {
    connect.server({
        root: target,
        livereload: true,
        middleware: function(connect, opt) {
            return [autoresponse];
        }
    });
});

gulp.task("connect-html", function() {
    return gulp.src(target + "/*.html")
        .pipe(connect.reload());
});
gulp.task("connect-js", function() {
    return gulp.src(["!" + target + "/js/*.bundle.js", target + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/js"))
        .pipe(connect.reload());
});

gulp.task('watch', function() {
    gulp.watch([target + "/" + configObj.entry + ".html"], ["connect-html"]);
    gulp.watch([target + "/js/" + configObj.entry + ".js"], ["connect-js"]);
});

gulp.task("build", ["build-clean"], function() {
    gulp.start(["build-html"]);
});

gulp.task("default", ["connect", "watch"]);