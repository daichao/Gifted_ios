define(['modules/user/templates/useredit', 'handlebars', 'gifted.countrycode'],function(mod0){
	var UserEditView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		topRefresh:false,
		bottomRefresh:false,
		saving:false,
		events:{
			'tap .headbar_sign':'backHome',
			'tap .header_commit':'save',
			'tap .useredit-portrait':'pickPhoto',
			'tap .useredit_businesscard_pic':'pickPhoto',
			'tap .useredit_businesslicence_pic':'pickPhoto',
			'tap .photo_select_list':'selectPhoto',
			'change .useredit_country':'changeCountry'
		},
		initialize: function () {
			this.model.set(this.app.user.toJSON());
			this.model.on("change:SimCountryIso",this.refreshCountryCode,this);
			this.model.on("change:Line1Number",this.refreshPhoneNumber,this);
			this.app.user.on('saveError',this.saveError,this);
			this.app.user.on('saveSuccess',this.saveSuccess,this);
	    	this.fileUploader = new Gifted.Util.FileUploader({zip:true});
	    	UserEditView.__super__.initialize.apply(this, arguments);
	    },
		refreshCountryCode:function(){
			var country = this.model.get('SimCountryIso')||'null';
			var code = Gifted.CountryCode[country]||'';
			this.$contentEl.find('.useredit_countrycode').val(code);
		},
		refreshPhoneNumber:function(){
			var phone = this.model.get('Line1Number')||'';
			this.$contentEl.find('.useredit_mobile').val(phone);
		},
		changeCountry:function(event){
			//var option = this.$el.find(".useredit_country option[value='"+$(event.target).val()+"']");
			var option = this.$el.find(".useredit_country option:selected");
			var phone_prefix = option.attr('phone_prefix');
			this.$el.find('.useredit_countrycode').val(phone_prefix);
		},
		saveError:function(args){
			this.fileUploader.remove();
			if(401 == args.errorCode){
				Backbone.history.navigate('user/useredit',{trigger:true});
			}else if(403 == xhr.status){
				Gifted.Global.alert(args.errorInfo);
			}
		},
		saveSuccess:function(args){
			Gifted.Global.alert(Gifted.Lang['saveSuccess']);
			this.fileUploader.remove();
			this.backHome();
		},
		save:function(){
			var name=this.$el.find('.useredit_username').val();
			if(!name){
				Gifted.Global.alert(Gifted.Lang['UsernameIsEmpty']);
				return;
			}
			var countryCode = this.$el.find('.useredit_countrycode').val();
			if(!countryCode){
				Gifted.Global.alert(Gifted.Lang['NotInputCountryCode']);
				return;
			}
			var country=this.$el.find('.useredit_country').val();
			var mobile = this.$el.find('.useredit_mobile').val();
			if(!mobile){//TODO 手机号码验证
				Gifted.Global.alert(Gifted.Lang['NotInputMobile']);
				return;
			}
			var address=this.$el.find('.useredit_address').val();
			if(!address){
				Gifted.Global.alert(Gifted.Lang['AddressIsEmpty']);
				return;
			}
			var pic = this.$el.find('.useredit_businesscard_pic').attr('src');
			if(pic=='' || pic=='img/takepicture.png'){
				Gifted.Global.alert(Gifted.Lang['NotInputBusinesscard']);
				return;
			}
			var pic2 = this.$el.find('.useredit_businesslicence_pic').attr('src');
			if(pic2=='' || pic2=='img/takepicture.png'){
				Gifted.Global.alert(Gifted.Lang['NotInputBusinessLicence']);
				return;
			}
			var selfIntroduction = this.$el.find('.useredit_selfintroduction_content').val();
			this.model.set({'SELFINTRODUCTION':selfIntroduction,'MOBILE':mobile.trim(),'COUNTRYCODE':countryCode.trim(),'COUNTRY':country.trim(),'ADDRESS':address});
			
			/*var len = this.fileUploader.photoCount();
			if (len==0) { // 检查是否有选择照片 修改其他信息也要让保存
				return;
			}*/
			// --------------------------------------------- upload --------------------------------------------- //
			if (this.saving==true) {
				Gifted.Global.alert('Uploading...');
				return;
			}
			this.saving=true;
			var uploadUrl = Gifted.Config.uploadServerURL+Gifted.Config.Image.uploadZipImageURL
						+'?GIFTED_SESSIONID='+Gifted.Global.getSessionId();
			Gifted.Global.showLoading();
			this.fileUploader.upload({
				uploadUrl:uploadUrl,
				params:{},
				success:_.bind(function(json, status) {
					this.saving=false;
					Gifted.Global.hideLoading();
					Gifted.Global.checkStatus(status);
					if (json.success==true) {
						var urls = json.urls;
						for (var k in urls) {
							var url = urls[k];
							if (k=='1') {
								this.model.set('PORTRAIT',url);
							} else if (k=='2') {
								this.model.set('BUSINESSCARD',url);
							} else if (k=='3') {
								this.model.set('BUSINESSLICENCE',url);
							}
						}
						this.paintImage(true);
						this.app.user.save(this.model.toJSON());
					} else {
						console.log('上传异常:'+JSON.stringify(json));
					}
				},this),
				failure:_.bind(function(status,message,imageUrl) {
					this.saving=false;
					Gifted.Global.hideLoading();
					Gifted.Global.checkStatus(status);
					console.log('上传错误:status='+status+',message='+message+',imageUrl='+imageUrl);
				},this)
			});
		},
		paintImage:function(override) {
			var userID = this.model.get('ID');
			var portrait = this.model.get('PORTRAIT');
			if (portrait) {
				var domImg = this.$el.find('.useredit-portrait')[0], cw=h=80;
				Gifted.Cache.localFile(portrait+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'userportrait_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg, null, override); // remoteURL, imgID, domImg, callback, override
			}
			var cardURL = this.model.get('BUSINESSCARD');
			if (cardURL) {
				var domImg = this.$el.find('.useredit_businesscard_pic')[0], cw=h=80;
				Gifted.Cache.localFile(cardURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'usercard_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg, null, override); // remoteURL, imgID, domImg, callback, override
			}
			var licenceURL = this.model.get('BUSINESSLICENCE');
			if (licenceURL) {
				var domImg = this.$el.find('.useredit_businesslicence_pic')[0], cw=h=80;
				Gifted.Cache.localFile(licenceURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'userlicence_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg, null, override); // remoteURL, imgID, domImg, callback, override
			}
		},
		contentRender:function(){
			var html = this.templateContent(this.model.toJSON());
			this.$contentEl.empty().html(html);
			if(!this.model.get('COUNTRYCODE'))
				this.model.getSimCountryIso();
			if(!this.model.get('MOBILE'))
				this.model.getPhoneNumber();
			this.paintImage();
			this.loadContriesListView();
		},
		deletePhoto:function() {
			this.fileUploader.deletePhoto();
		},
		photo4Debug:function() {
			this.fileUploader.photo4Debug({
				callback:_.bind(function(url){
					//this.uploadPhoto();
				},this)
			});
		},
	    photo4Camera:function(blob) {
			this.fileUploader.photo4Camera({
				callback:_.bind(function(url){
					//this.uploadPhoto();
				},this)
			});
		},
		photo4File:function() {
			this.fileUploader.photo4File({
				callback:_.bind(function(url){
					//this.uploadPhoto();
				},this)
			});
		},
	    pickPhoto:function(event) {
	    	if (event.target.tagName=='IMG') {
				if (this.saving==true) {
					Gifted.Global.alert('Uploading...');
					return;
				}
				this.fileUploader.imageDom = event.target;
				this.fileUploader.imageKey = $(event.target).attr('index');
				//this.isEditing = true;
				_.delay(_.bind(function(){
					this.$el.find('.photo_select_wrap').show();
				},this),500);
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
	    	this.app.user.off('saveError',this.saveError,this);
			this.app.user.off('saveSuccess',this.saveSuccess,this);
			this.fileUploader.remove();
			this.fileUploader = null;
			delete this.model;
			UserEditView.__super__.remove.apply(this,arguments);
		},
	    loadContriesListView:function(){
	    	require(['lib/countries'],_.bind(function(countries){
	    		var counties=getCountries();
	    		var i;
	    		for(i=0;i<counties.length;i++){
	    			var country=counties[i];
	    			var name,option;    			
	    			if(Gifted.Config.Locale.localeName=='en'){
	    				name=country.en_name.trim();
	    			}else if(Gifted.Config.Locale.localeName=='zh_CN'){
	    				name=country.cn_name.trim();
	    			}
	    			if(country.IDN.trim()&&this.model.attributes['COUNTRY']==country.IDN.trim()){
	    				option='<option value ="'+country.IDN.trim()+'" phone_prefix="'+country.phone_prefix.trim()+'" selected="selected">'+name.trim()+'</option>'
	    			}else if(!this.model.attributes['COUNTRY']&&
	    					this.model.attributes['COUNTRYCODE']==country.phone_prefix.trim()){
	    				option='<option value ="'+country.IDN.trim()+'" phone_prefix="'+country.phone_prefix.trim()+'" selected="selected">'+name.trim()+'</option>'
	    			}else{
	    				option='<option value ="'+country.IDN.trim()+'" phone_prefix="'+country.phone_prefix.trim()+'">'+name.trim()+'</option>'
	    			}
	    			this.$el.find('.useredit_country').append(
	    				option
    	    		);
	    		}
	    	},this));
	    }
	});
	return UserEditView;
	
});
