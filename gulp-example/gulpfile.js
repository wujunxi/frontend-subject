const gulp = require("gulp");
const clean = require("gulp-clean");
const rename = require("gulp-rename");
const uglify = require('gulp-uglify');
const browserify = require('gulp-browserify');
const inlineSource = require('gulp-inline-source');
const connect = require("gulp-connect");
const base64 = require('gulp-base64');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssImport = require("gulp-cssimport");
const imageMin = require('gulp-imagemin');
const pngQuant = require('imagemin-pngquant');
const autoResponse = require("./gulpfile/connect-auto-response");
const cssImgUrl = require("./gulpfile/inline-source-css-img-url");

/**
 * 用法：
 * 1.开发调试时使用 gulp 命令启动本地服务，可以通过gulpfile中的config.js文件配置调试数据
 * 2.构建时使用 gulp build 命令
 * 
 * 约定：
 * 1.每个模块一个目录，模块路径设置module字段
 * 2.每个模块下有css、js、img目录，分别存放css、js、img，html文件放在模块目录下
 * 3.模拟数据目录设置testData字段
 */

const configObj = {
    module: "main",
    src: "src",
    dest: "build",
    testData: "data",
    devServerRoot: "src",
};

const from = configObj.src + "/" + configObj.module;
const to = configObj.dest + "/" + configObj.module;

//---------- 生产构建 ----------

// build-clean
gulp.task("build-clean", function() {
    return gulp.src(to).pipe(clean());
});

// build-img
gulp.task("build-img", function() {
    return gulp.src(from + '/img/**/*')
        .pipe(imageMin({
            verbose: true,
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngQuant()]
        }))
        .pipe(gulp.dest(to + '/img'));
});

// build-js
gulp.task("build-js", function() {
    return gulp.src(["!" + from + "/js/*.bundle.js", from + "/js/*.js"])
        .pipe(browserify())
        .pipe(uglify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(to + "/js"));
});

// build-css
gulp.task("build-css", ["build-img"], function() {
    return gulp.src(["!" + from + "/css/*.bundle.css", from + "/css/*.css"])
        .pipe(autoprefixer())
        .pipe(cssImport({}))
        .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(base64({
            baseDir: to + "/css"
        }))
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(to + "/css"));
});

// build-html
gulp.task("build-html", ["build-js", "build-css"], function() {
    return gulp.src(from + "/*.html")
        .pipe(inlineSource({
            rootpath: to,
            compress: false, // 不再压缩，由build-js、build-css单独压缩
            handlers: [cssImgUrl]
        }))
        .pipe(gulp.dest(to));
});

// build
gulp.task("build", ["build-clean"], function() {
    gulp.start(["build-html"]);
});

//---------- 开发调试 ----------

// connect
gulp.task('connect', function() {
    connect.server({
        root: configObj.devServerRoot,
        livereload: true,
        middleware: function(connect, opt) {
            return [autoResponse];
        }
    });
});

// connect-html
gulp.task("connect-html", function() {
    return gulp.src(from + "/*.html").pipe(connect.reload());
});

// connect-js
gulp.task("connect-js", function() {
    return gulp.src(["!" + from + "/js/*.bundle.js", from + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(from + "/js")).pipe(connect.reload());
});

// connect-css
gulp.task("connect-css", function() {
    return gulp.src(["!" + from + "/css/*.bundle.css", from + "/css/*.css"])
        .pipe(autoprefixer())
        // .pipe(cleanCSS({ compatibility: 'ie8' }))
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(from + "/css"))
        .pipe(connect.reload());
});

// watch
gulp.task('watch', function() {
    gulp.watch([from + "/*.html"], ["connect-html"]);
    gulp.watch([from + "/js/*.js"], ["connect-js"]);
    gulp.watch([from + "/css/*.css"], ["connect-css"]);
});

gulp.task("default", ["connect-js", "connect-css"], function() {
    gulp.start(["connect", "watch"]);
});