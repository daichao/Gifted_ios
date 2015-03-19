define(['modules/user/templates/userregister', 'handlebars'],function(mod0){
	var RegisterView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		initialize:function(){
			this.bindEmailHintEvent(".register_email");
			this.app.user.on('registerError',this.registerError,this);
			this.app.user.on('registerSuccess',this.registerSuccess,this);
		},
		events:{
			'tap .headbar_sign':'back',
			//'tap .headbar_sign':'backHome',
			'tap .header_login':'login',
			'tap .register_button':'register'
		},
		login:function(){
			this.app.navigate('user/login', {trigger:true});
		},
		register:function(){
			var email = this.$el.find('.register_email').val();
			if(!this.app.user.validateEmail(email)){//验证不通过
				Gifted.Global.alert(Gifted.Lang['EmailIsWrong']);//TODO 样式
				return;
			}
			var password = this.$el.find('.register_password').val();
			if(!password || password.length <1 ){
				Gifted.Global.alert(Gifted.Lang['PasswordIsEmpty']);//TODO 样式
				return;
			}
			if(password.length<6){
				Gifted.Global.alert(Gifted.Lang['PasswordShort']);//TODO 样式
				return;
			}
			var username = this.$el.find('.register_name').val();
			if(!username || username.length == 0){//TODO ajax查重
				Gifted.Global.alert(Gifted.Lang['UsernameIsEmpty']);
				return;	
			}
			var params = {
				EMAIL : email,
				PASSWORD : password,
				NAME : username,
			};
			this.app.user.register(params);
		},
		registerSuccess : function(json){
			Backbone.history.navigate('home',{trigger:true});//注册成功后自动登录，返回到首页
		},
		registerError : function(error){
			if(error.errorInfo){
				Gifted.Global.alert(Gifted.Lang['register']+Gifted.Lang[error.errorInfo]);
			}
			var errorResponse = error.errorResponse;
			if(errorResponse){
				var error = JSON.parse(errorResponse).error;
				if(error)
					alert(error);
			}
		},
		remove : function(){
			this.app.user.off('registerError',this.registerError,this);
	    	RegisterView.__super__.remove.apply(this,arguments);
		}
	});
	return RegisterView;
	
});
