define(['modules/product/models/models'
	,'css!modules/product/styles/productinit.css' // product全局
	,deviceIsIOS?'css!../../../css/styles-ios.css':'css!../../../css/styles-android.css'],function(){
    var products = new ProductCachedCollection(); // 当前模块全局共享
	var result = new (function(){
		products.on('modelchanged',function(id){
			var v = this.app.selectView('productdetailview_'+id);
			if (v)
				v.refreshPage();
		},this);
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
				//var h = this.app.selectView('productdetailview_'+id);
        		var v = this.app.selectView('productdetailview_'+id,_.bind(function(){
					var model = new ProductDetail({collection:products,ID:id});
					var result = new ProductDetailView({model:model,app:this.app}); // 根据缓存获取model
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productdetailview_'+id;
	    			result.render(); // 只render一次后面的复用时都清空(先画出来)
	    			this.addDetailView(result);
        			return result;
        		},this));
        		if (!v.fromCache) {
        			v.loadData();  // 触发了loadModifyItem->sync->render
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
	    this.productModify=function(publisher, id){ // 放到自己发布的页面去修改
	        require(['modules/product/views/ProductModifyView_new','jquery.snipbox']
	        	,_.bind(function(ProductModifyView){
	        	if(!this.app.checkRight({checkRule:['LOGIN']}))
		    		return;
		    	if(this.app.user.get('ID')!=publisher) {
		    		Gifted.Global.alert(Gifted.Lang['NoRight']);
		    		return;
		    	}
				//var h = this.app.selectView('productmodifyview_'+id);
        		var v = this.app.selectView('productmodifyview_'+id,_.bind(function(){
					var model = new Product({collection:products,ID:id});
					var result = new ProductModifyView({model:model,app:this.app}); // 根据缓存获取model
        			this.app.pageContainer.append(result.$el);
        			result.key = 'productmodifyview_'+id;
	    			result.render(); // 只render一次后面的复用时都清空
	    			result.loadData(id, true, false); // 触发了loadModifyItem->sync->render
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
        this.productNew=function(){
	        require(['modules/product/views/ProductModifyView_new','jquery.snipbox']
	        	,_.bind(function(ProductNewView){
	        	if(!this.app.checkRight({checkRule:['LOGIN']})) // ,'FACTORY'
		    		return;
				//var h = this.app.selectView('productnewview');
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
				//var h = this.app.selectView('productchoosecatalogview');
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
				//var h = this.app.selectView('productcatalogview');
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
				//var h = this.app.selectView('querycatalog');
	    		var v = this.app.selectView('querycatalog',_.bind(function(){
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
        	},this));
		};
		this.productQueryJSON = function(jsonString, title){
			require(['modules/product/views/ProductSearchView_new'],_.bind(function(ProductSearchView){
				//var h = this.app.selectView('queryjson');
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
        	},this));
		};
		this.productPublishedBy = function(jsonString, title){
			require(['modules/product/views/ProductSearchView_new'],_.bind(function(ProductSearchView){
				//var h = this.app.selectView('queryjson');
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
        	},this));
		};
	})();
	_.extend(result,Backbone.Events);
	return result;
});