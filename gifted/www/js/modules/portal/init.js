define(['modules/portal/models/models'
	,'css!modules/portal/styles/portal.css'],function(){
	var result = new (function(){
		this.init = function(app){
			this.app = app;
			app.settings = new Settings();
			//app.settings.on('settingsModuleInitialized',_.bind(function(){
			//	this.trigger('inited',this);
			//},this));
			app.route('navigate','navigate');
			app.route('settings','openSettings');
			app.route('about5pro','about5pro');
        	app.route('imagebrowser','imagebrowser');
        	app.on('route:imagebrowser',this.imageBrowser,this);
        	app.on('route:navigate',this.toggleNavigator,this);
	    	app.on('route:openSettings',this.openSettings,this);
	    	app.on('route:about5pro',this.about5pro,this);
	    	app.on('hideNavigator',_.bind(function(view){
	    		if (view==this) {
	    			return;
	    		}
	    		if (this.isNavigatorOpen()){
    				this.toggleNavigator();
    			}
				if (view.preView) {
	    			var cc = this.app.getCacheView(view.preView).$el.find('.headbar_action_navigator2');
	    			if (cc.length>0) {
	    				cc.removeClass('headbar_action_navigator2').addClass('headbar_action_navigator');
	    			}
    			}
    			var cc = view.$el.find('.headbar_action_navigator2');
    			if (cc.length>0) {
    				cc.removeClass('headbar_action_navigator2').addClass('headbar_action_navigator');
    			}
	    	},this));
        	$('body').on('swipeleft swiperight',_.bind(function(e){
	    		if(e.type=='swipeleft'){
	    			if(this.isNavigatorOpen()){
	    				this.toggleNavigator();
	    			}
	    		} else if(e.type=="swiperight"){
	    			if(e.swipestart.coords[0]>40){
		    			if(!this.isNavigatorOpen()){
		    				this.toggleNavigator();
		    			}
	    			}
	    		}
	    	},this));
	    	this.trigger('inited',this);
		};
        this.isNavigatorOpen=function(){
        	var v = this.app.getCacheView('navigator');
        	if(!v)
        		return false;
        	return v.$el.is('.ui-panel-open');
        };
        this.toggleNavigator=function(callback){
        	require(['modules/portal/views/NavigatorView','modules/portal/models/models'],_.bind(function(NavigatorView){
	    		var hv = this.app.selectView('navigator',_.bind(function(){
	    			var result = new NavigatorView({el:$('#navigator')[0],app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.toggleView(hv);
	    		if (this.isNavigatorOpen()) {
	    			var cc = this.app.currentView.$el.find('.headbar_action_navigator');
	    			if (cc.length>0) {
	    				cc.removeClass('headbar_action_navigator').addClass('headbar_action_navigator2');
	    			}
	    		} else {
	    			var cc = this.app.currentView.$el.find('.headbar_action_navigator2');
	    			if (cc.length>0) {
	    				cc.removeClass('headbar_action_navigator2').addClass('headbar_action_navigator');
	    			}
	    		}
	    	},this));
        };
        this.toggleMessagePanel=function(callback){
        	return false;
        };
        this.imageBrowser=function(callback){
        	require(['modules/portal/views/ImageBrowserView'],_.bind(function(ImageBrowserView){
	    		var hv = this.app.createView('imagebrowser',_.bind(function(){
	    			var result = new ImageBrowserView({app:this.app});
	    			this.app.pageContainer.append(result.$el);
		    		if (this.app.currentView && this.app.currentView.getImageURLs) {
		    			var urls = this.app.currentView.getImageURLs();
		    			result.setImageURLs(urls);
		    		}
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv);
	    	},this));
        };
        this.openSettings = function(){
        	require(['modules/portal/views/SettingsView','modules/portal/models/models'],_.bind(function(SettingsView){
	    		var hv = this.app.selectView('settings',_.bind(function(){
	    			var result = new SettingsView({model:this.app.settings, app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv, {transition:'slidedown'});
	    	},this));
        };
        this.about5pro = function(){
        	require(['modules/portal/views/About5ProView','modules/portal/models/models'],_.bind(function(About5ProView){
	    		var hv = this.app.selectView('about5pro',_.bind(function(){
	    			var result = new About5ProView({app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv, {transition:'slideup'});
	    	},this));
        };
	})();
	_.extend(result, Backbone.Events);
	return result;
});