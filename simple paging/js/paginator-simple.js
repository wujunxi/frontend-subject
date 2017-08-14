/**
 * 简单分页
 * （1）更新页码需要两个值：当前页和总页数
 * （2）翻页时触发onPage事件
 * @author wujunxi 2017-08-02
 */
define(function(require, exports, module) {

    var defaultOpt = {
        elem: null, // 绑定节点
        isShowPageInfo: true, // 是否显示分页信息
        pageInfoFormat: '第{pageNum}页/共{totalPage}页', // 分页信息格式
        isShowFirstLastPage: true, // 是否显示首页尾页按钮
        fistPageText: '首页', // 首页按钮文字
        lastPageText: '末页', // 末页按钮文字
        isShowPrevNextPage: true, // 是否显示前后页按钮
        prevPageText: '上一页', // 上一页按钮文字
        nextPageText: '下一页', // 下一页按钮文字
        isShowGoPage: false, // 是否显示跳转
        pageNumCount: 5, // 可选页码按钮个数
        onPage: $.noop // 翻页事件,参数pageNum,totalPage
    };

    /**
     * 类定义
     * 
     * @param {any} _opt 
     */
    function Page(_opt) {
        this.opt = $.extend({}, defaultOpt, _opt);
        this._init();
    }

    /**
     * 初始化
     */
    Page.prototype._init = function() {
        if (this.opt.elem instanceof jQuery) {
            this.$elem = this.opt.elem;
        } else {
            this.$elem = $(this.opt.elem);
        }
        this.pageNum = 0;
        this.totalPage = 0;
        this._create();
        this._bindEvent();
    }

    /**
     * 创建结构
     */
    Page.prototype._create = function() {
        var htmlStr = '';
        htmlStr += '<div class="sp-wrap">';
        htmlStr += '<div class="sp-main">';
        htmlStr += '<span class="sp-info js_info"></span>';
        htmlStr += '<a class="sp-btn fix js_first" href="javascript:;"></a>';
        htmlStr += '<a class="sp-btn fix js_prev" href="javascript:;"></a>';
        htmlStr += '<div class="sp-pages js_pages"></div>';
        htmlStr += '<a class="sp-btn fix js_next" href="javascript:;"></a>';
        htmlStr += '<a class="sp-btn fix js_last" href="javascript:;"></a>';
        htmlStr += '<input class="sp-input js_input" type="text"/>';
        htmlStr += '<a class="sp-btn js_go" href="javascript:;">跳转</a>';
        htmlStr += '</div>';
        htmlStr += '</div>';
        this.$elem.html(htmlStr);
        var $box = this.$elem;
        this.$info = $('.js_info', $box);
        this.$first = $('.js_first', $box);
        this.$prev = $('.js_prev', $box);
        this.$next = $('.js_next', $box);
        this.$last = $('.js_last', $box);
        this.$pages = $('.js_pages', $box);
        this.$input = $('.js_input', $box);
        this.$go = $('.js_go', $box);
    }

    /**
     * 事件绑定
     */
    Page.prototype._bindEvent = function() {
        var that = this;
        this.$elem.on('click', '.sp-btn', function() {
            var $this = $(this);
            if ($this.hasClass('off') || $this.hasClass('active')) {
                return;
            }
            if ($this.is('.js_go')) {
                that._onGoPage();
                return;
            }
            var pageNum = $this.attr('data-key');
            pageNum = parseInt(pageNum);
            that.opt.onPage.call(that, pageNum, that.totalPage);
        });
        // 回车事件
        this.$input.on('keyup', function(e) {
            if (e.keyCode == '13') {
                that._onGoPage();
            }
        });
    }

    /**
     * 页面跳转
     */
    Page.prototype._onGoPage = function() {
        var pageNum = this.$input.val();
        pageNum = parseInt(pageNum);
        if (isNaN(pageNum)) {
            return;
        }
        pageNum = pageNum - 1;
        this.opt.onPage.call(this, pageNum, this.totalPage);
    }

    /**
     * 更新页码
     */
    Page.prototype.refreshPage = function(_pageNum, _totalPage) {
        var flag, pageNum, totalPage;
        totalPage = parseInt(_totalPage);
        pageNum = parseInt(_pageNum);
        if (isNaN(totalPage) || isNaN(pageNum) || pageNum >= totalPage) {
            return;
        }
        // 保存页码和总页数
        this.totalPage = totalPage;
        this.pageNum = pageNum;
        // 更新页码信息
        var info = this.opt.pageInfoFormat.replace('{pageNum}', this.pageNum + 1).replace('{totalPage}', this.totalPage);
        this.$info.html(info);
        this.$first.text(this.opt.fistPageText).toggle(this.opt.isShowFirstLastPage);
        this.$last.text(this.opt.lastPageText).toggle(this.opt.isShowFirstLastPage);
        this.$prev.text(this.opt.prevPageText).toggle(this.opt.isShowPrevNextPage);
        this.$next.text(this.opt.nextPageText).toggle(this.opt.isShowPrevNextPage);
        this.$input.toggle(this.opt.isShowGoPage);
        this.$go.toggle(this.opt.isShowGoPage);
        this._createPage(this.pageNum, this.totalPage);
        // 当前页为首页时，首页、上一页按钮不能点击
        flag = this.pageNum == 0;
        this.$first.toggleClass('off', flag).attr('data-key', 0);
        this.$prev.toggleClass('off', flag).attr('data-key', this.pageNum - 1);
        // 当前页为末页时，末页、下一页按钮不能点击
        flag = this.pageNum == (this.totalPage - 1);
        this.$last.toggleClass('off', flag).attr('data-key', this.totalPage - 1);
        this.$next.toggleClass('off', flag).attr('data-key', this.pageNum + 1);
        return this;
    }

    /**
     * 创建页码
     */
    Page.prototype._createPage = function(pageNum, totalPage) {
        var i, from, to, pageHtml = '',
            temp,
            m = this.opt.pageNumCount;
        from = pageNum - Math.floor(m / 2);
        from = from < 0 ? 0 : from;
        to = from + m - 1;
        to = to > (totalPage - 1) ? (totalPage - 1) : to;
        for (i = from; i <= to; i++) {
            temp = (pageNum == i ? ' active' : '');
            pageHtml += '<a class="sp-btn' + temp + '" href="javascript:;" data-key="' + i + '">' + (i + 1) + '</a>';
        }
        this.$pages.html(pageHtml);
    }

    /**
     * 工厂
     * 
     * @param {any} opt 
     * @returns 
     */
    function factory(opt) {
        return new Page(opt);
    }

    return factory;
});