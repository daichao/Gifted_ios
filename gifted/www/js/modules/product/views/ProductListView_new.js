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
	    initialize:function (options) {
	    	ProductListView.__super__.initialize.apply(this,arguments);
	    	this.collection.on('loaddata', _.bind(function(loadNew){ // 请求新数据
				this.loadData(loadNew);
	    	},this));
	    	//this.collection.on('refresh', this.refresh, this));
	    	this.collection.on('sync error', this.completeLoading, this);
	    	this.collection.on('set', this.completeLoading, this);
	    	this.collection.on('clear', this.clearHTML, this);
	    	this.collection.on('add', _.bind(function(model, collection, options){ // 绘制list
	    		var json = model.toJSON();
				this.paintList([json], options.at);
	    	},this));
	    	this.collection.on('reset', _.bind(function(){ // 绘制当前modellist
	    		this.clearHTML();
				this.paintList(this.collection.toJSON());
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
	    // public
		events:{
			'tap .headbar_sign':'openNavigate',
			'tap .header_search':'openSearch',
			'tap .header_camera':'newProduct',
			'tap .header_refresh':'refreshPage',
			'tap .product_list_columns':'refreshImg',
			'tap .product_item_fav':'clickFav'
		},
		onTopRefresh:function(){
			this.clearFlag();
			this.loadData(true); // loadData->model.loadData->hasmoredata->refresh
		},
		onBottomRefresh:function(){
			this.loadData(false);
		},
		completeLoading:function(){
			_.delay(_.bind(this.trigger,this,'refreshcomplete'),1000);
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
			}else{
				this.app.user.favorites.addFavorite(productID,publisher);
				//alert(Gifted.Lang['addFavoriteSuccess']);//TODO 此处应该在操作成功是操作
				$(event.target).addClass("fav_on");
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
		clearCache:function() {
			this.collection.clearCache();
		},
	    // public
		clearFlag:function() {
			this.collection.clearFlag();
		},
	    // public
	    loadData:function(loadNew) {
	    	this.collection.loadData(loadNew); // model.loadData->hasmoredata->refresh
	    },
	    // public
	    loadInitData:function(loadNew) {
	    	this.collection.loadInitData(loadNew);
	    },
		refreshPage:function(event){
			Gifted.Cache.deleteAllLocalFile(); // 删除缓存图片
			this.clearCache();
			this.loadData(); // loadData->model.loadData->hasmoredata->refresh
		},
		refreshImg:function(event){ // 点击图片刷新
			if (!$(event.target).is('.product_image')) 
				return false;
			var src = $(event.target).attr('src');
			var href = $(event.target).parent().attr('href');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				//if (this.isScrolling==true)
					//return false;
				console.log('productlist image tap');
				window.location.href=href;
				return false;
			}
			var productID = href.substring(9);
			var json = this.collection.loadCacheItem(productID);
			if (json) {
				var domImg = event.target;
				//var r=json.PHOTOURLS[i].PHOTORADIO;
				var cw=$(event.target).css('width'), h=$(event.target).css('height');
				cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
				h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
				//h=r?Math.round(cw/r):cw;
				Gifted.Cache.localFile(json.PHOTOURLS[0].PHOTOURL+'?imageView/1/w/'+cw+'/h/'+h+'/q/50',  
					json.PHOTOURLS[0].PHOTOID+'_1_'+cw+'_'+h+'_50', 
					domImg); // remoteURL, imgID, domImg
				return true; // 图片刷新成功的标记
			}
			return false;
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
			var len=jsonList.length;
			for (var i=0;i<len;i++) { // 渲染dom
				var json = jsonList[i];
				if (json == null)
					continue;
				if (json.PHOTOURLS && json.PHOTOURLS.length>0) {
					var r=json.PHOTOURLS[0].PHOTORADIO, cw=columnWidth, h=Math.round(cw/r), cs=columnSelector;
					json.realWidth = cw-16;
					json.realHeight = h;
					var col = cs.getColumn(h);
					if (index==0 || index>0)
						$(col).prepend(this.template1(json));
					else
						$(col).append(this.template1(json));
				} else{
					var c, cw=columnWidth, h=cw, cs=columnSelector;
					json.realWidth = cw-16;
					json.realHeight = h;
					var col = cs.getColumn(h);
					if (index==0 || index>0)
						$(col).prepend(this.template1(json));
					else
						$(col).append(this.template1(json));
					if ((c=this.$el.find('.product_image_'+json.ID)) && c.length>0) {
						c[0].src=Gifted.Config.emptyImg;
						c.attr('class', 'product_image_empty');
					}
				}
				// 描绘占位符
				var domImgs = this.$el.find('.product_image_'+json.ID); // (list以ProductID作为domID)
				if (!domImgs || domImgs.length==0)
					continue;
				var domImg = domImgs[0];
				var cw = json.realWidth, h = json.realHeight;
				$(domImg).css({width:cw,height:h});
		 　	}
		 	for (var i=0;i<len;i++) { // 延迟加载缓存图片
				var json = jsonList[i];
				if (json == null)
					continue;
				if (json.PHOTOURLS && json.PHOTOURLS.length>0) {
					var func=_.bind(function(json){
						var domImgs = this.$el.find('.product_image_'+json.ID); // (list以ProductID作为domID)
						if (!domImgs || domImgs.length==0)
							return;
						var domImg = domImgs[0];
						var cw = json.realWidth, h = json.realHeight;
						Gifted.Cache.localFile(json.PHOTOURLS[0].PHOTOURL+'?imageView/1/w/'+cw+'/h/'+h+'/q/50',  
							json.PHOTOURLS[0].PHOTOID+'_1_'+cw+'_'+h+'_50', 
							domImg); // remoteURL, imgID, domImg
					},this,json);
	        		_.defer(func);
				}
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
	    		this.bottomBound = false;
	      		this.scroll.refresh();
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
			this.clearCache();
			this.loadInitData();
			//this.loadData(); // 每次打开app都是加载最新的数据
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
