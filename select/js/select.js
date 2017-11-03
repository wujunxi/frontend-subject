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
    
    /**
     * 绑定下拉框
     * @param $tb 赋值的input
     * @param data 菜单数据{kay:value}
     * @param css 菜单调整样式
     * @returns {{setMenu: setMenu, val: wrapObj.val, onSelect: wrapObj.onSelect}}
     */
    return function ($tb, data, css) { // 依赖default.css中的样式
        var onSelect = $.noop, isShow = false;
        var $sp = $('<span class="drop_down"></span>'),
            $ul = $('<ul class="drop_down_option" style="display: none;"></ul>');
        // 设置菜单项
        if (data) {
            setMenu(data);
        }
        // 添加按钮和下拉菜单
        $tb.after($ul[0]).after($sp[0]);
        // 按钮事件
        $sp.click(function () {
            var $this = $(this);
            if ($this.hasClass("on")) {
                hide();
            } else {
                show();
            }
        });
        // 菜单事件
        $ul.delegate("li", "click", function () {
            var $this = $(this);
            if ($this.hasClass("on")) {
                return;
            }
            select($this);
            hide();
        });
        // 调整样式
        if (css) {
            $ul.css(css);
        }
        var wrapObj = {
            setMenu: setMenu,
            val: function (v) {
                var $item;
                if (arguments.length == 1) {
                    $item = $ul.find("[data-key=" + v + "]");
                    select($item, true);
                    return wrapObj;
                } else {
                    $item = $ul.find(".on");
                    if ($item.length != 0) {
                        return $item.attr("data-key");
                    } else {
                        return null;
                    }
                }
            },
            onSelect: function (callback) {
                onSelect = callback;
                return wrapObj;
            }
        };
        // 全局点击事件
        $(document).click(function (e) {
            if ($sp.is(e.target) || $ul.is(e.target) || !isShow) {
                return;
            }
            hide();
        });
        return wrapObj;
        function setMenu(kv, opt) {
            var i, len, item, htmlStr = "", k, kname, vname;
            if (opt) {
                kname = opt.key || "key";
                vname = opt.val || "val";
                for (i = 0, len = kv.length; i < len; i++) {
                    item = kv[i];
                    htmlStr += '<li data-key="' + item[kname] + '">' + item[vname] + '</li>';
                }
            } else {
                for (k in kv) {
                    htmlStr += '<li data-key="' + k + '">' + kv[k] + '</li>';
                }
            }
            $ul.html(htmlStr);
            // 默认选中第一项
            var $item = $("li:eq(0)", $ul);
            if ($item.length > 0) {
                select($item, true);
            }
            return wrapObj;
        }

        function select($item, isInner) {
            if ($item.length == 0) return;
            var k = $item.attr("data-key"),
                t = $item.text();
            $tb.val(t).attr("data-key", k);
            $(".on", $ul).removeClass("on");
            $item.addClass("on");
            if (!isInner && onSelect) {
                onSelect(k, t);
            }
        }

        function show() {
            $ul.css("display", "inline-block");
            $sp.addClass("on");
            isShow = true;
        }

        function hide() {
            $ul.hide();
            $sp.removeClass("on");
            isShow = false;
        }
    };
}));