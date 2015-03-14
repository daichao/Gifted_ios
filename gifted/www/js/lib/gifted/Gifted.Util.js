/*******************************************************************************
 * 工具包
 ******************************************************************************/
 // namespace
if (typeof Gifted == 'undefined')
	Gifted = {};
//================================== Util ==================================//
Gifted.Util={};
//================================== UUID ==================================//
(function() {
	var UUID = function() {
		this.id = this.createUUID();
	}
	// public share-class-function
	// When asked what this Object is, lie and return it's value
	UUID.prototype.valueOf = function() {
		return this.id;
	}
	// public share-class-function
	// toString
	UUID.prototype.toString = function() {
		return this.id;
	}
	// public share-class-function
	// INSTANCE SPECIFIC METHODS
	UUID.prototype.createUUID = function() {
		// Loose interpretation of the specification DCE 1.1: Remote Procedure
		// Call described at
		// http://www.opengroup.org/onlinepubs/009629399/apdxa.htm#tagtcjh_37
		// since JavaScript doesn't allow access to internal systems, the last
		// 48 bits of the node section is made up using a series of random
		// numbers (6
		// octets long).
		var dg = new Date(1582, 10, 15, 0, 0, 0, 0), dc = new Date();
		var t = dc.getTime() - dg.getTime(), h = '-';
		var tl = UUID.getIntegerBits(t, 0, 31);
		var tm = UUID.getIntegerBits(t, 32, 47);
		var thv = UUID.getIntegerBits(t, 48, 59) + '1'; // version 1, security
		// // version is 2
		var csar = UUID.getIntegerBits(UUID.rand(4095), 0, 7), csl = UUID
				.getIntegerBits(UUID.rand(4095), 0, 7);
		// since detection of anything about the machine/browser is far to
		// buggy,
		// include some more random numbers here
		// if NIC or an IP can be obtained reliably, that should be put in
		// here instead.
		var n = UUID.getIntegerBits(UUID.rand(8191), 0, 7)
				+ UUID.getIntegerBits(UUID.rand(8191), 8, 15)
				+ UUID.getIntegerBits(UUID.rand(8191), 0, 7)
				+ UUID.getIntegerBits(UUID.rand(8191), 8, 15)
				+ UUID.getIntegerBits(UUID.rand(8191), 0, 15); // this last
		// number
		// is two octets long
		return tl + h + tm + h + thv + h + csar + csl + h + n;
	}
	// NOTICE public static function
	// GENERAL METHODS (Not instance specific)
	// Pull out only certain bits from a very large integer, used to get the
	// time code information for the first part of a UUID. Will return zero's if
	// there aren't enough bits to shift where it needs to.
	UUID.getIntegerBits = function(val, start, end) {
		var base16 = UUID.returnBase(val, 16);
		var quadArray = new Array();
		var quadString = '';
		var i = 0;
		for (i = 0; i < base16.length; i++) {
			quadArray.push(base16.substring(i, i + 1));
		}
		for (i = Math.floor(start / 4); i <= Math.floor(end / 4); i++) {
			if (!quadArray[i] || quadArray[i] == '')
				quadString += '0';
			else
				quadString += quadArray[i];
		}
		return quadString;
	}
	// NOTICE public static function
	// Numeric Base Conversion algorithm from irt.org
	// In base 16: 0=0, 5=5, 10=A, 15=F
	UUID.returnBase = function(number, base) {
		// Copyright 1996-2006 irt.org, All Rights Reserved.
		// Downloaded from: http://www.irt.org/script/146.htm
		// modified to work in this class by Erik Giberti
		var convert = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A',
				'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
				'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
		if (number < base)
			var output = convert[number];
		else {
			var MSD = '' + Math.floor(number / base);
			var LSD = number - MSD * base;
			if (MSD >= base)
				var output = this.returnBase(MSD, base) + convert[LSD];
			else
				var output = convert[MSD] + convert[LSD];
		}
		return output;
	}
	// NOTICE public static function
	// pick a random number within a range of numbers
	// int b rand(int a); where 0 <= b <= a
	UUID.rand = function(max) {
		return Math.floor(Math.random() * max);
	}
	Gifted.UUID = UUID;
})();
//================================== hashCode ==================================//
(function(){
	Gifted.Util.hashCode  = function(str) {
        var h = 0;
        var len = str.length;
        var t = 32;
        for (var i = 0; i < len; i++) {
            h = 31 * h + str.charCodeAt(i);
            if(h > 31) 
            	h %= t;//java int溢出则取模
        }
        return h;
    }
})();
//================================== FileUploader ==================================//
(function(){
	function FileUploader(config) { // 多例
		this.zip = config.zip||false;
		this.pickUrl = {};
		this.deleteUrl = {};
		this.imageDom = null;
		this.imageKey = null;
	};
	FileUploader.prototype.initialize=function() {
	};
	FileUploader.prototype.check=function() {
		if (!this.imageDom) {
			throw {message:'没有指定FileUploader.this.imageDom'};
		}
		var key = this.imageKey||$(this.imageDom).attr('imageKey')||$(this.imageDom).attr('index');
		if (!key || key=='') {
			throw {message:'没有指定FileUploader.this.imageKey'};
		}
		this.imageKey = key;
	};
	FileUploader.prototype.photo4Debug=function(options1) {
		this.check();
		var imageURI = "http://gifted.qiniudn.com/00f04767-bd75-47b4-aecb-ca6ad7319468";
		var imageDom = this.imageDom;
		imageDom.style.display = 'block';
		imageDom.src = imageURI;
		// imageDom.src = "data:image/jpeg;base64," + imageData;
		this.pickUrl[this.imageKey] = imageURI;
		if (options1 && options1.callback)
			options1.callback(imageURI);
		delete this.deleteUrl[this.imageKey];
		console.log('photo4Debug:'+imageURI);
	};
	FileUploader.prototype.photo4Camera=function(options1) {
		try {
			// !Gifted.Config.isRealPhone
			if (!Gifted.Config.Camera.sourceType) { // 4PC-debug
				this.photo4Debug(options1);
				return;
			}
			this.check();
			var options = {
				saveToPhotoAlbum:true,
				sourceType:Gifted.Config.Camera.sourceType.CAMERA, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM,
				destinationType:Gifted.Config.Camera.destinationType.FILE_URI,
				//cameraDirection:Camera.Direction.FRONT
				allowEdit:true,
				targetWidth:640,
				targetHeight:480,
				quality:100,
				correctOrientation:true // true：按照片拍出来的方向存放（不自动旋转）
			};
			navigator.camera.getPicture(_.bind(function(imageURI) { // imageData
				try {
					var imageDom = this.imageDom;
					imageDom.style.display = 'block';
					imageDom.src = imageURI;
					// imageDom.src = "data:image/jpeg;base64," + imageData;
					this.pickUrl[this.imageKey] = imageURI;
					if (options1 && options1.callback)
						options1.callback(imageURI);
					delete this.deleteUrl[this.imageKey];
				} catch (e) {
					Gifted.Global.alert(e.message);
				}
			},this), function(event) {
				console.log('加载相机异常:'+JSON.stringify(event));
			}, options);
		} catch (E) {
			Gifted.Global.alert(E.message);
		}
	};
	FileUploader.prototype.photo4File = function(options1) {
		try {
			if (!Gifted.Config.Camera.sourceType) { // 4PC-debug
				this.photo4Debug(options1);
				return;
			}
			this.check();
			var options = {
				sourceType : Gifted.Config.Camera.sourceType.SAVEDPHOTOALBUM, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM,
				destinationType : Gifted.Config.Camera.destinationType.FILE_URI,
				allowEdit:true,
				targetWidth:640,
				targetHeight:480,
				quality:100,
				correctOrientation:true
			};
			navigator.camera.getPicture(_.bind(function(imageURI) { // imageData
				try {
					var imageDom = this.imageDom;
					imageDom.style.display = 'block';
					imageDom.src = imageURI;
					// imageDom.src = "data:image/jpeg;base64," + imageData;
					this.pickUrl[this.imageKey] = imageURI;
					if (options1 && options1.callback)
						options1.callback(imageURI);
					delete this.deleteUrl[this.imageKey];
				} catch (e) {
					Gifted.Global.alert(e.message);
				}
			},this), function(event) {
				console.log('加载相册异常:'+JSON.stringify(event));
			}, options);
		} catch (E) {
			Gifted.Global.alert(E.message);
		}
	};
	FileUploader.prototype.photo4MultiFile = function(options1) {
		try {
			if (!Gifted.Config.Camera.sourceType) { // 4PC-debug
				this.photo4Debug(options1);
				return;
			}
			this.check();
			options1=options1||{};
			var options = {
				maxPic:options1.maxPic||5,
				width:options1.width||640,
				height:options1.height||480,
				quality:options1.quality||100,
				sourceType:Gifted.Config.Camera.sourceType.SAVEDPHOTOALBUM, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM,
				destinationType:Gifted.Config.Camera.destinationType.FILE_URI,
				correctOrientation:true
			};
			Gifted.Plugin.phonePick('pickMutiPic', [options], // action,options,success,error
				_.bind(function(imageURIs) { // imageData
					if (options1 && options1.callback)
						options1.callback(imageURIs);
				},this), 
				function(event) {
					console.log('加载相册异常:'+JSON.stringify(event));
				});
		} catch (E) {
			Gifted.Global.alert(E.message);
		}
	};
	FileUploader.prototype.photoDelete=function() {
		this.check();
		this.imageDom.src = 'img/takepicture.png';
		this.deleteUrl[this.imageKey] = true;
		delete this.pickUrl[this.imageKey];
	};
	FileUploader.prototype.photoCount = function() {
		var count = 0;
		for (var key in this.pickUrl) 
			count++;
		return count;
	}
	FileUploader.prototype.photoPicked = function() {
		var photoCount = this.photoCount();
		return photoCount>0; // 检查是否有照片
	};
	FileUploader.prototype.upload = function(config) { // 批量上传
		//Gifted.Global.showLoading();
		var uploadUrlDebug=config.uploadUrlDebug, uploadUrl=config.uploadUrl
			, params=config.params, success1=config.success, failure1=config.failure;
		var photoCount = this.photoCount();
		//params._photoCount = count;
		//var isPCDebug = !Gifted.Config.isRealPhone; // && uploadUrlDebug!='' && uploadUrlDebug!=null;
		//params.GIFTED_LOCALENAME=Gifted.Config.Locale.localeName; // 保存时的语言环境(NOTICE transfer.body里中间层无法获取)
		if (photoCount==0) {
			console.log('uploader.onlysavedata');
			/*if (isPCDebug && uploadUrlDebug) { // 4PC-debug
				uploadUrl = uploadUrlDebug||uploadUrl;
				params.fileIndex = 1;
				params.inputImageURL = "http://gifted.qiniudn.com/00f04767-bd75-47b4-aecb-ca6ad7319468";
			}*/
			//params._pickUrl = JSON.stringify(this.pickUrl);
			params._deleteUrl = JSON.stringify(this.deleteUrl);
			$.ajax({ // browser ajax
				url : encodeURI(uploadUrl+'&_photoCount='+photoCount),
				async : true,
				type : 'post', // 应该是post但是用了jsonp就是get
				data : params,
				timeout : 5000,
				crossdomain:true,
				//dataType : 'jsonp', // 跨域
				//jsonp : 'jsoncallback', // 默认callback
				//beforeSend : function() { // jsonp
				//	// 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
				//},
				//complete : function(XMLHttpRequest, textStatus) { // 请求完成
				//},
				success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
					try {
						if (success1) success1(json, json.status);
					}finally{
						Gifted.Global.hideLoading();
					}
				},
				error : function(xhr) { // jsonp 方式此方法不被触发
					try {
						if (failure1) failure1(xhr.status, xhr.statusText);
					}finally{
						Gifted.Global.hideLoading();
					}
				}
			});
		} else {
			console.log('uploader.uploadfile');
            if (this.zip) { // 压缩模式一次上传
                var imageURIs = [], imageKeys = [];
                for (var key in this.pickUrl) {
                    imageKeys[imageKeys.length]=key;//+'.jpg';
                    imageURIs[imageURIs.length]=this.pickUrl[key];
                }
                Gifted.Plugin.zip('zip',[imageURIs,imageKeys]
                	,_.bind(function(fileURL){ // success
	                	if (!fileURL)
	                		return;
						params._pickUrl = JSON.stringify(this.pickUrl);
						params._deleteUrl = JSON.stringify(this.deleteUrl);
						var options = new FileUploadOptions();
						options.params = params;
						new FileTransfer().upload( // phonegap file upload
							fileURL, // localFileURL
							encodeURI(uploadUrl+'&_photoCount='+photoCount), // uploadURL
							function(xhr) { // success
								//Gifted.Global.logObject(xhr);
								try {
									var json = eval("(" + xhr.response + ")");
									if (success1) success1(json, xhr.responseCode, fileURL);
								}finally{
									Gifted.Global.hideLoading();
								}
							}, 
							function(xhr) { // fail
								try {
									if (failure1) failure1(xhr['http_status'], JSON.stringify(xhr), fileURL);
								}finally{
									Gifted.Global.hideLoading();
								}
							}, 
							options);
					},this)
					,function(fileURL) { // error
						console.log('Gifted.Plugin.zip.error:'+fileURL);
					}
                );
            } else { // 异步多次上传
				var c = 0;
				for (var key in this.pickUrl) {
					var imageURI = this.pickUrl[key];
					params._fileIndex = key;
					params._pickUrl = JSON.stringify(this.pickUrl);
					if (c==0) params._deleteUrl = JSON.stringify(this.deleteUrl); // 只要删除一次即可
					var options = new FileUploadOptions();
					options.params = params;
					c++;
					new FileTransfer().upload( // phonegap file upload
						imageURI, // localImageURL
						encodeURI(uploadUrl), // uploadURL
						function(xhr) { // success
							//Gifted.Global.logObject(xhr);
							try {
								var json = eval("(" + xhr.response + ")");
								if (success1) success1(json, xhr.responseCode, imageURI);
							}finally{
								Gifted.Global.hideLoading();
							}
						}, 
						function(xhr) { // fail
							//Gifted.Global.logObject(xhr);
							try {
								if (failure1) failure1(xhr['http_status'], JSON.stringify(xhr), imageURI);
							}finally{
								Gifted.Global.hideLoading();
							}
						}, 
						options);
				}
			}
		}
	};
	FileUploader.prototype.remove = function() {
		this.imageKey=null;
		this.imageDom=null;
		this.pickUrl={};
		this.deleteUrl={};
	};
	FileUploader.prototype.reset = FileUploader.prototype.remove;
	Gifted.Util.FileUploader = FileUploader;
})();
//================================== jquery patch ==================================//
define(['underscore','jquery'],function(_){
	var fullScreen = false;
	Gifted.Util.fullScreen = function(element) {
		fullScreen = true;
		if(element.requestFullscreen) {
		    element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
		    element.mozRequestFullScreen();
		} else if(element.msRequestFullscreen){ 
		    element.msRequestFullscreen();  
		} else if(element.webkitRequestFullscreen) {
		    element.webkitRequestFullScreen();
		}
	} 
	Gifted.Util.fullScreenCancel = function() {  
		fullScreen = false;
	  	if (document.exitFullscreen) {
	      	document.exitFullscreen();
	    } else if (document.msExitFullscreen) {
	      	document.msExitFullscreen();
	    } else if (document.mozCancelFullScreen) {
	      	document.mozCancelFullScreen();
	    } else if (document.webkitExitFullscreen) {
	      	document.webkitExitFullscreen();
	    }
	} 
	Gifted.Util.isFullScreen = function() {  
		return fullScreen;
	} 
	Gifted.Util.fullScreenToggle = function(element) {
		if (fullScreen==false) {
		 	Gifted.Util.FullScreen(element);
	  	} else {
	  		Gifted.Util.FullScreenCancel();
	  	}
	} 
	$.fn.serializeObject = function() {
	    var o = {};
	    var a = this.serializeArray();
	    $.each(a, function() {
	        if (o[this.name] !== undefined) {
	            if (!o[this.name].push) {
	                o[this.name] = [o[this.name]];
	            }
	            o[this.name].push(this.value||'');
	        } else {
	            o[this.name] = this.value||'';
	        }
	    });
	    return o;
	};
	var delayedFn=function(fn,interval,scope,repeat,count,args){
		this.count = 0;
		this.cancel=_.bind(function(){
			if(this.id){
				clearInterval(this.id);
				this.id = null;
			}
		},this);
		this.id = setInterval(_.bind(function(){
			if(!repeat){
				this.cancel();
			}
			fn.apply(scope,args||[]);
			if(repeat){
				this.count++;
				if(count && this.count>count){
					this.cancel();
				}
			}
		},this),interval);
	}
	return {
		DelayedTask : delayedFn
	}
});