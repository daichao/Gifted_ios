/**
 Require js initialization module definition file for StudioLite
 @class Require init js
 **/
require.config({
    baseUrl: 'js',
    paths: {
        'jquery': 'lib/jquery/jquery-2.1.1.min',
        'jquery.datepicker':'lib/jquery/jquery.ui.datepicker',
        'jqmobile':'lib/jqmobile/jquery.mobile-1.4.5.min',
        'jquery.mobiscroll':'lib/mobiscroll/js/mobiscroll.custom-2.6.2.min',
        'jquery.mobitabs':'lib/mobitabs/jquery.mobile.tabs',
        'jquery.snipbox': 'lib/jquery/jquery.snipbox', // - num +
        //'jquery.workmark':'lib/jquery.wookmark',
        
        'text':'lib/text', // for require.js
        'underscore': 'lib/underscore', // for backbone.js
        'handlebars': 'lib/handlebars', // for backbone.js
        
        'backbone': 'lib/backbone/backbone',
        'backbone.controller': 'lib/backbone/backbone.controller',
        'backbone.cache': 'lib/backbone/backbone.fetch-cache',
        'backbone.pageable':'lib/backbone/backbone-pageable',
        'backbone.infinitscrollview':'lib/backbone/backbone.infinitscrollview',
        'backbone.modaldialog':'lib/backbone/backbone.modaldialog',
        'backbone.scrollview':'lib/scrollview/backbone.scrollview',
        
        //'appframework':'lib/jqmobi/jq.appframework.min',
        'appframework':'lib/jqmobi/appframework',
        'fastclick': 'lib/fastclick', // 彻底解决tap“点透”，提升移动端点击相应速度
        'translate':'lib/translate',
        'countdown':'lib/countdown',
        'moment':'lib/moment',
        'text':'lib/text', // for require.js
        'pageslider':'lib/pageslider',
        'snipbox': 'lib/jquery/jquery.snipbox', // - num +
        'owl-carousel':'lib/owl.carousel/owl.carousel.min', // 图片滑动
        'canvascarousel':'lib/canvascarousel', // 图片滑动2
        
        //'iscroll':'lib/iscroll/iscroll-probe',
        //'iscroll-infinite':'lib/iscroll/iscroll-infinite',
        //'iscroll-lite':'lib/iscroll/iscroll-lite-5.1.2',
        'iscroll':'lib/iscroll/iscroll-lite-5.1.2',
        
        'gifted.config':'lib/gifted/Gifted.Config',
        'gifted.global':'lib/gifted/Gifted.Global',
        'gifted.plugin':'lib/gifted/Gifted.Plugin',
        'gifted.cache':'lib/gifted/Gifted.Cache',
        'gifted.util':'lib/gifted/Gifted.Util',
        'gifted.view':'lib/gifted/Gifted.View',
        'gifted.language.en':'lib/gifted/Gifted.Lang.en',
        'gifted.language':'lib/gifted/Gifted.Lang.zh-cn', // 根据用户设置中的"语言选项"加载不同的语言包，默认根据当前地理位置判断"语言环境"
    	'gifted.countrycode':'lib/gifted/Gifted.CountryCode'
    },
    shim: {
        'backbone': {
            deps: ['underscore','jquery'],
            exports: 'Backbone'
        },
        'backbone.controller': {
        	exports: 'controller'
        },
        'underscore': {
            exports: '_'
        },
        'gifted.language': {
            deps: ['jquery']
        },
        'gifted.global': {
            deps: ['jquery','jqmobile']
        },
        'gifted.cache': {
            deps: ['gifted.config','gifted.global']
        },
        'translate':{
        }
    }
});
require(['jquery'],function($, language) { // 重载jquery方法
	$(document).bind("mobileinit", function() {
		$.mobile.defaultPageTransition = 'none'; // 'slide';
	    $.mobile.ajaxEnabled = false;
	    $.mobile.linkBindingEnabled = false;
	    $.mobile.hashListeningEnabled = false;
	    $.mobile.pushStateEnabled = false;
	    $.mobile.defaultHomeScroll = 0;
	    $.mobile.page.prototype.options.degradeInputs.date = true;
	});
	//$.ajax.prototype.useBody=true;
	$(document).ajaxSend(function(event, xhr, property) {
		//property.data+='&GIFTED_LOCALENAME='+Gifted.Config.Locale.localeName;
		/*if (property.url.indexOf('?')>=0)
			property.url+='&GIFTED_LOCALENAME='+Gifted.Config.Locale.localeName;
		else
			property.url+='?GIFTED_LOCALENAME='+Gifted.Config.Locale.localeName;*/
	});
	$(document).ajaxComplete(function(event, xhr, property) {
		//Gifted.Global.checkStatus(xhr.status);
		var s = xhr.getResponseHeader('sessionstatus');
 		if (s=='timeout') { // 服务器重启或异常导致session丢失后要触发App登出
 			Gifted.app.user.logout();
 		}
	});
	$(document).ajaxSuccess(function(event, xhr, property) {
	});
	$(document).ajaxError(function(event, xhr, property, xhrErr) {
		console.log('$(document).ajaxError:url='+property.url);
		console.log('$(document).ajaxError:status='+xhr.status+', xhrErr='+xhrErr);
		console.log('$(document).ajaxError:responseJSON='+xhr.responseJSON+', responseText='+xhr.responseText);
		if (xhr.responseJSON && xhr.responseJSON.error) { //  && (xhr.status==500 || xhr.status==0 || xhr.status==404) 
			if (xhr.status!=403 && xhr.status!=401) { // 认证错误在user代码里处理提示信息， 系统级别错误在这里封装弹出。
				if (xhr.status!=500) // 非服务器系统级别错误
					Gifted.Global.alert(xhr.responseJSON.error);
			}
			//Gifted.Global.checkStatus(xhr.status);
		}
	});
	//element.addEventListener('tap', doSomething, false); \\ Native
	//$('#element').on('tap', doSomething); \\ jQuery
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); // native inited
	//$(document).bind("mobileinit", function() { // mobile inited
		//$.mobile.transitionFallbacks.slide = "none"; //不支持3D转屏的设备禁止转屏效果
		//$.mobile.buttonMarkup.hoverDelay = "false"; //禁止hover延迟
	//});
	//$(document).off('swiperight swipeleft');
	//$(function() {
	//	if (typeof FastClick != 'undefined')
	//   	FastClick.attach(document.body);
	//});
});
require(['gifted.language'],function(language) { // 加载默认语言包
	TRANSLATE.setCurrentLang('zh_CN'); // 界面翻译用
	Gifted.Lang = TRANSLATE.getCurrentLangObject(); // 异常提示用
});
require(['App','jquery','jqmobile','underscore','fastclick',
	'gifted.global','gifted.config','gifted.plugin','gifted.cache','gifted.util','gifted.view'], function (App) {
	Gifted.app = new App(); // 启动App
	var serverURL = Gifted.Cache.getCache('settings.serverURL'); // 读取客户手动设置的参数
	if (serverURL) {
		Gifted.Global.switchServer(serverURL);
	}
	var localeName = Gifted.Cache.getCache('settings.localeName'); // 读取客户手动设置的参数
	if (localeName && Gifted.Config.Locale.localeName!=localeName) {
		Gifted.Global.switchLanguage(localeName);
	}
	var currency = Gifted.Cache.getCache('settings.currency'); // 读取客户手动设置的参数
	if (currency && Gifted.Config.Currency!=currency) {
		Gifted.Global.switchCurrency(currency);
	}
	//app.settings.trigger('switchLanguage', locale.value||'zh_CN');
	function onDeviceReady() { // navtive加载(必须放在这个js里，放在后面的js里onDeviceReady加载失败)
		FastClick.attach(document.body); // 真机才用FastClick
		//alert(deviceIsIOS);
		//alert(deviceIsAndroid);
		if (deviceIsIOS==true) {
			Gifted.Config.Event.tap='click';
		}
		Gifted.Config.Camera.sourceType = navigator.camera.PictureSourceType;
		Gifted.Config.Camera.destinationType = navigator.camera.DestinationType;
		/*function deviceMotionHandler(eventData){
			var rotation = eventData.rotationRate;
			if (rotation)
				console.log(rotation.gama);
		}
		if (window.DeviceMotionEvent) {
			console.log("DeviceMotionEvent is supported");
			window.addEventListener('devicemotion', deviceMotionHandler, false)
		} else {
			console.log("DeviceMotionEvent is not supported");
		}*/
		if (navigator.geolocation)
			_.defer(function(){
				// onSuccess Callback
				// This method accepts a Position object, which contains the current GPS coordinates
				function geolocationSuccess(position) {
				    /*alert('Latitude: '          + position.coords.latitude          + '\n' +
				          'Longitude: '         + position.coords.longitude         + '\n' +
				          'Altitude: '          + position.coords.altitude          + '\n' +
				          'Accuracy: '          + position.coords.accuracy          + '\n' +
				          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
				          'Heading: '           + position.coords.heading           + '\n' +
				          'Speed: '             + position.coords.speed             + '\n' +
				          'Timestamp: '         + position.timestamp                + '\n');*/
					Gifted.Config.Position.latitude=position.coords.latitude||0;
					Gifted.Config.Position.longitude=position.coords.longitude||0;
					Gifted.Config.Position.altitude=position.coords.altitude||0;
				};
				// onError Callback receives a PositionError object
				function geolocationError(error) {
				    console.log('code: '    + error.code    + '\n' +
				          'message: ' + error.message + '\n');
				}
				//navigator.geolocation.getCurrentPosition(geolocationSuccess, geolocationError);
				var geolocationOptions = { maximumAge: 10000, timeout: 5000, enableHighAccuracy: true }
				navigator.geolocation.watchPosition(geolocationSuccess, geolocationError, geolocationOptions);
			});
		if (navigator.globalization)
			_.defer(function(){
				navigator.globalization.getLocaleName(
				    function(locale) {
						var localeName = Gifted.Cache.getCache('settings.localeName'); // 手动设置过
						if (!localeName) {
							localeName = locale.value; // 自动获取本地语言
						}
						if (Gifted.Config.Locale.localeName!=localeName)
				    		Gifted.Global.switchLanguage(localeName);
				    },
				    function(error) {
				    	console.log('Error getting locale\n');
				    }
				);
			});
	}
	document.addEventListener("deviceready", onDeviceReady, false); // native inited
	//document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false); // native inited
	//document.addEventListener('mousedown', function (e) { e.preventDefault(); }, false); // native inited
	//document.addEventListener('click', function (e) { e.preventDefault(); }, false); // native inited
});