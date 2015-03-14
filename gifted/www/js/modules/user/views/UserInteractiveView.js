define(['modules/user/templates/userinteractive', 'handlebars','owl-carousel'],function(mod0){
	var UserInteractiveView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		templateInfoHead: Handlebars.compile(mod0.head),
		templateInfoproducts: Handlebars.compile(mod0.products),
		templateInteractive:Handlebars.compile(mod0.interactive),
		templateLinks: Handlebars.compile(mod0.links),
		topRefresh:true,
		bottomRefresh:false,
	    events:{
			'tap .headbar_sign':'back',
			
			"tap .follow":"addFollow",
			"tap .following":"removeFollow",
	    	
			"tap .userinteractive_contact":"openConversation",
			
	    	//'tap .userinteractive_other_img':'openOthers',
	    	'tap .userinteractive_userinfo':'openUserInfo',
	    	'tap .userinteractive_favorite':'openFavorite',
	    	'tap .userinteractive_changepwd':'openPassword',
			'tap .userinteractive_img':'openUserInfo',
			'tap .userinteractive_settings':'openSettings',
	    	//'tap .userinteractive_img':'openIM',
			
	    	//'click .userinteractive_other_img':'openOthers',
	    	'tap .userinteractive_openmoreproducts':'openMoreProducts',
	    	'tap .userinteractive_moreproducts':'openMoreProducts'
		},
		initialize: function () {
			UserInteractiveView.__super__.initialize.apply(this,arguments);
			this.model.on("change:following", this.refreshFollow, this);
			this.model.on("change:userInfo", this.refreshInfoHead, this);
			this.model.on("change:products", this.refreshProducts, this);
	    	this.on('toprefresh',this.onTopRefresh,this);
	    	this.on('bottomrefresh',this.onBottomRefresh,this);
	    },
	    loadData:function(reload) {
			this.model.loadData(reload);
	    },
	    openNativeIM:function(event){
	    	var token = this.app.user.get('IMTOKEN');
	    	Gifted.Plugin.messageUtil('startPrivateChat',[token, this.model.id, '光头强'],
				function(result){
				},
				function(result){
				});
	    },
		onTopRefresh:function(event){
			this.loadData(true); 
			//this.contentRender(); // by trigger
			_.delay(_.bind(this.trigger,this,'refreshcomplete'),1000);
		},
		openPassword:function(event){
			this.app.navigate("user/modifypassword", {trigger:true});
		},
		openUserInfo:function(event){
			this.app.navigate('user/userinfo/'+this.model.id, {trigger:true});
		},
	    openOthers:function(event) {
	    	console.log('openOthers');
			if (!$(event.target).is('.userinteractive_other_img') || $(event.target).is('.userinteractive_openmoreproducts')) 
				return;
			var src = $(event.target).attr('src');
			var href = $(event.target).parent().attr('href');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				window.location.href=href;
			}
	    },
	    openMoreProducts:function(event){
	    	var ignoreYXQ = this.model.id==this.app.user.get('ID');
	    	var subQuery = {CREATEUSER:this.model.id,__ignoreYXQ:ignoreYXQ};
	    	var title = this.model.get('userInfo').NAME + Gifted.Lang['productof'];
	    	this.app.navigate('product/search/publishedby/'+JSON.stringify(subQuery)+'/'+title, {trigger:true});
	    },
	    openFavorite:function(event){
	    	var userName = this.model.get('userInfo').NAME;
	    	var ignoreYXQ = this.model.id==this.app.user.get('ID');
	    	var subQuery = {__favoriteBy:this.model.id,__ignoreYXQ:ignoreYXQ}; // 这个人喜欢的
	    	var title = Gifted.Lang['userFavorite']+'('+userName+')';
	    	this.app.navigate('product/search/query/'+JSON.stringify(subQuery)+'/'+title, {trigger:true});
	    },
		openConversation:function(event){
			this.app.navigate('user/conversation/'+this.model.id, {trigger:true});
		},
		openSettings:function(event){
			this.app.navigate('settings', {trigger:true});
		},
		addFollow : function(){
			this.model.addFollow();
		},
		removeFollow : function(){
			this.model.removeFollow();
		},
		refreshFollow:function(){
			var html = this.templateInteractive(this.model.toJSON());
			this.$contentEl.find('.userinteractive_interactive').empty().html(html);
			if(this.model.get("following") == true){
				this.$el.find(".userinteractive_follow").addClass('following').removeClass('follow');
				this.$el.find('.userinteractive_follow').html(Gifted.Lang['Following'])
			}else if(this.model.get("following") == false){
				this.$el.find(".userinteractive_follow").addClass('follow').removeClass('following');
				this.$el.find('.userinteractive_follow').html(Gifted.Lang['FOLLOW'])
			}else{
				this.$el.find('.userinteractive_interactive').empty();
			}
			this.$contentEl.translate();
		},
		refreshInfoHead:function(){
			var html = this.templateInfoHead(this.model.toJSON());
			this.$contentEl.find('.userinteractive_head').empty().html(html);
			this.$el.find('.userinteractive_position').html(
					"&nbsp;&nbsp;("+Math.round(Gifted.Config.Position.latitude)
						+","+Math.round(Gifted.Config.Position.longitude)
						+","+Math.round(Gifted.Config.Position.altitude)+")&nbsp;&nbsp;"
				);
			//if(this.$el.find('.userinteractive_publishedby').size()>0)
			this.refreshLinks();
			//this.refreshTopbar();
			this.paintImage();
			this.$contentEl.translate();
		},
		/*refreshTopbar : function(){
			var html = this.templateTop(this.model.toJSON());
			this.$topbarEl.html(html);
			this.$topbarEl.translate();
		},*/
		refreshLinks : function(){
			var links = this.templateLinks(this.model.toJSON());
			this.$contentEl.find('.userinteractive_infolinks').html(links);
			this.$contentEl.translate();
		},
		refreshProducts:function(){
			var products = this.model.get('products');
			if(!products || products.length==0){
				return;
			}
			if (products[0].PHOTOID=='placeholder') {
				return;
			}
			this.$el.find('.userinteractive_other_img').off('touchstart touchend');
			this.$el.find('.owl-carousel').off('touchstart');
        	this.removeOWLCanvas();
			var html = this.templateInfoproducts(this.model.toJSON());
			this.$contentEl.find('.userinteractive_product').empty().html(html);
			// 明细图片
        	if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
	        	this.$el.find('.canvascarousel').carouseldestroy();
				var cw=this.$el.css('width'), h=cw;
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
		        this.$el.find('.canvascarousel').css({width:cw,height:h});
		        this.$el.find('.canvascarousel').carousel({mouseOnly:Gifted.Config.isCanvasCarouelDebug});
	        } else {
	        	{
			        this.$el.find('.userinteractive_product').owlCarousel({
			            navigation:false, // Show next and prev buttons
			            //items:otherProductLength>3?3:otherProductLength,
			            //itemsTablet: [600,otherProductLength>3?3:otherProductLength],
			            items:2,
			            itemsTablet:[600,2],
			            itemsMobile:false
			        });
					// 获取所有的carousel实例
			        //this.owl = this.$el.find('.userinteractive_product').data('owlCarousel');
		        }
			    // 禁止左拉菜单 应该拉到最左边还继续swiperight则执行backHome
		        //this.$el.find('.owl-carousel').off('swipeleft swiperight');
//		        this.$el.find('.owl-carousel').on('swipeleft swiperight', function(event) {
//		        	 event.stopPropagation();
//		        	 event.preventDefault();
//		        });
		        this.$el.find('.owl-carousel').on('touchstart', function(event) {
//		        	console.log('touchstart1');
		        	 event.stopPropagation();
		        	 event.preventDefault();
		        });
//		        this.$el.find('.owl-carousel')[0].addEventListener('touchstart',function(event){
//		        	console.log('touchstart1');
//		        	event.stopPropagation();
//		        })
//		        this.delegateEvents();
		        this.$el.find('.userinteractive_other_img').on('touchstart touchend',_.bind(function(event){
		        	if(event.type=="touchstart"){
		        		this.lastTapTime = event.timeStamp;
		        		this.lastTarget = event.target;
		        	}
		        	if(event.type=='touchend'){
		        		if(event.timeStamp-this.lastTapTime<100){
		        			this.openOthers(event);
		        		}
		        	}
		        },this));
//		        this.$el.find('.userinteractive_other_img').on('tap',_.bind(this.openOthers,this));
	        }
		},
		paintImage : function() {
			var userInfo = this.model.get('userInfo');
			if (!userInfo) {
				return;
			}
			var userID = userInfo['ID'];
			var portrait = userInfo['PORTRAIT'];
			if (portrait) {
				var domImg = this.$el.find('.userinteractive_img')[0], cw=h=80;
				Gifted.Cache.localFile(portrait+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'userportrait_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg); // remoteURL, imgID, domImg, callback, override
			}
		},
		contentRender:function(){
			var html = this.templateContent(this.model.toJSON());
			this.$contentEl.empty().html(html);
			this.refreshFollow();
			this.refreshInfoHead();
			this.refreshProducts();
		},
	    remove:function(){
			this.model.off("change:following", this.refreshFollow, this);
			this.model.off("change:userInfo", this.refreshInfoHead, this);
			this.model.off("change:products", this.refreshProducts, this);
			this.$el.find('.owl-carousel').off('touchstart');
			this.$el.find('.userinteractive_other_img').off('touchstart touchend');
	    	UserInteractiveView.__super__.remove.apply(this, arguments);
	    }
	});
	return UserInteractiveView;
	
});
