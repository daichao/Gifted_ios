/*******************************************************************************
 * Product业务模块
 * 
 * 多例
 ******************************************************************************/
// namespace
if (typeof Gifted == 'undefined')
	Gifted = {};
//================================== Page ==================================//
Gifted.Product = function(paras) {
	this.beanID = 'product'; // page对象ID
	this.pageListID = 'list-page';
	this.contentListID = 'contentList';
	this.pageDetailID = 'detail-page';
	this.contentDetailID = 'contentDetail';
	this.loadDataURL = Gifted.Config.Product.loadDataURL;
	this.loadItemURL = Gifted.Config.Product.loadItemURL;
	
	this.listScroll = null; // 滚动轴对象
	this.pullDownStart = -1; // 下拉更新的起始行
	this.pullDownCount = -1; // 下拉更新的总行
	this.start = -1; // 起始行
	this.count = -1; // 已经加载了多少行
	this.isInit = 0;
	this.pullDownEl = null;
	
	this.pickUrl = {}; // TODO 多张图片
	this.sourceType = null;  // getPicture:数据来源参数的一个常量
	this.destinationType = null;  // getPicture中：设置getPicture的结果类型
}
Gifted.Product.prototype.destroy = function() {
	this.listScroll = null; // 滚动轴对象
	this.pullDownStart = -1; // 下拉更新的起始行
	this.pullDownCount = -1; // 下拉更新的总行
	this.start = -1; // 显示起始行
	this.count = -1; // 已经加载了多少行
	this.isInit = 0;
	this.pullDownEl = null;
	if (this.listScroll) {
		this.listScroll.scope = null;
		this.listScroll.destroy();
	}
	this.pickUrl = {}; // TODO 多张图片
}
Gifted.Product.prototype.initial = function() {
}
Gifted.Product.prototype.initListScroll = function(){
	if (this.listScroll) {
		this.listScroll.destroy();
	}
	this.pullDownEl = document.getElementById(this.contentListID+'-pullDown');
	var scope1 = this;
	//this.listScroll = new IScroll('#'+this.contentListID+'-wrapper', 
	//	{hScrollbar:false, vScrollbar:false, vScroll:true, hScroll:false, bounceLock:true, topOffset:30});
	this.listScroll = new IScroll('#'+this.contentListID+'-wrapper', {
		//topOffset:30,
		mouseWheel:true,
		scrollbars:false,
		hScrollbar:false,
		vScrollbar:false,
		vScroll:false,
		hScroll:false, 
		bounceLock:true,
		useTransition:false, // 是否使用CSS变换
		topOffset:0,
		//scrollbarClass: 'listScrollbar', // 自定义样式 
		dd:true
	});
	this.listScroll.on('refresh', function () {
		var scope = this.scope||scope1;
		if (scope.pullDownEl.className.match('loading')) { // 正在加载
			scope.pullDownEl.className = 'pullDown';
			scope.pullDownEl.innerHTML = 'More...';
		}
		var d1 = $("#"+scope.contentListID+"-v1"), d2 = $("#"+scope.contentListID+"-v2");
		d1.listview('refresh');
		d2.listview('refresh');
	});
	this.listScroll.on('scrollEnd', function() {
		var pointX=this.pointX, pointY=this.pointY, scrollerH=this.scrollerH, wrapperH=this.wrapperH, absDistY=this.absDistY;
		var scope = this.scope||scope1;
		if (this.y==0 && this.distY>200) { // 在最上页并且往下拉动超过200
			scope.pullDownEl.className = 'loading';
			scope.pullDownEl.innerHTML = 'Loading...';
			scope.pullDownAction();	// 处理数据
		}
	});
	this.listScroll.scope = this;
	
	var localDatas = Gifted.Cache.getCache(this.beanID+"_datas");
	if (Gifted.Cache.isCache && localDatas && localDatas!='[]') { // 判断是否读取缓存信息
		Gifted.Global.log('正在从缓存读取离线数据');
		Gifted.Global.showLoading();
		this.clearHTML();
		var jsonData = JSON.parse(localDatas);
		this.paintList({start:this.start,count:this.count,datas:jsonData}, false);
		this.refresh();
	} else if (this.isInit == 0) {
		this.loadData();
		this.isInit = 1;
	}
}
Gifted.Product.prototype.createContentList = function(json) {
	var content = "<li class=\"ullist-item\" >"; // id=\""+json.ID+"\"
	content += '<div class=\"ullist-item-wrapper\">';
	if (json.PHOTOURLS && json.PHOTOURLS.length>0) { // Math.random()
		// 列表界面用记录id做为图片id
		var h = 80+Math.round(220*Math.random());
		content += "<img id=\"" + json.ID + "\" src=\""+Gifted.Config.emptyImg+"\" " 
			+" style=\"width:100%;height:"+h+"px;\" class=\"ullist-img\" "
			//+" onTap=\Gifted.Products['"+this.beanID+"'].itemClick(" + json.PHOTOURLS[0].PHOTOID + ");\"
			+" />";
	}
	content += '<p>&nbsp;</p>';
	content += '<p>';
	content += "<span class=\"titlestyle\">标&nbsp;题:"+json.NAME+"</span>";
	content += "</p>";
	content += '<p>';
	content += "<span class=\"titlestyle\">价&nbsp;格:"+json.PRICE+"</span>";
	content += "</p>";
	content += '</div>';
	content += "</li>";
	return content;
}
Gifted.Product.prototype.createContentDetail = function(json) {
	var content = ''; // id=\""+json.ID+"\"
	if (json.PHOTOURLS && json.PHOTOURLS.length>0) { // Math.random()
		content += '<div class=\"detail-images\">'
		content += '<div id=\"detail-images-wrapper\" class=\"detail-images-wrapper\" >'
		var len = json.PHOTOURLS.length;
		for (var i=0;i<len;i++) {
			content += "<img id=\"" + json.PHOTOURLS[i].PHOTOID + "_d\" src=\""+Gifted.Config.emptyImg+"\" data-large=\"#\""
				+" style=\"width:100%;height:400px;padding:0 35 0 0;\" class=\"uldetail-img\" index=\""+i+"\""
				//+" onTap=\Gifted.Products['"+this.beanID+"'].itemClick(" + json.PHOTOURLS[0].PHOTOID + ");\"
				+" />";
		}
		content += '</div>';
		content += '</div>';
		//content += '<div><button id=\"img-pre\">prev</button><button id=\"img-next\">next</button></div>';
	}
	content += '<p>&nbsp;</p>';
	content += '<p>';
	content += "<span class=\"titlestyle\">标&nbsp;题:"+json.NAME+"</span>";
	content += "</p>";
	content += '<p>';
	content += "<span class=\"titlestyle\">价&nbsp;格:"+json.PRICE+"</span>";
	content += "</p>";
	content += '<p>';
	content += "<span class=\"titlestyle\">描&nbsp;述:"+json.DESCRIPTON+"</span>";
	content += "</p>";
	content += '<p>';
	content += "<span class=\"titlestyle\">发布人:"+json.CREATEUSER+"</span>";
	content += "</p>";
	content += '';
	return content;
}
Gifted.Product.prototype.paintList = function(jsonObject, cacheIt) {
	//var jsonObject = {start:0, count:100, str:'JSONDatasString'}
	if (jsonObject.count==0) {
		Gifted.Global.log('服务器没有新数据');
	} else if (jsonObject.count==-1 || jsonObject.count>0) { // 从缓存加载或者服务器有新的数据
		if (jsonObject.start>=0) {
			this.start = jsonObject.start;
			this.count = jsonObject.count;
			if (Gifted.Cache.isCache) {
				Gifted.Cache.setCache(this.beanID+"_start", this.start);
				Gifted.Cache.setCache(this.beanID+"_count", this.count);
			}
		} else {
			if (Gifted.Cache.isCache) {
				this.start = Gifted.Cache.getCache(this.beanID+"_start");
				this.count = Gifted.Cache.getCache(this.beanID+"_count");
			}
		}
		this.start = Number(this.start);
		this.count = Number(this.count);
		var jsonList = [];
		if (jsonObject.datas) {
			jsonList = jsonObject.datas;
		}
		if (cacheIt!=false) {
			var jsonListStr = JSON.stringify(jsonList);
			if (Gifted.Cache.isCache && jsonListStr) {
				Gifted.Cache.putCache(this.beanID+"_datas", jsonListStr);
			}
		}
		var d1 = $("#"+this.contentListID+"-v1"), d2 = $("#"+this.contentListID+"-v2"), scope = this;
		for (var i=0;i<jsonList.length;i++) {
			var json = jsonList[i];
			if (json == null) {
				continue;
			}
			var content = this.createContentList(json);
			//d1.prepend(content);
			if (d1.children().length>d2.children().length)
				d2.prepend(content);
			else
				d1.prepend(content);
			if (json.PHOTOURLS && json.PHOTOURLS.length>0) { 
				Gifted.Cache.localFile(json.PHOTOURLS[0].PHOTOURL+'?imageView/1/w/200/h/300/q/25',  
					json.ID+'_1_200_300_25', json.ID); // remoteURL, imgID, domID
			}
	 　	}
	}
	this.refresh();
}
Gifted.Product.prototype.paintDetail = function(json, selected) {
	var html = this.createContentDetail(json);
	//$('#'+json.ID+'_images').html(html);
	$(selected).html(html);
	if (json.PHOTOURLS && json.PHOTOURLS.length>0) {
		var len = json.PHOTOURLS.length;
		for (var i=0;i<len;i++) {
			Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView/1/w/360/h/540/q/60', 
				json.PHOTOURLS[i].PHOTOID+'_1_360_540_60', json.PHOTOURLS[i].PHOTOID+'_d'); // remoteURL, imgID, domID
			if (i>0) {
				$('#'+json.PHOTOURLS[i].PHOTOID+'_d').css({display:'none',width:0});
			}
		}
		this.photoLength = len;
		/*//$('#detail-images-wrapper').Swipe().data('Swipe');
		this.mySwipe = Swipe(document.getElementById('detail-images-wrapper')
		, {
			startSlide : 2,
			speed : 400,
			auto : 3000,
			continuous : true,
			disableScroll : false,
			stopPropagation : false,
			callback : function(index, elem) {
			},
			transitionEnd : function(index, elem) {
			}
		}
		);
		var scope = this;
		$('#img-pre').die().bind('tap', function(){
			scope.mySwipe.prev();
		}); 
		$('#img-next').die().bind('tap', function(){
			scope.mySwipe.next();
		});*/
		/*$('img[data-large]').touchGallery({
	        getSource: function() { 
	          return $(this).attr('src');
	        }
      	});*/
		//<button onclick='mySwipe.prev()'>prev</button> 
  		//<button onclick='mySwipe.next()'>next</button>
	}
}
Gifted.Product.prototype.refresh = function() {
	var scope = this;
	setTimeout(function() {
		scope.listScroll.refresh();
		scope = null;
		Gifted.Global.hideLoading();
		Gifted.Global.log('已加载完全部信息');
	}, 200);
}
Gifted.Product.prototype.pullDownAction = function() {
	var scope = this;
	setTimeout(function(){
		scope.loadData();
		scope=null;
	}, 200);
}
Gifted.Product.prototype.checkConnection = function() {
	//Gifted.Plugin.dispatch('checkConnection', [], function(val){Gifted.Global.alert(val)});
	//return true;
	var b = Gifted.Global.checkConnection();
	return b;
}
Gifted.Product.prototype.clearHTML = function() {
	$('.ullist-item').die();
	var d1 = $("#"+this.contentListID+"-v1"), d2 = $("#"+this.contentListID+"-v2");
	d1.html('');
	d2.html('');
}
Gifted.Product.prototype.reloadData = function() {
	Gifted.Cache.clearCache(this.beanID+"_datas");
	Gifted.Cache.clearCache(this.beanID+"_start");
	Gifted.Cache.clearCache(this.beanID+"_count");
	this.start = -1;
	this.count = -1;
	this.clearHTML();
	this.loadData();
}
Gifted.Product.prototype.loadData = function() {
	try {
		if (Gifted.Config.isDemo==true) { // for debug
			Gifted.Global.showLoading();
			var ID = new Gifted.UUID().toString();
			var json = {
				count:1,
				start:0,
				datas:[{NAME:'111',ID:ID,DESCRIPTION:'test',CREATEUSER:'1',
					PHOTOURLS:[
						{PHOTOID:ID+'_0',PHOTOURL:'http://gifted.qiniudn.com/90d64efd-434f-4dd8-afe0-ea441951af42'},
						{PHOTOID:ID+'_1',PHOTOURL:'http://gifted.qiniudn.com/5c900e46-bfda-44e0-873a-d60335aacaad'}
					]
				}]
			};
			Gifted.Cache.putCache(this.beanID+"_datas", JSON.stringify(json.datas));
			this.paintList(json);
			Gifted.Global.hideLoading();
			return true;
		}
		if (!this.checkConnection()) {
			this.listScroll.refresh();
			return false;
		}
		Gifted.Global.showLoading();
		if (Number(this.start)<0 || Number(this.count)<0)
			if (Gifted.Cache.isCache) {
				this.start = Gifted.Cache.getCache(this.beanID+"_start")||-1;
				this.count = Gifted.Cache.getCache(this.beanID+"_count")||-1;
			}
		this.start = Number(this.start);
		this.count = Number(this.count);
		var params = {
			start : this.start,
			count : this.count
		};
		if (params.start>=0 && params.count>0)
			params.start+=params.count;
		var scope = this;
		$.ajax({
			async : true,
			url : Gifted.Config.serverURL + this.loadDataURL, // 跨域URL
			//type : 'get', // 应该是post但是用了jsonp就是get
			//dataType : 'jsonp', // 跨域
			//jsonp : 'jsoncallback', // 默认callback
			type : 'get',
			dataType : 'json',
			//headers: { 'origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
			//headers: { 'Access-Control-Allow-Origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
			//headers: { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"X-Requested-With" },
			//headers: { 'X-Requested-With': 'XMLHttpRequest'},
			data : params,
			timeout : 5000,
			beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
			    //jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			   	//jqXHR.setRequestHeader('Access-Control-Allow-Origin', '*');
			},
			success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
				scope.paintList(json);
				scope = null;
				Gifted.Global.hideLoading();
			},
			complete : function(XMLHttpRequest, textStatus) {
				Gifted.Global.hideLoading();
				if (textStatus!='success')
					Gifted.Global.alert(Gifted.Lang['NoServerResource']);
			},
			error : function(xhr) { // jsonp 方式此方法不被触发
				Gifted.Global.hideLoading();
				Gifted.Global.log(xhr);
				Gifted.Global.alert(Gifted.Lang['LoadProductDatasFail']);
			}
		});
	} catch (e) {
		if (this.isInit != 0) {
			Gifted.Global.alert(e.name + ": " + e.message);
		}
	}
}
Gifted.Product.prototype.findItemByID = function(productID, forceRemote) {
	var item = Gifted.Cache.findCacheItem(this.beanID+"_datas", function(json){
		if (json.ID==productID)
			return true;
		return false;
	});
	if (!item || forceRemote==true) {
		var params = {
			//productID : productID
		};
		$.ajax({
			async : false,
			url : Gifted.Config.serverURL + this.loadItemURL + '/' + productID, // 跨域URL
			//type : 'get', // 应该是post但是用了jsonp就是get
			//dataType : 'jsonp', // 跨域
			//jsonp : 'jsoncallback', // 默认callback
			type : 'get',
			dataType : 'json',
			//headers: { 'origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
			//headers: { 'Access-Control-Allow-Origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
			//headers: { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"X-Requested-With" },
			//headers: { 'X-Requested-With': 'XMLHttpRequest'},
			data : params,
			timeout : 5000,
			beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
			    //jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
			   	//jqXHR.setRequestHeader('Access-Control-Allow-Origin', '*');
			},
			success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
				Gifted.Cache.putCache(this.beanID+"_datas", JSON.stringify([json]));
				if (json.datas && json.datas.length>0)
					item = json.datas[0];
				//scope.paintList(json);
				//scope = null;
				Gifted.Global.hideLoading();
			},
			complete : function(XMLHttpRequest, textStatus) {
				Gifted.Global.hideLoading();
				if (textStatus!='success')
					Gifted.Global.alert(Gifted.Lang['NoServerResource']);
			},
			error : function(xhr) { // jsonp 方式此方法不被触发
				Gifted.Global.hideLoading();
				Gifted.Global.log(xhr);
				Gifted.Global.alert(Gifted.Lang['LoadProductItemFail']);
			}
		});
	}
	return item;
}
// ============================================= detail ===================================================== //
Gifted.Product.prototype.changeDetailPhoto = function(index) {
	var scope = this, len = this.photoLength;
	if (index < len - 1) {
		scope.imgIndex = index+1;
	} else {
		scope.imgIndex = 0;
	}
	scope.imgIndex2 = (scope.imgIndex2||0)+1;
	if (scope.imgIndex2==2)
		scope.imgIndex2 = 0;
	if (scope.imgIndex2==0) {
		var d = document.getElementById('detail-images-wrapper');
		$(d.childNodes[index]).css({display:'none',width:0});
		$(d.childNodes[scope.imgIndex]).css({display:'block',width:'100%'});
	}
}
Gifted.Product.prototype.detailData = function(productID) {
	if (!productID)
		return;
	this.productID = productID;
	var json = this.findItemByID(this.productID);
	this.paintDetail(json, '#'+this.contentDetailID);
	$.mobile.changePage('#'+this.pageDetailID,{
		transition : "slide"
	});
}
Gifted.Product.prototype.editData = function(productID) {
	if ($("#productID").val()==productID) // 切换界面时
		return;
	productID = productID||this.productID;
	if (!productID)
		return;
	var json = this.findItemByID(productID), scope = this;
	$("#productID").val(productID);
	$("#name").val(json.NAME||'');
	$("#description").val(json.DESCRIPTION||'');
	$("#catalog").val(json.CATALOG||1);
	$("#price").val(json.PRICE||0);
	for (var i=1;i<6;i++) {
		$("#image-btn"+i)[0].src = 'images/takepicture.png';
	}
	this.pickUrl = {};
	if (json.PHOTOURLS && json.PHOTOURLS.length>0) { // Math.random()
		var len = json.PHOTOURLS.length;
		for (var i=0;i<len;i++) {
			var domID = 'image-btn'+(i+1);
			Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL, 
				json.PHOTOURLS[i].PHOTOID, domID, // remoteURL, imgID, domID
				function(localURL) { // callback
					scope.pickUrl[domID]=localURL;//document.getElementById(domID).src;
					//if (i==len-1)
					//	scope = null;
				}
			); 
		}
	}
}
Gifted.Product.prototype.newData = function() {
	$("#productID").val('');
	$("#name").val('');
	$("#description").val('');
	$("#catalog").val('');
	$("#price").val('');
	for (var i=1;i<6;i++) {
		$("#image-btn"+i)[0].src = 'images/takepicture.png';
	}
	this.pickUrl = {};
};
Gifted.Product.prototype.isEmtpyValue = function(v) {
	return !v || v.length==0;
};
// ============================================= input camera ===================================================== //
Gifted.Product.prototype.photo4Camera = function() {
	$("#photo-dialog").dialog("close");
	try {
		//alert(1);
		//if (!this.sourceType)
			//this.sourceType = navigator.camera.PictureSourceType;
		//if (!this.destinationType)
			//this.destinationType = navigator.camera.DestinationType;
		//alert(this.sourceType);
		//alert(this.destinationType);
		var options = {
			quality : 100,
			sourceType : this.sourceType.CAMERA, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM,
			destinationType : this.destinationType.FILE_URI
			// cameraDirection : Camera.Direction.FRONT
			// targetWidth: 240,
			// targetHeight: 320,
			// correctOrientation : true
		};
		var scope = this;
		navigator.camera.getPicture(function(imageURI) { // imageData
			try {
				//alert(imageURI);
				var largeImage = document.getElementById(scope.imageDomID);
				largeImage.style.display = 'block';
				largeImage.src = imageURI;
				// largeImage.src = "data:image/jpeg;base64," + imageData;
				//scope.pickUrl.push(imageURI);
				scope.pickUrl[scope.imageDomID] = imageURI;
				scope = null;
				//$('#description').val(scope.pickUrl);
			} catch (e) {
				Gifted.Global.alert(e.message);
			}
		}, function() {
			Gifted.Global.log('加载相册出错!');
		}, options);
	} catch (E) {
		Gifted.Global.alert(E.message);
	}
}
Gifted.Product.prototype.photo4File = function() {
	$("#photo-dialog").dialog("close");
	try {
		//alert(1);
		//if (!this.sourceType)
			//this.sourceType = navigator.camera.PictureSourceType;
		//if (!this.destinationType)
			//this.destinationType = navigator.camera.DestinationType;
		//alert(this.sourceType);
		//alert(this.destinationType);
		var options = {
			quality : 100,
			sourceType : this.sourceType.PHOTOLIBRARY, // CAMERA, PHOTOLIBRARY, SAVEDPHOTOALBUM,
			destinationType : this.destinationType.FILE_URI
			// cameraDirection : Camera.Direction.FRONT
			// targetWidth: 240,
			// targetHeight: 320,
			// correctOrientation : true
		};
		var scope = this;
		navigator.camera.getPicture(function(imageURI) { // imageData
			try {
				//alert(imageURI);
				var largeImage = document.getElementById(scope.imageDomID);
				largeImage.style.display = 'block';
				largeImage.src = imageURI;
				// largeImage.src = "data:image/jpeg;base64," + imageData;
				//scope.pickUrl.push(imageURI);
				scope.pickUrl[scope.imageDomID] = imageURI;
				scope = null;
				//$('#description').val(scope.pickUrl);
			} catch (e) {
				Gifted.Global.alert(e.message);
			}
		}, function() {
			Gifted.Global.log('加载相册出错!');
		}, options);
	} catch (E) {
		Gifted.Global.alert(E.message);
	}
}
Gifted.Product.prototype.pickPhoto = function(domID) { // sourceType.PHOTOLIBRARY TODO 需要放到Gifted.Global.js中?
	this.imageDomID = domID;
	$("#trigger-photo-dialog").trigger("click");
};
Gifted.Product.prototype.deletePhoto = function() {
	$("#photo-dialog").dialog("close");
	var scope = this;
	//setTimeout(function(){
		if (scope.imageDomID) {
			$('#'+scope.imageDomID)[0].src = 'images/takepicture.png';
			delete scope.pickUrl[scope.imageDomID];
		}
	//},500);
}
Gifted.Product.prototype.cancelPhoto = function() {
	$("#photo-dialog").dialog("close");
}
/** **************上传图片和数据************** */ 
Gifted.Product.prototype.backList = function() {
	$("#deploy-dialog").dialog("close");
	$.mobile.changePage('#'+this.pageListID);
}
Gifted.Product.prototype.uploadFile = function() { // 需要放到Gifted.Global.js中?
	if (this.isEmtpyValue($("#catalog").val())) {
		Gifted.Global.alert(Gifted.Lang['NotSelectCatalog']);
		return;
	}
	if (this.isEmtpyValue($("#name").val())) {
		Gifted.Global.alert(Gifted.Lang['NotInputName']);
		return;
	}
	if (this.isEmtpyValue($("#description").val())) {
		Gifted.Global.alert(Gifted.Lang['NotInputDescription']);
		return;
	}
	if (this.isEmtpyValue($("#price").val())) {
		Gifted.Global.alert(Gifted.Lang['NotInputPrice']);
		return;
	}
	try {
		var b = Gifted.Global.checkConnection();
		if (!b)
			return;
	} catch (e) {
		Gifted.Global.alert(e.name + ": " + e.message);
		return;
	}
	var len = 0;
	for (var key in this.pickUrl) {
		len++;
	}
	if (len==0) {
		Gifted.Global.alert(Gifted.Lang['NotSelectPhotos']);
		return;
	}
	Gifted.Global.showLoading();
	this.transID = encodeURIComponent(new Gifted.UUID().toString());
	//var len = this.pickUrl.length;
	//for (var i = 0; i < len; i++) {
		//var imageURI = this.pickUrl[i];
	for (var key in this.pickUrl) {
		var imageURI = this.pickUrl[key];
		//alert(key+":"+imageURI);
		//continue;
		var params = {
			inputFileCount : len,
			inputTransID : this.transID, // 保证多次请求是一个事务
			inputProductID : encodeURIComponent($("#productID").val()),
			inputName : encodeURIComponent($("#name").val()),
			inputDescription : encodeURIComponent($("#description").val()),
			inputCatalog : encodeURIComponent($("#catalog").val()),
			inputPrice : encodeURIComponent($("#price").val())
		};
		//alert(params.inputProductID);
		var options = new FileUploadOptions();
		options.mimeType = "image/jpeg";
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/') + 1);
		options.params = params;
		//alert(imageURI);
		var ft = new FileTransfer(), scope = this; // phonegap file upload
		ft.upload(imageURI, encodeURI(Gifted.Config.serverURL + Gifted.Config.Product.uploadFileURL), 
			function(xhr) { // success
				//var key = '', k;
				//for (k in xhr) {
				// 	if (k=='responseCode'||k=='objectId')
				//		continue;
				//	key+=','+k;
				//}
				//alert(key);
				//alert(xhr.bytesSent); // 16691 length
				//alert(xhr.objectId); // null
				//alert(xhr.response); // [[{"23746":"D:/temp\\23746"}]]
				//alert(xhr.responseCode); //200
				var json = eval("(" + xhr.response + ")");
				if (json.saving==true) {
					Gifted.Global.log("上传完一个图片");
				} else if (json.ID) {
					Gifted.Global.hideLoading();
					var jsonListStr = JSON.stringify([json]);
					if (Gifted.Cache.isCache && jsonListStr) {
						Gifted.Cache.putCache(this.beanID+"_datas", jsonListStr);
					}
					$("#productID").val(json.ID); // 新增回填ID
					$("#trigger-deploy-dialog").trigger("click");
					//$.mobile.changePage("#deploy-dialog", {
					//	role : "dialog",
					//	transition : "slidedown"
					//});
				} else {
					Gifted.Global.hideLoading();
					Gifted.Global.alert(Gifted.Lang['ProductDeployFail']);
				}
		}, function(xhr) { // fail
			Gifted.Global.hideLoading();
			Gifted.Global.log(xhr);
			Gifted.Global.alert(Gifted.Lang['ProductRequestFail']);
		}, options);
	} // end for
};
//@Deprecated
Gifted.Product.prototype.saveData = function() { // 需要放到Gifted.Global.js中？
	Gifted.Global.showLoading();
	this.transID = encodeURIComponent(new Gifted.UUID().toString());
	var params = {
		inputFileCount : 0,
		inputTransID : this.transID, // 保证多次请求是一个事务
		inputProductID : encodeURIComponent($("#productID").val()),
		inputName : encodeURIComponent($("#name").val()),
		inputDescription : encodeURIComponent($("#description").val()),
		inputCatalog : encodeURIComponent($("#catalog").val()),
		inputPrice : encodeURIComponent($("#price").val())
	};
	$.ajax({
		async : false,
		url : Gifted.Config.serverURL + Gifted.Config.Product.saveDataURL, // 跨域URL
		//type : 'get', // 应该是post但是用了jsonp就是get
		//dataType : 'jsonp', // 跨域
		//jsonp : 'jsoncallback', // 默认callback
		type : 'post',
		dataType : 'json',
		//headers: { 'origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
		//headers: { 'Access-Control-Allow-Origin': Gifted.Config.serverURL, 'X-Requested-With': 'XMLHttpRequest'},
		//headers: { "Access-Control-Allow-Origin":"*", "Access-Control-Allow-Headers":"X-Requested-With" },
		//headers: { 'X-Requested-With': 'XMLHttpRequest'},
		data : params,
		timeout : 5000,
		beforeSend: function(jqXHR, settings) { // jsonp 方式此方法不被触发。dataType如果指定为jsonp的话，就已经不是ajax事件了
	    	//jqXHR.setRequestHeader({'X-Requested-With': 'XMLHttpRequest'});
		    //jqXHR.setRequestHeader('Origin', Gifted.Config.serverURL);
		},
		success : function(json) { // 客户端jquery预先定义好的callback函数，成功获取跨域服务器上的json数据后，会动态执行这个callback函数
			if (json.saving==true) {
				Gifted.Global.log("上传完一个图片");
			} else if (json.ID) {
				Gifted.Global.hideLoading();
				var jsonListStr = JSON.stringify([json]);
				if (Gifted.Cache.isCache && jsonListStr) {
					Gifted.Cache.putCache(this.beanID+"_datas", jsonListStr);
				}
				$("#productID").val(json.ID); // 新增回填ID
				$("#trigger-deploy-dialog").trigger("click");
				//$.mobile.changePage("#deploy-dialog", {
				//	role : "dialog",
				//	transition : "slidedown"
				//});
			} else {
				Gifted.Global.hideLoading();
				Gifted.Global.alert(Gifted.Lang['ProductDeployFail']);
			}
		},
		complete : function(XMLHttpRequest, textStatus) { // 请求完成
			Gifted.Global.hideLoading();
			if (textStatus!='success')
				Gifted.Global.alert('亲，服务器没有你要的');
		},
		error : function(xhr) { // jsonp 方式此方法不被触发
			Gifted.Global.hideLoading();
			Gifted.Global.log(xhr);
			Gifted.Global.alert("亲，保存错误，请重试");
		}
	});
}