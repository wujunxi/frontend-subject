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
     * 将数字金额转为大写金额
     * @param money:数字金额，如：359.03
     * @return String 大写金额，如:叁佰伍拾玖元零角叁分
     */
    exports.toCapital = function(money) {
        money = parseFloat(money);
        if (isNaN(money)) {
            return "";
        }
        var strOutput = "";
        var strUnit = "仟佰拾亿仟佰拾万仟佰拾元角分";
        money += "00";
        var intPos = money.indexOf(".");
        if (intPos >= 0) {
            money = money.substring(0, intPos) + money.substr(intPos + 1, 2);
        }
        strUnit = strUnit.substr(strUnit.length - money.length);
        for (var i = 0; i < money.length; i++) {
            strOutput += "零壹贰叁肆伍陆柒捌玖".substr(parseInt(money.substr(i, 1)), 1) + strUnit.substr(i, 1);
        }
        return strOutput.replace(/零角零分$/, "整").replace(/零[仟佰拾]/g, "零").replace(/零{2,}/g, "零").replace(/零([亿|万])/g, "$1").replace(/零+元/, "元").replace(/亿零{0,3}万/, "亿").replace(/^元/, "零元");
    };

    /**
     * 将价格分转化成元，对于不能转换的返回0
     * @param strFen
     * @return string
     */
    exports.fen2yuan = function(strFen) {
        var fen = parseInt(strFen);
        if (fen) {
            if (fen < 100 && fen > 9) {
                return "0." + fen;
            } else if (fen < 10) {
                return "0.0" + fen;
            } else {
                fen = fen + "";
                return fen.substring(0, fen.length - 2) + "." + fen.substring(fen.length - 2);
            }
        }
        return "0";
    };

    /**
     * 将单位为元的金额分成两部分返回，前面为元，后面为角分
     * @param  {[type]} strFen [description]
     * @return {[type]}        [description]
     */
    exports.fen2yuanObj = function(strFen) {
        var fen = exports.fen2yuan(strFen);
        fen = fen + "";
        if (fen.indexOf(".") != -1) {
            return { "yuan": fen.substring(0, fen.indexOf(".")), "fen": fen.substring(fen.indexOf(".") + 1) };
        } else {
            return { "yuan": 0, "fen": 0 };
        }
    };

    /**
     * 格式化以分为单位的数值，转化为单位元，保留两位小数，并用逗号每三位隔离
     * @param str 待格式化的字符串，只允许数字或首字为负号
     * @return {string} [description]
     */
    exports.fmoney = function(str) {
        if (str == "") {
            return "0.00";
        } else {
            str = "" + str;
            var flag,
                len,
                result;
            // 校验入参格式
            if (!/^-?\d+$/.test(str)) {
                throw "fmoney:error param!(" + str + ")";
            }
            // 判断是否有负号
            flag = (str[0] == "-");
            if (flag) {
                str = str.substring(1);
            }
            len = str.length;

            if (len == 1) {
                result = "0.0" + str;
            } else if (len == 2) {
                result = "0." + str;
            } else {
                var part1, part2, ar;
                part1 = str.substr(0, len - 2);
                part2 = str.substr(len - 2, 2);
                if (len < 6) {
                    result = part1 + "." + part2;
                } else {
                    ar = part1.split("");
                    // 倒插逗号
                    for (var i = ar.length - 3; i > 0; i -= 3) {
                        ar.splice(i, 0, ",");
                    }
                    result = ar.join("") + "." + part2;
                }
            }
            // 将负号添加回去
            return (flag ? "-" : "") + result;
        }

    };

}));
