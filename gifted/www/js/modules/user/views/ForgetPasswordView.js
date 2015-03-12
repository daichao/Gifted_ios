define(['modules/user/templates/forgetpassword', 'handlebars'],function(mod0){
	var ForgetPasswordView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		topRefresh:false,
		bottomRefresh:false,
		events:{
			'tap .headbar_sign':'back',
			//'tap .headbar_sign':'openNavigate',
			'tap .send-identifying-code-btn':'sendIdentifyingCode',
			'tap .reset-password-btn':'resetPassword'
		},
		resetPassword:function(event){
			var email = this.$el.find('.forget-email').val();
			var identifyingCode = this.$el.find('.identifying-code').val();
			if(!identifyingCode)
				return;
			var params = {
				EMAIL : email,
				IDENTIFYINGCODE : identifyingCode
			}
			this.app.user.checkIdentifyingCode(params);
		},
		sendIdentifyingCode:function(event) {
			var email = this.$el.find('.forget-email').val();
			if(!email || email.length <1)
				return;
			var params = {
				EMAIL : email
			}
			this.app.user.forgetPassword(params);
		},
		refreshMessage: function(model,message){
			this.$el.find('.forget-password-message').html(message);
		},
		// TODO events
		contentRender:function(){
	    	this.$contentEl.empty();
	        this.$contentEl.html(this.templateContent([]));
			this.app.user.on("change:forgetPasswordMessage",this.refreshMessage,this);
		},
	    remove : function() {
	    	if (this.app) {
	    		this.app.user.off("change:forgetPasswordMessage",this.refreshMessage,this);
	    		delete this.app;
	    	}
	    	Backbone.View.prototype.remove.apply(this, arguments);
	    }
	});
	return ForgetPasswordView;
	
});
