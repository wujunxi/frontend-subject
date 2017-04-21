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
     * 时间格式化，为防止出现问题，月份用m或mm表示，分钟用M或MM表示
     * @param formatStr yyyy-mm-dd hh:MM:ss w 年月日时分秒星期数
     */
    Date.prototype.Format = function (formatStr) {
        var str = formatStr;
        var Week = ['日', '一', '二', '三', '四', '五', '六'];

        str = str.replace(/yyyy|YYYY/, this.getFullYear());
        str = str.replace(/yy|YY/, (this.getYear() % 100) > 9 ? (this.getYear() % 100).toString() : '0' + (this.getYear() % 100));

        str = str.replace(/mm/, (this.getMonth() + 1) > 9 ? (this.getMonth() + 1).toString() : '0' + (this.getMonth() + 1));
        str = str.replace(/m/g, this.getMonth());

        str = str.replace(/w|W/g, Week[this.getDay()]);

        str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
        str = str.replace(/d|D/g, this.getDate());

        str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
        str = str.replace(/h|H/g, this.getHours());
        str = str.replace(/MM/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
        str = str.replace(/M/g, this.getMinutes());

        str = str.replace(/ss|SS/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
        str = str.replace(/s|S/g, this.getSeconds());

        return str;
    };

    /**
     * 获取年月日格式字符串，yyyymmdd
     */
    exports.getYearMonthDay = function (objDate) {
        var dd = objDate.getDate().toString();
        var mm = (objDate.getMonth() + 1).toString();
        var yy = objDate.getFullYear().toString();
        if (dd.length == 1)
            dd = "0" + dd;
        if (mm.length == 1)
            mm = "0" + mm;
        return (yy + mm + dd);
    };

    /**
     * 转换成日期对象
     * @param date yyyymmdd, yyyy-m-d
     */
    exports.toDate = function (date) {
        //强行转换成string
        date += "";
        var arr = date.split("-"), yy, mm, dd;
        if (arr.length == 3) {
            yy = arr[0];
            mm = arr[1];
            dd = arr[2];
        } else {
            yy = date.substring(0, 4);
            mm = date.substring(4, 6);
            dd = date.substring(6, 8);
        }

        var pos = mm.indexOf("0");
        if (pos == 0) {
            mm = mm.substring(1, 2);
        }
        pos = dd.indexOf("0");
        if (pos == 0) {
            dd = dd.substring(1, 2);
        }

        yy = parseInt(yy);
        mm = parseInt(mm);
        dd = parseInt(dd);

        var objDate = new Date();
        objDate.setFullYear(yy, mm - 1, dd);
        return objDate;
    };

    /**
     * 获取标准日期 yyyy-mm-dd
     * @param date yyyymmdd
     */
    exports.getIsoDate = function (date) {
        date = date.replace(/-/g, "");
        return date.substring(0, 4) + "-" + date.substring(4, 6) + "-" + date.substring(6, 8);
    };

    /**
     * 日期运算
     * @param mst:y:年 m:月 d:日 h:小时 M:分钟 s:秒
     * @param objDate:日期对象
     * @param num:数字，支持正负整数
     * addDate(date, -150, 'y')
     */
    exports.addDate = function (objDate, num, mst) {
        var unixTimeMill = objDate.getTime();
        switch (mst) {
            case "y":
                //unixTimeMill += (num * 365*24*60*60*1000);
                var tmpDate = new Date(unixTimeMill);
                tmpDate.setFullYear(tmpDate.getFullYear() + num);
                unixTimeMill = tmpDate.getTime();
                break;
            case "m":
                unixTimeMill += (num * 30 * 24 * 60 * 60 * 1000);
                break;
            case "d":
                unixTimeMill += (num * 24 * 60 * 60 * 1000);
                break;
            case "h":
                unixTimeMill += (num * 60 * 60 * 1000);
                break;
            case "M":
                unixTimeMill += (num * 60 * 1000);
                break;
            case "s":
                unixTimeMill += (num * 1000);
                break;
        }
        return new Date(unixTimeMill);
    };

    /**
     * 求两个日期之间的差
     * @param endDate Date
     * @param beginDate Date
     * @param isPrecise boolean
     * @returns {{d, h, m: number}}
     */
    exports.minusDate = function (endDate, beginDate, isPrecise) {
        var result = endDate.getTime() - beginDate.getTime();
        var day = accDiv(result, 86400000);// 86400000 = 1000*60*60*24
        var r = result % 86400000;
        var m = accDiv(r, 60000);
        var h = accDiv(m, 60);
        var mm = m % 60;
        if (isPrecise) {
            return {d: day, h: h, m: mm};
        } else {
            return {d: Math.floor(day), h: Math.floor(h), m: Math.floor(mm)};
        }
    };

}));
