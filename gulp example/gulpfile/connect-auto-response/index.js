const path = require("path");
const fs = require("fs");
const querystring = require('querystring');
const log = require('../my-log').logger;

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

const requestMap = [{
        reg: /^service\/time.json/,
        action: function() { // 动态返回响应
            return JSON.stringify({ dateTime: Date.now() });
        }
    },
    {
        reg: /^service\/to.json/,
        action: function(param) { // 根据参数动态返回响应
            return JSON.stringify(param);
        }
    },
    { reg: /^service\/weather.json/, action: "proxy:www.baidu.com" }, // 代理
    { reg: /^service\/something\/wrong/, action: "redirect:/" }, // 跳转
    { reg: /service\/([^\.]+.json)(\?.*)?/, action: "local:data/$1" } // 响应本地json文件
];

// console.log('load connect-auto-response');

function handleFun(item, res, queryObj) {
    log.debug('handleFun',queryObj);
    returnStr = item.action(queryObj);
    res.write(returnStr);
}

function handleLocal(item, res, queryObj) {
    log.debug('handleLocal',queryObj);
    if (!EXPRESS_HEAD_REG.LOCAL.test(item.action)) {
        return false;
    }
    var express = item.action.replace(EXPRESS_HEAD_REG.LOCAL, "");
    if (express.indexOf("$") > 0) {
        pathStr = url.replace(item.reg, express);
    } else {
        pathStr = express;
    }
    fullPath = path.join(__dirname, pathStr);
    // console.log(__dirname,pathStr,fullPath);
    if (fs.existsSync(fullPath)) {
        console.log("local ", url, " -> ", fullPath);
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

function handleRedirect(item, res, queryObj) {
    log.debug('handleRedirect',queryObj);
    if (!EXPRESS_HEAD_REG.REDIRECT.test(item.action)) {
        return false;
    }
    return true;
}

function handleProxy(item, res, queryObj) {
    log.debug('handleProxy',queryObj);
    if (!EXPRESS_HEAD_REG.PROXY.test(item.action)) {
        return false;
    }
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
        handleQueue = [handleLocal, handleProxy, handleRedirect],
        index,
        stopFlag,
        pathStr,
        returnStr,
        fullPath,
        express;
    log.debug(url);
    for (i = 0, len = requestMap.length; i < len; i++) {
        item = requestMap[i];
        // 匹配url
        if (item.reg.test(url)) {
            log.debug('match',item.reg);
            //console.log(req.headers);
            index = url.indexOf('?');
            if (index > 0) {
                queryObj = querystring.parse(url.substr(index + 1));
            }
            if (typeof item.action == "function") {
                handleFun(item, res, queryObj);
            } else if (typeof item.action == "string") {
                stopFlag = false;
                handleQueue.forEach(function(fun) {
                    if (!stopFlag) {
                        stopFlag = fun(item, res, queryObj);
                    }
                });
            }
            return;
        }
    }
    next();
}

main.EXPRESS_HEAD = EXPRESS_HEAD;
module.exports = main;