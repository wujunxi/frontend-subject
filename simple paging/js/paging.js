(function($, win) {

    $.Paging = function(_opt) {
        var opt = $.extend({
            el: "",
            onChangePage: $.noop
        }, _opt);

        var htmlStr = "";
        htmlStr += '<ul class="paging">';
        htmlStr += '<li class="pg-btn _first">首页</li>';
        htmlStr += '<li class="pg-btn _prev">上一页</li>';
        htmlStr += '<li class="pg-txt _before">...</li>';
        htmlStr += '<li class="pg-btn _num">12</li>';
        htmlStr += '<li class="pg-btn _num on">13</li>';
        htmlStr += '<li class="pg-btn _num">14</li>';
        htmlStr += '<li class="pg-btn _num">15</li>';
        htmlStr += '<li class="pg-btn _num">16</li>';
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

        $box.on("click",".pg-btn",function(){
            var $this = $(this);
            if($this.hasClass("on") || $this.hasclass("off")){
                return;
            }
            if($this.hasClass("_num")){
                opt.onChangePage(parseInt($this.text()));
            }else if($this.hasClass("_first")){

            }
        });

        return {
            refresh: function(cur, size, total) {
                var totalPage = Math.ceil(total / size);
                $before.toggle(cur > 3);
                $after.toggle(cur < totalPage - 2);
                if (cur == 1) {
                    $prev.add($first).addClass("off");
                } else {
                    $prev.add($first).removeClass("off");
                }
                if (cur == totalPage) {
                    $next.add($last).addClass("off");
                } else {
                    $next.add($last).removeClass("off");
                }
                var from = cur -2,
                to = cur + 2;
                from = from < 1 ? 1: from;
                to = to > totalPage ? totalPage : to;
                console.log(cur,from,to);
                var newHtml = "",i;
                for(i = from; i <= to; i++){
                    newHtml += pageNum(i,i == cur);
                }
                $("._num",$box).remove();
                $before.after(newHtml);
            }
        };
    };

    function pageNum(num, isOn) {
        return '<li class="pg-btn _num' + (isOn ? ' on' : '') + '">' + num + '</li>'
    }

})(jQuery, window);