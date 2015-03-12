/**
 * jquery翻译函数，针对所有存在attribute data-translate的节点进行内容替换，
 * 
 */
define(['jquery','underscore'],function($){
	var SimpleFormat = function(format,params) {
	    // The string containing the format items (e.g. "{0}")
	    // will and always has to be the first argument.
	    var theString = format;
	    // start with the second argument (i = 1)
	    if(params){
		    for (var i = 0; i < params.length; i++) {
		        // "gm" = RegEx options for Global search (more than one instance)
		        // and for Multiline search
		        var regEx = new RegExp("\\{" + i + "\\}", "gm");
		        theString = theString.replace(regEx, params[i]);
		    }
	    }
	    return theString;
	}
	$.fn.translate=function(targetLang){
		this.each(function(){
			$(this).find('*[data-translate]').each(function(){
				var translateStr = $(this).attr('data-translate');
				//可以没有data-translate-param,使用|隔开
				var translateParam = $(this).attr('data-translate-param') || '';
				var params = translateParam.split('|');
				var result = TRANSLATE.translate(translateStr,params);
				//$(this).text(result);
				$(this).html(result);
			})
		})
	};
	function langData(){
		this.data = {};
	};
	langData.prototype.addLangItem=function(lang,key,str){
		if(!this.data[lang]){
			this.data[lang]={};
		}
		this.data[lang][key] = str;
	};
	langData.prototype.getLangItem=function(lang,key){
		if(!this.data[lang]){
			this.data[lang]={};
		}
		return this.data[lang][key];
	};
	langData.prototype.getLangObject=function(lang){
		if(!this.data[lang]){
			this.data[lang]={};
		}
		return this.data[lang];
	};
	langData.prototype.translate=function(lang,key,params){
		if(this.data[lang] && this.data[lang][key]){
			var formatStr = this.data[lang][key];
			var result = SimpleFormat(formatStr,params);
			return result;
		}
	};
	TRANSLATE=$.fn.translate.prototype;
	TRANSLATE.langData = new langData();
	//注册一个语种，语种的注册可以重复执行，后注册的会覆盖前面注册的内容
	TRANSLATE.registerLangFromRes=function(lang,res){
		require([res],function(data){
			TRANSLATE.registerLang(lang,data);
		});
	};
	TRANSLATE.registerLang=function(lang,data){
		_.each(_.keys(data),function(key){
			TRANSLATE.langData.addLangItem(lang,key,data[key]);
		})
	};
	TRANSLATE.translate = function(key,params){
		return TRANSLATE.langData.translate(TRANSLATE.defaultLang,key,params);
	};
	TRANSLATE.setCurrentLang = function(lang){
		TRANSLATE.defaultLang=lang;
	};
	TRANSLATE.getCurrentLangItem = function(lang,key){
		return TRANSLATE.langData.getLangItem(lang||TRANSLATE.defaultLang, key);
	};
	TRANSLATE.getCurrentLangObject = function(lang){
		return TRANSLATE.langData.getLangObject(lang||TRANSLATE.defaultLang);
	};
});