define(['modules/user/templates/userlogin', 'handlebars'], function(mod0){
	var UserLoginView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		initialize:function(){
			this.app.user.on('loginError',this.loginError,this);
			this.app.user.on('logoutError',this.logoutError,this);
			this.bindEmailHintEvent(".login-user");
		},
		logoutError:function(args){
		},
		loginError:function(args){
			if(args.errorCode == 401){
				Gifted.Global.alert(Gifted.Lang['UserNameOrPassWordIsWrong']);
			} else {
				Gifted.Global.alert(args[1]);
			}
		},
		events:{
			'tap .headbar_sign':'backHome',
			'tap .header_register':'register',
			'tap .login_button':'doLogin',
			'tap .forgetpwd':'forgetpwd'
		},
		register:function(){
			this.app.navigate('user/register', {trigger:true});
		},
		doLogin : function(event) {
			var email = this.$el.find('.login-user').val();
			var password = this.$el.find('.login-password').val();
			if(!password || password.length <1){
				Gifted.Global.alert(Gifted.Lang['PasswordIsEmpty']);//TODO 样式
				return;
			}
			var params = {
				PASSWORD : password
			}
			var usercode;
			if(!this.app.user.validateEmail(email)){//验证不通过,说明是用户名
				usercode = email;
				if(usercode && usercode.length >0)
					params.CODE = usercode;
				else
					Gifted.Global.alert(Gifted.Lang['UsernameIsEmpty']);
			}else
				params.EMAIL =  email;
			this.app.user.login(params);
		},
		forgetpwd:function(){
			this.app.navigate('user/forgetpassword', {trigger:true});
		},
		remove:function(){
			this.app.user.off('loginError',this.loginError,this);
			UserLoginView.__super__.remove.apply(this,arguments);
		}
	});
	return UserLoginView;
	
});
