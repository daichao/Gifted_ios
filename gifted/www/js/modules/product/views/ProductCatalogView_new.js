define(['modules/product/templates/productcatalog_new','handlebars'], function(tpl) {
	var ProductCatalogView = Gifted.View.extend({
		templateTop:Handlebars.compile(tpl.top),
		templateContent:Handlebars.compile(tpl.content),
		events:{
			'tap .headbar_sign':'back',
			'tap .header_search':'openSearch',
			'tap .product_catalog_item':'doSearchCatalog',
			"change .search_input":'doSearchContent'
		},
	    initialize: function() {
	    	ProductCatalogView.__super__.initialize.apply(this,arguments);
	    	//this.events = $.extend(this.events, Gifted.View.prototype.events);
	    },
		refreshPage:function(event){
			//this.render();
		},
		doSearchContent:function(event) {
        	var val = $(event.target).val();
	    	var subQuery = {__content:val};
	    	this.app.navigate('product/search/query/'+JSON.stringify(subQuery)+'/Catalog', {trigger:true});
		},
		doSearchCatalog:function(event) {
        	var title = $(event.target).find('span').text();
        	var val = $(event.target).attr('catalog');
	    	this.app.navigate('product/search/catalog/'+val+'/'+title, {trigger:true});
		},
		topbarRender:function(){
			this.$topbarEl.empty();
			this.$topbarEl.html(this.templateTop());
		},
		bottomRender:function(){
			this.$bottombarEl.hide();
		},
		contentRender:function(){
			var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
	    	this.$contentEl.empty();
	        this.$contentEl.html(this.templateContent({catalogs:catalogs}));
		},
	    remove : function() {
	    	ProductCatalogView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductCatalogView;
});