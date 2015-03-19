// @Deprecated
// Abstract
define(['underscore','backbone','backbone.scrollview'],function(_){
	// namespace
	if (typeof Gifted == 'undefined')
		Gifted = {};
	if (Gifted.View)
		return Gifted.View;
	Gifted.View = Backbone.ScrollView.extend({
	    // public
		constructor:function(config){
			if(config) {
				this.app=config?config.app:null;
				this.title=config.title;
			}
			Gifted.View.__super__.constructor.apply(this,arguments);
//			var tt = this.model||this.collection;
//			if (tt) {
//	    		tt.on("request", this.showLoading, this);
//	    		tt.on("sync", this.hideLoading, this);
//	    		tt.on("error", this.hideLoading, this);
//			}
		},
	    // public
		changeView:function(to){
			this.app.showView(to);
			this.app.navigate(to.path);
		},
	    // public
		getPrevView:function(){
			if(this.prevView){
				return this.app.getCacheView(this.prevView);
			}
			return null;
		},
		refreshHeadBar:function() {
	    	if (this.key=='home') {
	    		this.$el.find('.headbar_action')
	    			.removeClass('headbar_action_back')
	    			.removeClass('headbar_action_navigator2')
	    			.addClass('headbar_action_navigator');
	    	} else {
		    	if (this.prevView) {
			    	this.$el.find('.headbar_action')
			    		.removeClass('headbar_action_navigator')
			    		.removeClass('headbar_action_navigator2')
			    		.addClass('headbar_action_back');
		    	} else {
			    	this.$el.find('.headbar_action')
			    		.removeClass('headbar_action_back')
	    				.removeClass('headbar_action_navigator2')
			    		.addClass('headbar_action_navigator');
		    	}
	    	}
		},
	    onActive:function(){
	    	Gifted.View.__super__.onActive.apply(this, arguments);
	    	this.refreshHeadBar();
	    },
	    // public
	    backHome:function(event){
	    	this.app.navigate('home', {trigger:true});
	    },
	    // public
		back:function(event){
			if (this.$el.find('.headbar_action').hasClass('headbar_action_navigator') 
				|| this.$el.find('.headbar_action').hasClass('headbar_action_navigator2')) { // 优先判断css
				//this.openNavigate(event);
				this.app.trigger('route:navigator');
				return;
			}
			if (Backbone.history.history.length>1) {
				Backbone.history.history.back();
			} else {
	    		this.app.navigate('home', {trigger:true});
			}
		},
	    // public
	    openSearch:function(event) {
	    	var title = Gifted.Lang['ProductSearch'];
			this.app.navigate('product/search/query/*/'+title, {trigger:true});
	    },
	    // public
	    openLink:function(event){
	    	var href = $(event.target).find('a').attr('href');
	    	if (!href)
	    		href = $(event.target).attr('href');
	    	console.log('openLink,'+href);
	    	if (href && href!='tel:+' && href!='mailto:')
	    		window.location.href=href;
	    },
	    // public
		showLoading:function() {
			Gifted.Global.showLoading();
		},
	    // public
		hideLoading:function() {
			Gifted.Global.hideLoading();
		},
		// abstract
		topbarRender:function(){
	    	Gifted.View.__super__.topbarRender.apply(this, arguments);
		},
		// abstract
		bottomRender:function(){
	    	Gifted.View.__super__.bottomRender.apply(this, arguments);
		},
	    onRefreshContent:function(){
	    	Gifted.View.__super__.onRefreshContent.apply(this, arguments);
	    },
	    // protected
	    refresh:function() {
	    	this.onRefreshContent();
		},
		// public
		render:function(){
			Gifted.View.__super__.render.apply(this,arguments);
			this.onRefreshContent();
		},
		removeOWLCanvas:function() {
        	if (Gifted.Config.isCanvasCarouel) { // 启用CanvasCarouel或OWLCarousel的开关
	        	this.$el.find('.canvascarousel').carouseldestroy();
        	} else {
		    	this.$el.find('.owl-carousel').off('swipeleft swiperight touchstart');
		    	if (this.owl) {
					this.owl.destroy();
					delete this.owl;
				}
		    	if(this.othersOwl){//其他产品的图片控件
					this.othersOwl.destroy();
					delete this.othersOwl;
		    	}
	    	}
		},
		remove:function(){
//			if (this.app) {
//				delete this.app;
//			}
//			var tt = this.model||this.collection;
//			if (tt) {
//	    		tt.off("request");
//	    		tt.off("sync");
//	    		tt.off("error");
//			}
			this.removeOWLCanvas();
			Gifted.View.__super__.remove.apply(this,arguments);
		},
		hint:function(event){				
			var input = $(event.target).val();
			if(input.length==0){
				return;
			}else{
				var indexOfAt=input.indexOf('@');
				if(indexOfAt==-1){
					this.$el.find('.dropDownBoxForEmail').hide();
					return;
				}
				var suffix=input.substring(indexOfAt,input.length);
				var prefix=input.substring(0,indexOfAt);
				this.showPreparedEmailList(prefix,suffix);
			}
		},
		bindEmailHintEvent:function(selector){
			this.events['input '+selector+'']='hint';
			this.events['tap .dropDownBoxForEmail li']='appendEmailSuffix';	
			this.events['focus '+selector+'']='renderEmailHintFrame';
		},
		renderEmailHintFrame:function(event){
			if(this.$el.find(".dropDownBoxForEmail").length==0){
				this.$el.find(event.target).after(
					'<div class="dropDownBoxForEmail">'+
						'<ul class="dropDown"></ul>'+
					'</div>'
				);
			}	
		},
		showPreparedEmailList:function(prefix,suffix){
			 var emails = [
                {domain:'@139.com', label:'139邮箱'}, 
                {domain:'@126.com', label:'126邮箱'},
                {domain:'@163.com',  label:'163邮箱'},
                {domain:'@gmail.com',label:'gmail邮箱'}, 
                {domain:'@hotmail.com', label:'hotmail邮箱'},
                {domain:'@msn.cn', label:'msn邮箱'},
		 		{domain:'@qq.com', label:'qq邮箱'}, 
                {domain:'@sina.com', label:'sina邮箱'},
                {domain:'@yahoo.com.cn', label:'yahoo中国邮箱'}
			 ];
			 this.$el.find(".dropDown").html("");
			 this.$el.find('.dropDownBoxForEmail').show();
			 var i;
			 for(i=0;i<emails.length;i++){
				 if(emails[i].domain.indexOf(suffix)!=-1){
					 this.$el.find(".dropDown").append("<li>"+prefix+emails[i].domain+"</li;")
					 if(emails[i].domain==suffix){
						 this.$el.find('.dropDownBoxForEmail').hide();
					 }
				 }					 
			 }
			 if(this.$el.find(".dropDown").html().length==0)
				 this.$el.find('.dropDownBoxForEmail').hide();
		},
		appendEmailSuffix:function(event){
//			this.$el.find('.login-user').val(event.target.innerHTML);
			this.$el.find(".dropDownBoxForEmail").prev().val(event.target.innerHTML);
			this.$el.find('.dropDownBoxForEmail').hide();
		}
	});
	return Gifted.View;
});