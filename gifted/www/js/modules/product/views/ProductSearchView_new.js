define(['modules/product/templates/productsearch_new','modules/product/templates/productlistitem',
		'modules/product/views/ProductListView_new','handlebars',
		'modules/product/models/models','countdown'], function(mod0, mod1, ProductListView) {
	var ProductSearchView = ProductListView.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		//templateBottom:Handlebars.compile(mod0.bottom),
		template1:Handlebars.compile(mod1),
		topRefresh:true,
		bottomRefresh:true,
		//scrollClassName:'product_list_content',
		subQuery:{},
	    // public
		events:{
			'tap .headbar_sign':'back',
			'tap .header_camera':'newProduct',
			'tap .header_refresh':'refreshPage',
			'tap .product_list_columns':'refreshImg',
			'tap .product_item_fav':'clickFav',
			"change .search_input":'doSearch'
		},
	    // public
	    initialize:function (options) {
	    	ProductSearchView.__super__.initialize.apply(this,arguments);
	    },
		// public
		query : function(subQuery) {
			this.subQuery = subQuery||this.subQuery;
			var sSubQuery = JSON.stringify(this.subQuery);
	    	this.collection.search('/query/'+sSubQuery); // model.search->hasmoredata->refresh
		},
		doSearch:function(){
			var val = this.$el.find('.search_input').val();
			this.collection.reset(); // ->clearHTML
			if (val=='*') { // !val||val==''||
		    	delete this.subQuery['__content'];
		    	this.contentRender();
			} else {
				this.bottomBound = true;
				if(!val||val=='') {
		    		delete this.subQuery['__content'];
				} else {
		    		this.subQuery['__content']=val;
				}
		    	this.query();
				this.$el.find('.search_input').blur();
			}
		},
		clearSearch:function(){
			this.$el.find('.search_input').val('');
		},
		hideHeadSearch:function(){
			this.$el.find('.ui-input-search').hide();
		},
		contentRender:function(){
			ProductSearchView.__super__.contentRender.apply(this, arguments);
	        // TODO multi condition search
	        this.$el.find('.product_search_group').hide();
	        this.$el.find('.product_search_title').html(this.title);
	        this.getViewWrapBottomEl().addClass('product_search_title2').html(this.title);
			return this;
	    },
	    remove : function() {
	    	ProductSearchView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductSearchView;
})
