/**
 * 解决浮点数计算精度丢失的问题
 */

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

    var add = exports.add = function(arg1, arg2) {
        var m = 0,
            temp, r1, r2,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        temp = s1.split(".");
        r1 = temp.length > 1 ? temp[1].length : 0;
        temp = s2.split(".");
        r2 = temp.length > 1 ? temp[1].length : 0;
        m = Math.pow(10, Math.max(r1, r2));
        return (mul(arg1, m) + mul(arg2, m)) / m;
    };

    Number.prototype.add = function(arg) {
        return add(arg, this);
    };

    var mul = exports.mul = function(arg1, arg2) {
        var m = 0,
            temp,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        temp = s1.split(".");
        m += temp.length > 1 ? temp[1].length : 0;
        temp = s2.split(".");
        m += temp.length > 1 ? temp[1].length : 0;
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    };

    Number.prototype.mul = function(arg) {
        return mul(arg, this);
    };

    var div = exports.div = function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            s1 = arg1.toString(),
            s2 = arg2.toString(),
            r1, r2, temp;
        temp = s1.split(".");
        t1 = temp.length > 1 ? temp[1].length : 0;
        temp = s2.split(".");
        t2 = temp.length > 1 ? temp[1].length : 0;
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return mul((r1 / r2), Math.pow(10, t2 - t1));
    };

    Number.prototype.div = function(arg) {
        return div(arg, this);
    };

    Number.prototype.divBy = function(arg) {
        return div(this, arg);
    };
}));
