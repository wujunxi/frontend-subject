$(function(){

    $.ajax({
        url:"/say",
        success:function(data){
            $("#spInfo").text(data.data);
        }
    });

});