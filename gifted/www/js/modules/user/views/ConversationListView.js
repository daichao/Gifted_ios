define(['modules/user/templates/conversationlist','handlebars'],function(mod0){
	var ConversationListView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		templateConversation:Handlebars.compile(mod0.conversation),
		initialize: function () {
			this.collection.on('change',this.addConversation,this);
			this.collection.on('add',this.addConversation,this);
			this.collection.on('remove',this.removeConversation,this);
			ConversationListView.__super__.initialize.apply(this,arguments);
	    },
		events : {
			'tap .headbar_sign' : 'back',
			'tap .conversation' : 'openConversation',
		},
		openConversation : function(event){
			var conversationId = $(event.target).attr('conversationId');
			if(!conversationId){
				var item = $(event.target).parents('.conversation');
				conversationId = item.attr('conversationId');
			}
			this.app.navigate('user/conversation/'+conversationId, {trigger:true});
		},
		addConversation:function(conversation){
			this.$contentEl.find("div[conversationId=" + conversation.get('CONVERSATIONID') + "]").remove();
			var html = this.templateConversation(conversation.toJSON());
			this.$contentEl.prepend(html);
		},
		removeConversation : function(conversation){
			this.$contentEl.find("div[conversationId=" + conversation.get('CONVERSATIONID') + "]").remove();
		},
		contentRender : function(){
			var html = this.templateContent(this.collection.toJSON());
			this.$contentEl.html(html);
			if (this.collection.length==0)
	        	this.getViewWrapBottomEl().addClass('conversation_title2').html('No Data');
		},
	    remove : function() {
	    	this.collection.off('change',this.addConversation,this);
			this.collection.off('add',this.addConversation,this);
            this.collection.off('remove',this.removeConversation,this);
            ConversationListView.__super__.remove.apply(this, arguments);
	    }
	});
	return ConversationListView;
	
});
