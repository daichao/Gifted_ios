/*
 * 定义一个View的基类，这个新的View将使用IScroll作为内容的容器，不再使用系统自带的scrollbar
 * 支持topbar和footbar
 */
var deps = ['backbone','handlebars','iscroll','css!backbone.scrollview.css'];
if(navigator.userAgent.match(/iPhone/i)){
	deps.push('css!lib/scrollview/backbone.scrollview.iphone.css');
}
define(deps, function(util) {
	var tt = "<div class='scrollview'><div class='scrollview_topbar'></div>\
			<div class='scrollview_content'>\
				<div class='scrollview_wrapper'>\
					<div class='pullDown'><div class='alignwithtable'><span class='pullDownIcon'></span><span class='pullDownLabel'>Pull down to refresh...</span></div></div>\
					<div class='scrollview_realcontent_top'></div>\
					<div class='scrollview_realcontent'></div>\
					<div class='scrollview_realcontent_bottom'></div>\
					<div class='pullUp'><div class='alignwithtable'><span class='pullUpIcon'></span><span class='pullUpLabel'>Pull up to load more...</span></div></div>\
				</div>\
				<div class='scrollview_wrapper_bottom'></div>\
			</div>\
			<div class='scrollview_bottombar'></div></div>";
	// abstract
	Backbone.ScrollView = Backbone.View.extend({
		initialize:function(){
            this.on('active',this.onActive,this);
			this.on('refreshcontent',this.onRefreshContent,this);
			this.on('loadComplete',this.onLoadComplete,this);
		},
		getPrevView:function(){
			return null;
		},
		initSwipeEffect:function(){
			if(this.effectInited)
				return;
			this.el.addEventListener('touchstart',_.bind(this.onTouchStart,this));
			this.el.addEventListener('touchmove',_.bind(this.onTouchMove,this));
			this.el.addEventListener('touchend',_.bind(this.onTouchEnd,this));
			this.el.addEventListener('touchcancel',_.bind(this.onTouchCancel,this));
//			this.$el.on('touchstart',_.bind(this.onTouchStart,this));
//			this.$el.on('touchmove',_.bind(this.onTouchMove,this));
//			this.$el.on('touchend',_.bind(this.onTouchEnd,this));
//			this.$el.on('touchcancel',_.bind(this.onTouchCancel,this));
//			this.$el.on('swiptright',_.bind(this.onSwipeRight,this));
			this.effectInited = true;
		},
//		onSwipeRight:function(e){
//			if(this.swiping){
//	        	e.stopPropagation();
//	        	e.preventDefault();
//			}
//		},
		onTouchCancel:function(e){
			console.log('touchcancel key:' + this.key);
			this.onTouchEnd(e);
		},
		onTouchStart:function(e){
			if(this.inTransition)
				return;
			this.swiping=true;
			var originEvent = e;
			var pos = originEvent.touches ? originEvent.touches[0] : originEvent;
			this.startX = pos.pageX;
			if(this.startX>40){
				this.swiping=false;
				return;
			}
			var v = this.getPrevView();
			if(!v){
				this.swiping=false;
				return;
			}else{
				this.$el.addClass('tophead');
			}
			this.lastX = this.startX;
			var t = originEvent.timeStamp;
			this.startTime = t;
			this.translateX = 0;
			this.maxX = this.$el.width();
			this.$el.removeAttr('style');
			console.log('touchstart key:' + this.key);
			e.preventDefault();
		},
		onTouchMove:function(e){
			if(this.swiping){
				var originEvent = e;
				var pos = originEvent.touches ? originEvent.touches[0] : originEvent;
				var curX = pos.pageX;
				if(e.timeStamp-this.startTime<300)
					return;
				if(Math.abs(curX-this.lastX)<2)
					return;
				var deltaX = curX-this.lastX;
				this.lastX = curX;
				if(this.translateX==0){
					var v = this.getPrevView();
					v.$el.addClass('ui-page-active');
				}
				this.translateX += deltaX;
				if(this.translateX<0)
					this.translateX=0;
				if(this.translateX>this.maxX){
					this.translateX = this.maxX;
				}
				
				this.$el.css(IScroll.utils.style.transform,'translate(' + this.translateX + 'px,0px) translateZ(0)')
//				this.$el.css('transform','translate(' + this.translateX + 'px,0px)');
//				this.$el.css('-webkit-transform','translate(' + this.translateX + 'px,0px)');
				
				console.log('touchmove key:' + this.key);
				e.preventDefault();
			}
		},
		onTouchEnd:function(event){
			if(this.swiping){
				this.swiping=false;
				if(this.translateX==0){
					var v = this.getPrevView();
					if(v && v!=this){
						v.$el.removeClass('ui-page-active');
					}
					this.$el.removeAttr('style');
					var originEvent = event;
					var pos = originEvent.changedTouches ? originEvent.changedTouches[0] : originEvent;
					if(pos.pageX-this.startX>40){
						this.changeView(v);
					}
					return;
				}
				if(this.translateX==this.maxX){
					this.onTransitionEnd();
					return;
				}
				if(this.translateX<=(this.maxX/2)){
//					this.$el.css('transition','transform 0.5s ease-in');
//					this.$el.css('-webkit-transition','transform 0.5s ease-in');
//					this.$el.css('transform','translate(0px,0px)');
//					this.$el.css('-webkit-transform','translate(0px,0px)');
					this.$el.css(IScroll.utils.style.transitionDuration,'0.5s');
					this.$el.css(IScroll.utils.style.transitionTimingFunction,'ease-in');
					this.$el.css(IScroll.utils.style.transform,'translate(0px,0px) translateZ(0)')
					this.transitionType = 0;
				}else{
//					this.$el.css('-webkit-transition','transform 0.5s ease-in');
//					this.$el.css('transition','transform 0.5s ease-in');
//					this.$el.css('transform','translate('+ this.maxX + 'px,0px)');
//					this.$el.css('-webkit-transform','translate('+ this.maxX + 'px,0px)');
					this.$el.css(IScroll.utils.style.transitionDuration,'0.5s');
					this.$el.css(IScroll.utils.style.transitionTimingFunction,'ease-in');
					this.$el.css(IScroll.utils.style.transform,'translate('+ this.maxX + 'px,0px) translateZ(0)')
					this.transitionType = 1;
				}
				this.$el.one('transitionend webkitTransitionEnd oTransitionEnd otransitionend MSTransitionEnd',
						_.bind(this.onTransitionEnd,this));
				this.inTransition = true;
				console.log('touchend');
				event.preventDefault();
			}
		},
		onTransitionEnd:function(){
			if(!this.inTransition)
				return;
			this.$el.removeAttr('style');
			this.$el.removeClass('tophead');
			var v = this.getPrevView();
			if(v){
				if(this.transitionType==0){
					v.$el.removeClass('ui-page-active');
				}else{
					this.changeView(v);
				}
			}
			this.inTransition = false;
		},
		changeView:function(to){
			this.$el.removeClass('ui-page-active');
		},
		className:'scrollview_panel',
		scrollClassName:'scrollview_content',
		template:Handlebars.compile(tt),
		minScrollY:0,
		topRefresh:false,
		bottomRefresh:false,
		//scrollingStack:[],
		scrollDestroy:function() {
    	    if (this.scroll) {
	      		this.scroll.off('refresh');
	      		this.scroll.off('scrollEnd');
	    		this.scroll.destroy();
	    		delete this.scroll;
    	    }
		},
		render:function(){
			this.beforeRender();
			this.scrollDestroy();
			
			this.$el.html(this.template());
			this.$topbarEl = this.getTopbarEl();
			this.$contentEl=this.getContentEl();
			this.$bottombarEl = this.getBottomEl();
			
			this.topbarRender();
			this.contentRender();
			this.bottomRender();
			
			this.scrollRender();
			this.initSwipeEffect(); // 兼容某些设备
			this.afterRender();
		},
		beforeRender:function(){
			//
		},
		afterRender:function(){
			/*if(this.effectInited)
				return;
			this.$el.on('touchstart',_.bind(this.onTouchStart,this));
			this.$el.on('touchmove',_.bind(this.onTouchMove,this));
			this.$el.on('touchend',_.bind(this.onTouchEnd,this));
			this.$el.on('touchcancel',_.bind(this.onTouchCancel,this));
//			this.$el.on('swiptright',_.bind(this.onSwipeRight,this));
			this.effectInited = true;*/
		},
		caculateHeight:function(){
			//这里需要计算content的高度
			var h = this.$el.height();
			if(this.$topbarEl.is(':visible')){
				h-=this.$topbarEl.outerHeight();
			}
			if(this.$bottombarEl.is(':visible')){
				h-=this.$bottombarEl.outerHeight();
			}
			this.$el.find('.'+this.scrollClassName).height(h);
		},
		scrollRender:function() {
//			console.log($('.scrollview').css('display'));
//			console.log($('.'+this.scrollClassName).css('display'));
	    	if (!this.scroll) {
				this.caculateHeight();
	    		if(this.topRefresh){
	    			this.topBound=40;
	    			this.minScrollY=-40;
	    		}else{
	    			this.$el.find('.pullDown').hide();
	    		}
	    		if(this.bottomRefresh){
	    			this.bottomBound=40;
	    			this.maxScrollYOffset=40;
	    		}
                //else{
	    		this.$el.find('.pullUp').hide();
	    		//}
				this.scroll = new IScroll(this.$el.find('.'+this.scrollClassName)[0],{
		        	HWCompositing:true,
		        	useTransform:true, // 用true速度比较快(较新的浏览器内核上用translate较快)
					useTransition:true, // 是否使用CSS变换 真机 华为荣耀7用true速度比较快
					click:Gifted.Config.isRealPhone?false:true,//iscroll内部的link无法点击，用这个参数可以解决这个问题，暂时还没有发现副作用
		        	preventDefault:Gifted.Config.isRealPhone?true:false,
					mouseWheel:Gifted.Config.isRealPhone?false:true,
					disableMouse:Gifted.Config.isRealPhone?true:false,
					disablePointer:true,
					bindToWrapper:false,
					freeScroll:false,
					fadeScrollbars:false,
					bounceLock:true,
					bounce:true,
					deceleration:deviceIsIOS?0.0006:0.0002,
					//shrinkScrollbars:'clip', // 真机 华为荣耀7不用clip速度比较快
					
					//offsetTop:52,
					minScrollY:this.minScrollY,
					//maxScrollYOffset:this.maxScrollYOffset,
					startY:this.minScrollY,
					
					topBound:this.topBound,
					bottomBound:this.bottomBound,
					//hScroll:true, 
					vScroll:false,
					//hScrollbar:true,
					vScrollbar:false,
					scrollbars:true,
					scrollX:false,
					scrollY:true,
					drapdrop:true
				});
				if(this.topBound){
					this.scroll.on('topBound',_.bind(this.onTopBound,this));
				}
				if(this.bottomBound){
					this.scroll.on('bottomBound',_.bind(this.onBottomBound,this));
				}
				if(this.topBound || this.bottomBound){
					this.scroll.on('release',_.bind(this.onScrollRelease,this));
				}
			}
		},
        onActive:function(){ // 切换View后调用
            if (this.scroll) {
				//this.caculateHeight();
            	//_.delay(function(view){ // view change maybe cost much time 
	               	if (this.scroll)
		            	this.scroll.refresh();
	    		//},500,this);
	        }
			console.log('已切换完View');
        },
		onRefreshContent:function(){ // 描绘完html后调用
			this.$el.translate(); // 描绘完html要翻译
            if (this.scroll) {
				//this.caculateHeight();
            	//_.delay(function(view){ // view change maybe cost much time 
	               	if (this.scroll)
		            	this.scroll.refresh();
	    		//},500,this);
	        }
			console.log('已描绘完View');
		},
		scorllToBottom:function(){
			if(this.scroll){
				this.scroll.scrollTo(0,this.scroll.maxScrollY);
			}
		},
		onLoadComplete:function(){ // ajax完调用
			if(this.$el.find('.pullDown').hasClass('loading')){
				this.$el.find('.pullDown').removeClass('loading');
				this.$el.find('.pullDownLabel').html('Pull up to load more...');
				this.scroll.minScrollY = -40;
				this.scroll.maxScrollY+=40;
				this.scroll.resetPosition(300);
			}
			if(this.$el.find('.pullUp').hasClass('loading')){
				this.$el.find('.pullUp').removeClass('loading');//.removeClass('bottomLoading');
				this.$el.find('.pullUpLabel').html('Pull Down to refresh...');
				this.scroll.maxScrollY += this.scroll.maxScrollY -this.maxScrollYOffset;
			}
			this.$el.translate(); // 加载完新数据要翻译
            if (this.scroll) {
				//this.caculateHeight();
            	//_.delay(function(view){ // view change maybe cost much time 
	               	if (this.scroll)
		            	this.scroll.refresh();
	    		//},500,this);
	        }
			console.log('已刷新完View');
		},
		onScrollRelease:function(){
			if(!this.topBound && !this.bottomBound)
				return;
			if(this.$el.find('.pullDown').hasClass('flip')){
				this.trigger('toprefresh');
				this.$el.find('.pullDown').removeClass('flip').addClass('loading');
				this.$el.find('.pullDownLabel').html('Loading.');
				this.scroll.minScrollY = 0;
				this.scroll.maxScrollY -=40;
				this.scroll.refresh();
			}
			if(this.$el.find('.pullUp').hasClass('flip')){
				this.trigger('bottomrefresh');
				this.$el.find('.pullUp').removeClass('flip').addClass('loading');//.addClass('bottomLoading');
				this.$el.find('.pullUpLabel').html('Loading.');
				this.scroll.maxScrollY = this.scroll.maxScrollY-this.maxScrollYOffset;
				this.scroll.refresh();
			}
		},
		showPullDownRefreshing:function(action){
			if(this.$el.find('.pullDown').hasClass('flip')){
				this.$el.find('.pullDown').removeClass('flip').addClass('loading');
				this.$el.find('.pullDownLabel').html('Loading.');
				this.scroll.minScrollY = 0;
				if(action){
					this.scroll.scrollTo(0, 0, 300);
				}
			}
		},
		showPullUpRefreshing:function(action){
			if(this.$el.find('.pullUp').hasClass('flip')){
				this.$el.find('.pullUp').removeClass('flip').addClass('loading');//.addClass('bottomLoading');
				this.$el.find('.pullUpLabel').html('Loading.');
				//this.scroll.maxScrollY = this.scroll.maxScrollY;
				this.scroll.maxScrollY = this.scroll.maxScrollY-this.maxScrollYOffset;
			}
		},
		onTopBound:function(isTopBound){
			if(!this.topBound)
				return;
            /*if(this.topBound){
	    		this.$el.find('.pullDown').show();
	        }*/
			if (this.$el.find('.pullDown').hasClass('loading')) {
				return;
			}
			if(isTopBound){
				this.$el.find('.pullDown').addClass('flip');
				this.$el.find('.pullDownLabel').html('Release to refresh...');
			}else{
				this.$el.find('.pullDown').removeClass('flip');
				this.$el.find('.pullDownLabel').html('Pull up to load more...');
			}
		},
		onBottomBound:function(isBottomBound){
			if(!this.bottomBound)
				return;
            if(this.bottomRefresh){
	    		this.$el.find('.pullUp').show();
	        }
			if (this.$el.find('.pullUp').hasClass('loading')) {
				return;
			}
			if(isBottomBound){
				this.$el.find('.pullUp').addClass('flip');
				this.$el.find('.pullUpLabel').html('Release to refresh...');
			}else{
				this.$el.find('.pullUp').removeClass('flip');
				this.$el.find('.pullUpLabel').html('Pull Down to refresh...');
			}
		},
		// abstract
		contentRender:function(){
			if(this.templateContent){
				this.$contentEl.html(this.templateContent());
			}
		},
		// abstract
		topbarRender:function(){
			if(this.templateTop){
				this.$topbarEl.html(this.templateTop());
			}
		},
		// abstract
		bottomRender:function(){
			if(this.templateBottom){
				this.$bottombarEl.html(this.templateBottom());
			}else{
				this.$bottombarEl.hide();
			}
		},
		getContentTopEl:function(){
			return this.$el.find('.scrollview_realcontent_top');
		},
		getContentBottomEl:function(){
			return this.$el.find('.scrollview_realcontent_bottom');
		},
		getContentEl:function(){
			return this.$el.find('.scrollview_realcontent');
		},
		getViewWrapBottomEl:function(){
			return this.$el.find('.scrollview_wrapper_bottom');
		},
		getViewWrapEl:function(){
			return this.$el.find('.scrollview_wrapper');
		},
		getTopbarEl:function(){
			return this.$el.find('.scrollview_topbar');
		},
		getBottomEl:function(){
			return this.$el.find('.scrollview_bottombar');
		},
		scrollToBottom:function(){
			if(this.scroll){
				this.scroll.scrollTo(0,this.scroll.maxScrollY);
			}
		},
		remove:function(){
			this.scrollDestroy();
	    	if (this.app) {
	    		delete this.app;
	    	}
	    	Backbone.ScrollView.__super__.remove.apply(this,arguments);
		}
	});
	return Backbone.ScrollView;
})
