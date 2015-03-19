define(['modules/user/templates/userinfo', 'handlebars'],function(mod0){
	var UserInfoView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
		topRefresh:true,
		bottomRefresh:false,
		events:{
			'tap .headbar_sign':'back',
			'tap .user_userinfo_edit':'edit',
	    	'tap .content_wrapper':'refreshImg'
		},
		initialize: function () {
			this.model.on('change:userInfo',_.bind(function(){
				this.contentRender();
				this.refresh();
			},this),this);
	    	UserInfoView.__super__.initialize.apply(this, arguments);
	    },
	    loadData:function() {
			this.model.getUserInfo(); // trigger render
	    },
		onTopRefresh:function(event){
			this.loadData();
			_.delay(_.bind(this.trigger,this,'loadComplete'),1000);
		},
		edit : function(){
			this.app.navigate('user/useredit', {trigger:true});
		},
	    getImageURLs:function() {
			var userInfo = this.model.get('userInfo');
			if (!userInfo) {
				return [];
			}
			var userID=userInfo['ID'];
			var width=window.screen.width;
	    	return [
	    		{PHOTOURL:userInfo['PORTRAIT']||'img/noportrait.png',PHOTORADIO:1,PHOTOID:'userportrait_'+userID,PHOTOWIDTH:width},
	    		{PHOTOURL:userInfo['BUSINESSCARD']||'img/notexists_80_80.png',PHOTORADIO:1,PHOTOID:'usercard_'+userID,PHOTOWIDTH:width},
	    		{PHOTOURL:userInfo['BUSINESSLICENCE']||'img/notexists_80_80.png',PHOTORADIO:1,PHOTOID:'userlicence_'+userID,PHOTOWIDTH:width}
	    	];
	    },
	    refreshImg:function(event) {
			if (!$(event.target).is('.userinfo_image')) {
				if (Gifted.Util.isFullScreen())
					Gifted.Util.fullScreenCancel();
				return false;
			}
			var src = $(event.target).attr('src');
			if (src!='#'&&src!=''&&src!=Gifted.Config.emptyImg) {
				this.app.navigate('imagebrowser', {trigger:true});
				//Gifted.Util.fullScreenToggle(event.target);
				return false;
			}
			return true; // 图片刷新成功的标记
	    },
		paintImage : function() {
			var userInfo = this.model.get('userInfo');
			if (!userInfo) {
				return;
			}
			var userID = userInfo['ID'];
			var portrait = userInfo['PORTRAIT'];
			if (portrait) {
				var domImg = this.$el.find('.userinfo_portrait')[0], cw=h=80;
				Gifted.Cache.localFile(portrait+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'userportrait_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg); // remoteURL, imgID, domImg, callback, override
			}
			var cardURL = userInfo['BUSINESSCARD'];
			if (cardURL) {
				var domImg = this.$el.find('.useredit_businesscard_pic')[0], cw=h=80;
				Gifted.Cache.localFile(cardURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'usercard_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg); // remoteURL, imgID, domImg, callback, override
			}
			var licenceURL = userInfo['BUSINESSLICENCE'];
			if (licenceURL) {
				var domImg = this.$el.find('.useredit_businesslicence_pic')[0], cw=h=80;
				Gifted.Cache.localFile(licenceURL+'?imageView2/1/w/'+cw+'/h/'+h+'/q/50',  
					'userlicence_'+userID+'_1_'+cw+'_'+h+'_50', 
					domImg); // remoteURL, imgID, domImg, callback, override
			}
		},
		contentRender : function(){
			if(this.model.ID != this.app.user.get('ID')){
				this.$el.find('.user_userinfo_edit').hide();
			}
			var userInfo = this.model.get('userInfo');
			if (!userInfo) {
				return;
			}
			var html = this.templateContent(userInfo);
			this.$contentEl.empty().html(html);
			this.paintImage();
		}
	});
	return UserInfoView;
	
});
