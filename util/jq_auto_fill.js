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
     * 遍历对象填充值到页面，通过 data-name 匹配字段名
     * @param obj 取值的对象
     * @param fun 预处理函数
     */
    exports.autoFillByObj = function(obj, fun) {
        var $elem, v, temp;
        for (var k in obj) {
            $elem = $("[data-name=" + k + "]");
            $elem.each(function() {
                var $this = $(this);
                v = obj[k];
                if ($this.is("input")) {
                    $this.val(v);
                } else {
                    temp = v == "" ? "--" : v;
                    if (fun) {
                        temp = fun(k, v);
                    }
                    $this.html(temp);
                }
            });
        }
    };

    /**
     * 遍历节点填充值到页面，通过 data-name 匹配字段名
     * @param obj 取值的对象
     * @param fun 预处理函数
     * @param $root 可选根节点
     */
    exports.autoFillByPage = function(obj, fun, $root) {
        var $elems;
        if ($root) {
            $elems = $("[data-name]", $root);
        } else {
            $elems = $("[data-name]");
        }
        $elems.each(function() {
            var $this = $(this),
                v, temp,
                k = $this.attr("data-name");
            v = obj[k];
            if ($this.is("input")) {
                $this.val(v);
            } else {
                temp = v == "" ? "--" : v;
                if (fun) {
                    temp = fun(k, v);
                }
                $this.html(temp);
            }
        });
    };
}));
