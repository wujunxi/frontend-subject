/**
 * [分页插件]
 * author: xgs
 * date: 2017.01.05
 * version: 1.0.0
 */
define(function(require, exports, module) {

    require("../paginator");

    var paginatorSimple = require("../paginator-simple");

    $(".page").paginator({
        url: "/list/",
        showJump: true,
        showPage: 100,
        pageStartNum: 0,
        pageCurrent: 12,
        pageMaxNum: 30,
        pageSizeTotal: 102,
        pageNumTotal: 20,
        loadMode: {
            firstPage: "sync"
        },
        render: function() {
            $("#target").html("这是一个数据列表哈！！！")
        },
        loading: {
            target: "#target"
        }
    });

    // 简单分页，不包装数据请求
    var $paginatorSimple = paginatorSimple({
        elem: '#divTestPage',
        isShowGoPage:true,
        onPage: function(pageNum,totalPage) {
            this.refreshPage(pageNum, totalPage);
        }
    });

    $paginatorSimple.refreshPage(0, 100);
});