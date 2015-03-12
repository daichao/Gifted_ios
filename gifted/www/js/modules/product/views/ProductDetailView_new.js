define(['modules/product/templates/productdetail_new','handlebars',
		'modules/product/models/models','countdown',
		(Gifted.Config.isCanvasCarouel?'canvascarousel':'owl-carousel')], function(tpl) {
	var ProductDetailView = Gifted.View.extend({
		templateTop:Handlebars.compile(tpl.top),
		templateContent:Handlebars.compile(tpl.content),
		templatePublisher:Handlebars.compile(tpl.publisher),
		templatePublisher2:Handlebars.compile(tpl.publisher2),
		templateOthers:Handlebars.compile(tpl.others),
		topRefresh:true,
		bottomRefresh:false,
		swipeLeftBackHome:true,
	    //publisher:this.model.publisher,
//	    events:{'swipeleft .ow-carousel':'onSwipe',
//	    	'swiperight .ow-carousel':'onSwipe'
//	    events:{'swipeleft .ow-carousel':'onSwipe',
//	    	'swiperight .ow-carousel':'onSwipe'
//	    },
	    events:{
	    	'tap .headbar_sign':'back',
	    	'tap .header_edit':'openEdit',
	    	'tap .header_search':'openSearch',
	    	'tap .header_share':'doShare',
			'tap .header_refresh':'refreshPage',
			'tap .publisher_position': 'openMap',
	    	'tap .publisher_email':'openLink',
	    	'tap .publisher_mobile':'openLink',
	    	'tap .publisher_conversation':'openConversation',
	    	'tap .publisher_zoomup':'zoomUp',
	    	'tap .product_detail_content':'refreshImg',
	    	'tap .product_detail_publisher':'openUserInteractiveView',
	    	'tap .product_detail_itemfav':'clickFav',
	    	'tap .product_detail_others':'openOthers',
	    	'tap .product_detail_openmoreproducts':'openMoreProducts'
	    },
	    initialize: function () {
	    	ProductDetailView.__super__.initialize.apply(this,arguments);
	    	this.model.on('sync error', this.completeLoading, this);
	    	this.model.on("sync", this.render, this);
	    	//this.model.on("synccache", this.renderCache, this);
	    	//this.model.on("refresh", this.refresh, this);
	    	this.app.user.on('change:RIGHTS',this.doPaintUser,this);
	    	this.app.user.favorites.on('favoritechange:' + this.model.get('ID'),this.addFav,this);
	    	this.on('toprefresh',this.onTopRefresh,this);
	    	this.on('bottomrefresh',this.onBottomRefresh,this);
	    },
		onTopRefresh:function(){
			//this.clearCache();
			//this.loadData(true);
			this.refreshPage();
		},
		onBottomRefresh:function(){
			//this.loadData(false);
		},
		completeLoading:function(){
			_.delay(_.bind(this.trigger,this,'refreshcomplete'),1000);
		},
	    addFav:function(favModel){
			var productId = favModel.get('PRODUCTID');
			var favoriting = favModel.get('FAVORITING');
			var productId = favModel.get('PRODUCTID');
			if(favoriting == true){
				this.$el.find(".fav_"+productId).addClass("fav_on");
			}else{
				this.$el.find(".fav_"+productId).removeClass("fav_on");
			}
		},
	    clickFav:function(event) {
			if(!this.app.checkRight({checkRule:['LOGIN']}))
    			return;
    		var productID = this.model.id;
    		var publisher = this.model.get('CREATEUSER');
    		var favModel = this.app.user.favorites.getFavorite(productID);
    		if(favModel == undefined){//没有加载过改product的favorite记录
				if(this.app.checkRight({checkRule:['LOGIN']}))//只有登录过的才可能有favorite数据
					this.app.user.favorites.loadFavorites(productID);
			}else if(favModel.get('FAVORITING') == true){
				this.app.user.favorites.removeFavorite(productID,publisher);
				//alert(Gifted.Lang['removeFavoriteSuccess']);//TODO 此处应该在操作成功是操作
				$(event.target).removeClass("fav_on");
			}else{
				this.app.user.favorites.addFavorite(productID,publisher);
				//alert(Gifted.Lang['addFavoriteSuccess']);//TODO 此处应该在操作成功是操作
				$(event.target).addClass("fav_on");
			}
			event.stopPropagation();
	    	event.preventDefault();
	    },
	    doShare:function(event){
	    	_.debounce(_.bind(function(){
    			var url = '\"<a href="'
    				+'http://www.5proapp.com' //+Gifted.Config.serverURL
    				+"/www/index.html#product/detail/"+this.model.get('ID')+'">'
    				+this.model.get('NAME')+'</a>\"';
    			Gifted.Plugin.socialSharing('share', ['Share a Awesome Product,', 'Gifted', null, url]);
	    	},this),300)();
	    },
	    openMap:function(event){
	    	navigate.app.loadUrl('http://www.google.com/maps/@'+$(event.target).html());
	    	//http://www.google.com/maps/@33.9546705,121.9839866
	    },
	    openUserInteractiveView:function(){
	    	this.app.navigate('user/userinteractive/'+this.model.get('CREATEUSER'), {trigger:true});
	    },
	    openMoreProducts:function(event){
	    	//var ignoreYXQ = Gifted.app.user.ID==this.model.get('CREATEUSER');
	    	var subQuery = {CREATEUSER:this.model.get('CREATEUSER')}; // ,__ignoreYXQ:ignoreYXQ
	    	var title = this.$el.find('.product_detail_publishedby').html();
	    	this.app.navigate('product/search/publishedby/'+JSON.stringify(subQuery)+'/'+title, {trigger:true});
	    },
	    openEdit:function(event) {
	    	this.app.navigate('product/modify/'+this.model.get('CREATEUSER')+'/'+this.model.get('ID'), {trigger:true});
	    },
	    openConversation:function(event){
	    	this.app.navigate('user/conversation/'+this.model.get('CREATEUSER')+'/'+this.model.get('ID'), {trigger:true});
	    },
	    openOthers:function(event) {
			if (!$(event.target).is('.product_detail_otherimage') || $(event.target).is('.product_detail_openmoreproducts')) 
				return;
			var src = $(event.target).attr('src');
			var href = $(event.target).parent().attr('href');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				window.location.href=href;
			}
	    },
	    getImageURLs:function(event) {
			var json = this.model.toJSON();//this.model.loadCacheItem(productID);
			if (!json) {
				return [];
			}
	    	return json.PHOTOURLS;
	    },
		zoomUp:function(event){
			this.app.navigate('imagebrowser', {trigger:true});
		},
		refreshPage:function(event){
			this.clearCache();
			this.loadData(true);
		},
	    refreshImg:function(event) {
			if (!$(event.target).is('.product_image')) {
				if (Gifted.Util.isFullScreen())
					Gifted.Util.fullScreenCancel();
				return false;
			}
			var src = $(event.target).attr('src');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				this.app.navigate('imagebrowser', {trigger:true});
				//Gifted.Util.fullScreenToggle(event.target);
				return false;
			}
			var json = this.model.toJSON();//this.model.loadCacheItem(productID);
			if (json) {
				var domImg = event.target;
				var i = Number($(domImg).attr('index'));
				//var r=json.PHOTOURLS[i].PHOTORADIO;
				var cw=this.$el.css('width'), h=cw;
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
				h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
				h=h*2/3;
				//h=r?Math.round(cw/r):cw;
				//$(domImg).css({'width':cw,'height':h});
				//$(domImg).attr({'index':i});
				Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView/1/w/'+cw+'/h/'+h+'/q/80', //'/h/'+h+
					json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_'+h+'_80', //'_'+h+
					domImg); // remoteURL, imgID, domImg
				return true; // 图片刷新成功的标记
			}
			return false;
	    },
	    doPaint:function(json, placeholder) {
        	var len = json.PHOTOURLS.length;
        	for (var i=0;i<len;i++) {
		        var domImgs = this.$el.find('.product_image_'+json.PHOTOURLS[i].PHOTOID);
        		if (domImgs.length==0)
        			continue;
				var domImg = domImgs[0];
				//var r=json.PHOTOURLS[i].PHOTORADIO;
				var cw=this.$el.css('width'), h=cw;
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
				h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
				h=h*2/3;
				//h=r?Math.round(cw/r):cw;
				$(domImg).css({'width':cw,'height':h});
				$(domImg).attr({'index':i});
				/*if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
					$(domImg).hide();
				}*/
				if (placeholder) 
					continue;
				Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView/1/w/'+cw+'/h/'+h+'/q/80', //'/h/'+h+
					json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_'+h+'_80', //'_'+h+
					domImg); // remoteURL, imgID, domImg
        	}
		},
		doPaintEffects:function() {
    		//var func=_.bind(function(){ // 延迟加载图片和其他信息
        	if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
	        	this.$el.find('.canvascarousel').carouseldestroy();
				var cw=this.$el.css('width'), h=cw;
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
		        this.$el.find('.canvascarousel').css({width:cw,height:h});
		        this.$el.find('.canvascarousel').carousel({mouseOnly:Gifted.Config.isCanvasCarouelDebug});
	        } else {
	        	{
			        this.$el.find('.product_item_images').owlCarousel({
			            navigation:false,
			            singleItem:true,
			            slideSpeed:300,
			            paginationSpeed:400
			        });
				    /*var imgs = this.$el.find('.product_item_images img');
			        imgs.show();
					imgs.height(imgs.width()*2/3);*/
			        // 获取所有的carousel实例
			        this.owl = this.$el.find('.product_item_images').data('owlCarousel');
		        }
		        { // 明细图片
			       	this.$el.find('.product_detail_others').owlCarousel({
			            navigation:false, // Show next and prev buttons
			            //items:otherProductLength>3?3:otherProductLength,
			            //itemsTablet: [600,otherProductLength>3?3:otherProductLength],
			            items:2,
			            itemsTablet:[600,2],
			            itemsMobile:false
			        });
			        /*var imgs = this.$el.find('.product_detail_others img');
					imgs.show();
					imgs.height(imgs.width());*/
		       		// 获取所有的carousel实例
					this.otherProductOwl = this.$el.find('.product_detail_others').data('owlCarousel');
		        }
		        // 禁止左拉菜单 应该拉到最左边还继续swiperight则执行backHome
		        this.$el.find('.owl-carousel').off('swipeleft swiperight');
		        this.$el.find('.owl-carousel').on('swipeleft swiperight', function(event) {
		        	 event.stopPropagation();
		        	 event.preventDefault();
		        });
		        //this.$el.find('.owl-carousel').on('touchstart',function(event){
		        //	 event.stopPropagation();
//		        	 event.preventDefault();
		        //});
		    }
        	//},this);
        	//_.defer(func);
	    },
		doPaintUser:function(event) {
			var productID = this.model.get("ID");
	        var publisher = this.model.get("CREATEUSER");
	        var loginUserID = this.app.user.get('ID');
	        if (loginUserID==publisher) { // editable
	        	this.$el.find('.header_edit').show();
	        } else {
	        	this.$el.find('.header_edit').hide();
	        }
			var favModel = this.app.user.favorites.getFavorite(productID);
			if(favModel == undefined){//没有加载过改product的favorite记录
				if(this.app.checkRight({trigger:false,checkRule:['LOGIN']}))//只有登录过的才可能有favorite数据
					this.app.user.favorites.loadFavorites(productID);
			}else if(favModel.get('FAVORITING') == true){
				this.$el.find(".fav_"+productID).addClass("fav_on");
			}
		},
		topbarRender:function(){
			this.$topbarEl.empty();
			this.$topbarEl.html(this.templateTop());
		},
		bottomRender:function(){
			this.$bottombarEl.hide();
		},
		/*scrollRender:function() {
	        ProductDetailView.__super__.scrollRender.call(this);
	        this.scroll.off('refresh');
			this.scroll.on('refresh',_.bind(function() {
				console.log('refresh:'+window.location.href);
			},this));
	        this.scroll.off('scrollEnd');
			this.scroll.on('scrollEnd',_.debounce(_.bind(function() {
				if (this.scroll.y==0 && this.scroll.distY>200) { // 在最上页并且往下拉动超过N
					//var pullDownEl = this.$el.find('.scroll_pullDown'); //$('#productList-pullDown')[0];
					this.refreshPage();
				} 
				//else if (this.scrolly<-(this.scroll.scrollerHeight-200) && this.scroll.distY<-200) {
				//else if (this.scroll.y<=(this.scroll.maxScrollY+screen.height*2) && this.scroll.distY<-50) { // 上拉距离100像素
				//	//var pullUpEl = this.$el.find('.scroll_pullUp'); //$('#productList-pullDown')[0];
				//} 
			},this),200));
		},*/
		contentRender:function(){
		    this.$el.find('.owl-carousel').off('swipeleft swiperight');
		    this.$el.off('swiperight');
	    	if (this.owl) {//当前产品的图片控件
				this.owl.destroy();
				delete this.owl;
			}
	    	if(this.otherProductOwl){//其他产品的图片控件
				this.otherProductOwl.destroy();
				delete this.otherProductOwl;
	    	}
	    	if(this.countdown){
	    		this.countdown.destroy();
	    		delete this.countdown;
	    	}
	    	var json = this.model.toJSON();
	    	var name = json.NAME;
	    	if (name && name.length>14) {
	    		name = name.substring(0, 14)+'...';
	    	}
	    	this.$el.find('.header_mid').html(name);
	        this.$contentEl.empty().html(this.templateContent(json));
	        this.getContentBottomEl().html('&nbsp;');
			this.$el.find('.product_detail_publisher').empty().html(this.templatePublisher(json));
			this.$el.find('.product_detail_publisher2').empty().html(this.templatePublisher2(json));
			this.$el.find('.product_detail_others').empty().html(this.templateOthers(json));
	        if (json.PHOTOURLS && json.PHOTOURLS.length>0) {
        		this.doPaint(json, false);
        		this.doPaintEffects(); // 渲染dom占位符特效
	        } 
			this.doPaintUser();
		 	this.countdown = this.$el.find('[data-time]').countdown();
//		 	this.$el.on('swiperight',_.bind(function(event){
//		 		if(event.swipestart.coords[0]<40){
//		        	event.stopPropagation();
//		        	event.preventDefault();
//			 		this.back();
//		 		}
//		 	},this));
	        return this;
	    },
	    preventTap:function() {
    		/*this.isChanging=true;
        	_.delay(_.bind(function(){
        		this.isChanging=false;
        	},this),3000);*/
	    },
	    // public
		clearCache:function() {
			var json = this.model.toJSON();////this.model.loadCacheItem(productID);
			if (!json) 
				return false;
			if (!json.PHOTOURLS)
				return false;
        	var len = json.PHOTOURLS.length;
			for (var i=0;i<len;i++) {
				if (!json.PHOTOURLS[i]) 
					continue;
				var cw=this.$el.css('width');
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
				var fileID = json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_80';
				Gifted.Cache.deleteLocalFile(fileID);
        	}
		},
		loadData:function(refresh){
			var id = this.model.get('ID');
			if (!id) {
				return;
			}
			this.model.loadDetailItem(id, refresh);  // 触发了sync->render(画完整的数据)
		},
//	    onSwipe:function(event){
//	       	 event.stopPropagation();
//	    	 event.preventDefault();
//	    },
	    remove:function(){
	    	this.model.off('sync error');
	    	this.model.off("sync");
	    	//this.model.off("synccache");
	    	//this.model.off("refresh");
	    	this.stopListening(this.model);
	    	this.app.user.off('change:RIGHTS',this.doPaintUser,this);
	    	this.app.user.favorites.off('favoritechange:' + this.model.get('ID'),this.addFav,this);
	    	if(this.countdown){
	    		this.countdown.destroy();
	    		delete this.countdown;
	    	}
	    	this.off('toprefresh');
	    	this.off('bottomrefresh');
	    	this.$el.off('swiperight');
        	if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
	        	this.$el.find('.canvascarousel').carouseldestroy();
        	}else{
		    	this.$el.find('.owl-carousel').off('swipeleft swiperight');
		    	if (this.owl) {
					this.owl.destroy();
					delete this.owl;
				}
        	}
	    	if(this.otherProductOwl){
	    		this.otherProductOwl.destroy();
	    		delete this.otherProductOwl;
	    	}
	    	delete this.model;
	    	ProductDetailView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductDetailView;
});
//<button onclick="window.plugins.socialsharing.share('Message only')">message only</button>
//<button onclick="window.plugins.socialsharing.share('Message and subject', 'The subject')">message and subject</button>
// <button onclick="window.plugins.socialsharing.share(null, null, null, 'http://www.x-services.nl')">link only</button>
// <button onclick="window.plugins.socialsharing.share('Message and link', null, null, 'http://www.x-services.nl')">message and link</button>
// <button onclick="window.plugins.socialsharing.share(null, null, 'https://www.google.nl/images/srpr/logo4w.png', null)">image only</button>
// <button onclick="window.plugins.socialsharing.share('Message and image', null, 'https://www.google.nl/images/srpr/logo4w.png', null)">message and image</button>
//<button onclick="window.plugins.socialsharing.share('Message, image and link', null, 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, image and link</button>
// <button onclick="window.plugins.socialsharing.share('Message, subject, image and link', 'The subject', 'https://www.google.nl/images/srpr/logo4w.png', 'http://www.x-services.nl')">message, subject, image and link</button>