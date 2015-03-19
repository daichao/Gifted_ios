define(['modules/portal/templates/about5pro', 'handlebars', 'jquery.mobitabs'],function(mod0){
	var About5ProView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		//scrollClassName:'about_tabs_content',
	    events:{
	    	"tap .headbar_sign":"back"
		},
	    initialize: function () {
	    	About5ProView.__super__.initialize.apply(this, arguments);
	    },
		render:function() {
			this.tabs = this.$el.find('[data-role="tabs"]').tabs();
			/*{
			'afterTabShow':function(event, paras){
	    		console.log(event);
	    	}
	    	});*/
	    	About5ProView.__super__.render.apply(this, arguments);
	    	this.$el.find('.'+this.scrollClassName).height(3024);
		},
	    remove : function() {
	    	if (this.tabs) {
	    		this.tabs.off('afterTabShow');
	    	}
	    	About5ProView.__super__.remove.apply(this, arguments);
	    }
	});
	return About5ProView;
	
});
