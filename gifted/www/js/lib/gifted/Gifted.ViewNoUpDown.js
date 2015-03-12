// @Deprecated
define(['underscore','backbone','backbone.scrollview'],function(_){
	var tt = 
		"<div class='scrollview'>"+
			"<div class='scrollview_topbar'></div>"+
			"<div class='scrollview_content'>"+
				"<div class='scrollview_wrapper'>"+
					"<div class='scrollview_realcontent'></div>"+
				"</div>"+
			"</div>"+
			"<div style='min-height:25px;height:25px;'>&nbsp;</div>"+
			"<div class='scrollview_bottombar'></div>"+
		"</div>";
		//<div class='pullDown'><span class='pullDownIcon'></span><span class='pullDownLabel'>Pull down to refresh...</span></div>\
		//<div class='pullUp'><span class='pullUpIcon'></span><span class='pullUpLabel'>Pull up to refresh...</span></div>\
	Gifted.ViewNoUpDown = Gifted.View.extend({
		template:Handlebars.compile(tt),
		topRefresh:false,
		bottomRefresh:false,
		onTopRefresh:function(){
			//this.loadData(true);
		},
		onBottomRefresh:function(){
			//this.loadData(false);
		},
		completeLoading:function(){
//			this.trigger('refreshcomplete');
			//_.delay(_.bind(this.trigger,this,'refreshcomplete'),1000);
		}
	});
});