const path = require("path");
const fs = require("fs");
const querystring = require('querystring');
const log = require('../my-log').logger;
// 获取映射配置
const requestMap = require('./config');
// 自定义表达式头
const EXPRESS_HEAD = {
    PROXY: "proxy:",
    LOCAL: "local:",
    REDIRECT: "redirect:"
};
const EXPRESS_HEAD_REG = {
    PROXY: /^proxy:/,
    LOCAL: /^local:/,
    REDIRECT: /^redirect:/
};

/**
 * 函数处理器 
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} item 
 * @param {any} queryObj 
 * @returns 
 */
function handleFun(req, res, item, queryObj) {
    if (typeof item.action != "function") {
        return false;
    }
    log.debug('handleFun', queryObj);
    var result = item.action(queryObj);
    if (typeof result !== "string") {
        result = JSON.stringify(result);
    }
    res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Length': result.length
    });
    res.write(result);
    // res.flush();
    res.end();
    return true;
}

/**
 * 本地文件处理器
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} item 
 * @param {any} queryObj 
 * @returns 
 */
function handleLocal(req, res, item, queryObj) {
    if (typeof item.action != "string" || !EXPRESS_HEAD_REG.LOCAL.test(item.action)) {
        return false;
    }
    log.debug('handleLocal', queryObj);
    var express = item.action.replace(EXPRESS_HEAD_REG.LOCAL, ""),
        url = req.url,
        pathStr = express;
    if (express.indexOf("$") > 0) {
        pathStr = url.replace(item.reg, express);
    }
    var fullPath = path.join(__dirname, pathStr);
    log.debug(__dirname, pathStr, fullPath);
    if (fs.existsSync(fullPath)) {
        log.info("local ", url, " -> ", fullPath);
        var stat = fs.statSync(fullPath);
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Length': stat.size
        });

        var readStream = fs.createReadStream(fullPath);
        // We replaced all the event handlers with a simple call to readStream.pipe()
        readStream.pipe(res);
    }
    return true;
}

/**
 * 跳转处理器
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} item 
 * @param {any} queryObj 
 * @returns 
 */
function handleRedirect(req, res, item, queryObj) {
    if (typeof item.action != "string" || !EXPRESS_HEAD_REG.REDIRECT.test(item.action)) {
        return false;
    }
    log.debug('handleRedirect', queryObj);

    return true;
}

/**
 * 代理处理器
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} item 
 * @param {any} queryObj 
 * @returns 
 */
function handleProxy(req, res, item, queryObj) {
    if (typeof item.action != "string" || !EXPRESS_HEAD_REG.PROXY.test(item.action)) {
        return false;
    }
    log.debug('handleProxy', queryObj);
    return true;
}

/**
 * 自定义响应
 * 
 * @param {any} req 
 * @param {any} res 
 * @param {any} next 
 * @returns 
 * 
 */
function main(req, res, next) {
    var i, len, item,
        url = req.url,
        queryObj = {},
        handleQueue = [handleFun, handleLocal, handleProxy, handleRedirect],
        index,
        stopFlag;
    log.debug(url);
    for (i = 0, len = requestMap.length; i < len; i++) {
        item = requestMap[i];
        // 匹配url
        if (item.reg.test(url)) {
            log.debug('match', item.reg);
            index = url.indexOf('?');
            // 获得查询参数对象
            if (index > 0) {
                queryObj = querystring.parse(url.substr(index + 1));
            }
            // 执行处理器队列，只执行第一个满足条件的处理器
            stopFlag = false;
            handleQueue.forEach(function(fun) {
                if (!stopFlag) {
                    stopFlag = fun(req, res, item, queryObj);
                }
            });
            return;
        }
    }
    next();
}

main.EXPRESS_HEAD = EXPRESS_HEAD;
module.exports = main;