define(['modules/user/templates/resetpassword', 'handlebars'],function(mod0){
	var ForgetPasswordView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		events:{
			'tap .headbar_sign':'back',
			//'tap .headbar_sign':'openNavigate',
			'tap .header_login':'login',
			'tap .reset-password-ok-btn':'resetPassword'
		},
		login:function(){
			this.app.navigate('user/login', {trigger:true});
		},
		resetPassword:function(event){
			var oldPassword = this.$el.find('.old-password').val();
			if (oldPassword == '') {
				Gifted.Global.alert('Old password can\'t be empty !')
				return;
			}
			var password = this.$el.find('.reset-password').val(), password2 = this.$el.find('.reset-password-ok').val();
			if (password == '') {
				Gifted.Global.alert(Gifted.Lang['PasswordIsEmpty']);
				return;
			}
			if (password != password2){
				Gifted.Global.alert(Gifted.Lang['PasswordsDontMatch']);
				return;
			}
			var params = {
				OLDPASSWORD : oldPassword,
				PASSWORD : password
			}
			this.app.user.resetPassword(params);
		},
		contentRender : function(){
			var html = this.templateContent([]);
			this.$contentEl.empty().html(html);
		},
	    remove : function() {
	    	if (this.app) {
	    		delete this.app;
	    	}
	    	Backbone.View.prototype.remove.apply(this, arguments);
	    }
	});
	return ForgetPasswordView;
	
});
