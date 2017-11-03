define(function(require, exports, modules) {

    var data1 = [
            { value: '1', text: '西瓜' },
            { value: '2', text: '苹果' },
            { value: '3', text: '雪梨' },
            { value: '4', text: '香蕉' },
            { value: '5', text: '茄子' }
        ],
        data2 = [
            { value: '1', text: '西瓜2' },
            { value: '2', text: '苹果2' },
            { value: '3', text: '雪梨2' },
            { value: '4', text: '香蕉2' },
            { value: '5', text: '茄子2' }
        ],
        data3 = [
            { value: '1', text: '西瓜3' },
            { value: '2', text: '苹果3' },
            { value: '3', text: '雪梨3' },
            { value: '4', text: '香蕉3' },
            { value: '5', text: '茄子3' }
        ];;


    var dropdown = require('./dropdown.js');
    $(function() {
        // 方法一：覆盖select
        $('select').each(function() {
            dropdown($(this), {
                onSelect: function(key, text) {
                    console.log('key:%s text:%s', key, text);
                }
            });
        });
        // 方法二：自定义data
        dropdown($('#test'), {
            data: data1
        });
        // 联动
        var $dropdown1 = dropdown($('#test1'), {
            hasDefault:false,
            data: data1,
            onSelect: function(value,text) {
                if(value%2){
                    $dropdown2.setData(data3);
                }else{
                    $dropdown2.setData(data2);
                }
            }
        });
        var $dropdown2 = dropdown($('#test2'));
    });
});