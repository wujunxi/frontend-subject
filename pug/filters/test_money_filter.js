{
    filters: {
        'money': function(text, options) {
            console.log(options);
            var str = text;
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
                result =  (flag ? "-" : "") + result;
                // 单位
                result += options.unit ? options.unit : "";
                return result;
            }
        }
    },
    'pretty': true
}
