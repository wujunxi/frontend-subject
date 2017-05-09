var path = require("path");
var fs = require("fs");
var gulp = require("gulp");
var clean = require("gulp-clean");
var rename = require("gulp-rename");
var browserify = require('gulp-browserify');
var inlinesource = require('gulp-inline-source');
var connect = require("gulp-connect");

var configObj = {
    module: "main",
    entry:"index",
    src:"src",
    dest: "build",
    testData:"data"
};

var target = configObj.src + "/" + configObj.module;

var requestMap = [
    {reg:/service\/([^\.]+.json)$/,local:"data/$1"}
];

function handleJsonRequrest(req, res, next){
    var i,len,item,url = req.url,pathStr;
    console.log(url);
    for(i = 0,len = requestMap.length; i < len; i++){
        item = requestMap[i];
        if(item.reg.test(url)){
            if(item.local.indexOf("$")>0){
                pathStr = url.replace(item.reg,item.local);
            }else{
                pathStr = item.local;
            }
            console.log(__dirname,pathStr,path.join(__dirname,pathStr));

        }
    }
    next();
}

gulp.task("clean",function(){
    return gulp.src(configObj.dest+"/"+configObj.module).pipe(clean());
});

gulp.task("js", function() {
    return gulp.src(["!"+target + "/js/*.bundle.js",target + "/js/*.js"])
        .pipe(browserify())
        .pipe(rename({ suffix: ".bundle" }))
        .pipe(gulp.dest(target + "/js"));
});

gulp.task("html", ["js"], function() {
    return gulp.src(target+"/*.html")
        .pipe(inlinesource())
        .pipe(gulp.dest(configObj.dest))
        .pipe(connect.reload());
});


gulp.task('connect', function() {
    connect.server({
        root: configObj.dest,
        livereload: true,
        middleware: function(connect, opt) {
            return [handleJsonRequrest];
        }
    });
});

gulp.task('watch',function() {
    gulp.watch([target+"/js/"+configObj.entry + ".js"], ['html']);
});

gulp.task("default",["clean"] ,function(){
    gulp.start(["html","connect", "watch"]);
});