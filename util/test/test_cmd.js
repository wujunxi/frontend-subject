define(function(require, exports, module) {
    var number_extend = require("../number_extend");
    var string_extend = require("../string_extend");
    var url_param = require("../url_param");
    var money = require("../money");
    var FunQueue = require("../FunQueue");

    console.log(0.07 * 100);
    console.log(new Number(0.07).mul(100));
    console.log(number_extend.mul(100, 0.07));

    console.log(0.16 + 0.3);
    console.log(new Number(0.16).add(0.3));
    console.log(number_extend.add(0.16, 0.3));

    console.log(0.1 - 0.01);
    console.log(new Number(0.1).add(-0.1));
    console.log(number_extend.add(0.1, -0.1));

    // string_extend
    console.log("   sdf adf  ".trim());

    // url_param
    var url = "?v=123&type=oper";
    var obj = url_param.qryStr2Obj(url);
    console.log(obj);
    console.log(url_param.obj2QryStr(obj));
    console.log(url_param.qryStr2Obj(window.location.search));

    // money
    console.log(money.toCapital(1234567890));
    console.log(money.fmoney(1234567890));

    function randomNum() {
        return Math.floor(Math.random() * 1000);
    }

    function stepOne(fq, data) {
        var t = randomNum();
        setTimeout(function() {
            console.log(data += " -> stepOne("+t+")");
            fq.next(data);
        }, t);
    }

    function stepTwo(fq, data) {
        var t = randomNum();
        setTimeout(function() {
            console.log(data += " -> stepTwo("+ t+")");
            fq.next(data);
        }, t);
    }

    function stepThree(fq, data) {
        var t = randomNum();
        setTimeout(function() {
            console.log(data += " -> stepThree(" + t + ")");
            fq.next(data);
        }, t);
    }

    new FunQueue().add(stepOne).add(stepTwo).add(stepThree).next("team A");
    new FunQueue().add(stepOne, stepTwo).add(stepThree).next("team B");

});
