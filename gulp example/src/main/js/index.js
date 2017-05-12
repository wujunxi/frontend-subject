var $ = require("jquery");

$(function() {
    var $divLoading = $("#divLoading"),
        $hServiceTime = $("#hServiceTime");

    // 测试映射本地文件
    var listAjax = ajax("service/user/list.json", {}, function(data) {
        var i, len, item, htmlStr = "";
        for (i = 0, len = data.list.length; i < len; i++) {
            item = data.list[i];
            htmlStr += '<li>' + item.name + '</li>';
        }
        $("#ulNameList").html(htmlStr);
    });
    // 测试动态返回数据
    var timeAjax = ajax("service/time.json", {}, function(data) {
        $hServiceTime.text("服务器时间：" + new Date(data.dateTime));
    });
    var toAjax = ajax("service/to.json?name=Lily&type=3", {}, function(data) {
        console.log(data);
    });
    $.when(listAjax, timeAjax, toAjax).done(function() {
        $divLoading.hide();
    });
});

/**
 * 自定义ajax请求
 * 
 * @param {any} url 
 * @param {any} data 
 * @param {any} callback 
 * @param {any} _opt 
 */
function ajax(url, data, callback, _opt) {
    var opt = $.extend({
        type: "get",
        dataType: "json",
        error: function() {
            console.error("ajax fail!", arguments);
        }
    }, {
        url: url,
        data: data,
        success: function(retData) {
            if (retData && retData.retCode == "00") {
                callback(retData.data);
            } else {
                console.warn(retData.retMsg || "not excepted result!");
            }
        }
    }, _opt);
    return $.ajax(opt);
}