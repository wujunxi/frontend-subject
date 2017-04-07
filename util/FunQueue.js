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

    /**
     * 函数队列对象，用来顺序执行函数
     * 对象有两个方法add和next，
     * add用来往队列添加函数，多个入参表示并行
     * next用来执行队列中的函数。
     *  使用方法：
     *  new FunQueue().add(getUserInfo).add(getBankList).add(getUserBankCards)
     *     .add(bindEvent).next();
     *  被添加的函数有一个FunQueue对象的入参，可以通过这个入参执行next方法定义
     *  下一个函数的执行时机。
     *  <b>解决多个异步函数顺序执行深层嵌套的问题</b>。
     */

    function FunQueue() {
        this.ar = []; // 待执行函数队列
        this.parraleNum = 0; // 当前并行函数数目
    }

    FunQueue.prototype.add = function(fun) {
        // 判断是否多个入参
        if (arguments.length > 1) {
            this.ar.unshift(arguments);
        } else {
            this.ar.unshift(fun);
        }
        return this;
    };

    FunQueue.prototype.next = function(data) {
        //console.log(this.ar.length);
        if (this.ar.length > 0) {
            // 判断并行项是否完成
            if (this.parraleNum != 0 && --this.parraleNum != 0) {
                return this;
            }
            var item = this.ar.pop();
            // 判断是否为并行项
            if (item.length && typeof item !== "function") {
                this.parraleNum = item.length;
                var i, len;
                for (i = 0, len = item.length; i < len; i++) {
                    item[i](this, data);
                }
            } else {
                item(this, data);
            }
        }
        return this;
    };

    return FunQueue;
}));
