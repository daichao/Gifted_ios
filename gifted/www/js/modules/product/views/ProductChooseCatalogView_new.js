define(['modules/product/templates/productchoosecatalog_new','modules/product/views/ProductCatalogView_new','handlebars'], function(tpl, ProductCatalogView) {
	var ProductChooseCatalogView = ProductCatalogView.extend({
		templateTop:Handlebars.compile(tpl.top),
		templateContent:Handlebars.compile(tpl.content),
		events:{
			//'tap .headbar_sign':'openNavigate',
			'tap .headbar_sign':'back',
			'tap .header_search':'openSearch',
			'tap .product_back_home':'backHome',
			'tap .product_catalog_item':'doSearchCatalog',
			"change .search_input":'doSearchContent'
		},
	    initialize: function() {
	    	ProductChooseCatalogView.__super__.initialize.apply(this,arguments);
	    },
		doSearchCatalog:function(event) {
        	//var title = $(event.target).find('span').text();
        	var val = $(event.target).attr('catalog');
        	this.catalog = val;
        	Backbone.history.history.back();
	    	//this.app.navigate('product/search/catalog/'+val+'/'+title, {trigger:true});
		},
		contentRender:function(){
			ProductChooseCatalogView.__super__.contentRender.apply(this, arguments);
			this.$el.find('.header_search').hide();
		},
	    remove : function() {
	    	ProductChooseCatalogView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductChooseCatalogView;
});