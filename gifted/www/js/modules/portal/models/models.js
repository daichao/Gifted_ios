var NavigatorItem = Backbone.Model.extend({
});
var NavigatorItemCollection = Backbone.Collection.extend({
	model:NavigatorItem,
	list : [
		{link:"#user/login", id:'navigator-login',text:Gifted.Lang['Login'],rightRule:['GUEST']},
	    {link:"#user/userinteractive/navigate",id:'navigator-userInfo',text:Gifted.Lang['UserCenter'],rightRule:['LOGIN']},//
	    {link:"#home",id:'navigator-home',text:Gifted.Lang['HomePage']},
	    {link:"#product/catalog",id:'navigator-product-search',text:Gifted.Lang['Browse']},
	    //{link:"#product/sell", id:'navigator-sell',text: '我的商品',rightRule:['LOGIN']},
	    //{link:"#product/buy", id:'navigator-buy',text: '我的订单',rightRule:['LOGIN']},
	    //{link:"#product/collection",id:'navigator-collection',text:'我的收藏',rightRule:['LOGIN']},
	    {link:"#user/conversationList",id:'navigator-conversation-list',text:Gifted.Lang['ConversationList'],rightRule:['LOGIN']},
	    {link:"#settings",id:'navigator-settings',text:Gifted.Lang['Settings']},
	    {link:"#about5pro",id:'navigator-about5pro',text:Gifted.Lang['About5Pro']}
	    //{link:"#exit",id:'navigator-exit',text:'退出系统'}
	],
	filterRight:function(model,rights){
	    var arr = this.list.slice(0,this.list.length);//将list clone一份
	    if(!rights || rights.length == 0)
	    	rights = [''];
	    $.each(this.list,function(){//遍历需要过滤的数据
	    	var rightRules =  this.rightRule;
	    	var data = this;
	    	if(rightRules)//需要权限过滤
		    	$.each(rightRules,function(){//遍历需要过滤的权限
		    		var rule = this.toString();
		    		var index = rights.indexOf(rule);
		    		if(index<0){//用户没有此权限
		    			arr.splice(arr.indexOf(data),1);//删除不符合条件的数据
		    		}
		    	});
	    });
	    this.reset(arr);
	}
});
define([],function(){
	Settings = Backbone.Model.extend({
		initialize : function() {
			function clearCache() {
				localStorage.clear(); // 清楚localStorage
				try {
					Gifted.Cache.deleteAllLocalFile(); // 删除缓存图片
				}catch(E){
					console.log(E.message);
				}
				Gifted.app.user.recreateDB(); // 重建表
			    Gifted.app.user.logout(); // 退出
			}
			this.on('clearcache',clearCache);
			this.on('switchCurrency',_.bind(function(val){
				Gifted.Global.switchCurrency(val, _.bind(function(){
					this.trigger('afterSwitchCurrency', val);
				},this));
			},this));
			this.on('switchLanguage',_.bind(function(localeName, excludes){
				Gifted.Global.switchLanguage(localeName, excludes, _.bind(function(){
					this.trigger('afterSwitchLanguage', localeName, excludes);
					window.location.reload();
				},this));
			},this));
			this.on('switchServer',_.bind(function(serverURL){
				clearCache();
				Gifted.Global.switchServer(serverURL, _.bind(function(){
					this.trigger('afterSwitchServer', serverURL);
					window.location.reload();
				},this));
			},this));
		}
	});
});