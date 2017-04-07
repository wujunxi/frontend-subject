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
     * 删除字符串中的空白
     */
    (function () {
        if (!"".trim) {
            String.prototype.trim = function () {
                return this.replace(/^\s+|\s+$/g, "");
            };
        }
    })();

}));
