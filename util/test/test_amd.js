require(["../number_extend", "../string_extend", "../url_param", "../money"], function(number_extend, string_extend, url_param, money) {
    // number_extend
    console.log(0.07 * 100);
    console.log(new Number(0.07).mul(100));
    console.log(number_extend.mul(100, 0.07));

    console.log(0.16 + 0.3);
    console.log(new Number(0.16).add(0.3));
    console.log(number_extend.add(0.16, 0.3));

    console.log(0.1 - 0.01);
    console.log(new Number(0.1).add(-0.01));
    console.log(number_extend.add(0.1, -0.1));

    console.log(0.47/100);
    console.log(new Number(0.47).divBy(100));
    console.log(number_extend.div(0.47, 100));

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


});
