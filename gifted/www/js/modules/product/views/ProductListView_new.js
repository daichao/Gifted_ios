define(['modules/product/templates/productlist_new','modules/product/templates/productlistitem','handlebars',
		'modules/product/models/models','countdown'], function(mod0, mod1) {
	var ProductListView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		template1:Handlebars.compile(mod1),
		topRefresh:true,
		bottomRefresh:true,
		//scrollClassName:'product_list_content',
	    // public
		events:{
			'tap .headbar_sign':'back',
			'tap .header_search':'openSearch',
			'tap .header_camera':'newProduct',
			'tap .header_refresh':'refreshPage',
			'tap .product_list_columns':'refreshImg',
			'tap .product_item_fav':'clickFav'
		},
	    // public
	    initialize:function (options) {
	    	ProductListView.__super__.initialize.apply(this,arguments);
	    	this.collection.on('sync error', this.completeLoading, this);
	    	this.collection.on('set', this.completeLoading, this);
	    	this.collection.on('clear', this.clearHTML, this);
	    	this.collection.on('refresh', this.onRefreshContent, this);
	    	this.collection.on('loaddata', _.bind(function(loadNew, start, count){ // 请求新数据
				this.loadData(loadNew, start, count);
	    	},this));
	    	this.collection.on('add', _.bind(function(model, collection, options){ // 绘制list
	    		var json = model.toJSON();
				this.paintList([json], options.at);
	    	},this));
	    	this.collection.on('reset', _.bind(function(){ // 绘制当前modellist
	    		this.clearHTML();
				this.paintList(this.collection.toJSON());
				this.trigger('refreshcontent');
	    	},this));
	    	this.collection.on('hasmoredata', _.bind(function(hasMore, loadNew){ // 绘制more|loading提示
            	this.paintHasMore(hasMore, loadNew);
	    	},this));
	    	this.app.settings.on('afterSwitchLanguage', _.bind(function(){
	    		this.refreshPage();
	    	},this));
	    	this.app.user.favorites.on('change',this.addFav,this);
	    	this.app.user.favorites.on('add',this.addFav,this);
	    	this.on('toprefresh',this.onTopRefresh,this);
	    	this.on('bottomrefresh',this.onBottomRefresh,this);
	    },
		onTopRefresh:function(){
			if (this.$el.find('.pullDown').hasClass('loading')) {
				return;
			}
			this.loadData(true,-1,0); // loadData->model.loadData->hasmoredata->refresh
		},
		onBottomRefresh:function(){
			if (this.$el.find('.pullUp').hasClass('loading')) {
				return;
			}
			this.loadData(false); // 使用当前页标记
		},
		completeLoading:function(){
			_.delay(_.bind(this.trigger,this,'loadComplete'),1000);
		},
		addFav:function(favModel){
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
    		var item = $(event.target).parents('.product_item');
    		var productID = item.attr('dataid');
    		var publisher = item.attr('createrid');
    		var favModel = this.app.user.favorites.getFavorite(productID);
    		if(favModel == undefined){//没有加载过改product的favorite记录
				if(this.app.checkRight({checkRule:['LOGIN']}))//只有登录过的才可能有favorite数据
					this.app.user.favorites.loadFavorites(productID);
			}else if(favModel.get('FAVORITING') == true){
				this.app.user.favorites.removeFavorite(productID,publisher);
				//alert(Gifted.Lang['removeFavoriteSuccess']);//TODO 此处应该在操作成功是操作
				$(event.target).removeClass("fav_on");
				Gifted.Global.alert(Gifted.Lang['removeFavoriteItemSuccess']);
			}else{
				this.app.user.favorites.addFavorite(productID,publisher);
				//alert(Gifted.Lang['addFavoriteSuccess']);//TODO 此处应该在操作成功是操作
				$(event.target).addClass("fav_on");
				Gifted.Global.alert(Gifted.Lang['addFavoriteItemSuccess']);
			}
	    },
		newProduct:function(event){
			this.app.navigate('product/new', {trigger:true,photo:true}); // 是否开启直接拍照功能
		},
	    // public
	    clearHTML:function(){
			this.$el.find('.product_item').remove();
	    },
	    // public
		clearStorage:function() { // 删除storage缓存
			this.collection.clearStorage();
		},
	    // public
		clearDatas:function() { // 删除model数据
			this.collection.clearDatas();
		},
		// public
		clearAllFiles:function() { // 删除所有图片缓存文件
			this.collection.clearAllFiles();
		},
	    // public
	    loadData:function(loadNew, start, count) {
	    	this.collection.loadData(loadNew, start, count); // model.loadData->hasmoredata->refresh
	    },
	    // public
	    loadInitData:function(loadNew) {
	    	this.collection.loadInitData(loadNew);
	    },
		refreshPage:function(event){
			this.clearAllFiles(); // 删除图片缓存
			this.clearStorage(); // 删除storage缓存
			this.clearDatas(); // 删除model数据和页标记
			this.loadData(null,-1,0); // loadData->model.loadData->hasmoredata->refresh
		},
		refreshImg:function(event){ // 点击图片刷新
			if (!$(event.target).is('.product_image')) 
				return;
			var src = $(event.target).attr('src');
			var href = $(event.target).parent().attr('href');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				//if (this.isScrolling==true)
					//return false;
				console.log('productlist image tap');
				window.location.href=href;
				return;
			}
			var productID = href.substring(16);
			var model = this.collection.get(productID);
			if (!model) 
				return;
			var json = model.toJSON();
			if (!json.PHOTOURLS || json.PHOTOURLS.length==0)
				return;
			var domImg = event.target;
			
			var cw=window.screen.width; // 没切换过来时宽度为0：this.$el.css('width');
			var h=cw;
			//cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
			cw=cw-20;
			//h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
			h=Math.round(h*4/5);
			if (cw<0)
				return ;
			//var r=json.PHOTOURLS[i].PHOTORADIO;
			//h=r?Math.round(cw/r):cw;
			Gifted.Cache.localFile(json.PHOTOURLS[0].PHOTOURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/80', //'/h/'+h+
				json.PHOTOURLS[0].PHOTOID+'_1_'+cw+'_'+h+'_80', //'_'+h+
				domImg); // remoteURL, imgID, domImg
			return true; // 图片刷新成功的标记
		},
		// private
	    paintList:function (jsonList, index) {	    	
	    	//这里需要根据当前产品列的高度计算当前产品应该放到哪个列上
			var d=this.$el.find('.product_list_columns');
			//if (loadNew) d.prepend(html); else d.append(html);
			var columnWidth = this.$el.find('.product_column_1').width(),
				columns = this.$el.find('.product_column:visible'),
				colHeights = [];
			columns.each(function(index,col){
				colHeights.push({
					dom:col,
					height:$(col).height()
				})				
			});
			var columnSelector = (function(colHeights){                                                                                                        
				return {
					getColumn:function(height){
						var col=_.min(colHeights,function(item){
							return item.height;
						});
						col.height+=height;
						return col.dom;
					}
				}
			})(colHeights);
			var cw, h, cs;
			cw=columnWidth;
			//h=cw;
			//cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
			cw=cw-20;
			//h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
			//h=Math.round(h*4/5);
			if (cw<0)
				return false;
			//json._maxListWidth=cw;
			//json._maxListHeight=h;
			/*var heightRule=Math.round(window.screen.height*3/5);
			if (h>heightRule) {
				h=heightRule;
			}*/
			var len=jsonList.length;
			var needLoadFavIds=[];
			for (var i=0;i<len;i++) { // 渲染dom
				var json=jsonList[i];
				needLoadFavIds.push(json.ID);
				if (!json)
					continue;
				if (!json.PHOTOURLS || json.PHOTOURLS.length<=0) 
					continue;
				cs=columnSelector;
				var r=json.PHOTOURLS[0].PHOTORADIO, 
				h=Math.round(cw/r);
				var heightRule=Math.round(window.screen.height*3/5);
				if (h>heightRule) {
					h=heightRule;
				}
				json._maxListWidth=cw;
				json._maxListHeight=h;
				var col=cs.getColumn(h);
				if (index==0 || index>0)
					$(col).prepend(this.template1(json));
				else
					$(col).append(this.template1(json));
				/*var c;
				if ((c=this.$el.find('.product_image_'+json.ID)) && c.length>0) {
					c[0].src=Gifted.Config.emptyImg;
					c.attr('class', 'product_image_empty');
				}*/
				// 描绘占位符
				/*var domImgs = this.$el.find('.product_image_'+json.ID); // (list以ProductID作为domID)
				if (domImgs.length==0)
					continue;
				var domImg = domImgs[0];
				var cw=json._maxListWidth, h=json._maxListHeight;
				$(domImg).css({width:cw,height:h}); // 占位符*/
				this.$el.find('.product_image_'+json.ID).css({width:cw,height:h});				
		 　	}
			if(needLoadFavIds.length>0){//延迟加载用户喜好
	    		Gifted.app.user.favorites.loadFavorites(needLoadFavIds.join("/"),_.bind(function(){
	    			jsonList.forEach(function(json){
	    				this.addFav(Gifted.app.user.favorites.getFavorite(json.ID));
	    	    	},this);	
	    		},this));
	    	}	 
		 	for (var i=0;i<len;i++) { // 延迟加载缓存图片
				var json = jsonList[i];
				if (!json)
					continue;
				if (!json.PHOTOURLS || json.PHOTOURLS.length<=0) 
					continue;
				_.defer(_.bind(function(json){
					var domImgs = this.$el.find('.product_image_'+json.ID); // (list以ProductID作为domID)
					if (domImgs.length==0)
						return;
					var domImg=domImgs[0];
					
					var cw=json._maxListWidth, h=json._maxListHeight;
					Gifted.Cache.localFile(json.PHOTOURLS[0].PHOTOURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
						json.PHOTOURLS[0].PHOTOID+'_1_'+cw+'_'+h+'_50', 
						domImg); // remoteURL, imgID, domImg
				},this,json));
		 　	}
		 	if(this.countdown){
		 		this.countdown.destroy();
		 		delete this.countdown;
		 	}
		 	this.countdown = this.$el.find('[data-time]').countdown();
	    },
	    // protected
	    paintHasMore:function(hasMore, loadNew) {
			if (!hasMore && !loadNew) {
				this.$el.find('.pullUp').removeClass('loading');
				this.$el.find('.pullUpLabel').html('No More.');
				this.$el.find('.pullUpIcon').removeClass('pullUpIcon');
				//this.$el.find('.product_last_row').css({height:100});
				//_.delay(function(v) {
	    		this.bottomBound = false;
				this.scroll.refresh();
				/*if (deviceIsAndroid) {
					this.$el.find('.product_column_1').append(this.template1({}));
					var container = this.$el.find('.product_column_1');
					var last = $(container.children()[container.children().length-1]);//.hide();
					last.find('.product_image').hide();
					last.find('.product_item_detail').hide();
					last.css({height:160,'text-align':'center','font-weight':'bold'}).html('No More');
					this.$el.find('.pullUp').hide();
				}*/
				//},500,this);
			}
	    },
		topbarRender:function(){
			this.$topbarEl.empty();
			this.$topbarEl.html(this.templateTop());
		},
		bottomRender:function(){
			this.$bottombarEl.hide();
		},
		contentRender:function(){
	    	this.$contentEl.empty();
	        this.$contentEl.html(this.templateContent([]));
	        
			//this.clearStorage(); // 不删除本地缓存
			this.clearDatas(); // 删除model数据
			this.loadInitData(); // 加载初始化缓存数据
			//this.loadData(null,-1,0); // 每次打开app都是加载最新的数据
			return this;
	    },
	    preventTap:function() {
    		/*this.isChanging=true;
        	_.delay(_.bind(function(){
        		this.isChanging=false;
        	},this),3000);*/
	    },
	    remove:function() {
	    	this.collection.off('loaddata');
	    	this.collection.off('refresh');
	    	this.collection.off('clear');
	    	this.collection.off('paint');
	    	this.collection.off('sync error');
	    	this.collection.off('add');
	    	this.collection.off('reset');
	    	this.collection.off('hasmoredata');
	    	this.app.settings.off('afterSwitchLanguage');
	    	this.app.user.favorites.off('change');
	    	this.app.user.favorites.off('add');
	    	this.off('toprefresh');
	    	this.off('bottomrefresh');
	    	if(this.countdown){
	    		this.countdown.destroy();
	    		delete this.countdown;
	    	}
	    	ProductListView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductListView;
})
