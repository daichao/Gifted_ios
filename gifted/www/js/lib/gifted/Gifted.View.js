// @Deprecated
// Abstract
define(['underscore','backbone','backbone.scrollview'],function(_){
	Gifted.View = Backbone.ScrollView.extend({
	    // public
		constructor:function(config){
			if(config) {
				this.app=config?config.app:null;
				this.title=config.title;
			}
			Gifted.View.__super__.constructor.apply(this,arguments);
			var tt = this.model||this.collection;
			if (tt) {
	    		tt.on("request", this.showLoading, this);
	    		tt.on("sync", this.hideLoading, this);
	    		tt.on("error", this.hideLoading, this);
			}
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
	    // public
		back:function(event){
			if (Backbone.history.history.length>1) {
				Backbone.history.history.back();
			} else {
	    		this.backHome(event);
			}
		},
	    // public
	    backHome:function(event){
	    	this.app.navigate('home', {trigger:true});
	    },
	    // public
		openNavigate:function(event){
			this.app.navigate('navigate', {trigger:true});
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
	    	//$(event.target).click();
	    },
	    //openCatalog:function(event) {
	    //	event.stopPropagation();
		//  	event.preventDefault();
		//	this.app.navigate('product/choosecatalog', {trigger:true,transition:'slidetop'});
	    //},
	    // public
		showLoading:function() {
			Gifted.Global.showLoading();
		},
	    // public
		hideLoading:function() {
			Gifted.Global.hideLoading();
		},
	    // public
	    refresh:function() {
	    	//this.trigger('refreshcontent');
	    	this.onRefreshContent();
		},
		// protected
		render:function(){
			Gifted.View.__super__.render.apply(this,arguments);
			//this.trigger('refreshcontent');
			this.onRefreshContent();
		},
		remove:function(){
			Gifted.View.__super__.remove.apply(this,arguments);
			var tt = this.model||this.collection;
			if (tt) {
	    		tt.off("request");
	    		tt.off("sync");
	    		tt.off("error");
			}
			if(this.app)
				delete this.app;
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
});