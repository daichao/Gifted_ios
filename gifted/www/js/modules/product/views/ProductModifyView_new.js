define(['modules/product/templates/productmodify_new','handlebars',
		'modules/product/models/models', 'jquery.mobiscroll'], function(tpl) {
	var ProductModifyView = Gifted.View.extend({
		templateTop:Handlebars.compile(tpl.top),
		templateContent:Handlebars.compile(tpl.content),
		topRefresh:false,
		bottomRefresh:false,
		saving:false,
		events:{
			'tap .product_catalog':'openCatalog',
	    	'tap .headbar_sign':'back',
	    	'tap .header_commit':'saveData',
	    	'change .product_date':'changeDate',
	    	'change .product_price':'changePrice',
	    	'change .product_qdl':'changeQDL',
	    	'tap .product_image_btn':'pickPhoto',
	    	'tap .photo_select_list':'selectPhoto'
	    },
	    initialize: function () {
	    	ProductModifyView.__super__.initialize.apply(this,arguments);
	    	this.model.on("sync", this.render, this);
	    	this.model.on("refresh", this.refresh, this);
	    	this.on('active',this.onActive,this);
	    	this.fileUploader = new Gifted.Util.FileUploader({zip:true});
	    },
	    // public
		back:function(event){
			_.delay(_.bind(function(){
				this.$el.find('.photo_select_wrap').hide();
			},this),100);
			ProductModifyView.__super__.back.apply(this,arguments);
		},
	    onActive:function() {
	    	ProductModifyView.__super__.onActive.apply(this,arguments);
	    	if (this.prevView=='productchoosecatalogview') {
	    		var view = this.app.selectView('productchoosecatalogview');
	    		//view.setCatalog(this.app.currentView.catalog);
	    		this.setCatalog(view.catalog);
	    	}
	    },
		setDescription:function(text) {
			this.$el.find('.product_description').val(text);
		},
		getDescription:function(text) {
			return this.$el.find('.product_description').val();
		},
	    openCatalog:function(event){
	    	event.stopPropagation();
		  	event.preventDefault();
	    	this.app.navigate('product/choosecatalog', {trigger:true});
	    },
	    setCatalog:function(value) {
	    	var display = this.$el.find(".product_catalog option[value='"+value+"']").html();
	    	this.$el.find(".product_catalog option[value='"+value+"']").attr("checked",true);
	    	$(this.$el.find('.product_catalog')[0]).html(display);
	    	$(this.$el.find('.product_catalog')[1]).val(value);
	    },
		refreshPage:function(event){
			var id = this.model.get('ID');
			//var sync = !event?true:false; // 手动刷新event不为空
			this.loadData(id, true, false);
		},
		loadData:function(id, sync, reload) {
			this.model.loadModifyItem(id, sync, reload); // 触发了sync->render, reload:false->loadFromDetail
		},
	    changeQDL:function(event){
	    	var val = $(event.target).val();
	    	$(event.target).val(Math.abs(val));
	    },
	    changePrice:function(event){
	    	var val = $(event.target).val();
	    	$(event.target).val(Math.abs(val));
	    },
	    changeDate:function(event){
	    	//if ($(event.target).is('.product_yxq_start')) {
	    		//var smm = moment($(event.target).val(),'YYYY-MM-DD');
				//var emm = moment($(event.target).val(),'YYYY-MM-DD').add('days', 7);
				/*this.$el.find('.product_yxq_end').mobiscroll('destroy').mobiscroll().date({
					preset: 'date', //日期
					theme: deviceIsIOS?'ios':'android-ics light', //皮肤样式
					display: deviceIsIOS?'bottom':'modal', //显示方式  bottom modal
					mode: 'scroller', //日期选择模式
					dateFormat: 'yy-mm-dd', // 日期格式
					dateOrder: 'yymmdd', //面板中日期排列格式
					startYear:smm.year(), // 起始年份
					startMonth:smm.month(), // 起始月份
					startDate:smm.date(), // 起始日期
					endYear:emm.year(), // 结束年份
					endMonth:emm.month(), // 结束月份
					endDate:emm.date() // 结束日期
				});*/
			//} else if ($(event.target).is('.product_yxq_end')) {
			//_.delay(_.bind(function(){
				var smm = moment(this.$el.find('.product_yxq_start').val(),'YYYY-MM-DD').add('days', 6);
				var emm = moment(this.$el.find('.product_yxq_end').val(),'YYYY-MM-DD');
				if (smm.isBefore(emm)) {
					_.delay(_.bind(function(){
						Gifted.Global.alert(Gifted.Lang['YXQIsSevenDays']);
						this.$el.find('.product_yxq_end').val(smm.format('YYYY-MM-DD'));
					},this),500);
				}
			//},this),100);
			//}
	    },
		topbarRender:function(){
			this.$topbarEl.empty();
			this.$topbarEl.html(this.templateTop());
		},
		bottomRender:function(){
			this.$bottombarEl.hide();
		},
		contentRender:function(){
			this.transID = encodeURIComponent(new Gifted.UUID().toString()); // 同产品的多次图片上传请求的页面“事务ID”，每次页面刷新后重新计算
			this.fileUploader.reset(); // 清除上传信息
			
			var catalogs = TRANSLATE.getCurrentLangItem(null,'CatalogData');
	    	var json = this.model.toJSON();
	    	json.catalogs = catalogs;
	    	this.$contentEl.empty();
	        this.$contentEl.html(this.templateContent(json));
	      
	    	var imgDoms = this.$el.find('.product_image_btn');
			for (var i=0;i<5;i++) {
				var dom = imgDoms[i];
				dom.src = 'img/takepicture.png';
			}
			// 和detail参数保持一致
			var cw=this.$el.css('width');
			var h=cw;
			cw=cw.indexOf('px')>=0?cw.substring(0,cw.length-2):cw;
			cw=cw-20;
			h=h.indexOf('px')>=0?h.substring(0,h.length-2):h;
			h=Math.round(h*4/5);
			if (cw<0)
				return false;
			if (json.PHOTOURLS && json.PHOTOURLS.length>0) { // Math.random()
				var len = json.PHOTOURLS.length;
				for (var i=0;i<len;i++) {
					var photoIndex = (!json.PHOTOURLS[i].PHOTOINDEX||json.PHOTOURLS[i].PHOTOINDEX<=0)
						?(i+1):json.PHOTOURLS[i].PHOTOINDEX; // 计算图片的序列位置
					var domImg = imgDoms[photoIndex-1];
					// 下面代码的目的:直接用明细页面的缓存图片
					//var r=json.PHOTOURLS[i].PHOTORADIO;
					//h=r?Math.round(cw/r):cw; // 和detail参数保持一致
					Gifted.Cache.localFile(json.PHOTOURLS[i].PHOTOURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/80', 
						json.PHOTOURLS[i].PHOTOID+'_1_'+cw+'_'+h+'_80', 
						domImg); // remoteURL, imgID, domImg, callback(localURL)
				}
			}
	        /*this.$el.find(".product_catalog").mobiscroll('destroy').mobiscroll({
			    preset: 'select', //选择
				theme: deviceIsIOS?'ios':'android-ics light', //皮肤样式
			    display: deviceIsIOS?'bottom':'modal', //显示方式  bottom modal
			    mode: 'scroller' //选择模式
	    	}).mobiscroll('setValue', this.model.get('CATALOG'), true); //设置option的checked属性*/
			//this.$el.find('.product_catalog').on('tap')
	        this.$el.find(".product_currency").mobiscroll('destroy').mobiscroll({
			    preset: 'select', //选择
				theme: deviceIsIOS?'ios':'android-ics light', //皮肤样式
			    display: 'modal',//deviceIsIOS?'bottom':'modal', //显示方式  bottom modal
			    mode: 'scroller' //选择模式
	    	}).mobiscroll('setValue', this.model.get('CURRENCY'), true); //设置option的checked属性
	    	var date = new Date();
	        this.$el.find(".product_date").each(function(){
				$(this).mobiscroll('destroy').mobiscroll().date({
					preset: 'date', //日期
					theme: deviceIsIOS?'ios':'android-ics light', //皮肤样式
					display: deviceIsIOS?'bottom':'modal', //显示方式  bottom modal
					mode: 'scroller', //日期选择模式
					dateFormat: 'yy-mm-dd', // 日期格式
					dateOrder: 'yymmdd', //面板中日期排列格式
					//dayText: '日', monthText: '月', yearText: '年', //面板中年月日文字
					//setText: '确定', //确认按钮名
					//cancelText: '取消',//取消按钮名
					//minYear:date.getFullYear(), // 起始年份
					//minMonth:date.getMonth()+1, // 起始月份
					//minDate:date.getDate(), // 起始日期
					startYear:date.getFullYear(), // 起始年份
					startMonth:date.getMonth()+1, // 起始月份
					startDate:date.getDate(), // 起始日期
					endYear:date.getFullYear()+20 // 结束年份
		    	});
			});
	        this.$el.trigger('create');
			this.setCatalog(this.model.get('CATALOG')||1);
	        /*var eventTap = Gifted.Config.Event.tap;
			this.$el.find(".product_description").off(eventTap);
			if (deviceIsAndroid==true) // 这样做是因为Android输入法会导致浏览器布局异常
				this.$el.find(".product_description").on(eventTap, _.bind(function(event) {
					event.preventDefault();
					this.isEditing = true;
					Backbone.history.navigate('product/description',{trigger:true});
				},this));*/
			//this.$el.find(".product_yxq_end").disable();
	        /*.product_modify_content {
				position:absolute;
				padding-top:50px;
				padding-bottom:3px;
			}*/
			//if (Gifted.Config.isRealPhone) { // 真机布局有点错乱 做点冗余调整
			//	this.$el.find('.product_modify_content').css({'position':'absolute','padding-top':'50px'});
			//	_.defer(_.bind(function(){
			//		this.$el.find('.product_modify_content').css({'position':'absolute','padding-top':'10px'});
			//	},this));
			//}
	        return this;
	    },
	    saveData:function(event) {
	    	if (this.saving==true) {
	    		Gifted.Global.alert('saving...');
	    		return false;
	    	}
			if (!Gifted.Global.checkConnection()) // 网络检查
				return false;
        	if(!this.app.checkRight({checkRule:['LOGIN']})) // 登录检查
	    		return false;
	    	var productID = this.model.get('ID')||'';
			if (productID=='' && this.fileUploader.photoPicked()==false) { // 新增时要检查photo是否选择了
				Gifted.Global.alert(Gifted.Lang['NotSelectPhotos']);
				return false;
			}
			var jsonForm = this.$el.find('.product_modify_form').serializeObject(); // 新增或修改时将表单数据转model
			this.model.set(jsonForm); // form2model
	    	if (!this.model.isValid()) { // 检查数据合法性
				Gifted.Global.alert(this.model.validationError);
				return false;
			}
			// --------------------------------------------- upload --------------------------------------------- //
			this.saving = true;
			try {
				var len = this.fileUploader.photoCount(), params = this.model.toSaveJSON();
				//params.GIFTED_LOCALENAME=Gifted.Config.Locale.localeName; // 保存时的语言环境(NOTICE transfer.body里中间层无法获取)
				var paramOfURL = 'GIFTED_SESSIONID='+Gifted.Global.getSessionId()+'&GIFTED_LOCALENAME='+Gifted.Config.Locale.localeName
					+'&inputFileCount='+len+'&inputTransID='+this.transID+'&inputProductID='+productID; // getParameter
				var uploadUrlDebug = Gifted.Config.uploadServerURL+Gifted.Config.Product.uploadFileURLDebug +'?'+paramOfURL;
				var uploadUrl = Gifted.Config.uploadServerURL+Gifted.Config.Product.uploadFileURL +'?'+paramOfURL;
				console.log("uploading:"+uploadUrl);
				Gifted.Global.showLoading();
				if (!Gifted.Config.isRealPhone && len>0) { // NOTICE 非真机且进行照片模拟的时候不保存只用于客户端调试
					var json = jsonForm; // 模拟保存后的数据
					json.ID = this.transID;
					json.PHOTOURLS = [{
						PHOTOID:this.fileUploader.imageKey,
						PHOTOURL:this.fileUploader.pickUrl[this.fileUploader.imageKey],
						PHOTORADIO:1,
						PHOTOINDEX:1,
						PHOTOWIDTH:640,
						PHOTOHEIGHT:480
					}];
					this.saving = false;
					Gifted.Global.hideLoading();
					// Gifted.Global.checkStatus(status);
					console.log("uploaded:"+json.url+", completed");
					Gifted.Global.alert(Gifted.Lang['Success']);
					this.fileUploader.reset(); // 重置上传信息
					if (this.model.isNew()) { // 重建新增页面并返回
						this.model.set(json); // 覆盖当前属性
						Backbone.history.history.back(); // 后退后才能在List:visible中显示
						_.delay(_.bind(function(){
							this.model.afterNew();
							this.model = new Product({collection:this.model.collection}); // 重建一个model(新建的view是共用的)
							this.render(); // 把空的model重新render // TODO 需要局部刷新
						},this),500);
					} else {
						this.model.set(json); // 覆盖当前属性
						this.model.afterModify();
					}
					return;
				}
				this.fileUploader.upload({ // 上传图片并保存数据
					//uploadUrlDebug:uploadUrlDebug,
					uploadUrl:uploadUrl, // url
					params:params, // body
					success:_.bind(function(json,status) {
						this.saving = false;
						Gifted.Global.hideLoading();
						Gifted.Global.checkStatus(status);
						if (json.complete==true) { // 保存完反填model
							console.log("uploaded:"+json.url+", completed");
							Gifted.Global.alert(Gifted.Lang['Success']);
							this.fileUploader.reset(); // 重置上传信息
							if (this.model.isNew()) { // 重建新增页面并返回
								this.model.set(json); // 覆盖当前属性
								Backbone.history.history.back(); // 后退后才能在List:visible中显示
								_.delay(_.bind(function(){
									this.model.afterNew();
									this.model = new Product({collection:this.model.collection}); // 重建一个model(新建的view是共用的)
									this.render(); // 把空的model重新render // TODO 需要局部刷新
								},this),500);
							} else {
								this.model.set(json); // 覆盖当前属性
								this.model.afterModify();
							}
						} else {
							console.log('upload.exception:'+JSON.stringify(json));
						}
					},this),
					failure:_.bind(function(status,message,imageUrl) {
						this.saving = false;
						Gifted.Global.hideLoading();
						Gifted.Global.checkStatus(status);
						console.log('upload.error:status='+status+',message='+message+',imageUrl='+imageUrl);
					},this)
				});
			}catch(E){
				this.saving = false;
				throw E;
			}
		},
		// ------------------------------------------------------------------------------------------ //
		/*photoUpload:function() {
			var len = this.fileUploader.photoCount();
			var params = this.model.serializeSaveObject();
			var productID = this.$el.find(".product_ID").val();
			var paramOfURL = 'GIFTED_SESSIONID='+Gifted.Global.getSessionId()
				+'&inputFileCount='+len+'&inputTransID='+this.transID+'&inputProductID='+productID; // getParameter
			var uploadUrlDebug = Gifted.Config.uploadServerURL+Gifted.Config.Product.uploadFileURLDebug +'?'+paramOfURL;
			var uploadUrl = Gifted.Config.uploadServerURL+Gifted.Config.Product.uploadFileURL +'?'+paramOfURL;
			this.fileUploader.upload({
				uploadUrlDebug:uploadUrlDebug,
				uploadUrl:uploadUrl,
				params:params,
				success:_.bind(function(json, status) {
					if (json.success==true) {
						this.model.set('PHOTO_'+this.fileUploader.imageKey, json.url);
					}
				},this),
				failure:_.bind(function(status, message) {
					//console.log('上传错误:'+message);
				},this)
			});
		},*/
		photoDelete:function() {
			this.fileUploader.photoDelete();
			//this.model.unset('PHOTO_'+this.fileUploader.imageKey);
		},
		photo4Debug:function() {
			this.fileUploader.photo4Debug({
				callback:_.bind(function(){
					//this.photoUpload();
				},this)
			});
		},
	    photo4Camera:function(blob) {
			this.fileUploader.photo4Camera({
				callback:_.bind(function(){
					//this.photoUpload();
				},this)
			});
		},
		photo4File:function() {
			var maxPic = 5;
			this.fileUploader.photo4MultiFile({
				maxPic:maxPic,
				callback:_.bind(function(uris){
					//this.photoUpload();
					//alert('modfiypic2......,this.fileUploader.imageKey:'+this.fileUploader.imageKey);
					var index = Number(this.fileUploader.imageKey)-1, len=uris.length;
					for (var i=0;i<len;i++) {
						var imageIndex = (index+i)%maxPic;
						var imageKey = imageIndex+'';
						//alert('modfiypic3......,i:'+i+',imageKey:'+imageKey);
						this.fileUploader.pickUrl[imageKey] = uris[i];
						delete this.fileUploader.deleteUrl[imageKey];
						var imageDom = this.$el.find('.product_image_btn')[imageIndex];
						imageDom.style.display = 'block';
						imageDom.src = uris[i];
					}
				},this)
			});
		},
	    pickPhoto:function(event) {
	    	if (event.target.tagName=='IMG') {
		    	if (this.saving==true) {
		    		//console.log("uploading......");
		    		Gifted.Global.alert('saving...');
		    		return false;
		    	}
				this.fileUploader.imageDom = event.target;
				this.fileUploader.imageKey = $(event.target).attr('index');
				//alert('modfiypic1......,this.fileUploader.imageKey:'+this.fileUploader.imageKey);
				//this.isEditing = true;
				//Backbone.history.navigate('product/photo',{trigger:true});
				//this.$el.find('.product_modify_form').hide();
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').show();
				},this),100);
			}
		},
	    selectPhoto:function(event) {
        	var val = $(event.target).attr('value');
			if (val==1) {
				this.photo4Camera();
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').hide();
				},this),100);
			} else if (val==2) {
				this.photo4File();
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').hide();
				},this),100);
			} else if (val==3) {
				this.photoDelete();
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').hide();
				},this),100);
			} else if (val==4) {
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').hide();
				},this),100);
			}
	    },
		// ------------------------------------------------------------------------------------------ //
	    remove:function(){
	    	/*if (this.photoViewer) {
	    		this.photoViewer.remove();
	    		delete this.photoViewer;
	    	}*/
	        //var eventTap = Gifted.Config.Event.tap;
			//this.$el.find(".product_description").off(eventTap);
	    	this.$el.find(".product_currency").mobiscroll('destroy');
	        this.$el.find(".product_catalog").mobiscroll('destroy');
	        this.$el.find(".product_date").each(function(){
				$(this).mobiscroll('destroy');
			});
	    	this.model.off("sync");
	    	this.model.off("refresh");
			this.fileUploader.remove();
			this.fileUploader = null;
			this.off('active');
	    	ProductListView.__super__.remove.apply(this, arguments);
	    }
	});
	return ProductModifyView;
});