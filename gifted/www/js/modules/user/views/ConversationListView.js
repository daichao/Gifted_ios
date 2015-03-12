define(['modules/user/templates/conversationlist','handlebars'],function(mod0){
	var ConversationListView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		templateConversation:Handlebars.compile(mod0.conversation),
		initialize: function () {
			this.collection.on('change',this.refreshConversationList,this);
			this.collection.on('add',this.addConversation,this);
			this.collection.on('remove',this.removeConversation,this);
			Gifted.View.prototype.initialize.apply(this,arguments);
	    },
		events : {
			'tap .headbar_sign' : 'openNavigate',
			'tap .conversation' : 'openConversation',
		},
		openConversation : function(event){
			var conversationId = $(event.target).attr('conversationId');
			this.app.navigate('user/conversation/'+conversationId, {trigger:true});
		},
		addConversation:function(conversation){
			if(conversation.inited){
				this.refreshConversationList(conversation);
			}else{
				conversation.on('Inited',this.refreshConversationList,this);
			}
		},
		removeConversation : function(conversation){
			this.$contentEl.find("div[conversationId=" + conversation + "]").remove();
		},
		refreshConversationList : function(conversation){
			this.$contentEl.find("div[conversationId=" + conversation + "]").remove();
			var html = this.templateConversation(conversation.toJSON());
			this.$contentEl.prepend(html);
		},
		contentRender : function(){
			var html = this.templateContent(this.collection.toJSON());
			this.$contentEl.empty().html(html);
	        this.getViewWrapBottomEl().addClass('conversation_title2').html('No Data');
		},
	    remove : function() {
	    	if (this.app) {
	    		delete this.app;
	    	}
	    	this.collection.off('change',this.refreshConversationList,this);
			this.collection.off('add',this.addConversation,this);
            this.collection.off('remove',this.removeConversation,this);
            Gifted.View.prototype.remove.apply(this, arguments);
	    }
	});
	return ConversationListView;
	
});
