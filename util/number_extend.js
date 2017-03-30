/**
 * 解决浮点数计算精度丢失的问题
 */

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports"], factory);
    } else if (typeof define === "function" && define.cmd) {
        define(function(require, exports, module) {
            factory(exports);
        });
    } else {
        factory();
    }
}(function(exports) {

    exports.add = function(arg1, arg2) {
        var m = 0,
            temp, r1, r2,
            s1 = arg1.toString(),
            s2 = arg2.toString();
        temp = s1.split(".");
        r1 = temp.length > 1 ? temp[1].length : 0;
        temp = s2.split(".");
        r2 = temp.length > 1 ? temp[1].length : 0;
        m = Math.pow(10, Math.max(r1, r2));
        return (arg1 * m + arg2 * m) / m;
    };

    Number.prototype.add = function(arg) {
        return exports.add(arg, this);
    };

    exports.mul = function(arg1, arg2) {
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
        return exports.mul(arg, this);
    };

    exports.div = function(arg1, arg2) {
        var t1 = 0,
            t2 = 0,
            r1, r2, temp;
        temp = s1.split(".");
        m += temp.length > 1 ? temp[1].length : 0;
        temp = s2.split(".");
        m += temp.length > 1 ? temp[1].length : 0;
        r1 = Number(arg1.toString().replace(".", ""));
        r2 = Number(arg2.toString().replace(".", ""));
        return (r1 / r2) * Math.pow(10, t2 - t1);
    };

    Number.prototype.div = function(arg) {
        return exports.div(arg, this);
    };

    Number.prototype.divBy = function(arg) {
        return exports.div(this, arg);
    };
}));
