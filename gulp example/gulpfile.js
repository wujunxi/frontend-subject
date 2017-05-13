const gulp = require("gulp");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const browserify = require('gulp-browserify');
const inlinesource = require('gulp-inline-source');
const connect = require("gulp-connect");
const base64 = require('gulp-base64');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssimport = require("gulp-cssimport");
const autoresponse = require("./gulpfile/connect-auto-response");

const configObj = {
    module: "main",
    entry: "index",
    src: "src",
    dest: "build",
    testData: "data"
};

const target = configObj.src + "/" + configObj.module;

//---------- 生产构建 ----------

// build-clean
gulp.task("build-clean", function() {
    return gulp.src(configObj.dest + "/" + configObj.module).pipe(clean());
});

// build-js
gulp.task("build-js", function() {
    return gulp.src(["!" + target + "/js/*.bundle.js", target + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/js"));
});

// build-css
gulp.task("build-css", function() {
    return gulp.src(["!" + target + "/css/*.bundle.css", target + "/css/*.css"])
        .pipe(cssimport({}))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/css"));
});

// build-html
gulp.task("build-html", ["build-js"], function() {
    return gulp.src(target + "/*.html")
        .pipe(inlinesource())
        .pipe(gulp.dest(configObj.dest));
});

// build
gulp.task("build", ["build-clean"], function() {
    gulp.start(["build-html"]);
});

//---------- 开发调试 ----------

// connect
gulp.task('connect', function() {
    connect.server({
        root: target,
        livereload: true,
        middleware: function(connect, opt) {
            return [autoresponse];
        }
    });
});

// connect-html
gulp.task("connect-html", function() {
    return gulp.src(target + "/*.html")
        .pipe(connect.reload());
});

// connect-js
gulp.task("connect-js", function() {
    return gulp.src(["!" + target + "/js/*.bundle.js", target + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/js"))
        .pipe(connect.reload());
});

// connect-css
gulp.task("connect-css", function() {
    return gulp.src(["!" + target + "/css/*.bundle.css", traget + "/css/*.css"])
        .pipe(cssimport({}))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/css"))
        .pipe(connect.reload());
});

// watch
gulp.task('watch', function() {
    gulp.watch([target + "/" + configObj.entry + ".html"], ["connect-html"]);
    gulp.watch([target + "/js/" + configObj.entry + ".js"], ["connect-js"]);
});

gulp.task("default", ["build-js", "build-css"], function() {
    gulp.start(["connect", "watch"]);
});