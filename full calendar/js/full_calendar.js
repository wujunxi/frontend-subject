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
    var NAMESPACE = "full_calender",
        MONTH = ["", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"];

    var cSetting = {};
    var $table, $title, $days;

    $.fn.fullCalendar = function() {
        var method = arguments[0],
            args = [];
        for (var i = 0, len = arguments.length; i < len; i++) {
            args.push(arguments[i]);
        }
        if (methods[method]) {
            method = methods[method];
            args.shift();
        } else if (typeof(method) == 'object' || !method) {
            method = methods.init;
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.calendar');
            return this;
        }
        return method.apply(this, args);
    };

    var defaults = $.fn.fullCalendar.defaults = {
        date: null,
        onClickDay: $.noop,
        onChangeDate: $.noop
    };

    var methods = {
        init: function(options) {
            return this.each(function() {
                getSetting.call(this, options);
                $(this).html(create());
                refresh.call(this);
                bindEvent.call(this);
            });
        },
        prevMonth: function() {
            return this.each(function() {
                getSetting.call(this);
                if (cSetting.cMonth == 1) {
                    cSetting.cMonth = 12;
                    cSetting.cYear--;
                } else {
                    cSetting.cMonth--;
                }
                refresh.call(this);
            });
        },
        nextMonth: function() {
            return this.each(function() {
                getSetting.call(this);
                if (cSetting.cMonth == 12) {
                    cSetting.cMonth = 1;
                    cSetting.cYear++;
                } else {
                    cSetting.cMonth++;
                }
                refresh.call(this);
            });
        },
        checkDay: function(day) {
            return this.each(function() {
                if (typeof day == "string") {
                    checkDay.call(this, day);
                } else {
                    for (var i = 0, len = day.length; i < len; i++) {
                        checkDay.call(this, day[i]);
                    }
                }
            });
        }
    };

    function checkDay(day) {
        var $this = $(this);
        $(".fcal-day[data-date=" + day + "]", $this).addClass("checked");
    }

    function getSetting(options) {
        var $this = $(this),
            temp;
        var settings = $this.data(NAMESPACE);
        if (typeof(settings) == 'undefined') {
            cSetting = $.extend({}, $.fn.fullCalendar.defaults, options);
            if (cSetting.date) {
                temp = new Date(cSetting.date);
            } else {
                temp = new Date();
            }
            cSetting.cYear = temp.getFullYear();
            cSetting.cMonth = temp.getMonth() + 1;
            cSetting.cDay = temp.getDay();
            cSetting.cDate = formateDateStr(cSetting.cYear,cSetting.cMonth,cSetting.cDay);
        } else {
            cSetting = $.extend({}, settings, options);
        }
    }

    function formateDateStr(year, month, day) {
        var temp,ar = [];
        ar.push(year);
        temp = "0"+month;
        ar.push(temp.substr(temp.length -2,2));
        temp = "0"+day;
        ar.push(temp.substr(temp.length -2,2));
        return ar.join("-");
    }

    function bindEvent() {
        var $container = $(this).on("click", "._prev", function() {
            methods.prevMonth.call($container);
        }).on("click", "._next", function() {
            methods.nextMonth.call($container);
        }).on("click", ".fcal-day", function() {
            var $this = $(this),
                dateStr = $this.attr("data-date");
            if ($this.hasClass("disabled")) {
                return;
            }
            getSetting.call($container);
            cSetting.onClickDay(dateStr);
        });
    }

    function refresh() {
        var $this = $(this);
        $table = $this.find(".fcal");
        $title = $(".fcal-title", $table);
        $days = $(".fcal-day", $table);
        refreshHead();
        refreshDayList();
        // 更新完保存当前参数
        $this.data(NAMESPACE, cSetting);
        cSetting.onChangeDate(cSetting.cYear, cSetting.cMonth);
    }

    function refreshHead() {
        $title.text(MONTH[cSetting.cMonth] + "月 " + cSetting.cYear);
    }

    function refreshDayList() {
        var cYear = cSetting.cYear,
            cMonth = cSetting.cMonth,
            cDay = cSetting.cDay, // 当前年月日
            lYear = cMonth == 1 ? cYear - 1 : cYear,
            lMonth = cMonth == 1 ? 12 : cMonth - 1,
            nYear = cMonth == 12 ? cYear + 1 : cYear,
            nMonth = cMonth == 12 ? 1 : cMonth + 1;
        var len = (new Date(cYear, cMonth, 0)).getDate(), // 取下个月的第0天日期，即本月的天数
            first = (new Date(cYear, cMonth - 1, 1)).getDay(), // 取本月第一天所在星期的星期几，作为显示天数的起点
            last = first + len, // 显示天数的终点
            lastMonthDays = (new Date(lYear, lMonth, 0)).getDate(), // 上个月天数
            now = new Date(),
            today = formateDateStr(now.getFullYear(),now.getMonth()+1,now.getDate()),
            date = 1,
            index = 1,
            dateStr = "";
        $days.each(function(i, e) {
            var $e = $(e),
                className = "fcal-day",
                text = "";
            if (i < first) { // 上个月的日期
                text = lastMonthDays - first + i + 1;
                dateStr = formateDateStr(lYear, lMonth, text);
                className += " disabled";
            } else if (i >= first && i < last) { // 这个月的日期
                text = date;
                dateStr = formateDateStr(cYear, cMonth, text);
                date++;
            } else if (i >= last) { // 下个月的日期
                text = index++;
                dateStr = formateDateStr(nYear, nMonth, text);
                className += " disabled";
            }
            // 今天
            if(dateStr == today){
                className += " fcal-today";
            }
            $e.text(text).attr("class", className).attr("data-date", dateStr);
        });
    }

    function create() {
        var htmlStr = "";
        htmlStr += '<table class="fcal">'
        htmlStr += createHead();
        htmlStr += createBody();
        htmlStr += '</table>';
        return htmlStr;
    }

    function createHead() {
        var htmlStr = '';
        htmlStr += '<thead class="fcal-head">';
        htmlStr += '<tr>';
        htmlStr += '<th colspan="7">';
        htmlStr += '<span class="fcal-head-right">';
        htmlStr += '<span class="fcal-btn first _prev">◄</span>';
        htmlStr += '<span class="fcal-btn _next">►</span>';
        htmlStr += '</span>';
        htmlStr += '<span class="fcal-head-left fcal-title"></span>';
        htmlStr += '</th>';
        htmlStr += '</tr>';
        htmlStr += '</thead>';
        return htmlStr;
    }

    function createBody() {
        var htmlStr = '',
            i, j, m, n;
        htmlStr += '<tbody class="fcal-body">';
        htmlStr += '<tr class="fcal-week-title">'
        htmlStr += '<td>日</td> <td>一</td> <td>二</td> <td>三</td> <td>四</td> <td>五</td> <td>六</td>';
        htmlStr += '</tr>';
        for (i = 0; i < 6; i++) { // 六个星期
            htmlStr += '<tr class="fcal-row">';
            for (j = 0; j < 7; j++) { // 七天
                htmlStr += '<td class="fcal-day"></td>';
            }
            htmlStr += '</tr>';
        }
        htmlStr += '</tbody>';
        return htmlStr;
    }
}));
