const path = require('path');

/**
 * gulp-inline-source 自定义处理器
 * 调整内嵌html后css中的url相对路径
 * 
 * @param {any} source 
 * @param {any} context 
 * @param {any} next 
 */
module.exports = function (source, context, next) {
    if (source.fileContent &&
        !source.content &&
        (source.type == 'css')) {
        // 获得css文件所在目录
        var cssDir = path.dirname(source.filepath);
        // 获得html文件所在目录
        var htmlDir = context.rootpath || path.dirname(context.htmlpath);
        // console.log(cssDir, context.htmlpath);
        // 匹配css中的相对路径的url，如 url(../../xxx.png)
        var replaceResult = source.fileContent.replace(/url\(([^(data:)|(http:)|(https:)|\\][^\)]+)\)/g, function(fullMatch, relativePath) {
            // 根据css目录获得绝对路径
            var absolutePath = path.resolve(cssDir, relativePath);
            // 根据html目录，将绝对路径转换为相对路径
            var newRelativePath = path.relative(htmlDir, absolutePath).replace(/\\/g, "/");
            // 替换路径获得新的url
            var newUrl = fullMatch.replace(relativePath, newRelativePath);
            // console.log(relativePath, absolutePath, newRelativePath, newUrl);
            return newUrl;
        });
        // console.log(replaceResult);
        // 将处理结果放到fileContent，传递给下个处理器处理
        source.fileContent = replaceResult;
    }
    next();
}