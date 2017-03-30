require(["../number_extend"], function(number_extend) {
    console.log(0.07 * 100);
    console.log(new Number(0.07).mul(100));
    console.log(number_extend.mul(100,0.07));

    console.log(0.16 + 0.3);
    console.log(new Number(0.16).add(0.3));
    console.log(number_extend.add(0.16,0.3));

    console.log(0.1 - 0.01);
    console.log(new Number(0.1).add(-0.1));
    console.log(number_extend.add(0.1,-0.1));
});
