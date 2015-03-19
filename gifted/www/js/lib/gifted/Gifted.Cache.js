/*******************************************************************************
 * 离线工具js 默认使用html5的localstorage实现，也可以调用phongegap的native持久化程序(文件系统)实现
 * 
 * 单例
 ******************************************************************************/
 define(['jquery'],function($){
	// namespace
	if (typeof Gifted == 'undefined')
		Gifted = {};
	//================================== Cache ==================================//
	if (Gifted.Cache)
		return Gifted.Cache;
	//================================== Cache ==================================//
	Gifted.Cache = {
		/**
		 * 下载缓存图片
		 * 
		 * @param sourceURL 源图片地址
		 * @param targetURL 目标图片地址
		 * @parem domID || dom
		 * @parem callback
		 */
		downloadPic : function(sourceURL, targetURL, domID, callback) {
			if (typeof FileTransfer == 'undefined') {
				var domImg = (typeof domID=='string')?document.getElementById(domID):domID;
				domImg.style.display = 'block';
				domImg.src = sourceURL; // network url
				//console.log('下载net图片文件:'+sourceURL);
				if (callback)
					callback.call(callback.scope||this, sourceURL);
				return;
			}
			var fileTransfer = new FileTransfer();
			fileTransfer.download(encodeURI(sourceURL), targetURL,
				function(fileEntry) { // success
					var domImg = (typeof domID=='string')?document.getElementById(domID):domID;
					domImg.style.display = 'block';
					domImg.src = targetURL; // local url
					//console.log('下载cache图片文件到:'+targetURL);
					if (callback)
						callback.call(callback.scope||this, targetURL);
				},
				function(error) { // error
					console.log("下载cache图片出错:"+JSON.stringify(error));
				});
		},
		/** 
		 * 加载缓存图片 若缓存中没有该图片则下载
		 * 
		 * @param sourceURL 目标图片地址
		 * @param imgID 图片ID
		 * @param domID || dom
		 * @param callback
		 * @param override
		 */
		localFile : function(sourceURL, imgID, domID, callback, override) {
			//alert('localFile:'+(typeof LocalFileSystem));
			if (typeof LocalFileSystem == 'undefined') {
				this.downloadPic(sourceURL, null, domID, callback);
				return;
			}
			var scope = this;
			//console.log("将要加载文件系统...");
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
				function(fs) { // request filesystem successful
					var fileSystem = fs;
					//console.log("将要加载根目录:"+Gifted.Config.Cache.dir);
					fileSystem.root.getDirectory( 
						Gifted.Config.Cache.dir, // 根目录
						{ // options
							create : true, // 创建目录
							exclusive : false
						}, 
						function(fileEntry) { // create dir successful
							var hashCode = Gifted.Util.hashCode(imgID);
							var _hashDir = Gifted.Config.Cache.dir+'/'+hashCode;
							//onsole.log("将要加载Hash目录:"+_hashDir);
							fileSystem.root.getDirectory(
								_hashDir, // hash目录
								{ // options
									create : true, // 创建目录
									exclusive : false
								},
								function(parentEntry) { // exists 文件存在就直接显示
									var _localFile = _hashDir+'/'+imgID;
									//console.log("将要加载缓存文件:"+_localFile);
									fileSystem.root.getFile(
										_localFile, // 要查找的本地文件
										{ // options
											create : false, // 不创建
											exclusive : false
										},
										function(fileEntry) { // exists 文件存在就直接显示
											if (override==true) { // 如果覆盖文件就要重新下载图片
												fileSystem.root.getFile(
													_localFile, // 要创建的本地文件
													{ // options
														create : false,  // 不创建文件
														exclusive : false
													},
													function(fileEntry) { // create file successful
														var targetURL = fileEntry.fullPath;
														scope.downloadPic(sourceURL, targetURL, domID, callback);
														scope = null;
													},
													function(error) { // create file failure
														console.log('创建缓存文件出错:'+JSON.stringify(error)+',localFile='+_localFile);
													});
											} else {
												var targetURL = fileEntry.fullPath;
												var domImg = (typeof domID=='string')?document.getElementById(domID):domID;
												domImg.style.display = 'block';
												domImg.src = targetURL; // local url
												//console.log('找到缓存文件:'+targetURL);
												if (callback)
													callback.call(callback.scope||scope, targetURL);
											}
										},
										function(error) { // not existes 否则就到网络下载图片
											fileSystem.root.getFile(
												_localFile, // 要创建的本地文件
												{ // options
													create : true,  // 先创建空文件
													exclusive : false
												},
												function(fileEntry) { // create file successful
													var targetURL = fileEntry.fullPath;
													scope.downloadPic(sourceURL, targetURL, domID, callback);
													scope = null;
												},
												function(error) { // create file failure
													console.log('创建缓存文件出错:'+JSON.stringify(error)+',localFile='+_localFile);
												});
										});
								},
								function(error) { // create dir failure
									console.log('创建Hash目录出错:'+JSON.stringify(error)+',hashDir='+_hashDir);
								});
						}, 
						function(error) { // create dir failure
							console.log('创建根目录失败:'+JSON.stringify(error)+',rootDir='+Gifted.Config.Cache.dir);
						});
				}, 
				function(error) { // request filesystem failure
					console.log("加载文件系统出错:"+JSON.stringify(error));
				});
		},
		/**
		 * 删除Image缓存
		 */
		deleteLocalFile : function(imgID) {
			if (typeof LocalFileSystem == 'undefined') {
				return;
			}
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
				function(fs) { // success
					var fileSystem = fs;
					var hashCode = Gifted.Util.hashCode(imgID);
					var _hashDir = Gifted.Config.Cache.dir+'/'+hashCode;
					var _localFile = _hashDir+'/'+imgID;
					//console.log("将要删除文件:"+_localFile);
					fileSystem.root.getFile(
						_localFile, 
						{ // options
							create : false, // 不创建
							//exclusive : false // 需要转化为file对象
						},
						function(fileEntry) { // success
							fileEntry.removeRecursively( // 删除此目录及其所有内容
								function(event) { // success
									console.log("删除缓存文件成功:"+JSON.stringify(event));
								},
								function(error) { // fail
									console.log("删除缓存文件失败:"+JSON.stringify(error));
								});
						}, 
						function(error) { // fail
							console.log("缓存文件不存在:"+JSON.stringify(error));
						});
				}, 
				function(error) { // fail
					console.log("加载文件系统出现错误:"+JSON.stringify(error));
				});
		},
		/**
		 * 删除所有文件缓存
		 */
		deleteAllLocalFile : function() {
			if (typeof LocalFileSystem == 'undefined') {
				return;
			}
			window.requestFileSystem(LocalFileSystem.PERSISTENT, 0,
				function(fs) { // success
					var fileSystem = fs;
					fileSystem.root.getDirectory(
						Gifted.Config.Cache.dir, 
						{ // options
							create : false, // 不创建
							//exclusive : false // 需要转化为file对象
						},
						function(dirEntry) { // success
							dirEntry.removeRecursively( // 删除此目录及其所有内容
								function(event) { // success
									console.log("删除缓存文件成功:"+JSON.stringify(event));
								},
								function(error) { // fail
									console.log("删除缓存文件失败:"+JSON.stringify(error));
								});
						}, 
						function(error) { // fail
							console.log("缓存文件不存在:"+JSON.stringify(error));
						});
				}, 
				function(error) { // fail
					console.log("加载文件系统出现错误:"+JSON.stringify(error));
				});
		},
		// ---------------------------------------------- localStorage ---------------------------------------------- //
		/**
		 * 合并cache
		 * 
		 * @param key
		 * @param jsonObject
		 */
		putCache : function(key, jsonObject) {
			var localDatas = localStorage.getItem(key);
			if (localDatas) {
				var preJsonList = JSON.parse(localDatas), preLength = preJsonList.length;
				if (preLength>=Gifted.Config.Cache.cacheLimit*0.95) {
					console.log('缓存受限:key='+key+',length='+preLength+',limit='+Gifted.Config.Cache.cacheLimit);
					return true;
				}
				var newJsonList = $.isArray(jsonObject)?jsonObject:JSON.parse(jsonObject), 
					newLength = newJsonList.length;
				var /*finalJsonList = [], */isExist = false; // 根据ID是否匹配来检查是否已经缓存
				loop_1 : for (var i = 0;i < preLength; i++) { // NOTICE 在key相同情况下，默认都是没有重复的情况
					if (!preJsonList[i]) {
						continue;
					}
					for (var j = 0;j < newLength; j++) {
						if (!newJsonList[j]) {
							continue;
						}
						if (preJsonList[i].ID == newJsonList[j].ID) {
							isExist = true;
							preJsonList[i] = newJsonList[j]; // 覆盖新值
							break loop_1;
						}
					}
				}
				if (isExist == false) { // 拼接json对象
					/*for (var i=newLength-1;i>=0;i--) { // 最新的排最前面
						if (newJsonList[i]) {
							finalJsonList[finalJsonList.length] = newJsonList[i];
						}
					}*/
					/*for (var i=0;i<preLength;i++) {
						if (preJsonList[i]) {
							finalJsonList[finalJsonList.length] = preJsonList[i];
						}
					}
					for (var i=0;i<newLength;i++) {
						if (newJsonList[i]) {
							finalJsonList[finalJsonList.length] = newJsonList[i];
						}
					}*/
					for (var i=0;i<newLength;i++) {
						if (newJsonList[i]) {
							preJsonList[preJsonList.length] = newJsonList[i];
						}
					}
				}
				jsonObject = JSON.stringify(preJsonList); // 0 最新 len-1最老
			} else {
				if ($.isArray(jsonObject)) {
					if (jsonObject.length>=Gifted.Config.Cache.cacheLimit*0.95) {
						console.log('缓存受限:key='+key+',length='+preLength+',limit='+Gifted.Config.Cache.cacheLimit);
						return true;
					}
				}
				jsonObject = $.isArray(jsonObject)?JSON.stringify(jsonObject):jsonObject;
			}
			localStorage.setItem(key, jsonObject); // 存入缓存
			return false;
		},
		/**
		 * 设置Cache
		 * 
		 * @param key
		 * @param string data
		 */
		setCache : function(key, data) {
			localStorage.setItem(key, data);
		},
		/**
		 * 获得Cache
		 * 
		 * @param key
		 * @return string data
		 */
		getCache : function(key) {
			return localStorage.getItem(key);
		},
		/**
		 * @param key
		 * @param filter function(json){check json}
		 * @return json
		 */
		setCacheItem : function(key, filter, item) {
			var localDatas = localStorage.getItem(key);
			if (localDatas == null || typeof localDatas === "undefined") {
				return null;
			} else {
				var jsonList = JSON.parse(localDatas), len=jsonList.length;
				for (var i=0;i<len;i++) {
					if (filter && filter.call(this, jsonList[i])==true) {
						jsonList[i]=item;
						break;
					}
				}
				localStorage.setItem(key, JSON.stringify(jsonList));
			}
		},
		/**
		 * @param key
		 * @param filter function(json){check json}
		 * @return json
		 */
		findCacheItem : function(key, filter) {
			var localDatas = localStorage.getItem(key);
			if (localDatas == null || typeof localDatas === "undefined") {
				return null;
			} else {
				var jsonList = JSON.parse(localDatas), len=jsonList.length;
				for (var i=0;i<len;i++) {
					if (filter && filter.call(this, jsonList[i])==true)
						return jsonList[i];
				}
				return null;
			}
		},
		/**
		 * 0 最新 len-1最老
		 * 
		 * @return json
		 */
		getFirstCacheItem : function(key) {
			var localDatas = localStorage.getItem(key);
			if (localDatas == null || typeof localDatas === "undefined") {
				return null;
			} else {
				var jsonList = JSON.parse(localDatas);
				if (jsonList && jsonList.length > 0)
					return jsonList[0];
				return null;
			}
		},
		/**
		 * 0 最新 len-1最老
		 * 
		 * @return json
		 */
		getLastCacheItem : function(key) {
			var localDatas = localStorage.getItem(key);
			if (localDatas == null || typeof localDatas === "undefined") {
				return null;
			} else {
				var jsonList = JSON.parse(localDatas);
				if (jsonList && jsonList.length > 0)
					return jsonList[jsonList.length-1];
				return null;
			}
		},
		/**
		 * clear指定缓存
		 */
		clearCache : function(key) {
			var localDatas = localStorage.getItem(key);
			if (localDatas) {
				localStorage.removeItem(key);
				console.log('清除缓存成功,key='+key);
			}
		}
		/*,clearAllCache : function() {
			localStorage.clear();
			console.log('清除缓存成功!');
			// doDeleteFile();
		}*/
	};
	return Gifted.Cache;
});