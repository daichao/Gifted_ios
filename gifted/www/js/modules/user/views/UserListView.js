define(['modules/user/templates/userlist','handlebars'],function(mod0){
	var UserListView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		templateUser:Handlebars.compile(mod0.user),
		topRefresh:true,
		bottomRefresh:true,
		initialize: function () {
			this.collection.on('add',this.addUser,this);
            this.collection.on('remove',this.removeUser,this);
            this.collection.on('reset',this.refreshUser,this);
            this.collection.on('sync',this.completeLoading,this);
            this.collection.on('error',this.completeLoading,this);
			this.collection.loadData();
			this.on('toprefresh',this.onTopRefresh,this);
	    	this.on('bottomrefresh',this.onBottomRefresh,this);
			Gifted.View.prototype.initialize.apply(this,arguments);
	    },
		events : {
			'tap .headbar_sign' : 'back',
			'tap .user_list_user' : 'openUserInteractive',
		},
		onTopRefresh:function(){
			if (this.$el.find('.pullDown').hasClass('loading')) {
				return;
			}
			this.collection.refresh();
		},
		onBottomRefresh:function(){
			if (this.$el.find('.pullUp').hasClass('loading')) {
				return;
			}
			this.collection.loadData();
		},
		completeLoading:function(){
			_.delay(_.bind(this.trigger,this,'loadComplete'),1000);
		},
		openUserInteractive : function(event){
			var userId = $(event.target).attr('userId');
			if(!userId){
				var item = $(event.target).parents('.user_list_user');
				userId = item.attr('userId');
			}
			this.app.navigate('user/userinteractive/'+userId, {trigger:true});
		},
		addUser:function(model){
			var html = this.templateUser(model.toJSON());
			this.$contentEl.find('.user_list_content').prepend(html);
		},
		removeUser : function(model){
			this.$contentEl.find("div[userId=" + model.get('ID') + "]").remove();
		},
		refreshUser:function(){
			this.contentRender();
		},
		topbarRender:function(){
			Gifted.View.prototype.topbarRender.apply(this, arguments);
			var html = this.templateTop({'NAME':this.collection.name});
			this.$topbarEl.html(html);
		},
		contentRender : function(){
			var html = this.templateContent(this.collection.toJSON());
			this.$contentEl.html(html);
		},
	    remove : function() {
	    	if (this.app) {
	    		delete this.app;
	    	}
	    	this.collection.off('add',this.addUser,this);
            this.collection.off('remove',this.removeUser,this);
            this.collection.off('reset',this.refreshUser,this);
            this.collection.off('sync',this.completeLoading,this);
            this.collection.off('error',this.completeLoading,this);
            this.off('toprefresh',this.onTopRefresh,this);
	    	this.off('bottomrefresh',this.onBottomRefresh,this);
            Gifted.View.prototype.remove.apply(this, arguments);
	    }
	});
	return UserListView;
	
});
