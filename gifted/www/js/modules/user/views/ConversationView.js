define(['modules/user/templates/conversation', 'handlebars'],function(mod0){
	var ConversationView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent : Handlebars.compile(mod0.content),
		templateMessage : Handlebars.compile(mod0.message),
		//templateHead : Handlebars.compile(mod0.head),
		templateBottom:Handlebars.compile(mod0.bottom),
		topRefresh:true,
		initialize: function () {
			this.model.on('change:PORTRAIT',this.changeFriendPortrait,this);
			this.app.user.on('change:PORTRAIT',this.changeMyPortrait,this)
			this.model.messageList.on('add',this.addMessage,this);
			this.model.on('sendSuccess',this.sendSuccess,this);
			this.on('toprefresh',this.onTopRefresh,this);
			this.on('loadHistorySuccess',this.loadComplete,this);
			this.on('loadHistoryError',this.loadComplete,this);
			Gifted.View.prototype.initialize.apply(this,arguments);
	    },
		events : {
			'tap .headbar_sign' : 'back',
			'tap .conversation_send_button' : 'sendMessage',
		},
		back : function(){
			this.model.clearUnreadCount();
			Gifted.View.prototype.back.apply(this,arguments);
		},
		sendSuccess:function(){
			this.model.parse(this.model.attributes,{});
			this.app.user.conversationList.add(this.model,{at:0,merge:true,parse:true});
		},
		onTopRefresh:function(){
			if (this.$el.find('.pullDown').hasClass('loading')) {
				return;
			}
			this.loadHistory(20);//默认一次最多加载20条消息
		},
		loadComplete : function(){
			_.delay(_.bind(this.trigger,this,'loadComplete'),1000);
			//this.trigger('loadComplete');
		},
		loadHistory : function(count){
			var firstMessage = this.model.messageList.at(0);
			var messageId ;
			if(!firstMessage){
				messageId = this.model.get('MESSAGEID');
			}else {
				messageId = firstMessage.get('MESSAGEID');
			}
			if(!messageId){
				this.loadComplete();
				return;//从来没发过消息
			}
			this.model.loadHistory(messageId,count);
		},
		sendMessage : function(message){
			if(message && message.targetId && (message.content || message.title)){
				message.senderId = this.app.user.get('ID');
				this.model.sendMessage(message);
			}else{
				var content = this.$el.find('.conversation_input').val();
				if(!content || content.trim().length == 0){
					alert('请输入发送内容');
					return;
				}
				var message = {
					'targetId':this.model.get('CONVERSATIONID'),
					'content':content,
					'senderId' : this.app.user.get('ID'),
				};
				this.model.sendMessage(message);
				this.$el.find('.conversation_input').val('');
			}
		},
		addMessage : function(messageModel){
			var json = messageModel.toJSON();
			if(json.senderId == this.model.get('CONVERSATIONID')){
				json.PORTRAIT = this.model.get('PORTRAIT');
				json.NAME = this.model.get('NAME');
			}else{
				json.PORTRAIT = this.app.user.get('PORTRAIT');
				json.NAME = this.app.user.get('NAME');
			}
			var html = this.templateMessage(json);
			var nextMessageId = messageModel.get('nextMessageId');
			if(nextMessageId){//添加的是历史消息
				this.$contentEl.prepend(html);
				//this.$contentEl.find('.message_' + nextMessageId).before(html);
			}else
				this.$contentEl.append(html);
			this.trigger('refreshcontent');
			if(!nextMessageId){
				this.scrollToBottom();
			}
		},
		afterRender:function(){
			Gifted.View.prototype.afterRender.apply(this,arguments);
			this.scrollToBottom();
		},
		contentRender : function(){
			var html = this.templateContent(this.model.messageList.toJSON());
			this.$contentEl.html(html);
			var unreadCount = this.model.get('unreadCount');
			if(!isNaN(unreadCount)){
				var count = parseInt(unreadCount);
				if(count>0)
					this.loadHistory(count);
			}
		},
		changeFriendPortrait : function(){
			this.$contentEl.find('.conversation_dir_RECEIVE > img').attr('src',this.model.get('PORTRAIT')+'?imageView2/1/w/50/h/50/q/100');
		},
		changeMyPortrait : function(){
			this.$contentEl.find('.conversation_dir_SEND > img').attr('src',this.app.user.get('PORTRAIT')+'?imageView2/1/w/50/h/50/q/100');
		},
	    remove : function() {
	    	this.model.off('change:PORTRAIT',this.changeFriendPortrait,this);
			this.app.user.off('change:PORTRAIT',this.changeMyPortrait,this)
	    	this.model.messageList.off('add',this.addMessage,this);
	    	this.model.off('sendSuccess',this.sendSuccess,this);
	    	this.off('toprefresh',this.onTopRefresh,this);
	    	delete this.model;
	    	Gifted.View.prototype.remove.apply(this,arguments);
	    }
	});
	return ConversationView;
	
});
