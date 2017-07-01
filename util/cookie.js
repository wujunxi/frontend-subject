(function(factory) {
    if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(module.exports);
    } else if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof define === "function" && define.cmd) {
        define(function(require, exports, module) {
            return factory(exports);
        });
    } else {
        factory();
    }
}(function(exports) {

    'use strict';


    /**
     * 添加一个cookie
     * @param {String} name cookie的名字
     * @param {String} val cookie的内容
     * @param {String} path 有效路径（默认/）
     * @param {Number} days 只存日期天数（默认半小时）
     */
    function addCookie(name, val, path, days) {
        var _path = path || "/";
        var ss = days ? (days * 24 * 60 * 60 * 1000) : (30 * 60 * 1000);
        var expires = (new Date((new Date()).getTime() + ss)).toGMTString();
        document.cookie = name + "=" + encodeURIComponent(val) + ";path=" + _path + ";expires=" + expires;
    }

    /**
     * 获取一个cookie
     * 
     * @param {String} name cookie的名字
     * @returns {String}
     */
    function getCookie(name) {
        var cookieStr = document.cookie;
        var ArrCookie = cookieStr.split(";");
        for (var i = 0; i < ArrCookie.length; i++) {
            var arr = ArrCookie[i].split("=");
            arr[0] = arr[0].replace(/\s/g, "");
            if (arr[0] == name) return decodeURIComponent(arr[1]);
        }
        return "";
    }

    /**
     * 删除一个cookie
     * 
     * @param {String} name cookie的名字
     * @param {String} path 有效路径（默认/）
     */
    function delCookie(name, path) {
        var _path = path || '/';
        if (getCookie(name) != "") {
            document.cookie = name + "=;path=" + _path + ";expires=" + new Date((new Date()).getTime() - 10000).toGMTString();
        }
    }

    exports.addCookie = addCookie;
    exports.getCookie = getCookie;
    exports.delCookie = delCookie;

}));