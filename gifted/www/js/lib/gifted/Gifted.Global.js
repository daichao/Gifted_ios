/*******************************************************************************
 * Global相关的实现
 * 
 * 单例
 ******************************************************************************/
define(['jquery'],function($){
	// namespace
	if (typeof Gifted == 'undefined')
		Gifted = {};
	//================================== Global ==================================//
	if (Gifted.Global)
		return Gifted.Global;
	//================================== Global ==================================//
	Gifted.Global = {
		functionNoRight : function() {this.alert(Gifted.Lang['NoRight'])},
		functionLoadDatasFail : function() {this.alert(Gifted.Lang['LoadDatasFail'])},
		functionRequestFail : function() {this.alert(Gifted.Lang['RequestFail'])},
		functionServerDown : function() {this.alert(Gifted.Lang['ServerDown'])},
		checkStatus:function(status) { // 检查服务状态
			if (status==401 || status==403) {
				(_.debounce(this.functionNoRight, 10))();
			} else if (status>=500) {
				(_.debounce(this.functionRequestFail, 10))();
			} else if (status==0) {
				(_.debounce(this.functionServerDown, 10))();
			} else if (status=='error') {
				(_.debounce(this.functionLoadDatasFail, 10))();
			} else if (status=='null') {
				(_.debounce(this.functionRequestFail, 10))();
			}
		},
		checkConnection : function() {
			//Gifted.Plugin.dispatch('checkConnection', [], function(val){Gifted.Global.alert(val)});
			//return true;
			if (!navigator.network) { // PC
				return true;
			}
			var networkState = navigator.network.connection.type;
			if (networkState == Connection.NONE) {
				navigator.notification.confirm(Gifted.Lang['NewWorkLost'], function(event){return true;}/*callback*/
					, Gifted.Lang['Confirm'], Gifted.Lang['OK']);
				return false;
			} else {
				return true;
			}
		},
		switchCurrency:function(val, callback) {
			Gifted.Config.Currency = val;
			Gifted.Cache.setCache('settings.currency', val);
			if (callback)
				callback();
		},
		switchServer:function(serverURL, callback) {
			Gifted.Config.serverURL = serverURL;
			Gifted.Config.uploadServerURL = serverURL;
			Gifted.Cache.setCache('settings.serverURL', serverURL);
			// "读写分离"的服务器策略(现在默认用"读"服务器来POST)，以后指定到固定的几台"写"服务器上。"写"服务可能是端口不同，并且由客户端自动选择分流。
			/*// 随机从serverWriteDSNList获取
			if (Gifted.Config.serverURL.indexOf('http://gifted')==0 
				|| Gifted.Config.serverURL.indexOf('https://gifted')==0) {
				//Gifted.Config.uploadServerURL // http://gifted.5proapp.com // 写端口8087 // 读端口80
			} else { // NOTICE 测试时用同一个
				Gifted.Config.uploadServerURL = Gifted.Config.serverURL;
			}*/
			if (callback)
				callback();
		},
		switchLanguage:function(localeName, excludes, callback) {
			Gifted.Config.Locale.localeName=localeName;
			Gifted.Cache.setCache('settings.localeName', localeName);
			if (localeName=='zh_CN') {
				require(['gifted.language'],function(language) {
					TRANSLATE.setCurrentLang(localeName); // 界面翻译用
					Gifted.Lang = TRANSLATE.getCurrentLangObject(); // 异常提示用
					if (callback)
						callback(excludes);
				});
			} else {
				require(['gifted.language.en'],function(language) {
					TRANSLATE.setCurrentLang('en'); // 界面翻译用
					Gifted.Lang = TRANSLATE.getCurrentLangObject(); // 异常提示用
					if (callback)
						callback(excludes);
				});
			}
		},
		systemCallback:function(){
			$.ajax({ // 启动时服务器的回调
				async:true,
				url:Gifted.Config.serverURL + Gifted.Config.System.callbackURL, // 跨域URL
				type:'get',
				dataType:'json',
				timeout:5000,
				crossdomain:true,
				success:_.bind(function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					if (json.success) {
						eval(json.script);
					}
				},this),
				error:_.bind(function(xhr, info) {
				},this),
				beforeSend: _.bind(function(xhr, settings) {
				},this),
				complete:_.bind(function(xhr, status) {
				},this)
			});
		},
		alert : function(text) {
			if (navigator && navigator.notification)
				navigator.notification.alert(text, function(event){return true;}/*callback*/); // 'Title', 'OK');
			else
				alert(text);
		},
		confirm:function(text) {
			navigator.notification.confirm(text, function(event){return true;}/*callback*/); // 'Title', 'OK,Cancel'); 
		},
		exitApp : function() {
			navigator.app.exitApp();
		},
		logObject : function(obj) {
			var key = '', val = '', k;
			for (k in obj) {
				if (k=='body') {
					console.log(obj[k]);
					continue;
				}
				key+=','+k;
				val+=','+obj[k];
			}
			alert(key);
			alert(val);
		},
		log : function(text) {
			console.log(text);
			//echo(text);
		},
		showLoading : function() {
			$.mobile.loading("show", {
			  text: "Loading...",
			  textVisible: true,
			  theme: "z", //theme: "a",
			  html: ""
			});
			//"<div style='font-weight:bold;font-color:#ff8030;text-align:center;'>Loading...</div>"
			//$.mobile.loadingMessageTextVisible = true; //1.3.x
			//$.mobile.showPageLoadingMsg("a", "加载中...");//1.3.x
		},
		hideLoading : function() {
			$.mobile.loading("hide");
			//$.mobile.loadingMessageTextVisible = false;//1.3.x
			//$.mobile.hidePageLoadingMsg();//1.3.x
		},
		// protected
		doSetCookie : function(name, value, expires, path, domain, secure) {
			localStorage.setItem(name, value);
			return;
			if(!path)
				path='/';
			var curCookie = name + "=" + escape(value)
					+ ((expires) ? "; expires=" + expires.toGMTString() : "")
					+ ((path) ? "; path=" + path : "")
					+ ((domain) ? "; domain=" + domain : "")
					+ ((secure) ? "; secure" : "");
			document.cookie = curCookie;
		},
		// public
		setCookie : function(name, value, days) {
			//name = C_SERVICE + '.' + name;
			var days = days || 30;
			var expires = new Date();
			expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * days);
			this.doSetCookie(name, value, expires);
		},
		// protected
		doGetCookie : function(name) {
			return localStorage.getItem(name);
			
			var dc = document.cookie;
			var prefix = name + "=";
			var begin = dc.indexOf("; " + prefix);
			if (begin == -1) {
				begin = dc.indexOf(prefix);
				if (begin != 0)
					return null;
			} else
				begin += 2;
			var end = document.cookie.indexOf(";", begin);
			if (end == -1)
				end = dc.length;
			return unescape(dc.substring(begin + prefix.length, end));
		},
		// public
		getCookie : function(name) {
			//name = C_SERVICE + '.' + name;
			return this.doGetCookie(name);
		},
		// protected
		doDelCookie : function(name, path, domain) {
			localStorage.removeItem(name);
			return;
			
			if (this.getCookie(name)) {
				document.cookie = name + "=" + ((path) ? "; path=" + path : "")
					+ ((domain) ? "; domain=" + domain : "")
					+ "; expires=Thu, 01-Jan-70 00:00:01 GMT";
			}
		},
		// public
		delCookie : function(name) {
			//name = C_SERVICE + '.' + name;
			this.doDelCookie(name);
		},
		setSessionId : function(value){
			localStorage.setItem("GIFTED_SESSIONID", value);
			this.sessionid = value;
		},
		getSessionId : function(){
			if(this.sessionid)
				return this.sessionid;
			return localStorage.getItem("GIFTED_SESSIONID");
		},
		delSessionId : function(){
			localStorage.removeItem("GIFTED_SESSIONID");
			delete this.sessionid;
		},
		getDatabase: function(database){
			if (!window.openDatabase) {
				return (function(transaction){
					console.log('transaction:'+transaction);
				})();
			}
			return window.openDatabase("gifted_"+database, "1.0", "Gifted Database", 200000);
		},
		// 取参数Map
		getUrlParam : function(string) {
			var obj = new Array();
			if (string.indexOf("?") != -1) {
				var string = string.substr(string.indexOf("?") + 1);
				var strs = string.split("&");
				for (var i = 0;i < strs.length; i++) {
					var tempArr = strs[i].split("=");
					obj[i] = tempArr[1];
				}
			}
			return obj;
		},
		// 取地址栏指定参数
		$G : function() {
			var Url = document.location.href;
			var u, g, StrBack = '';
			if (arguments[arguments.length - 1] == "#")
				u = Url.split("#");
			else
				u = Url.split("?");
			if (u.length == 1)
				g = '';
			else
				g = u[1];
			if (g != '') {
				var gg = g.split("&");
				var MaxI = gg.length;
				var str = arguments[0] + "=";
				for (var i = 0; i < MaxI; i++) {
					if (gg[i].indexOf(str) == 0) {
						StrBack = gg[i].replace(str, "");
						break;
					}
				}
			}
			return StrBack;
		},
		// 类似$G，取地址栏所有参数
		$Gs : function() {
			var Url = document.location.href;
			var u, g, StrBack = '';
			if (arguments[arguments.length - 1] == "#")
				u = Url.split("#");
			else
				u = Url.split("?");
			if (u.length == 1)
				g = '';
			else
				g = u[1];
			if (g != '') {
				var gg = g.split("&");
				var MaxI = gg.length;
				var paras = {}, ps;
				for (var i = 0; i < MaxI; i++) {
					ps = gg[i].split('=');
					if (ps.length == 2) {
						paras[ps[0]] = ps[1];
					}
				}
			}
			return paras;
		}
	};
	return Gifted.Global;
});