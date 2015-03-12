define([],function(){
	User = Backbone.Model.extend({
		constructor:function(){
			this.on('userModuleInitialized',this.onInited,this);
			User.__super__.constructor.apply(this,arguments); // User.__super__==Backbone.Model.prototype
		},
		onInited:function(){
			this.inited = true;
		},
		recreateDB:function() {
			var db = Gifted.Global.getDatabase('alluser');
			db.transaction(
			    function createUserTable(tx) {//创建用户表
			    	var sql = 'DROP TABLE IF EXISTS user';
			    	console.log(sql);
			    	tx.executeSql(sql); // TODO 当表结构发生变化时
			    	sql = 'CREATE TABLE IF NOT EXISTS user (ID,GIFTED_SESSIONID,CODE,NAME,REALNAME,SEX,USED,EMAIL,YEALS_OLD,COUNTRYCODE,MOBILE,PORTRAIT,RIGHTS,BUSINESSCARD,BUSINESSLICENCE,SELFINTRODUCTION,FOLLOWER,FOLLOW,FAVORITE,PRODUCT)';
			    	console.log(sql);
			        tx.executeSql(sql);
			    }
		    );
		},
		initialize : function() {
			this.on('loginSuccess',this.loginSuccess,this);
			this.on('logoutComplete',this.logoutComplete,this);
			this.favorites = new FavoritesCollection();
			this.conversationList = new ConversationCollection();
			//this.on('loginSuccess',this.registAppCID,this);
			_.defer(_.bind(function(){
				Gifted.Global.delSessionId();//清空遗留的SessionID
			    var db = Gifted.Global.getDatabase('alluser');
			    db.transaction(
				    function createUserTable(tx) {//创建用户表
				    	//tx.executeSql('DROP TABLE IF EXISTS user');//TODO 当表结构发生变化时
				        tx.executeSql('CREATE TABLE IF NOT EXISTS user (ID,GIFTED_SESSIONID,CODE,NAME,REALNAME,SEX,USED,EMAIL,YEALS_OLD,COUNTRYCODE,MOBILE,PORTRAIT,RIGHTS,BUSINESSCARD,BUSINESSLICENCE,SELFINTRODUCTION,FOLLOWER,FOLLOW,FAVORITE,PRODUCT)');
				    }
			    );
			    db.transaction(
			    	_.bind(function selectUser(tx){
			    		tx.executeSql('select * from user',[],_.bind(successSelectUser,this));
			    	},this)
			    );
			    function successSelectUser(tx,results){
			    	var length = results.rows.length;
			    	if(length == 0){//没有用户登录
			    		this.logoutComplete();
			    	}else if(length ==  1){//找到用户信息，恢复
			    		this.trigger('loginSuccess',[results.rows.item(0),false]);
			    	}else{//TODO 有多个账户，应该选一个，现在默认登录最后一个
			    		this.trigger('loginSuccess',[results.rows.item(length-1),false]);
			    	}
					this.trigger('userModuleInitialized');
				};
		    },this));
		},
		loginSuccess : function(params){
			this.setAttributes(params[0],params[1]);
			this.off('change:IMTOKEN',this.conversationList.startListening,this.conversationList);
			this.on('change:IMTOKEN',this.conversationList.startListening,this.conversationList);
			this.getIMToken();
		},
		/*regetIMToken:function() {
			if (!this.get('IMTOKEN'))
				setTimeout(this.getIMToken(),10000);
		},*/
		parse:function(response){
			console.log('user.models.parse.response:'+response);
		},
		getIMToken:function(){
			console.log('getIMToken.sessionID:'+Gifted.Global.getSessionId());
			if (!Gifted.Global.getSessionId())
				return;
			var url = Gifted.Config.serverURL+Gifted.Config.User.IMTokenURL+'?GIFTED_SESSIONID='+Gifted.Global.getSessionId(); // 跨域URL
			this.fetch({
				url : url,
				success:_.bind(function(response){
					console.log('user.models.getIMToken.response:'+response);
				},this),
				error:_.bind(function(){
					if (!this.get('IMTOKEN')) {
						_.debounce(_.bind(this.getIMToken, this),10000)();
					}
				},this)
			});
		},
		registAppCID:function(){
			var url = Gifted.Config.serverURL+Gifted.Config.User.APPCIDURL+
				'?GIFTED_SESSIONID='+Gifted.Global.getSessionId()+'&__APP_CID='+this.getAppClientID(); // 跨域URL
			this.save(null,{
				url : url
			});
		},
		register : function(params ,async){
			//params.GIFTED_SESSIONID = Gifted.Global.getSessionId();
			//params.GIFTED_LOCALNAME = Gifted.Config.Locale.localeName;
			params.GIFTED_POSITION = JSON.stringify(Gifted.Config.Position);
			$.ajax({
				//useBody:true,
				async : async==false?false:true,
				url : Gifted.Config.serverURL + Gifted.Config.User.registerURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				crossdomain:true,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.trigger('loginSuccess',[json,true]);
					this.trigger('registerSuccess',json);
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.trigger('error');
					this.trigger('registerError',{'errorCode':xhr.status,'errorInfo':xhr.responseText})
					/*if(401 == xhr.status){
						if (xhr.responseJSON)
							Gifted.Global.alert(xhr.responseJSON.error);
						else
							Gifted.Global.alert(xhr.responseText);
						//Backbone.history.history.back();
					}*/
				},this)
			});
		},
		getAppClientID : function(){
			if (Gifted.Config.isRealPhone==false)
				return null;
			if(!this.appCID && deviceIsAndroid)//TODO 等IOS做好再修改
				Gifted.Plugin.dispatch('getAppCID',[],_.bind(function(cid){
					this.appCID = cid;
				},this));
			return this.appCID;
		},
		login : function(params){
			Gifted.Global.delSessionId();
			//params.GIFTED_LOCALNAME = Gifted.Config.Locale.localeName;
			params.GIFTED_POSITION = JSON.stringify(Gifted.Config.Position);
			console.log('user.login:'+params.EMAIL+',url:'+Gifted.Config.serverURL + Gifted.Config.User.loginURL);
			this.trigger('request');
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.loginURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.trigger('loginSuccess',[json,true]);
					Backbone.history.history.back();//登录成功后，返回到之前操作的页面
				},this),
				complete : _.bind(function(XMLHttpRequest, textStatus) {
					this.trigger('sync');
				},this),
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.trigger('error');
					this.trigger('loginError',{'errorCode':xhr.status,'errorInfo':xhr.responseText})
				},this)
			});
		},
		// 用户的属性填充
		setAttributes:function(userInfo,insertDB){
			var json = {
				GIFTED_SESSIONID : userInfo['GIFTED_SESSIONID'],
				ID : userInfo.ID,
				CODE : (userInfo.CODE=='undefined'||userInfo.CODE=='null')?undefined:userInfo.CODE,
				EMAIL : (userInfo.EMAIL=='undefined'||userInfo.EMAIL=='null')?undefined:userInfo.EMAIL,
				COUNTRYCODE : (userInfo.COUNTRYCODE=='undefined'||userInfo.COUNTRYCODE=='null')?undefined:userInfo.COUNTRYCODE,
				MOBILE : (userInfo.MOBILE=='undefined'||userInfo.MOBILE=='null')?undefined:userInfo.MOBILE,
				NAME : (userInfo.NAME=='undefined'||userInfo.NAME=='null')?undefined:userInfo.NAME,
				REALNAME : (userInfo.REALNAME=='undefined'||userInfo.REALNAME=='null')?undefined:userInfo.REALNAME,
				SEX : (userInfo.SEX=='undefined'||userInfo.SEX=='null')?undefined:userInfo.SEX,
				YEARS_OLD : (userInfo.YEARS_OLD=='undefined'|| userInfo.YEARS_OLD=='null')?undefined:userInfo.YEARS_OLD,
				SELFINTRODUCTION : (userInfo.SELFINTRODUCTION=='undefined'||userInfo.SELFINTRODUCTION=='null')?undefined:userInfo.SELFINTRODUCTION,
				RIGHTS : userInfo.RIGHTS?userInfo.RIGHTS.split(';') : ['GUEST'],
				USED : userInfo.USED,
				PORTRAIT : (userInfo.PORTRAIT=='undefined'||userInfo.PORTRAIT=='null')?undefined:userInfo.PORTRAIT,
				BUSINESSCARD : (userInfo.BUSINESSCARD=='undefined'||userInfo.BUSINESSCARD=='null')?undefined:userInfo.BUSINESSCARD,
				BUSINESSLICENCE : (userInfo.BUSINESSLICENCE=='undefined'||userInfo.BUSINESSLICENCE=='null')?undefined:userInfo.BUSINESSLICENCE,
				FOLLOWER : userInfo.FOLLOWER,
				FOLLOW : userInfo.FOLLOW,
				FAVORITE : userInfo.FAVORITE,
				PRODUCT : userInfo.PRODUCT
			};
			this.set(json);
			Gifted.Global.setSessionId(userInfo['GIFTED_SESSIONID']);
			//this.set({"userInfo":{REALNAME:this.get('REALNAME'),NAME:this.get('NAME'),PORTRAIT:this.get('PORTRAIT')}});//触发 set attributes
			if(insertDB==true){//将用户信息保存到数据库
				var db = Gifted.Global.getDatabase('alluser');
				db.transaction(
					_.bind(function(tx){
						tx.executeSql('insert into user (ID,GIFTED_SESSIONID,CODE,NAME,REALNAME,SEX,USED,EMAIL,YEALS_OLD,COUNTRYCODE,MOBILE,PORTRAIT,RIGHTS,BUSINESSCARD,BUSINESSLICENCE,SELFINTRODUCTION,FOLLOWER,FOLLOW,FAVORITE,PRODUCT)' +
								'values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ',
								[this.get('ID'),this.get('GIFTED_SESSIONID'),this.get('CODE'),this.get('NAME'),this.get('REALNAME'),this.get('SEX'),this.get('USED'),this.get('EMAIL'),this.get('YEARS_OLD'),this.get('COUNTRYCODE'),this.get('MOBILE'),this.get('PORTRAIT'),this.get('RIGHTS').toString(),this.get('BUSINESSCARD'),this.get('BUSINESSLICENCE'),this.get('SELFINTRODUCTION'),this.get('FOLLOWER'),this.get('FOLLOW'),this.get('FAVORITE'),this.get('PRODUCT')])
					},this),
					function(err){
						Gifted.Global.alert(err.message);
					}
				);
			}
		},
		logout:function(logoutOnly){
			params = {GIFTED_SESSIONID:Gifted.Global.getSessionId(),
						__APP_CID : this.getAppClientID()};
			this.trigger('request');
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.logoutURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				crossdomain:true,
				complete : _.bind(function(XMLHttpRequest, textStatus) {
					this.trigger('sync');
					this.trigger('logoutComplete');
					if (logoutOnly==true) {
					}else {
						//Backbone.history.navigate('home',{trigger:true});//登出后跳转到首页
						Backbone.history.history.back();
					}
				},this),
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.trigger('error');
					this.trigger('logoutError',{'errorCode':xhr.status,'errorInfo':xhr.responseText})
				},this)
			});
		},
		logoutComplete:function(){
			//TODO 清除favorites
			var db = Gifted.Global.getDatabase('alluser');
		    db.transaction(
		    	_.bind(function selectUser(tx){
		    		tx.executeSql('delete from user where GIFTED_SESSIONID = ?',[Gifted.Global.getSessionId()]);
		    		this.clear({silent: true});
					Gifted.Global.delSessionId();
					this.set({RIGHTS:['GUEST']});
		    	},this)
		    );
			this.conversationList.stopListening();
			this.conversationList.clear();
			
		},
		forgetPassword : function(params){
			if(!params){
				return;
			}
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.forgetPasswordURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 10000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.set('forgetPasswordMessage',json.success);
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						Gifted.Global.alert(Gifted.Lang['PleaseInputEmail']);
					}else if(403){
						Gifted.Global.alert(Gifted.Lang['EmailIsWrong']);
					}
					Backbone.history.history.back();
				}
			});
		},
		checkIdentifyingCode : function(params){
			params.__APP_CID = this.getAppClientID();
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.checkIdentifyingCodeURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.setAttributes(json,true);
					Backbone.history.navigate('user/resetpassword',{trigger:true});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						Gifted.Global.alert(Gifted.Lang['WrongIdentifyingCode']);
						Backbone.history.history.back();
					}
				}
			});
		},
		modifyPassword : function(params){
			params.GIFTED_SESSIONID = Gifted.Global.getSessionId();
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.modifyPasswordURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					Gifted.Global.alert(json.success);
					Backbone.history.navigate('home',{trigger:true});//跳转到首页
				},
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						Backbone.history.navigate('user/modifypassword',{trigger:true});
					}
				}
			});
		},
		resetPassword : function(params){
			params.GIFTED_SESSIONID = Gifted.Global.getSessionId();
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.resetPasswordURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					Gifted.Global.alert(json.success);
					Backbone.history.navigate('home',{trigger:true});//跳转到首页
				},
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						Backbone.history.navigate('user/resetpassword',{trigger:true});
					}
				}
			});
		},
		save : function(params){
			params.GIFTED_SESSIONID = Gifted.Global.getSessionId();
			//params.GIFTED_LOCALNAME = Gifted.Config.Locale.localeName;
			params.GIFTED_POSITION = JSON.stringify(Gifted.Config.Position);
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.saveURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.setAttributes(json,true);
					this.trigger('saveSuccess');
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.trigger('saveError',{'errorCode':xhr.status,'errorInfo':xhr.responseText});
				},this)
			});
		},
		validateEmail:function(email){
			if(!email)
				return false;
			var re = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z]{2,4})+$/;
			if (re.test(email)){
			    return true;
			}
			return false;
		},
		
	});
	Publisher = Backbone.Model.extend({ // 此Model的attributes只有 "products" "userInfo" "following"
		initialize : function(userId){
			if(userId){
				this.ID = userId;
			}else{
				alert('Publisher must has ID');
			}
		},
		getUserInfo:function(){
			params = {GIFTED_SESSIONID:Gifted.Global.getSessionId()}; // 没登录不运行看任何用户信息
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL+Gifted.Config.User.userInfoURL+"/"+this.ID, // 跨域URL
				type : 'get',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.set({"userInfo":json});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.set({"userInfo":{}});
				},this)
			});
		},
		getProducts:function(){
			params = {GIFTED_SESSIONID:Gifted.Global.getSessionId()}; // 没登录不运行看任何用户产品
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.Product.getProductsURL + "/"+ this.ID, // 跨域URL
				type : 'get',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.set({"products":json});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : _.bind(function(xhr, info) { // jsonp 方式此方法不被触发
					this.set({"products":{}});
				},this)
			});
		}
	});
	UserInteractiveModel = Backbone.Model.extend({ // 此model的attributes什么都没有
		idAttribute: "ID",
		initialize : function(userId){
			this.set(this.idAttribute, userId);
		},
		loadData : function(reload){
			//params = {LOGINUSERID:loginUserId};
			params = {
				GIFTED_LOCALENAME:Gifted.Config.Locale.localeName,
				GIFTED_SESSIONID:Gifted.Global.getSessionId()
			}; // 没登录不运行看任何用户信息
			//params = {
			//	GIFTED_SESSIONID:Gifted.Global.getSessionId(), // 不能获取别人的favorites
			//	GIFTED_POSITION:JSON.stringify(Gifted.Config.Position) // 跟踪App启动时位置
			//};
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL+Gifted.Config.User.userInteractiveURL+"/"+this.get(this.idAttribute), // 跨域URL
				type : 'get',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success:_.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					//this.user.set({"userInfo" : json.userInfo,
					this.set({"userInfo" : json.userInfo,
						"following" : json.following,
						"products" : json.products,
						"favorites" : json.favorites});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					Gifted.Global.checkStatus(xhr.status);
				}
			});
		},
		addFollow : function(){
			params = {PUBLISHERID:this.ID,
					GIFTED_SESSIONID:Gifted.Global.getSessionId()};
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL+Gifted.Config.User.addFollowURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.set({"following":true});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
				}
			});
		},
		removeFollow : function(){
			params = {PUBLISHERID:this.ID,
					GIFTED_SESSIONID:Gifted.Global.getSessionId()};
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL+Gifted.Config.User.removeFollowURL, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				},
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.set({"following":false});
				},this),
				complete : function(XMLHttpRequest, textStatus) {
				},
				error : function(xhr, info) { // jsonp 方式此方法不被触发
				}
			});
		}
	});
	UserEditModel = Backbone.Model.extend({
		getSimCountryIso:function(){
			Gifted.Plugin.phoneNumber('getSimCountryIso',[],
				_.bind(function(json){
					this.set('SimCountryIso',json.SimCountryIso);
				},this),
				_.bind(function(){
					alert('getSimCountryIso error');
				},this));
		},
		getPhoneNumber:function(){
			Gifted.Plugin.phoneNumber('getPhoneNumber',[],
				_.bind(function(json){
					this.set("Line1Number",json.Line1Number);
				},this),
				_.bind(function(){
					alert('getPhoneNumber error');
				},this));
		}
	});
	MessageModel = Backbone.Model.extend({
		idAttribute:'MESSAGEID',
	});
	MessageCollection = Backbone.Collection.extend({
		model : MessageModel,
	});
	ConversationModel = Backbone.Model.extend({
		idAttribute:'CONVERSATIONID',
		initialize : function(){
			this.friend = new Publisher(this.get('CONVERSATIONID'));
			this.friend.on('change:userInfo',this.init,this);
			this.friend.getUserInfo();
			this.messageList = new MessageCollection();
		},
		dateFields:['time'],
		init:function(){
			var userInfo = this.friend.get('userInfo');
			this.set({'PORTRAIT':userInfo.PORTRAIT, 'NAME':userInfo.NAME});
			var unreadCount = this.get('unreadCount');
			if(!isNaN(unreadCount) && this.get('content')){
				this.receiveMessage(this.toJSON());
			}
			this.inited = true;
			this.trigger('Inited',this);
		},
		parse:function(response){
			var result = ConversationModel.prototype.parse.apply(this,arguments);
			this._parseItmes(json, catalogs, force);
		},
		_parseTimes:function(json){
			if (!json)
				return null;
		    _.each(this.dateFields, function(field) {
		    	if (json[field]) {
		    		var mm = moment(json[field]); // moment类型字段 直接转moment对象
		    		json[field+'_MOMENT'] = mm;
		    		json[field+'_formnow'] = mm.fromNow();
		    	}
		    });
			return json;
		},
		receiveMessage : function(message){
			var messageModel = new MessageModel(message);
			if(message.senderId == this.get('CONVERSATIONID'))
				messageModel.set({'PORTRAIT':this.get('PORTRAIT'),'NAME':this.get('NAME')});
			else
				messageModel.set({'PORTRAIT':Gifted.app.user.get('PORTRAIT'),'NAME':Gifted.app.user.get('NAME')});
			this.messageList.push(messageModel,{merge:true});
			this.set(message);
			this.trigger('receiveSuccess',this);
		},
		sendMessage : function(message){
			if(message.title){
				Gifted.Plugin.messageUtil('sendRichContentMessage',[message.targetId,message.title,message.content,message.imageUri],
					_.bind(function(message){this.sendSuccess(message)},this),
					_.bind(function(){
						alert('sendRichContentMessage error');
					},this));
			}else{
				Gifted.Plugin.messageUtil('sendTextMessage',[message.targetId,message.content],
					_.bind(function(message){this.sendSuccess(message)},this),
					_.bind(function(){
						alert('sendTextMessage error');
					},this));
			}
		},
		sendSuccess:function(message){
			var messageModel = new MessageModel(message);
			messageModel.set({'PORTRAIT':Gifted.app.user.get('PORTRAIT'),'NAME':Gifted.app.user.get('NAME')});
			this.messageList.push(messageModel,{merge:true});
			this.set(message);
			this.trigger('sendSuccess',this);
		},
		loadHistory : function(lastMessageId,count){
			var conversationType = this.get('conversationType')?this.get('conversationType'):'PRIVATE';//默认是私聊
			var conversationId = this.get('CONVERSATIONID');
			Gifted.Plugin.messageUtil('loadHistory',[conversationType,conversationId,lastMessageId,count],
				_.bind(function(messages){
					var models = [];
					for(var i in messages){
						var message = messages[i];
						var messageModel = new MessageModel(message);
						if(message.senderId == this.get('CONVERSATIONID'))
							messageModel.set({'PORTRAIT':this.get('PORTRAIT'),'NAME':this.get('NAME')});
						else
							messageModel.set({'PORTRAIT':Gifted.app.user.get('PORTRAIT'),'NAME':Gifted.app.user.get('NAME')});
						models.push(messageModel);
					}
					if(models.length>0)
						this.messageList.unshift(models,{merge:true}); 
				},this));
		},
		clearUnreadCount : function(){
			var conversationType = this.get('conversationType')?this.get('conversationType'):'PRIVATE';//默认是私聊
			var conversationId = this.get('CONVERSATIONID');
			Gifted.Plugin.messageUtil('clearUnreadCount',[conversationType,conversationId],
				_.bind(function(json){
					this.set(json);
				},this));
		}
	});
	ConversationCollection = Backbone.Collection.extend({
		model:ConversationModel,
		//初始化回话列表
		initConversationList : function(loginUserId){
			Gifted.Plugin.messageUtil('getConversationList',[],_.bind(function(conversationList){
				var conversations = [];
				for(var i in conversationList){
					var data = conversationList[i];
					var senderId = data.senderId;
					if(loginUserId == senderId){
						data.CONVERSATIONID = data.targetId;
					}else{
						data.CONVERSATIONID = data.senderId;
					}
					var conversation = new ConversationModel(data);
					conversations.push(conversation);
				}
				this.unshift(conversations,{merge:true});
				this.interval = setInterval(_.bind(this.getMessage,this),1000);
			},this));
		},
		startListening : function(user){
			Gifted.Plugin.messageUtil('connectIMServer',[user.get('IMTOKEN')],_.bind(function(userId){
				this.initConversationList(userId);
			},this));
		},
		stopListening : function(){
			clearInterval(this.interval);
		},
		clear : function(){
			while(this.size()>0)
				this.pop();
		},
		getMessage : function(){
			Gifted.Plugin.messageUtil('consumeMessage',[],_.bind(function(message){
				this.receiveMessage(message);
			},this));
		},
		receiveMessage : function(message){
			var conversation = this.get(message.senderId);
			if(!conversation){//添加conversation
				message.CONVERSATIONID = message.senderId;
				conversation = new ConversationModel(message);
				this.unshift(conversation,{merge:true});
			}else{
				conversation.receiveMessage(message);
			}
		}
	});
	FavoriteModel = Backbone.Model.extend({
		idAttribute:'PRODUCTID'
	});
	FavoritesCollection = Backbone.Collection.extend({
		model: FavoriteModel,
		initialize : function(models,options){
			this.on('change',this.onItemChange,this);
			this.on('add',this.onItemChange,this);
		},
		onItemChange:function(model){
			this.trigger('favoritechange:' + model.get(model.idAttribute),model);
		},
		loadFavorites : function(productIds){
			var url = Gifted.Config.serverURL+Gifted.Config.User.getFavorites+'?GIFTED_SESSIONID='+Gifted.Global.getSessionId()
				+'&IDS='+productIds; // 跨域URL
			this.fetch({
				url : url,
				remove: false,
				success : _.bind(function(json) {
					
				},this),
				error : function(json, xhr) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						Gifted.app.navigate('user/login', {trigger:true});
						//this.trigger('gotoLogin');
						//Backbone.history.navigate('user/useredit',{trigger:true});
					}
				}
			});
		},
		getFavorite : function(productId){
			return this.get(productId);
		},
		addFavorite : function(productID,publisherId){
			params = {GIFTED_SESSIONID:Gifted.Global.getSessionId(),
						PRODUCTID:productID,
						PUBLISHERID:publisherId};
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.addFavorite, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.add([json],{merge:true});
				},this),
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						//Backbone.history.navigate('user/useredit',{trigger:true});
					}
				}
			});
		},
		removeFavorite : function(productID,publisherId){
			params = {GIFTED_SESSIONID:Gifted.Global.getSessionId(),
						PRODUCTID:productID,
						PUBLISHERID:publisherId};
			$.ajax({
				//useBody:true,
				async : true,
				url : Gifted.Config.serverURL + Gifted.Config.User.removeFavorite, // 跨域URL
				type : 'post',
				dataType : 'json',
				data : params,
				timeout : 5000,
				success : _.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					this.add([json],{merge:true});
				},this),
				error : function(xhr, info) { // jsonp 方式此方法不被触发
					if(401 == xhr.status){
						//Backbone.history.navigate('user/useredit',{trigger:true});
					}
				}
			});
		},
	});
});