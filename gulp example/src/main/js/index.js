var $ = require("jquery");

$(function(){

    $.ajax({
        url:"service/user/list.json",
        data:{},
        dataType:"json",
        type:"get",
        success:function(retData){
            var i,len,item,htmlStr = "";
            if(retData && retData.retCode == "00"){
                for(i = 0,len = retData.data.list.length; i < len;i++){
                    item = retData.data.list[i];
                    htmlStr += '<li>'+ item.name +'</li>';
                }
                $("#ulNameList").html(htmlStr);
            }else{
                alert("fail!");
            }
        },
        error:function(){
            alert("system busy!");
        }
    });

});