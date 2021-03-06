define(['modules/user/templates/modifypassword', 'handlebars'],function(mod0){
	var ModifyPasswordView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		events:{
			'tap .headbar_sign':'back',
			'tap .header_login':'login',
			'tap .reset-password-ok-btn':'resetPassword'
		},
		login:function(){
			this.app.navigate('user/login', {trigger:true});
		},
		resetPassword:function(event){
			var password = this.$el.find('.reset-password').val(), password2 = this.$el.find('.reset-password-ok').val();
			var oldPassword=this.$el.find('.old-password').val();
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
			this.app.user.modifyPassword(params);
		},
		contentRender : function(){
			var html = this.templateContent([]);
			this.$contentEl.empty().html(html);
		},
	    remove : function() {
	    	ModifyPasswordView.__super__.remove.apply(this, arguments);
	    }
	});
	return ModifyPasswordView;
	
});
