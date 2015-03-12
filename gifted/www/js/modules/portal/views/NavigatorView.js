define(['modules/portal/templates/navigator','handlebars',
	'modules/portal/models/models','backbone.cache'],function(tpl){
	var NavigatorView = Gifted.View.extend({
		template : Handlebars.compile(tpl),
		collection : new NavigatorItemCollection(),
	    initialize: function () {
	    	this.collection.on("reset", this.refresh, this);
	        this.app.user.on("change:RIGHTS",this.collection.filterRight,this.collection);//绑定权限change事件
	    },
	    tag:'div',
	    className:'navigator',
	    attributes:{
	    	'data-role':'panel',
	    	'data-position':'left',
	    	'data-display':"overlay",
	    	'data-theme':"a"
	    },
	    refresh:function(){
	    	this.$el.find('ul').replaceWith(this.template(this.collection.toJSON()));
	    	this.$el.find('ul').listview();
	    	$(this.el).trigger('updatelayout');
	    },
	    render: function () {
	    	this.collection.filterRight(this.app.user,this.app.user.get('RIGHTS'));//权限过滤
	        this.$el.html(this.template(this.collection.toJSON()));
	        //$('body').append(this.el);
	        this.$el.find('ul').listview();
	        $(this.el).panel();
	        return this;
	    },
	    remove: function(){
	    	if(this.app){
	    		this.app.user.off("change:RIGHTS",this.collection.flterRight,this.collection);
	    		delete this.app;
	    	}
	    	this.collection.off("reset", this.refresh, this);
	    	Gifted.View.prototype.remove.apply(this, arguments);
	    }
	});
	return NavigatorView;
});