define(['modules/user/templates/conversation', 'handlebars'],function(mod0){
	var ConversationView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent : Handlebars.compile(mod0.content),
		templateMessage : Handlebars.compile(mod0.message),
		templateHead : Handlebars.compile(mod0.head),
		initialize: function () {
			if(!this.model.inited)
				this.model.on('Inited',this.headRender,this);
			this.model.messageList.on('add',this.addMessage,this);
			this.model.on('sendSuccess',this.sendSuccess,this);
	    },
		events : {
			'tap .headbar_action_back' : 'back',
			'tap .message_send' : 'sendMessage',
		},
		back : function(){
			this.model.clearUnreadCount();
			ConversationView.__super__.back.apply(this,arguments);
		},
		sendSuccess:function(){
			this.app.user.conversationList.add([this.model],{at:0,merge:true});
		},
		onTopRefresh:function(){
			alert('ConversationView onTopRefresh');
			this.loadHistory(20);//默认一次最多加载20条消息
		},
		loadHistory : function(count){
			var firstMessage = this.model.messageList.at(0);
			var messageId = firstMessage.get('MESSAGEID');
			this.model.loadHistory(messageId,count);
		},
		sendMessage : function(message){
			if(message && message.targetId && message.content){
				this.model.sendMessage(message);
			}else{
				var content = this.$el.find('.input_message').val();
				if(!content || content.trim().length == 0){
					alert('请输入发送内容');
					return;
				}
				var message = {
					'targetId':this.model.get('CONVERSATIONID'),
					'content':content
				};
				this.model.sendMessage(message);
				this.$contentEl.find('.input_message').val('');
			}
		},
		addMessage : function(messageModel){
			var html = this.templateMessage(messageModel.toJSON());
			var nextMessageId = messageModel.get('nextMessageId');
			if(nextMessageId){//添加的是历史消息
				this.$contentEl.find('.conversation_content').prepend(html);
				//this.$contentEl.find('.message_' + nextMessageId).before(html);
			}else
				this.$contentEl.find('.conversation_content').append(html);
		},
		contentRender : function(){
			var html = this.templateContent(this.model.messageList.toJSON());
			this.$contentEl.html(html);
			this.headRender();
			var unreadCount = this.model.get('unreadCount');
			if(!isNaN(unreadCount)){
				var count = parseInt(unreadCount);
				if(count>0)
					this.loadHistory(count);
			}
		},
		headRender : function(){
			var html = this.templateHead(this.model.toJSON());
			this.$contentEl.find('.conversation_head').empty().append(html);
		},
	    remove : function() {
	    	this.model.messageList.off('add',this.addMessage,this);
	    	this.model.off('sendSuccess',this.sendSuccess,this);
	    	this.model.off('Inited',this.headRender,this);
	    	delete this.model;
	    	ConversationView.__super__.remove.apply(this,arguments);
	    }
	});
	return ConversationView;
	
});
