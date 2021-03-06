define(['modules/portal/templates/imagebrowser', 'handlebars',
		(Gifted.Config.isCanvasCarouel?'canvascarousel':'owl-carousel')],function(mod0){
	var ImageBrowser = Gifted.View.extend({
		//templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		//templateBottom:Handlebars.compile(mod0.bottom),
		topRefresh:false,
		bottomRefresh:false,
		urls:[],
	    events:{
			"tap .headbar_sign":"back",
			"tap .scrollview_content":"back"
		},
	    initialize: function() {
	    	ImageBrowser.__super__.initialize.apply(this, arguments);
	    },
	    setImageURLs:function(urls) {
	    	this.urls = urls||[];
	    },
	    refreshImg:function(event) {
			if (!$(event.target).is('.imageview_image')) {
				//if (Gifted.Util.isFullScreen())
				//	Gifted.Util.fullScreenCancel();
				return false;
			}
			var src = $(event.target).attr('src');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				//Gifted.Util.fullScreen(event.target);
				return false;
			}
			var cw=window.screen.width; // 没切换过来时宽度为0：this.$el.css('width');
			//var h=cw;
			//cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
			//cw=cw-20;
			//h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
			//h-=50;
			var json = {PHOTOURLS:this.urls};
			if (json) { 
				var domImg = event.target;
				var i = Number($(domImg).attr('index'));
				
				//var r=json.PHOTOURLS[i].PHOTORADIO;
				//h=r?Math.round(cw/r):cw;
				//$(domImg).css({'width':cw,'height':h});
				//$(domImg).css({'width':cw});
				//$(domImg).attr({'index':i});
				//if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
				//	$(domImg).hide();
				//}
				Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView2/1/w/'+cw+'/q/80', //'/h/'+h+
					json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_80', //'_'+h+
					domImg); // remoteURL, imgID, domImg
				return true; // 图片刷新成功的标记
			}
			return false;
	    },
	    doPaint:function(json, placeholder) {
			var cw=window.screen.width; // 没切换过来时宽度为0：this.$el.css('width');
			//var h=cw;
			//cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
			//cw=cw-20;
			//h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
			//h-=50;
	    	//if (placeholder) {
			//	this.$el.find('.product_image_0').css({'width':cw,'height':h});
	    	//	return;
	    	//} 
    		//this.$el.find('.product_image_0').remove();
        	var len = json.PHOTOURLS.length;
        	for (var i=0;i<len;i++) {
		        var domImgs = this.$el.find('.imageview_'+json.PHOTOURLS[i].PHOTOID);
        		if (domImgs.length==0)
        			continue;
				var domImg = domImgs[0];
				
				var r=json.PHOTOURLS[i].PHOTORADIO;
				h=r?Math.round(cw/r):cw;
				$(domImg).css({'width':cw});
				$(domImg).attr({'index':i});
				//if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
				//	$(domImg).hide();
				//}
				json._maxBrowserWidth=cw;
				json._maxBrowserHeight=Math.max(h,json._maxBrowserHeight||0);
				//if (placeholder) // 占位符不加载图片
				//	continue;
				Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView2/1/w/'+cw+'/q/80', //'/h/'+h+
					json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_80', //'_'+h+
					domImg); // remoteURL, imgID, domImg
        	}
		},
		doPaintEffects:function() {
			return;
	    	this.$el.find('.imageview_images').addClass(Gifted.Config.isCanvasCarouel?'canvascarousel':'owl-carousel');
        	if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
	        	this.$el.find('.canvascarousel').carouseldestroy();
		        //this.$el.find('.canvascarousel').css({width:cw,height:h});
		        this.$el.find('.canvascarousel').carousel({mouseOnly:Gifted.Config.isCanvasCarouelDebug});
	        } else {
	        	{
			        this.$el.find('.imageview_images').owlCarousel({
			            navigation:false, // Show next and prev buttons
			            singleItem:true,
			            slideSpeed:300,
			            paginationSpeed:400
			        });
			        // 获取所有的carousel实例
			        this.owl = this.$el.find('.imageview_images').data('owlCarousel');
		        }
		        // 禁止左拉菜单 应该拉到最左边还继续swiperight则执行back
		        this.$el.find('.owl-carousel').off('swipeleft swiperight');
		        this.$el.find('.owl-carousel').on('swipeleft swiperight', function(event) {
		        	 event.stopPropagation();
		        	 event.preventDefault();
		        });
		        this.$el.find('.owl-carousel').on('touchstart',function(event){
		        	 event.stopPropagation();
	//		        	 event.preventDefault();
		        });
		    }
	    },
	    contentRender:function(){
        	this.removeOWLCanvas();
			var json = {PHOTOURLS:this.urls};
	        this.$contentEl.empty().html(this.templateContent(json));
	        if (this.urls && this.urls.length>0) {
        		this.doPaint(json, false);
        		this.doPaintEffects(); // 渲染dom占位符特效
	        }
		    this.$el.off('swiperight');
	        this.$el.find('.scrollview_topbar').hide();
	        this.$el.find('.scrollview_content').css({'background-color':'#363636','height':window.screen.height});
	        return this;
	    },
	    remove:function(){
	    	this.off('toprefresh');
	    	this.off('bottomrefresh');
        	this.removeOWLCanvas();
	    	ImageBrowser.__super__.remove.apply(this, arguments);
	    }
	});
	return ImageBrowser;
});
