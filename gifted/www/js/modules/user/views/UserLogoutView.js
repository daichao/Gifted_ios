define(['handlebars'],function(mod0){
	var UserLogoutView = Gifted.View.extend({
		logout:function(){
			params = {GIFTED_SESSIONID :Gifted.Global.getSessionId(),
	    			userId : Gifted.Global.getCookie('GIFTED_USERID')};
			Gifted.Global.delSessionId();
			Gifted.Global.delCookie('GIFTED_USERID');
			$.ajax({
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.logoutURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
				},
				complete : _.bind(function(XMLHttpRequest, textStatus) {
					this.app.navigateCollection.filterRight(['GUEST']);
					Backbone.history.navigate('',{trigger:true});//登出后跳转到首页
				},this),
				error : function(xhr) { // jsonp 方式此方法不被触发
					//Gifted.Global.alert(xhr.status);
				}
			});
		},
		remove : function() {
	    	UserLogoutView.__super__.remove.apply(this, arguments);
	    }
	});
	return UserLogoutView;
});