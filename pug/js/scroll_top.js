(function(){

	var timer;

	$(function(){
		addIcon();
	});

	function addIcon(){
		var htmlStr = new String(),
		cssStr = new String();
		cssStr += '.scroll_top{position:fixed;bottom:50px;left:50%;margin:0 0 0 380px;display:block;width:50px;height:50px;line-height:50px;border:solid 1px #f0f0f0;color:#fff;background:#fff;font-size:24px;text-align:center;box-shadow:6px 6px 3px #f0f0f0;cursor:pointer;}';
		cssStr += '.scroll_top:hover {color:#888;}';
		cssStr += '.scroll_top:before {content:"";position:absolute;display:inline-block;width:22px;height:22px;margin:20px 0 0 5px;border:solid 2px #888;border-top:none;border-right:none;transform:rotate(135deg);transition:opacity 0.5s 0s ease;}'
		cssStr += '.scroll_top:hover:before {opacity:0;}';
		htmlStr += '<div class="scroll_top">Up</div>';
		cssStr = '<style>' + cssStr + '</style>';
		var $box = $(htmlStr);
		$box.click(function(){
			clearInterval(timer);
			timer = setInterval(function(){
				var h = $(document).scrollTop(),
				d = 1000;
				// console.log(h);
				h = (h - d) > 0 ? (h-d) : 0 ;
				// console.log(h);
				$(document).scrollTop(h);
				if(h == 0){
					clearInterval(timer);
				}
			},50);
		});
		$("body").append(cssStr).append($box);
	}
})();