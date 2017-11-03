/**
 * 下拉框
 * @author wujunxi 2017-07-28
 * （1）绑定方式一：以select为数据源，隐藏select，插入一个新div
 * （2）绑定方式二：绑定到一个空的div
 */
(function($) {

    /**
     * DropDown类定义
     * 
     * @param {any} $elem 
     * @param {any} _opt 
     */
    function DropDown($elem, _opt) {
        this.$elem = $elem;
        this.opt = $.extend({
            data: null, // 菜单数据（可选） Array，如：[{value:xxx,text:xxxx},{value:xxx,text:xxxx},...]
            hasDefault: true, // 是否设置默认值，默认true，取首选项
            selectClass: 'dropdown', // 伪装select样式
            optionClass: 'dropdown-option', // 伪装option样式
            toggleClass: 'on', // select翻转样式
            onShow: $.noop, // 显示事件
            onHide: $.noop, // 隐藏事件
            onSelect: $.noop // 选中事件，传入选中项的值 value 及文本 text
        }, _opt);
        this._menuData = [];
        this._init();
    }

    /**
     * 初始化
     */
    DropDown.prototype._init = function() {
        var that = this;
        // 判断当前节点是否select
        this._isSelect = this.$elem.is('select');
        // 有默认数据的话取默认数据，没有判断是否为select节点，是则取select里的数据
        if (this.opt.data) {
            this._menuData = this.opt.data;
        } else if (this._isSelect) {
            this.$elem.find('option').each(function(i, e) {
                var $this = $(this),
                    value = $this.attr('value'),
                    text = $this.text();
                value = value || text;
                that._menuData.push({ value: value, text: text });
            });
        }
        // 生成下拉列表
        this.$ul = $('<ul class="' + this.opt.optionClass + '"></ul>');
        if (this._isSelect) {
            this.$div = $('<div class="' + this.opt.selectClass + '"></div>');
            // 隐藏原生，插入节点
            this.$elem.hide().after(this.$div);
        } else {
            this.$div = this.$elem;
            this.$div.addClass(this.opt.selectClass);
        }
        // 判断是否设置默认值，是则取数据源第一个
        if (this.opt.hasDefault && this._menuData.length > 0) {
            this.setValue(this._menuData[0]);
        }
        this._bindEvent();
    }

    /**
     * 刷新
     */
    DropDown.prototype.refresh = function() {
        var pos = this.$div.offset();
        pos.top += this.$div.outerHeight();
        this.$ul.css({
            left: pos.left + 'px',
            top: pos.top + 'px'
        });
        this.$ul.html(this.buildMenu(this._menuData));
        return this;
    };

    /**
     * 构建菜单
     */
    DropDown.prototype.buildMenu = function(data) {
        var i, len, item, htmlStr = '';
        for (i = 0, len = data.length; i < len; i++) {
            item = data[i];
            htmlStr += '<li data-key="' + item.value + '">' + item.text + '</li>';
        }
        return htmlStr;
    }

    /**
     * 事件绑定
     */
    DropDown.prototype._bindEvent = function() {
        var that = this;
        // 显示隐藏菜单
        this.$div.on('click', function() {
            that.showMenu();
        });
        // 菜单项选中
        this.$ul.on('click', 'li', function() {
            var $this = $(this),
                key = $this.attr('data-key'),
                text = $this.text();
            that.setValue({ value: key, text: text });
            that.hideMenu();
            that.opt.onSelect(key, text);
        });
        // 点击其他区域隐藏菜单
        $(document).click(function(e) {
            var $target = $(e.target);
            if (!$target.is(that.$div) && !$.contains(that.$ul, $target)) {
                that.hideMenu();
            }
        });
    }

    /**
     * 显示菜单
     */
    DropDown.prototype.showMenu = function() {
        this.$div.addClass(this.opt.toggleClass);
        this.refresh();
        $('body').append(this.$ul);
        this.opt.onShow();
        return this;
    }

    /**
     * 隐藏菜单
     */
    DropDown.prototype.hideMenu = function() {
        this.$div.removeClass(this.opt.toggleClass);
        this.$ul.detach();
        this.opt.onHide();
        return this;
    }

    /**
     * 设置数据源
     */
    DropDown.prototype.setData = function(data) {
        this._menuData = data;
        this.hideMenu();
        this.setValue();
        return this;
    }

    /**
     * 设置值
     */
    DropDown.prototype.setValue = function(_data) {
        var data = $.extend({
            value: '',
            text: ''
        }, _data);
        this.$div.text(data.text).attr('data-key', data.value);
        // 如果是包装select，则回填数据
        if (this._isSelect) {
            this.$elem.val(data.value);
        }
    }

    $.fn.dropdown = function(opt) {
        return new DropDown(this, opt);
    }

})(jQuery);