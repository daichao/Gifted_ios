define(['moment'],function(monent){
	var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
	Product = Backbone.Model.extend({
		idAttribute: "ID",
		dateFields:['YXQ_START','YXQ_END','CREATEDATE','UPDATEDATE'],
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
			//this.on('add',this.parse,this);
		},
		_calculateTimes:function(json){ // 计算剩余时间
			if (!json)
				return null;
			//if (!json['YXQ_START_MOMENT']||forceTime==true) { // 每次都要算
			var now = moment();
			var start = json['YXQ_START_MOMENT'];
			var end = json['YXQ_END_MOMENT'];
			var duration = moment.duration(end-start);
			var lefttime = moment.duration(end-now);
			json['_timeleft'] = lefttime.humanize();
			json['_timeleft_monent'] = lefttime;
			json['_timeleft_percent'] = 100*lefttime/duration;
			if (now.isBefore(start)||now.isAfter(end)) {
				json['_timeover'] = true;
			}
			//}
			return json;
		},
		_parseTimes:function(json){ // 附加时间对象
			if (!json)
				return null;
		    //if(!json['YXQ_START_MOMENT']||forceTime==true) // 每次都要算
		    _.each(this.dateFields, function(field) {
		    	if (json[field]) {
		    		var mm = moment(json[field],'YYYY-MM-DD hh:mm:ss'); // moment类型字段 直接转moment对象
		    		json[field+'_MOMENT'] = mm;
		    	}
		    });
			this._calculateTimes(json);
			return json;
		},
		_parseDatas:function(json, catalogs){
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
		   	this._parseTimes(json); // 附加时间对象
			return json;
		},
		parse:function(response){ // ajax.parse->backbone.sync->this.ajaxCompelete
			var json;
			if (response.datas) {
				json = response.datas[0];
			} else if (response.ID) { // backbone.collection.add(Model)
				json = response;
			} else {
				return null;
			}
			// 要处理成本地化数据了 还要计算时间
			this._parseDatas(json, catalogs);
			return json;
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
		loadListItem:function(id, sync) {
			console.log('loadListItem：id='+id);
			if (!id) {
				return null;
			}
			var json = null;
			if (this.collection) { // 已经打开过列表后直接从列表中获取
				json = this.collection.get(id);
			}
			if (!json) {
				return null;
			}
			this.attributes = $.extend(this.attributes, json.attributes); // NOTICE 当前的DetailModel是New出来的要做属性覆盖
			if (sync==false){ // 不进行ui同步
				// do nothing
			} else {
				this.trigger('sync'); // 为了触发view.render
			}
			return this.attributes;
		},
		loadItem:function(id, callback) {
			console.log('loadRemoteItem：id='+id);
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
		loadDetailItem:function(id, reload){
			console.log('loadDetailItem：id='+id);
			if (!id) {
				return null;
			}
			var localDatas = Gifted.Cache.getCache('productdetail_'+id);
			if (!localDatas || reload) {
				this.loadItem(id, _.bind(function(){
					var json = this.toSaveJSON();
					Gifted.Cache.setCache('productdetail_'+id, JSON.stringify(json));
					Gifted.Cache.putCache("product_list_datas"+this.collection.key, [json]);
				},this));
			} else if (localDatas) {
				var json = JSON.parse(localDatas);
				// 缓存已经都是本地化数据了 只要计算时间即可
				this._parseDatas(json, catalogs);
				$.extend(this.attributes, json);
				this.trigger('sync');
			}
		},
		loadModifyItem:function(id, sync, reload) {
			console.log('loadModifyItem：id='+id);
			var item = this.loadListItem(id, sync);
			if (!item) {
				this.loadDetailItem(id, reload);
			}
		},
		isNew:function(){
			return !this.has(this.idAttribute) || this.get(this.idAttribute)=='';
		},
	    isEmtpyValue : function(v) {
			return !v || v.length==0;
		},
		afterNew:function(){ // 新增后的插入第一条记录
			console.log('Product.afterNew:'+this.collection);
	   		this.clearTempAttributes(this.attributes); // 放到缓存里的数据不能有临时对象
			Gifted.Cache.setCache('productdetail_'+this.get('ID'), JSON.stringify(this.attributes)); // 设置到缓存中
			if (!this.collection) 
				return;
	   		// 新增时已经都是本地化数据了 只要计算时间即可
			this._parseDatas(this.attributes, catalogs, true);
			this.collection.unshift(this.attributes, {merge: true}); // 插入到头部(要算好时间对象), 只触发了collection的parse, merge:true触发add操作
			this.collection.trigger('refresh');
		},
		afterModify:function(){ // 新增后的插入第一条记录
			console.log('Product.afterModify:'+this.collection);
	   		this.clearTempAttributes(this.attributes); // 放到缓存里的数据不能有临时对象
			Gifted.Cache.setCache('productdetail_'+this.get('ID'), JSON.stringify(this.attributes)); // 设置到缓存中
			if (!this.collection) 
				return;
	   		// 修改时已经都是本地化数据了 但还是要要重新计算时间（可能修改了时间）
			// this._parseDatas(this.attributes, catalogs, true);
			this.collection.trigger('modelchanged', this.get('ID')); // 抛出事件 detail会refreshPage(首先到缓存中获取)
		},
		clearTempAttributes:function(json) {
			delete json['collection']; // 临时对象
			delete json['success']; // 临时变量
			delete json['complete']; // 临时变量
			delete json['_timeover']; // 临时变量
			delete json['_timeleft']; // 临时对象
			delete json['_timeleft_monent']; // 临时对象
			delete json['_timeleft_percent']; // 临时变量
			delete json['__CATALOG__Option__']; // 临时变量
			delete json['__CURRENCY__Option__']; // 临时变量
			delete json['__LANGUAGE__Option__']; // 临时变量
		},
		toSaveJSON:function(){ // 保存转义
			var json = Product.__super__.toJSON.apply(this, arguments);
		    _.each(this.dateFields, function(field) {
		    	if (json[field]) {
		    		var mm = moment(json[field],'YYYY-MM-DD hh:mm:ss'); // 先转moment对象（变成标准时间）
		    		json[field] = mm.utc().format('YYYY-MM-DD HH:mm:ss'); // 再转utc string
		    	}
		    });
		    // 以下只返回清理过的json不对attributes进行标记清理
		    _.each(this.dateFields, _.bind(function(field) {
		    	delete json[field+'_MOMENT']; // 删除多余对象
		    },this));
			this.clearTempAttributes(json);
			delete json['_parsedDatas']; // 清楚本地化标记 可以不清楚 因为返回的是临时json不影响model数据
			// delete json['PHOTOURLS']; // 后台不会用此属性 但不能删除否则其他界面用到的model缓存会出问题
			return json;
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
			/*if (this.isEmtpyValue(this.attributes['DESCRIPTION'])) {
				return Gifted.Lang['NotInputDescription'];
			}*/
		},
		getURL:function(id) { // 切换server后重新计算
			this.urlRoot=Gifted.Config.serverURL+Gifted.Config.Product.loadItemURL;
			var url = this.urlRoot+'/'+id;
			return url;
		}
	});
	ProductDetail = Product.extend({ // 特殊model
		idAttribute: "ID",
		dateFields:['YXQ_START','YXQ_END','CREATEDATE','UPDATEDATE'],
		urlRoot:Gifted.Config.serverURL+Gifted.Config.Product.loadDetailURL,
		defaults:{
			NAME:'',
			DESCRIPTION:'',
			QDL:0,
			PRICE:0,
			CURRENCY:Gifted.Config.Currency,
			CATALOG:1,
			PHOTOURLS:[{
				PHOTOID:'placeholder',
				PHOTONAME:'placeholder',
				PHOTOURL:'img/notexists.png',
				PHOTOINDEX:1,
				PHOTORADIO:1,
				PHOTOWIDTH:200,
				PHOTOHEIGHT:150
			}],
			others:[{
				PHOTOID:'placeholder',
				PHOTONAME:'placeholder',
				PHOTOURL:'img/notexists.png',
				PHOTOINDEX:1,
				PHOTORADIO:1,
				PHOTOWIDTH:200,
				PHOTOHEIGHT:150
			}],
			publisher:{
				ID:'-1',
				PORTRAIT:'img/noportrait_30_30.png',
				PRODUCT:0,
				FOLLOW:0,
				FOLLOWER:0
			}
		},
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
			return ProductDetail.__super__.loadDetailItem.call(this, id, refresh);
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
	    key:'',
	    sortField:'UPDATEDATE',
		idAttribute: "ID",
		dateFields:['YXQ_START','YXQ_END','CREATEDATE','UPDATEDATE'],
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
		},
		clearStorage:function() {
			Gifted.Cache.clearCache("product_list_datas"+this.key);
			Gifted.Cache.clearCache("product_list_count"+this.key);
			Gifted.Cache.clearCache("product_list_start"+this.key);
			Gifted.Cache.clearCache("product_list_last"+this.key);
		},
		clearFlag:function() {
			this.count=0;
			this.start=-1;
			//this.last=null; // 不能删除这个last
		},
		clearDatas:function() {
			this.reset([]);
			this.count=0;
			this.start=-1;
			this.last=null;
		},
		parse:function(response) { // ajax.parse->backbone.sync->this.ajaxCompelete
			// NOTICE ajax读取后如果这里做了parse，add后的model还会做一遍parse，效率太低！（要调用Model的parse请显式调用）
			var datas = response.datas; // ajax后的add的每个单元Model会自己去做parse
			return datas;
		},
		_calculateTimes:function(json) {
			return Product.prototype._calculateTimes.call(this, json);
		},
		_parseTimes:function(json) {
			return Product.prototype._parseTimes.call(this, json);
		},
		_parseDatas:function(json, catalogs) {
			return Product.prototype._parseDatas.call(this, json, catalogs);
		},
		fetch:function(options) {
			return ProductCachedCollection.__super__.fetch.call(this, options);
		},
		loadItem:function(id){
			return Product.prototype.loadItem.call(this, id);
		},
		loadListItem:function(id, sync){
			return Product.prototype.loadListItem.call(this, id, sync);
		},
		loadDetailItem:function(id){
			return ProductDetail.prototype.loadDetailItem.call(this, id);
		},
		loadInitData:function() {
			var localDatas = Gifted.Cache.getCache("product_list_datas"+this.key); // TODO 可以从collection中获取
			if (localDatas && localDatas!='[]') { // 判断是否读取缓存信息
				console.log('正在从缓存读取离线数据');
				this.count = Gifted.Cache.getCache("product_list_count"+this.key);
				this.start = Gifted.Cache.getCache("product_list_start"+this.key);
				this.last  = Gifted.Cache.getCache("product_list_last"+this.key);
				var datas  = JSON.parse(localDatas);
				_.each(datas,_.bind(function(json){
					// 缓存已经都是本地化数据了 只要计算时间即可
					this._parseDatas(json, catalogs);
					this.add(json,{sort:true}); // collection.set->model.parse
				},this));
				//this.sort();
				//this.set(datas,{parse:true}); // 只触发了collection的parse
				this.trigger('hasmoredata', true, true); // 绘制上下是否有最新数据的状态栏->v.refresh
			} else if (this.isInit == 0) {
				this.loadData();
				this.isInit = 1;
			}
		},
		comparator:function(model) {
		    return model.get(this.sortField);
		},
		search:function(sRestfulAction) {
			if (!Gifted.Global.checkConnection()) {
				this.trigger('refresh');
				return false;
			}
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
							}
							if (this.start==0) { // 只存放有限个localstorage的缓存(因为有时候是直接刷编辑页models里没数据只有cache里有)
								//Gifted.Cache.setCache("product_list_last"+this.key, this.last);
								//Gifted.Cache.setCache("product_list_start"+this.key, this.start);
								//Gifted.Cache.setCache("product_list_count"+this.key, this.count);
								//Gifted.Cache.putCache("product_list_datas"+this.key, response.datas);
							}
						}
						if (!loadNew) { // 上拉
							var limited = response.datas.length<20;
							//limited = false; // 还是到中间层去确认下有无数据
							this.trigger('hasmoredata', limited==true?false:true, loadNew); // 绘制上下是否有最新数据的状态栏->refresh->刷新iscroll
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
							}
							if (this.start==0) { // 只存放最新数据的缓存(因为有时候是直接刷编辑页models里没数据只有cache里有)
								Gifted.Cache.setCache("product_list_last"+this.key, this.last);
								Gifted.Cache.setCache("product_list_start"+this.key, this.start);
								Gifted.Cache.setCache("product_list_count"+this.key, this.count);
								var limitedStorage = Gifted.Cache.putCache("product_list_datas"+this.key, response.datas);
								if (limitedStorage==true) { // localstorage缓存到限制条数
									this.clearStorage();
								}
							}
						}
						if (!loadNew) { // 上拉
							var limited = false;//response.datas.length<20;
							//limited = false; // 还是到中间层去确认下有无数据
							this.trigger('hasmoredata', limited==true?false:true, loadNew); // 绘制上下是否有最新数据的状态栏->refresh
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
