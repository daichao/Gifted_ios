/*******************************************************************************
 * Config相关的实现
 * 
 * 单例
 ******************************************************************************/
define([], function() {
	if (typeof deviceIsAndroid == 'undefined')
		deviceIsAndroid=false;
	if (typeof deviceIsIOS == 'undefined')
		deviceIsIOS=false;
	// namespace
	if (typeof Gifted == 'undefined')
		Gifted = {};
	//================================== Config ==================================//
	if (Gifted.Config)
		return Gifted.Config;
	//================================== Config ==================================//
	Gifted.Config = { // 单例
		isDemo : false, // 是否启用demo数据
		isRealPhone : typeof LocalFileSystem != 'undefined',
		isCanvasCarouel : false,//(!this.isRealPhone&&!deviceIsAndroid&&!deviceIsIOS) || this.isRealPhone,
		isCanvasCarouelDebug : true,//((!this.isRealPhone&&!deviceIsAndroid&&!deviceIsIOS) || this.isRealPhone) && true,
		// TODO 根据DNS列表服务器信息获取（可用）serverURL列表，并根据对serverURL的网络ping信息，获取最优serverURL。
	    // 是为了将serverURL设置成（连接到）最快的服务器地址(同时缓存到localStorage，App启动时首先从localStorage中获取并覆盖serverURL)。
		uploadServerList : [ // 写服务器DNS列表（CDN做路由分发，DNS作为备用路由策略--跳过CDN直连我们的服务器）
			 {key:'gifted.5proapp.com', url:'http://gifted.5proapp.com'} // 正式
			,{key:'gifted1.5proapp.com',url:'http://gifted1.5proapp.com'} // 正式
			,{key:'gifted2.5proapp.com',url:'http://gifted2.5proapp.com'} // 正式
			,{key:'192.168.0.106:8080',url:'http://192.168.0.106:8080/gifted'} // 内部测试用
			,{key:'127.0.0.1:8080',url:'http://127.0.0.1:8080/gifted'} // 内部测试用
			,{key:'127.0.0.1:8087',url:'http://127.0.0.1:8087/gifted'} // 内部测试用
			,{key:'1.1.8.48:8080',url:'http://1.1.8.48:8080/gifted'} // 内部测试用
			,{key:'1.1.8.45:8080',url:'http://1.1.8.45:8080/gifted'} // 内部测试用
			,{key:'1.1.8.64:8080',url:'http://1.1.8.64:8080/gifted'} // 内部测试用
			,{key:'1.1.8.79:8080',url:'http://1.1.8.79:8080/gifted'}
		],
		uploadServerURL : 'http://gifted.5proapp.com', // 测试时读写服务用同一个
		// "读写分离"的服务器策略(现在默认用"读"服务器来POST)，以后指定到固定的几台"写"服务器上。"写"服务可能是端口不同，并且由客户端自动选择分流。
		serverList : [
			 {key:'gifted.5proapp.com', url:'http://gifted.5proapp.com'} // 正式
			,{key:'gifted1.5proapp.com',url:'http://gifted1.5proapp.com'} // 正式
			,{key:'gifted2.5proapp.com',url:'http://gifted2.5proapp.com'} // 正式
			,{key:'192.168.0.106:8080',url:'http://192.168.0.106:8080/gifted'} // 内部测试用
			,{key:'127.0.0.1:8080',url:'http://127.0.0.1:8080/gifted'} // 内部测试用
			,{key:'127.0.0.1:8087',url:'http://127.0.0.1:8087/gifted'} // 内部测试用
			,{key:'1.1.8.48:8080',url:'http://1.1.8.48:8080/gifted'} // 内部测试用
			,{key:'1.1.8.45:8080',url:'http://1.1.8.45:8080/gifted'} // 内部测试用
			,{key:'1.1.8.64:8080',url:'http://1.1.8.64:8080/gifted'} // 内部测试用
			,{key:'1.1.8.79:8080',url:'http://1.1.8.79:8080/gifted'}
		],
		serverURL : 'http://gifted.5proapp.com',
		//emptyImg : 'data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
		emptyImg : 'img/notexists.png', // 空白图片
		Currency : 1, // 默认美元 
		//mobile.event
		Event : {
			tap:'tap',
			click:'click'
		},
		Cache : {
			dir:'gifted_cachefiles', // 放到相对目录gifted_cachefiles下
			cacheLimit:20, // 同一个key的缓存个数限制
		},
		Camera : {
			sourceType:null,
			destinationType:null
		},
		Locale : {
			localeName:'zh_CN'
		},
		Position : {
			latitude:0,
			longitude:0,
			altitude:0
		},
		System : {
			callbackURL:'/ajax/system/callback'
		},
		Product : {
			loadDataURL:'/ajax/product', // GET collections TODO /content/xxx /catalog/xxx default
			loadPageURL:'/ajax/product/page', // GET page
			loadDetailURL:'/ajax/product/detail', // GET detail model
			loadItemURL:'/ajax/product/item', // GET /ajax/product/item/{ID}
			saveItemURL:'/ajax/product/item', // POST /ajax/product/item/{ID}
			uploadImageURL:'/ajax/product/uploadImage', // uploadImage
			uploadImageURLDebug:'/ajax/product/uploadImage', // uploadImage
			uploadFileURLDebug:'/ajax/product/uploadFileDebug', // uploadFileDebug & savedata
			uploadFileURL:'/ajax/product/uploadZipFile', // uploadfile & savedata
			getProductsURL:'/ajax/product/products', // GET
		},
		User : {
			registerURL:'/ajax/user/register', // POST
			loginURL:'/ajax/user/login', // POST
			logoutURL:'/ajax/user/logout' , // POST
			userInfoURL:'/ajax/user/userInfo', // GET
			userInteractiveURL:'/ajax/user/interactive', // GET 用户交互模块
			forgetPasswordURL:'/ajax/user/forgetPassword', // POST
			resetPasswordURL:'/ajax/user/resetPassword', // POST
			modifyPasswordURL:'/ajax/user/modifyPassword', //POST
			checkIdentifyingCodeURL:'/ajax/user/checkIdentifyingCode', // POST
			checkLoginURL:'/ajax/user/checkLogin', // POST
			saveURL:'/ajax/user/save', //POST
			
			addFavorite:'/ajax/user/favorite/add', //POST
			removeFavorite:'/ajax/user/favorite/remove', //POST
			synchronizeFavorite:'/ajax/user/favorite/synchronize', //POST
			getFavorites:'/ajax/user/favorites', //GET 能否看他人收藏？
			
			addFollowURL:'/ajax/user/follow/add', //POST
			removeFollowURL:'/ajax/user/follow/remove',
			getFollowsURL :'/ajax/user/follows', //GET
			getFollowersURL:'/ajax/user/followers', //GET
			IMTokenURL:'/ajax/user/IMToken',//GET
			APPCIDURL:'/ajax/user/APPCID',//POST
		},
		Image : {
			uploadImageURL : '/ajax/image/upload',
			uploadZipImageURL : '/ajax/image/uploadZip'
		},
		Message : {
			sendMessageURL : '/ajax/message/conversation',
		},
		Favorite:{
			localDBTime:"60000"
		},
	};
	//Gifted.Config.uploadServerURL=Gifted.Config.uploadServerList[Math.random()>0.5?1:0].url;
	//Gifted.Config.uploadServerURL="http://192.168.0.106:8080/gifted";
	return Gifted.Config;
});