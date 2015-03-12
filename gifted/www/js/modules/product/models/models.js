define(['moment'],function(monent){
	Product = Backbone.Model.extend({
		idAttribute: "ID",
		urlRoot:Gifted.Config.serverURL+Gifted.Config.Product.loadItemURL,
		defaults:{
			NAME:'',
			DESCRIPTION:'',
			QDL:0,
			PRICE:0,
			CURRENCY:Gifted.Config.Currency,
			CATALOG:1
			//YXQ_START:new Date().format('yyyy-MM-dd')
		},
		initialize:function(config){ // init.js中model构造时会调用这里
			this.collection = config.collection;
		},
		isNew:function(){
			return !this.has(this.idAttribute) || this.get(this.idAttribute)=='';
		},
		dateFields:['YXQ_START','YXQ_END','CREATEDATE','UPDATEDATE'],
		_parseTimes:function(json, forceTime){
			if (!json)
				return null;
		    if(!json['YXQ_START_MOMENT']||forceTime==true) // 没算过moment或强制计算
			    _.each(this.dateFields, function(field) {
			    	if (json[field]) {
			    		var mm = moment(json[field],'YYYY-MM-DD hh:mm:ss'); // moment类型字段 直接转moment对象
			    		json[field+'_MOMENT'] = mm;
			    	}
			    });
			return json;
		},
		_calculateTimes:function(json, forceTime){
			if (!json)
				return null;
			//if (!json['YXQ_START_MOMENT']||forceTime==true) { // 每次都要算
			var start = json['YXQ_START_MOMENT'];
			var end = json['YXQ_END_MOMENT'];
			var duration = moment.duration(end-start);
			var lefttime = moment.duration(end-moment());
			json['timeleft'] = lefttime.humanize();
			json['timeleft_monent'] = lefttime;
			json['timeleftpercent'] = 100*lefttime/duration;
			//}
			return json;
		},
		_parseDatas:function(json, catalogs, forceTime){
			if (!json)
				return null;
			if (json['_parsedDatas']!=true) { // 已经转化过本地数据或强制转化
			    if(this.dateFields) // 日期本地化转换 forceLocal
				    _.each(this.dateFields, function(field) {
				    	if (json[field]) {
			    			var mm = moment(json[field],'YYYY-MM-DD hh:mm:ss'); // 先转moment对象
			    			var localTime = moment.utc(mm).toDate(); // 再转localTime
							localTime = moment(localTime).format('YYYY-MM-DD HH:mm:ss'); // 转localString
			    			json[field] = localTime;
				    	}
				    });
				if (json && json.publisher && json.publisher.POSITION) { // 地理位置转换
					var position = json.publisher.POSITION;
					if (position.latitude)
						position.latitude = Math.round(position.latitude*100)/100;
					if (position.longitude)
						position.longitude = Math.round(position.longitude*100)/100;
				}
			    if (json.CATALOG && Number(json.CATALOG)>0) { // 产品大类显示值转换
			   		json['__CATALOG__Option__'] = catalogs[json.CATALOG-1].display;
			    }
			    json['_parsedDatas']=true;
		    }
		   	this._parseTimes(json, forceTime);
			this._calculateTimes(json, forceTime); // 计算剩余时间
			return json;
		},
		parse:function(response){ // ajax.parse->backbone.sync->this.ajaxCompelete
			var json;
			var force;
			if (response.datas) {
				json = response.datas[0];
				force = response.force;
			} else if (response.ID) { // backbone.collection.add(Model)
				json = response;
				force = response.force;
			} else {
				return null;
			}
			var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
			this._parseDatas(json, catalogs, force);
			return json;
		},
		toSaveJSON:function(){ // NOTICE 保存时把本地时间转UTC时间
			var json = Backbone.Model.prototype.toJSON.apply(this, arguments);
		    _.each(this.dateFields, function(field) {
		    	if (json[field]) {
		    		var mm = moment(json[field],'YYYY-MM-DD hh:mm:ss'); // 先转moment对象
		    		json[field] = mm.utc().format('YYYY-MM-DD HH:mm:ss'); // 再转utc string
		    		delete json[field+'_MOMENT']; // 删除多余对象
		    	}
		    });
			//delete json['PHOTOURLS'];
			delete json['collection'];
			delete json['_parsedDates'];
			delete json['_parsedDatas'];
			delete json['timeleft'];
			delete json['timeleft_monent'];
			delete json['timeleftpercent'];
			delete json['__CATALOG__Option__'];
			delete json['__CURRENCY__Option__'];
			delete json['__LANGUAGE__Option__'];
			return json;
		},
	    isEmtpyValue : function(v) {
			return !v || v.length==0;
		},
		validate : function(attrs, options) {
			if (this.isEmtpyValue(this.attributes['NAME'])) {
				return Gifted.Lang['NotInputName'];
			}
			if (this.isEmtpyValue(this.attributes['CATALOG'])) {
				return Gifted.Lang['NotSelectCatalog'];
			}
			if (this.isEmtpyValue(this.attributes['PRICE']) || Number(this.attributes['PRICE'])<=0) {
				return Gifted.Lang['NotInputPrice'];
			}
			if (this.isEmtpyValue(this.attributes['QDL']) || Number(this.attributes['QDL'])<=0) {
				return Gifted.Lang['NotInputQDL'];
			}
			if (this.isEmtpyValue(this.attributes['CURRENCY']) || Number(this.attributes['CURRENCY'])<=0) {
				return Gifted.Lang['NotInputCurrency'];
			}
			if (this.isEmtpyValue(this.attributes['YXQ_START'])) {
				return Gifted.Lang['NotInputYXQ_Start'];
			}
			if (this.isEmtpyValue(this.attributes['YXQ_END'])) {
				return Gifted.Lang['NotInputYXQ_End'];
			}
			if (this.attributes['YXQ_END']<this.attributes['YXQ_START']) {
				return Gifted.Lang['YXQEndMustLaterThanYXQStart'];
			}
			if (this.isEmtpyValue(this.attributes['DESCRIPTION'])) {
				return Gifted.Lang['NotInputDescription'];
			}
		},
		// @unused
		updateCacheItem:function(){
			var id = this.attributes['ID'];
			console.log('updateCacheItem：id='+id);
			if (!id || !this.collection || !this.collection.models)
				return;
			/*Gifted.Cache.setCacheItem("product_list_datas", function(json){
				if (json.ID==id)
					return true;
				return false;
			}, this.toJSON());*/
			//this.trigger('sync');
			var item, coll = this.collection.models;
			for (var i=0;i<coll.length;i++) {
				if (coll[i].id==id) {
					item = coll[i].attributes = this.toJSON(); // 不触发trigger
					return item;
				}
			}
			return null;
		},
		loadCacheItem:function(id, sync, force) {
			console.log('loadCacheItem：id='+id);
			if (!id) {
				return null;
			}
    		/*var item = Gifted.Cache.findCacheItem("product_list_datas", function(json){
				if (json.ID==id)
					return true;
				return false;
			});*/
			var item = null;
			if (this.collection) {
				item = this.collection.find(function(item){
					return item.get('ID')==id;
				});
			}
			if (!item) {
				return null;
			}
			// 模拟fetch自动触发 parse\success\sync
			var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
			this._parseTimes(item, catalogs, force); // 缓存里的数据在collection获取前已经parse过，这里只是再计算下moment
			this._calculateTimes(item, force); // 计算剩余时间
			this.attributes = $.extend(this.attributes, item.attributes);
			if (sync==false){ // 不进行ui同步
			} else {
				this.trigger('sync'); // 为了触发view.render
			}
			return this.attributes;
		},
		loadItem:function(id, callback) {
			console.log('loadItem：id='+id);
			if (!id) {
				return null;
			}
			this.fetch({ // ajax or cache->this.initilize()->parse
				url:this.getURL(id)
    		})
            .done(_.bind(function(event, response, status){ // fetch完会自动触发 parse\success\sync
            	if (status=='success') {
            		if (response.count>=1) {
						this.attributes = $.extend(this.attributes, response.datas[0]); // parse里已经处理了
						if (callback)
							callback();
					} else  {
            			Gifted.Global.alert(Gifted.Lang['LoadDatasFail']);
					}
            	} else {
            		console.log('FecthError:'+status);
            	}
            },this))
            .fail(_.bind(function(event, response, status){
            	Gifted.Global.checkStatus(status);
            },this));
		},
		loadModifyItem:function(id, sync) {
			var item = this.loadCacheItem(id, true);
			if (!item) {
				this.loadItem(id);
			}
		},
		getURL:function(id) { // 切换server后重新计算
			this.urlRoot=Gifted.Config.serverURL+Gifted.Config.Product.loadItemURL;
			var url = this.urlRoot+'/'+id;
			return url;
		}
	});
	ProductDetail = Product.extend({ // 特殊model
		urlRoot:Gifted.Config.serverURL+Gifted.Config.Product.loadDetailURL,
		idAttribute: "ID",
		dateFields:['YXQ_START','YXQ_END','CREATEDATE','UPDATEDATE'],
		initialize:function(config){
			// 方法置空 否则在init中new ProductDetail就去做parseDatas了
			return ProductDetail.__super__.initialize.call(this, config);
		},
		getURL:function(id) {
			this.urlRoot = Gifted.Config.serverURL+Gifted.Config.Product.loadDetailURL;
			var url = this.urlRoot+'/'+id+'/'+Gifted.Config.Locale.localeName;
			return url;
		},
		loadDetailItem:function(id, refresh){
			console.log('正在查询ProductDetail数据：id='+id);
			if (!id) {
				return;
			}
			var localDatas = Gifted.Cache.getCache('productdetail_'+id);
			if (!localDatas || refresh) {
				Product.prototype.loadItem.call(this, id, _.bind(function(){
					var json = this.toSaveJSON();
					Gifted.Cache.setCache('productdetail_'+id, JSON.stringify(json));
				},this));
			} else if (localDatas) {
				var json = JSON.parse(localDatas);
				var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
				this._parseDatas(json, catalogs);
				this._calculateTimes(json); // 计算剩余时间
				$.extend(this.attributes, json);
				this.trigger('sync');
			}
		}
	});
	// NOTICE 有limit的内存缓存collection，能有效防止内存溢出(只看到和缓存最新的limit条数据)
	ProductCachedCollection = Backbone.Collection.extend({
		isInit:0, // 初始化标记
		start:-1, // 新记录起始位置
		count:-1, // 本次服务器取数取到的个数
		last:null, // 最后记录的时间戳，避免重复下拉加载
		perCount:10, // 每页记录数
	    model:Product,
		dateFields:['YXQ_START','YXQ_END','CREATEDATE'],
		idAttribute: "ID",
	    url:Gifted.Config.serverURL+Gifted.Config.Product.loadDataURL,
		getURL:function(_start,_count) { // 切换server后重新计算
			this.url = Gifted.Config.serverURL+Gifted.Config.Product.loadDataURL;
			//return this.url+'?start='+_start+'&count='+this.perCount+(this.restfulAction?this.restfulAction:'');
			if (!this.restfulAction || this.restfulAction=='') 
				this.restfulAction = '/load';
			return this.url+this.restfulAction+'/start/'+_start+'/count/'+_count+'/'+Gifted.Config.Locale.localeName;
		},
		initialize: function(arguments){
			this.key = arguments?(arguments.key||''):'';
			this.on('cachesync', _.bind(function(scope, attributes, opts){
				this.cachesync(attributes, opts);
			},this));
		},
		_parseTimes:function(json, forceTime){ // 转化成Moment对象
			return Product.prototype._parseTimes.call(this, json, forceTime);
		},
		_calculateTimes:function(json, forceTime){
			return Product.prototype._calculateTimes.call(this, json, forceTime);
		},
		_parseDatas:function(json, catalogs, forceTime){ // 转化成本地数据
			return Product.prototype._parseDatas.call(this, json, catalogs, forceTime);
		},
		parse:function(response) { // ajax.parse->backbone.sync->this.ajaxCompelete
			var datas = response.datas;
			var forceTime = response.forceTime;
			var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
		    _.each(datas,_.bind(function(json) {
		    	this._parseDatas(json, catalogs, forceTime);
		    },this));
		    return datas;
		},
		loadDetailItem:function(id){
			return ProductDetail.prototype.loadDetailItem.call(this, id);
		},
		loadItem:function(id){
			return Product.prototype.loadItem.call(this, id);
		},
		loadCacheItem:function(id, sync){
			return Product.prototype.loadCacheItem.call(this, id, sync);
		},
		clearCache:function() {
			this.reset([]);
			//this.clearFlag();
			this.count=0;
			this.start=-1;
			this.last=null;
		},
		clearFlag:function() {
			this.count=0;
			this.start=-1;
			//this.last=null;
		},
		cachesync:function(attributes, opts) {
			/*if (this._cacheDatas) {
				console.log('正在从缓存读取离线数据');
				var i=opts.start, len = i+opts.count;
				for (;i<len;i++) {
					this.add(this._cacheDatas[i]);
				}
				this.start = len;
				this.count = opts.count;
			}*/
		},
		fetch:function(options) {
			/*if (this._cacheDatas) {
				if (options.start<0)
					options.start=0;
				if (options.count<=0)
					options.count=1; // 从缓存读数据时每次加载N条
				var _start = options.start, _count = options.count;
				if (Number(_start)+Number(_count)<=this._cacheDatas.length) {
					options.cache=true;
					options.prefill=false;
					options.async=false;
					options.silent=true;
				}
			}*/
			return Backbone.Collection.prototype.fetch.call(this, options);
		},
		loadInitData:function() {
			var localDatas = Gifted.Cache.getCache("product_list_datas"+this.key); // TODO 可以从collection中获取
			if (localDatas && localDatas!='[]') { // 判断是否读取缓存信息
				console.log('正在从缓存读取离线数据');
				this.count = Gifted.Cache.getCache("product_list_count"+this.key);
				this.start = Gifted.Cache.getCache("product_list_start"+this.key);
				this.last = Gifted.Cache.getCache("product_list_last"+this.key);
				var datas = JSON.parse(localDatas);
				this.parse({datas:datas,forceTime:true});
				this.reset(datas);
				this.trigger('hasmoredata', true, true); // 绘制上下是否有最新数据的状态栏->v.refresh
			} else if (this.isInit == 0) {
				//this.trigger('loaddata', true); // loadData->hasmoredata->refresh
				this.loadData(true);
				this.isInit = 1;
			}
		},
		search:function(sRestfulAction) {
			//if (!Gifted.Global.checkConnection()) {
			//	this.trigger('refresh');// completeLoading->refreshcomplete->刷新iscroll
			//	return false;
			//}
			//this.trigger('clear'); // 搜索后必定清空html
			this.restfulAction=sRestfulAction;
			var _start=-1, _count=0, loadNew=true;
			var _url=this.getURL(_start, _count);
			var at=null; // typeof(loadNew)=='undefined'?null:(loadNew?0:null); 第一次搜索结果总是按默认排序
			console.log('正在查询数据：url='+_url+',restfulAction='+this.restfulAction);
			//var GIFTED_POSITION = JSON.stringify(Gifted.Config.Position);
			this.fetch({ // ajax or cache
				url:_url, start:_start, count:_count,
				remove:false, at:at
    		})
            .done(_.bind(function(event, response, status){ // fetch: parse\success\sync
            	if (status=='success') {
					if (response.count==0) {
						console.log('服务器没有更多要查的数据');
						this.trigger('hasmoredata', false, loadNew); // 绘制上下是否有最新数据的状态栏->refresh
						//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
					} else if (response.count>0) { // 从缓存加载或者服务器有新的数据
						console.log('服务器有要查的新数据：'+response.count+'条');
						this.start = Number(response.start);
						this.count = Number(response.count);
						if (loadNew) {
							if (response.last) {
								this.last = response.last;
								//Gifted.Cache.setCache("product_list_last"+this.key, this.last);
							}
							if (this.start==0) { // 只存放有限个localstorage的缓存(因为有时候是直接刷编辑页models里没数据只有cache里有)
								//Gifted.Cache.setCache("product_list_start"+this.key, this.start);
								//Gifted.Cache.setCache("product_list_count"+this.key, this.count);
								//Gifted.Cache.clearCache("product_list_datas"+this.key);
							}
						}
						//var limited = Gifted.Cache.putCache("product_list_datas"+this.key, JSON.stringify(response.datas)); // TODO 可以根据ID追加到collection中
						//limited=response.count<this.perCount; // 没有更多老数据
						if (!loadNew) { // 上拉
							var limited = response.datas.length<20;
							//limited = false; // 还是到中间层去确认下有无数据
							this.trigger('hasmoredata', limited==true?false:true, loadNew); // 绘制上下是否有最新数据的状态栏->refresh->刷新iscroll
						} else {
							//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
						}
					} else {
            			Gifted.Global.checkStatus(status);
					}
            	} else {
            		Gifted.Global.checkStatus(status);
            	}
            },this))
            .fail(_.bind(function(event, response, status){
            	Gifted.Global.checkStatus(status);
				this.trigger('hasmoredata', false, loadNew); // ->refresh->刷新iscroll
				//this.trigger('refresh'); // 刷新iscroll
            },this));
		},
		loadData:function(loadNew) {
			if (!Gifted.Global.checkConnection()) {
				this.trigger('refresh');
				return false;
			}
			if (Number(this.start)<-1) {
				this.start=-1; // 表示重新取数
			}
			if (Number(this.count)<0) {
				this.count=0;
			}
			var _start=Number(this.start);
			var _count=Number(this.count);
			if (loadNew) {
				_start=-1;
				_count=0;
			}
			var _url=this.getURL(_start+_count, _count);
			var at=typeof(loadNew)=='undefined'?null:(loadNew?0:null); // typeof(loadNew)=='undefined' 打开界面
			loadNew=typeof(loadNew)=='undefined'?true:loadNew;
			console.log('正在读取数据：url='+_url);
			//var GIFTED_POSITION = JSON.stringify(Gifted.Config.Position);
			this.fetch({ // ajax or cache
				url:_url, start:_start+_count, count:_count,
				remove:false, at:at
    		})
            .done(_.bind(function(event, response, status){ // fetch: parse\success\sync
            	if (status=='success') {
					if (response.count==0) {
						console.log('服务器没有更多的数据');
						this.trigger('hasmoredata', false, loadNew); // 绘制上下是否有最新数据的状态栏->refresh
						//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
					} else if (response.count>0) { // 从缓存加载或者服务器有新的数据
						if (loadNew && this.last && response.last && this.last==response.last) {
							console.log('服务器没有新数据');
							//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
							return;
						}
						console.log('服务器有新数据：'+response.count+'条');
						this.start = Number(response.start);
						this.count = Number(response.count);
						if (loadNew) {
							if (response.last) {
								this.last = response.last;
								Gifted.Cache.setCache("product_list_last"+this.key, this.last);
							}
							if (this.start==0) { // 只存放有限个localstorage的缓存(因为有时候是直接刷编辑页models里没数据只有cache里有)
								Gifted.Cache.setCache("product_list_start"+this.key, this.start);
								Gifted.Cache.setCache("product_list_count"+this.key, this.count);
								Gifted.Cache.putCache("product_list_datas"+this.key, JSON.stringify(response.datas)); 
							}
						}
						//var limited = Gifted.Cache.putCache("product_list_datas"+this.key, JSON.stringify(response.datas)); // TODO 可以根据ID追加到collection中
						//limited=response.count<this.perCount; // 没有更多老数据
						if (!loadNew) { // 上拉
							var limited = false;//response.datas.length<20;
							//limited = false; // 还是到中间层去确认下有无数据
							this.trigger('hasmoredata', limited==true?false:true, loadNew); // 绘制上下是否有最新数据的状态栏->refresh
						} else {
							//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
						}
						if(Gifted.app.checkRight({checkRule:['LOGIN'],trigger:false})){ // 只有登录过的才可能有favorite数据(根据产品ids获取喜好信息)
							var ids = '';
							var datas = response.datas;
							for(var i=0;i<datas.length ;i++){
								var id = datas[i].ID;
								ids = ids + '/' + id;
							}
							ids = ids.slice(1,ids.length);
							Gifted.app.user.favorites.loadFavorites(ids);
						}
					} else {
						Gifted.Global.checkStatus(status);
					}
            	} else {
            		Gifted.Global.checkStatus(status);
            	}
				//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
            },this))
            .fail(_.bind(function(event, response, status){
            	Gifted.Global.checkStatus(status);
				this.trigger('hasmoredata', false, loadNew);
				//this.trigger('refresh'); // completeLoading->refreshcomplete->刷新iscroll
            },this));
		}
	});
});
