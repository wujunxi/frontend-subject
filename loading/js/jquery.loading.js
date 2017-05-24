(function($){

    var loadingHtml = '<div class="loading-wrap" style="display:none;"><div class="loading"><span></span><span></span><span></span><span></span><span></span></div></div>';

    $.loading = function(){
        var wrapObj = {
            isInit:false
        };

        wrapObj.init = function(){
            this.$box = $(loadingHtml);
            $("body").append(this.$box);
            this.isInit = true;
        };

        wrapObj.show = function(){
            if(!this.isInit){
                this.init();
            }
            this.$box.show();
        };

        wrapObj.hide = function(){
            if(!this.isInit){
                this.init();
            }
            this.$box.hide();
        }

        return wrapObj;
    };

})(jQuery);