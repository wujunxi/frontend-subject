(function(factory) {
    if (typeof define === "function" && define.amd) {
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
     * query string转化为Object
     * @param params query string
     * @param isDecode boolean 是否进行URI解码
     * @returns {{}}
     */
    exports.qryStr2Obj = function(params, isDecode) {
        var obj = {};
        if (params != null && params != undefined && params != "") {
            params = params.replace(/\?/, "");
            var arr = params.split('&');
            for (var index = 0; index < arr.length; index++) {
                var pair = arr[index];
                var indexOf = pair.indexOf('=');
                if (indexOf != -1) {
                    var name = pair.substring(0, indexOf);
                    var val = "";
                    if (indexOf != pair.length - 1) {
                        val = pair.substring(indexOf + 1);
                    }
                    if (isDecode) {
                        obj[name] = decodeURIComponent(val);
                    } else {
                        obj[name] = val;
                    }
                } else {
                    obj[pair] = "";
                }
            }
        }
        return obj;
    };

    /**
     * obj转换成参数串
     * @param obj
     * @param isEncode 是否进行uri编码
     * @returns {string}
     */
    exports.obj2QryStr = function(obj, isEncode) {
        var str = "";
        for (var k in obj) {
            if (isEncode) {
                str += "&" + k + "=" + encodeURIComponent(obj[k].toString());
            } else {
                str += "&" + k + "=" + obj[k].toString();
            }
        }
        if (str != "") {
            str = str.substring(1, str.length);
        }
        return str;
    };

}));
