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
     * <p>18位居民身份证检查</p>
     ------------------------------
     18位身份证号码组成：
     ddddddyyyymmddxxsp共18位，其中：
     其他部分都和15位的相同。年份代码由原来的2位升级到4位。最后一位为校验位。
     校验规则是：
     （1）十七位数字本体码加权求和公式
     S = Sum(Ai * Wi), i = 0, ... , 16 ，先对前17位数字的权求和
     Ai:表示第i位置上的身份证号码数字值
     Wi:表示第i位置上的加权因子
     Wi: 7 9 10 5 8 4 2 1 6 3 7 9 10 5 8 4 2
     （2）计算模
     Y = mod(S, 11)
     （3）通过模得到对应的校验码
     Y: 0 1 2 3 4 5 6 7 8 9 10
     校验码: 1 0 X 9 8 7 6 5 4 3 2
     ------------------------------
     * @return boolean
     */
    exports.checkID18 = function(strTemp) {
        var arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
        var arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
        var nTemp = 0,
            i;

        if (strTemp.length != 18) {
            return false;
        }
        for (i = 0; i < strTemp.length - 1; i++) {
            nTemp += strTemp.substr(i, 1) * arrInt[i];
        }
        return strTemp.substr(17, 1).toUpperCase() == arrCh[nTemp % 11];
    };

    /**
     * 校验手机号码
     * @param str
     */
    exports.checkMobile = function(str) {
        if (str.trim() == "") {
            return "请输入手机号码";
        }
        if (!/^(1[0-9]{10})$/.test(str)) {
            return "格式有误";
        }
        return true;
    };

    /**
     * 校验银行卡号
     * @param str
     * @returns {*}
     */
    exports.checkCardNo = function(str) {
        if (str == "") {
            return "请输入银行卡号";
        }
        if (!(/^([0-9]{16,20})$/.test(str))) {
            return "请输入正确的银行卡号";
        }
        return true;
    };

    /**
     * 校验邮箱
     */
    exports.checkEmail = function(email) {
        if (email == "") {
            return "请输入邮箱";
        }
        if (!/^([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\-|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(email)) {
            return "邮箱格式不正确";
        }
        return true;
    };

    /**
     * IP地址校验
     * @param str
     */
    exports.checkIP = function(str) {
        var flag = true,
            temp;
        if (!/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(str)) {
            flag = false;
        } else {
            temp = str.split(".");
            for (var k in temp) {
                if (temp[k].length > 1 && temp[k][0] == "0") {
                    flag = false;
                } else if (parseInt(temp[k]) > 255) {
                    flag = false
                }
            }
        }
        return flag ? flag : "IP地址格式错误";
    };

    /**
     * 邮政编码检查
     * @param postcode
     * @returns {boolean}
     */
    exports.checkPostcode = function(postcode) {
        return /^([0-9]{6})$/.test(postcode);
    };

    /**
     * 密码检测,必须数字、英文或符号
     * @param password
     * @returns {boolean}
     */
    exports.checkPassword = function(password) {
        return /^[\x21-\x7E]{8,20}$/.test(password);
    };

    /**
     * 检查是否为单一纯字母
     * @param password
     * @returns {boolean}
     */
    exports.isSinglepureletters = function(password) {
        return /^([a-zA-Z])\1*$/.test(password);
    };

    /**
     * 检查是否为数字
     * @param password
     * @returns {boolean}
     */
    exports.isNum = function(password) {
        return /^\d+$/.test(password);
    };

    /**
     *验证一个给定参数是否为数字(注意不是比较变量的类型，而是比较是不是一个数字或数字字符串)
     */
    exports.isNumber = function(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };

    /**
     * 验证密码强度
     * 0-表示密码不合法；1-表示强度为弱，2-表示强度为中；3-表示强度为高
     */
    exports.passwordIntensity = function(password) {
        var rank = 0;
        if (password.length < 8 || password.length > 20) {
            return rank;
        }
        //要求密码必须包含字母、数字、特殊字符
        if (/((\d+[a-zA-Z]+[-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+)|(\d+[-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+[a-zA-Z]+)|([a-zA-Z]+\d+[-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+)|([a-zA-Z]+[-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+\d+)|([-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+\d+[a-zA-Z]+)|([-`=\\\[\];',./~!@#$%^&*()_+|{}:\"<>?]+[a-zA-Z]+\d+))/.test(password)) {
            if (password.length > 10) {
                rank = 3
            } else {
                rank = 2;
            }
            return rank;
        }
        //仅包含数字和字母
        if (/^([0-9a-zA-Z]*\d[a-zA-Z][0-9a-zA-Z]*$)|([0-9a-zA-Z]*[a-zA-Z]\d[0-9a-zA-Z]*$)/.test(password)) {
            if (password.length > 8) {
                rank = 2;
            } else {
                rank = 1;
            }
            return rank;
        }
        //仅包含数字和特殊字符
        if (/^[-\d`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]*\d+[-`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]+[-\d`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]*$/.test(password)) {
            if (password.length > 8) {
                rank = 2;
            } else {
                rank = 1;
            }
            return rank;
        }
        //仅包含字母和特殊字符
        if (/^[-a-zA-Z`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]*[a-zA-Z]+[-`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]+[-a-zA-Z`=\\\[\];',./~!@#$%^&*()_+|{}:"<>?]*$/.test(password)) {
            if (password.length > 8) {
                rank = 2;
            } else {
                rank = 1;
            }
            return rank;
        }
        return rank;
    };

    /**
     * 检查输入的金额是否正确
     * @param str
     * @return {Boolean|String} 当为true时校验成功，否则返回错误信息
     */
    exports.checkMoney = function(str) {
        str = str.trim(); // 去掉空格
        var i, n, f;

        if (!str || str == "") { // 1.不能为空
            return "金额不能为空";
        }
        if (!(/^(-?\d+)(\.\d+)?$/.test(str))) { // 2.包含其它非数字
            return "金额只能是数字";
        }
        i = str.indexOf(".");
        if (i != -1) {
            n = str.substring(i + 1);
            if (n.length > 2) { // 3.金额只能精确到小数点后两位
                return "金额只能精确到小数点后两位";
            }
        }
        f = parseFloat(str);
        if (f >= 100000000) { // 4.金额必须小于一亿
            return "金额过大";
        }
        if (f < 0.01) { // 5.必须大于0.01
            return "金额小于0.01";
        }
        return true;
    };

    /**
     * 校验名字
     * @param name
     * @returns {*}
     */
    exports.checkName = function(name) {
        var csName = /^[a-zA-Z\u4e00-\u9fa5-\u2022]{2,20}$/.test(name);
        var cnEnName = /[A-Za-z\u4E00-\u9FA5]{1,20}/.test(name);
        var cnEE = /[^\x00-\xff]/g.test(name);
        var n = _getStrLen(name); //字节总长度

        if (!name) {
            return "请输入姓名";
        }

        if (cnEE && n < 4) {
            return "请输入完整的姓名";
        }

        if (n > 50) {
            return "姓名字符超长，请联系客服";
        }

        if (!csName) {
            return "名字只能包含中文、英文和\"\u2022\"";
        }

        if (!cnEnName) {
            return "名字必须包含有中文或英文";
        }

        return true;
    };

    /**
     * 判断字符长度
     */
    function _getStrLen(str) {
        var cnstrCount = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255)
                cnstrCount = cnstrCount + 1;
        }
        return str.length + cnstrCount;
    }

}));
