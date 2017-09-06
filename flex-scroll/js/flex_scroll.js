(function(factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "zepto"], factory);
    } else if (typeof define === "function" && define.cmd) {
        define(function(require, exports, module) {
            var zepto = require("zepto");
            return factory(exports, zepto);
        });
    } else {
        factory({}, Zepto);
    }
}(function(exports, $) {
    'use strict';

    $.fn.flexScroll = function() {
        var $this = this;
        this._y = null;
        this.on("touchstart mousedown", function(e) {
            // console.log(e);
            var y = e.type === "mousedown" ? e.clientY : e.changedTouches[0].clientY;
            $this._y = Math.floor(y);
        }).on("touchmove mousemove", function(e) {
            if($this._y === null) return;
            var y = e.type === "mousemove" ? e.clientY : e.changedTouches[0].clientY;
            y = Math.floor(y);
            moveY.call($this, y - $this._y);
            $this._y = y;
            e.preventDefault();
        }).on("touchend mouseup", function(e) {
            var parentH = $this.parent().height(),
                elemH = $this.height(),
                tranY = getTranY.call($this);
            if (tranY > 0) { // 上边框移入上边界
                resetTo.call($this, 0);
            } else if (tranY < 0 && elemH < parentH) { // 上边框移出上边界，且内容高小于框高
                resetTo.call($this, 0);
            } else if (tranY < 0 && (elemH + tranY < parentH)) { // 上边框移出上边界，且下边框移入下边界
                resetTo.call($this, parentH - elemH);
            }
            $this._y = null;
        });
        return this;
    };

    function moveY(d) {
        d = d || 1;
        var tranY = getTranY.call(this) + d;
        // print(tranY);
        // to-do 滚动终止减速效果
        this.css("transform", "translateY(" + tranY + "px)");
    }

    function getTranY() {
        var tranY = this.css("transform");
        tranY = tranY.match(/translateY\((-?[\d\.]+)px\)/);
        tranY = tranY ? parseFloat(tranY[1]) : 0;
        return tranY;
    }

    function resetTo(tranY, callback) {
        // print(tranY);
        // to-do 可优化为css3动画
        this.animate({
            "transform": "translateY(" + tranY + "px)"
        }, 600, "ease", callback);
    }


}));
