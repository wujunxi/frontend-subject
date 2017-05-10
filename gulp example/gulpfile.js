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
    {reg:/^service\/time.json/,local:function(){ // 动态返回响应
        return JSON.stringify({dateTime:Date.now()});
    }},
    {reg:/^service\/to.json/,local:function(param){ // 根据参数动态返回响应
        return JSON.stringify(param);
    }},
    {reg:/^service\/weather.json/,proxy:"www.baidu.com"}, // 代理
    {reg:/^service\/something\/wrong/,redirect:"/"}, // 跳转
    {reg:/service\/([^\.]+.json)(\?.*)?/,local:"data/$1"} // 响应本地json文件
];

/**
 * 代理json请求到本地文件
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns 
 * 
 */
function handleJsonRequrest(req, res, next){
    var i,len,item,
    url = req.url,
    pathStr,
    fullPath;
    // console.log(url);
    for(i = 0,len = requestMap.length; i < len; i++){
        item = requestMap[i];
        if(item.reg.test(url)){
            if(item.local.indexOf("$")>0){
                pathStr = url.replace(item.reg,item.local);
            }else{
                pathStr = item.local;
            }
            fullPath = path.join(__dirname,pathStr);
            // console.log(__dirname,pathStr,fullPath);
            if(fs.existsSync(fullPath)){
                console.log("catch ",url," -> ",fullPath);
                var stat = fs.statSync(fullPath);
                res.writeHead(200, {
                    'Content-Type': 'application/json',
                    'Content-Length': stat.size
                });

                var readStream = fs.createReadStream(fullPath);
                // We replaced all the event handlers with a simple call to readStream.pipe()
                readStream.pipe(res);
                return;
            }
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