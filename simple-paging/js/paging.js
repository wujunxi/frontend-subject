(function($, win) {

    $.Paging = function(_opt) {
        var opt = $.extend({
            el: "",
            onChangePage: $.noop
        }, _opt);

        var htmlStr = "";
        htmlStr += '<ul class="paging">';
        htmlStr += '<li class="pg-btn _first" data-num="1">首页</li>';
        htmlStr += '<li class="pg-btn _prev">上一页</li>';
        htmlStr += '<li class="pg-txt _before">...</li>';
        htmlStr += '<li class="pg-txt _after">...</li>';
        htmlStr += '<li class="pg-btn _next">下一页</li>';
        htmlStr += '<li class="pg-btn _last">尾页</li>';
        htmlStr += '</ul>';

        var $box = $(opt.el);

        $box.html(htmlStr);

        var $first = $("._first", $box),
            $prev = $("._prev", $box),
            $before = $("._before", $box),
            $after = $("._after", $box),
            $next = $("._next", $box),
            $last = $("._last", $box);

        $box.on("click", "[data-num]", function() {
            var $this = $(this),
                num = parseInt($this.attr("data-num"));
            if ($this.hasClass("on") || $this.hasClass("off")) {
                return;
            }
            opt.onChangePage(num);
        });

        return {
            refresh: function(_cur, size, total) {
                var cur = parseInt(_cur);
                // 计算总页数
                var totalPage = Math.ceil(total / size);
                // 判断是否显示省略号
                $before.toggle(cur > 3);
                $after.toggle(cur < totalPage - 2);
                // 设置上一页和首页是否可点击
                if (cur == 1) {
                    $prev.add($first).addClass("off");
                } else {
                    $prev.add($first).removeClass("off");
                }
                // 设置下一页和尾页是否可点击
                if (cur == totalPage) {
                    $next.add($last).addClass("off");
                } else {
                    $next.add($last).removeClass("off");
                }
                // 设置下一页、上一页、尾页页码
                $prev.attr("data-num", cur - 1);
                $next.attr("data-num", cur + 1);
                $last.attr("data-num", totalPage);
                // 设置可选页码范围
                var from = cur - 2,
                    to = cur + 2;
                from = from < 1 ? 1 : from;
                to = to > totalPage ? totalPage : to;
                var newHtml = "",
                    i;
                // 构造页码html
                for (i = from; i <= to; i++) {
                    newHtml += pageNum(i, i == cur);
                }
                // 移出老的页面
                $("._num", $box).remove();
                // 插入新页码
                $before.after(newHtml);
            }
        };
    };

    /**
     * 构造页码按钮html
     * 
     * @param {any} num 页码
     * @param {any} isOn 是否当前页码
     * @returns 
     */
    function pageNum(num, isOn) {
        return '<li class="pg-btn _num' + (isOn ? ' on' : '') + '" data-num="' + num + '">' + num + '</li>'
    }

})(jQuery, window);