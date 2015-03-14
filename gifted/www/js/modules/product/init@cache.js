define(['modules/product/models/models'
	,'css!modules/product/styles/productinit.css' // product全局
	,deviceIsIOS?'css!../../../css/styles-ios.css':'css!../../../css/styles-android.css'],function(){
    var products = new ProductCachedCollection(); // 当前模块全局共享
	var result = new (function(){
		this.dependents=['user', 'portal'];
		this.detailViewCache = [];
		this.init = function(app){
        	this.app = app;
        	app.route('','home');
        	app.route('home','home');
        	app.route('product/new','productnew');
        	app.route('product/modify/:publisher/:id','productmodify');
        	app.route('product/detail/:id','productdetail');
        	app.route('product/catalog','productopencatalog');
        	app.route('product/choosecatalog','productchoosecatalog');
        	app.route('product/search/catalog/:catalog/:title','productsearchcatalog');
        	app.route('product/search/query/:json/:title','productqueryjson');
        	app.route('product/search/publishedby/:json/:title','productpublishedby');
        	//app.route('product/backnew','productbacknew');
        	//app.route('product/photo','productphoto');
        	//app.route('product/description','productdescription');
        	app.on('route:home',this.home,this);
        	app.on('route:productdetail',this.productDetail,this);
        	app.on('route:productmodify',this.productModify,this);
        	app.on('route:productnew',this.productNew,this);
        	app.on('route:productchoosecatalog',this.productChooseCatalog,this);
        	app.on('route:productopencatalog',this.productOpenCatalog,this);
        	app.on('route:productsearchcatalog',this.productSearchCatalog,this);
        	app.on('route:productqueryjson',this.productQueryJSON,this);
        	app.on('route:productpublishedby',this.productPublishedBy,this);
        	app.on('route:productpublisherqueryjson',this.productPublisherQueryJSON,this);
        	//app.on('route:productbacknew',this.productBackNew,this);
        	//app.on('route:productphoto',this.productPhoto,this);
        	//app.on('route:productdescription',this.productDescription,this);
        	this.trigger('inited',this);
		};
		this.addDetailView=function(v){
			this.detailViewCache.push(v);
		};
		this.clearDetailView=function(){
			_.each(this.detailViewCache,this.removeDetailView,this);
			this.detailViewCache=[];
		};
		this.removeDetailView=function(v){
			this.app.removeView(v.key);
		};
		this.home=function(){
			this.clearDetailView();
			require(['modules/product/views/ProductListView_new'],_.bind(function(ProductListView){
				//var h = this.app.selectView('home');
	    		var v = this.app.selectView('home',_.bind(function(){
	    			var result = new ProductListView({collection:products,app:this.app});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'home';
	    			result.render(); // 在创建时只render一次->loadInitData
	    			return result;
	    		},this));
	    		this.app.changeView(v, {reverse:true});
        	},this));
	    };
	    this.productDetail=function(id){
	        require(['modules/product/views/ProductDetailView_new'],_.bind(function(ProductDetailView){
        		var v = this.app.selectView('productdetailview_'+id,_.bind(function(){
					var model = new ProductDetail({collection:products,ID:id});
					var result = new ProductDetailView({model:model,app:this.app}); // 根据缓存获取model
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productdetailview_'+id;
	    			//result.render(); // 只render一次后面的复用时都清空(先画出来)
        			result.refreshPage(); // 触发了loadModifyItem->sync->render
	    			this.addDetailView(result);
        			return result;
        		},this));
        		if (!v.fromCache) {
        			v.loadData();
        		}
    			if (this.app.currentView && this.app.currentView.key=='ProductModifyView') {
    				this.app.changeView(v,{reverse:true});
				}
    			//else if (this.app.currentView && (this.app.currentView.key=='ProductSearchView'||this.app.currentView.key=='ProductPublishedByView'))
    			//	this.app.changeView(v,{transition:'slideup'});
	    		else {
	    			this.app.changeView(v);
	    		}
        	},this));
        };
		products.on('modelchanged',function(id){
			var v = this.app.selectView('productdetailview_'+id);
			if (v)
				v.refreshPage();
		},this);
	    this.productModify=function(publisher, id){ // 放到自己发布的页面去修改
	        require(['modules/product/views/ProductModifyView_new','jquery.snipbox']
	        	,_.bind(function(ProductModifyView){
				if (!Gifted.Global.checkConnection()) // 网络检查
					return false;
	        	if(!this.app.checkRight({checkRule:['LOGIN']}))
		    		return;
		    	if(this.app.user.get('ID')!=publisher) {
		    		Gifted.Global.alert(Gifted.Lang['NoRight']);
		    		return;
		    	}
        		var v = this.app.selectView('productmodifyview_'+id,_.bind(function(){
					var model = new Product({collection:products,ID:id});
					var result = new ProductModifyView({model:model,app:this.app}); // 根据缓存获取model
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productmodifyview_'+id;
        			result.refreshPage(); // 触发了loadModifyItem->sync->render
	    			//result.render(); // 只render一次后面的复用时都清空
        			return result;
        		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductChooseCatalogView') {
	    			this.app.changeView(v,{reverse:true}); 
	    		} else {
	    			this.app.changeView(v);
	    		}
        	},this));
        };
        this.productNew=function(){
	        require(['modules/product/views/ProductModifyView_new','jquery.snipbox']
	        	,_.bind(function(ProductNewView){
				if (!Gifted.Global.checkConnection()) // 网络检查
					return false;
	        	if(!this.app.checkRight({checkRule:['LOGIN']})) // ,'FACTORY'
		    		return;
        		var v = this.app.selectView('productnewview',_.bind(function(){
					var model = new Product({collection:products});
        			var result = new ProductNewView({model:model,app:this.app});
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productnewview';
	    			result.render(); // 只render一次后面的复用时都清空
        			return result;
        		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductChooseCatalogView') {
	    			v.setCatalog(this.app.currentView.catalog);
	    			this.app.changeView(v,{reverse:true}); 
	    		} else {
	    			this.app.changeView(v);
	    		}
        	},this));
        };
        // ---------------------------------------------------------------------------------------------- //
        this.productChooseCatalog=function() {
        	require(['modules/product/views/ProductChooseCatalogView_new'],_.bind(function(ProductChooseCatalogView){
        		var v = this.app.selectView('productchoosecatalogview',_.bind(function(){
        			var result = new ProductChooseCatalogView({app:this.app});
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productchoosecatalogview';
		    		result.render(); // 在创建时只render一次
        			return result;
        		},this));
	    		this.app.changeView(v);
        	},this));
        }
        this.productOpenCatalog=function() {
        	require(['modules/product/views/ProductCatalogView_new'],_.bind(function(ProductCatalogView){
        		var v = this.app.selectView('productcatalogview',_.bind(function(){
        			var result = new ProductCatalogView({app:this.app});
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productcatalogview';
		    		result.render(); // 在创建时只render一次
        			return result;
        		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductSearchView') 
	    			this.app.changeView(v,{reverse:true}); 
	    		else {
	    			this.app.changeView(v);
	    		}
        	},this));
        }
		this.productSearchCatalog = function(catalog, title){
			require(['modules/product/views/ProductSearchView_new'],_.bind(function(ProductSearchView){
	    		var v = this.app.selectView('querycatalog',_.bind(function(){
	    			//var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
	    			var collection = new ProductCachedCollection({key:'_querycatalog_'+catalog});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'querycatalog';
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView')
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
	    			if (catalog!='*') {
		    			var subQuery = {CATALOG:catalog};
		    			v.clearSearch();
		    			v.query(subQuery);
	    			} if (!catalog||catalog=='') {
		    			v.clearHTML();
		    		} 
	    			this.app.changeView(v);
	    		}
				/*var h = this.app.selectView('querycatalog_'+catalog); // 只取
	    		var v = this.app.selectView('querycatalog_'+catalog,_.bind(function(){
	    			//var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
	    			var collection = new ProductCachedCollection({key:'_querycatalog_'+catalog});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'querycatalog_'+catalog;
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView')
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
		    		if (!h) { // 第一次才要设置restfulAction
		    			if (catalog!='*') {
			    			var subQuery = {CATALOG:catalog};
			    			v.clearSearch();
			    			v.query(subQuery);
		    			} 
		    		} else if (!catalog||catalog=='') {
		    			v.clearHTML();
		    		} 
	    			this.app.changeView(v);
	    		}*/
        	},this));
		};
		this.productQueryJSON = function(jsonString, title){
			require(['modules/product/views/ProductSearchView_new'],_.bind(function(ProductSearchView){
				var v = this.app.selectView('queryjson',_.bind(function(){
	    			var collection = new ProductCachedCollection({key:'_queryjson_'+title});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'queryjson';
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView') 
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
	    			if (jsonString!='*') {
		    			var subQuery = JSON.parse(jsonString);
		    			v.clearSearch();
		    			v.query(subQuery);
	    			} else if (!jsonString||jsonString=='') {
		    			v.clearHTML();
		    		}
	    			this.app.changeView(v);
	    		}
				/*var h = this.app.selectView('queryjson_'+title); // 只取
	    		var v = this.app.selectView('queryjson_'+title,_.bind(function(){
	    			var collection = new ProductCachedCollection({key:'_queryjson_'+title});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'queryjson_'+title;
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView') 
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
		    		if (!h) { // 第一次才要设置restfulAction
		    			if (jsonString!='*') {
			    			var subQuery = JSON.parse(jsonString);
			    			v.clearSearch();
			    			v.query(subQuery);
		    			} 
		    		} else if (!jsonString||jsonString=='') {
		    			v.clearHTML();
		    		}
	    			this.app.changeView(v);
	    		}*/
        	},this));
		};
		this.productPublishedBy = function(jsonString, title){
			require(['modules/product/views/ProductSearchView_new'],_.bind(function(ProductSearchView){
				var v = this.app.selectView('queryjson',_.bind(function(){
	    			var collection = new ProductCachedCollection({key:'_queryjson_'+title});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'ProductPublishedByView';
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView') 
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
	    			if (jsonString!='*') {
		    			var subQuery = JSON.parse(jsonString);
		    			v.clearSearch();
		    			v.query(subQuery);
		    		} else if (!jsonString||jsonString=='') {
		    			v.clearHTML();
		    		}
	    			this.app.changeView(v);
	    		}
				/*var h = this.app.selectView('queryjson_'+title); // 只取
	    		var v = this.app.selectView('queryjson_'+title,_.bind(function(){
	    			var collection = new ProductCachedCollection({key:'_queryjson_'+title});
	    			var result = new ProductSearchView({collection:collection,app:this.app,title:title});
	    			this.app.pageContainer.append(result.$el);
        			result.key = 'ProductPublishedByView';
	    			result.render(); // 在创建时只render一次
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='ProductDetailView') 
	    			this.app.changeView(v); // ,{transition:'slidedown'}
	    		else {
		    		if (!h) { // 第一次才要设置restfulAction
		    			if (jsonString!='*') {
			    			var subQuery = JSON.parse(jsonString);
			    			v.clearSearch();
			    			v.query(subQuery);
		    			} 
		    		} else if (!jsonString||jsonString=='') {
		    			v.clearHTML();
		    		}
	    			this.app.changeView(v);
	    		}*/
        	},this));
		};
	})();
	_.extend(result,Backbone.Events);
	return result;
});