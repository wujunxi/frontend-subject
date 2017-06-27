$(function(){

    var $spInfo = $("#spInfo");

    $.ajax({
        url:'data/test.json',
        dataType:'json',
        data:{name:"Jack"},
        timeout:30000,
        success:function(data){
            $spInfo.text(data.data);
        },
        error:function(){
            alert('网络错误');
        }
    });
});