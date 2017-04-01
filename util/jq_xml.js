(function(factory) {
    if (typeof define === "function" && define.amd) {
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
     * xml转Object
     * @param xml dom元素
     * @param rule 转换规则对象，对象的每个属性对应一个节点名，没特殊转换规则的节点可以不用配置:
     *            mult:{Boolen} 是否出现多次，设为true则会当成数组成员处理
     *            rename:{String} 重命名节点
     *            val:{String} 节点默认值
     *            handler:{function} 节点处理方法，入参为节点值，返回处理结果值
     *            type:{String} 节点文本值转换成的数据类型，number,boolean,date,string(默认)
     * xml2obj(xmlDoc,{row:{mult:true}})
     */
    exports.xml2obj = function(xml, rule) {
        return node2obj($($(xml).children(":first")));

        function node2obj($node) {
            var ar = [],
                obj = {},
                hasChild = false;
            $node.children().each(function(i, e) {
                var r = node2obj($(e)),
                    t, k, v, f;
                hasChild = true;
                // 判断是否定义转换规则
                if (rule && e.tagName in rule) {
                    t = rule[e.tagName];
                    // 数据类型转换
                    if (t["type"] === "number") {
                        r = Number(r);
                    } else if (t["type"] === "boolean") {
                        r = r == "true";
                    } else if (t["type"] === "date") {
                        f = t["format"] || "yyyy-mm-dd hh:mi:ss";
                        var y, m, d, h, mi, s, temp;
                        try {
                            y = parseInt(r.substr(f.match(/yyyy/).index, 4));
                            m = parseInt(r.substr(f.match(/mm/).index, 2));
                            d = parseInt(r.substr(f.match(/dd/).index, 2));
                            try {
                                h = parseInt(r.substr(f.match(/hh/).index, 2));
                            } catch (ex) {
                                h = 0;
                            }
                            try {
                                mi = parseInt(r.substr(f.match(/mi/).index, 2));
                            } catch (ex) {
                                mi = 0;
                            }
                            try {
                                s = parseInt(r.substr(f.match(/ss/).index, 2));
                            } catch (ex) {
                                s = 0;
                            }
                            r = new Date(y, m, d, h, mi, s);
                        } catch (ex) {
                            r = null;
                        }
                    }
                    // 是否重命名及默认值
                    k = t["rename"] || e.tagName;
                    v = t["val"] || r;
                    // 自定义处理方法
                    if (t["handler"]) {
                        v = t["handler"](r);
                    }
                    // 判断是否数组成员
                    if (t["mult"] === true) { // 有根节点的数组取根节点作为数组名
                        ar.push(v);
                    } else if (t["mult2"] === true) { // 无根节点的数组取成员节点名作为数组名
                        if (obj[k] && obj[k].length) {
                            obj[k].push(v);
                        } else {
                            obj[k] = [v];
                        }
                    } else {
                        obj[k] = v;
                    }
                } else {
                    obj[e.tagName] = r;
                }
            });
            // 返回数组、对象 或 节点值
            return ar.length > 0 ? ar : (hasChild ? obj : $node.text());
        }
    };

}));
