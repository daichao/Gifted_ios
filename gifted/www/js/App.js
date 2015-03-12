define(['underscore', 'backbone', 'backbone.cache', 'jqmobile','handlebars',
	'css!../css/jquery.mobile-1.4.5.css',
	'css!../css/jquerymobile.nativedroid.css',
	'css!../css/jquerymobile.nativedroid.dark.css',
	//'css!http://nativedroid.godesign.ch/demo/css/jquerymobile.nativedroid.color.green.css',
	//'css!../css/reset.css',
	'css!../css/styles.css'], function (_, Backbone) {
	Handlebars.registerHelper('dataformnow', function(dt) {
		 var now = new Date();
		 if(dt.year!=now.year){
			 return dt.format('YYYY-MM-DD');
		 }
		 if(dt.month!=now.month || dt.day!=now.day){
			 return dt.format('MM-DD');
		 }
		 return dt.format('HH:mm')
	});
    var App = Backbone.Router.extend({
    	pageContainer:$('body'),
    	currentView:null,
    	navigatorItems:[],
    	getCacheView:function(key){
    		if(this.views[key]){
    			return this.views[key];
    		}
    		return null;
    	},
    	selectView:function(key,fn){
    		if(this.views[key]){
    			var result = this.views[key];
    			result.delegateEvents();
    			result.fromCache = true;
    			return result;
    		}
    		if(fn){
    			var result =  this.createView(key,fn);
    			result.path = Backbone.history.fragment;
    			return result;
    		}
    		return null;
    	},
    	createView:function(key, fn){
    		this.removeView(key);
    		var newView = fn.apply(this);
    		this.views[key]= newView;
    		return newView;
    	},
    	removeView:function(key){
    		var cacheView = this.getCacheView(key);
    		if (cacheView){
    			cacheView.remove();
    			cacheView.$el.remove();
    			delete this.views[key];
    		}
    	},
    	clearAllView:function(excludes) {
    		for (var key in this.views) {
    			if (excludes) {
    				for (var i=0;i<excludes.length;i++) {
    					if (excludes[i]==this.views[key])
    						return;
    				}
    			}
    			this.views[key].remove();
    		};
    		this.views.clear();
			for (var i=0;i<excludes.length;i++) {
				this.views[i]=excludes[i];
			}
    	},
    	loadModule:function(key){
    		this.modules[key]=null;
    		require(['modules/' + key + '/init'],_.bind(function(module){
    			module.key = key;
    			this.modules[key] = module;
    			module.on('inited',this.onModuleInited,this);
    			if(module.dependents && module.dependents.length>0){
    				_.each(module.dependents,function(dep){
    					if(!this.isModuleExist(dep)){
    						this.loadModule(dep);
    					}
    				},this);
    			}
    		},this))
    	},
    	onModuleInited:function(module){
    		module.initing = false;
    		module.inited = true;
    		console.log('module ' + module.key + ' inited!');
    	},
    	isModuleInited:function(module){
    		var m = this.modules[module];
    		if(!m)
    			return false;
    		return m.inited;
    	},
    	isModuleExist:function(module){
    		return this.modules[module]!=null;
    	},
    	onAllModulesInited:function(){
    		Backbone.history.start();
    	},
    	initModules:function(){
    		var allinited = true;
    		_.each(_.keys(this.modules),function(moduleKey){
    			var m = this.modules[moduleKey];
    			if(m && (m.inited || m.initing))
    				return;
    			allinited = false;
    			if(!m)
    				return;
    			var a = _.find(m.dependents,function(dep){
    				return !this.isModuleInited(dep);
    			},this);
    			if(!a){//没有找多说明全部初始化了
    				m.initing = true;
    				m.init(this);
    			}
    		},this);
    		if(allinited)
    			this.trigger('modulesinited');
    		else
    			_.delay(_.bind(this.initModules,this),300);
    	},
    	// 完成路由的加载
        initialize: function () {
//        	this.on("route", function(route, params) {
//        	    console.log("Different Page: " + route);
//        	});
        	this.views={};
        	this.modules = {};
        	this.loadModule('user');
        	this.loadModule('portal');
        	this.loadModule('product');
        	this.once('modulesinited',this.onAllModulesInited,this);
        	this.initModules();
        },
//        isNavigatorOpen:function(){
//        	var v = this.getCacheView('navigator');
//        	if(!v)
//        		return false;
//        	return v.$el.is('.ui-panel-open');
//        },
//        toggleNavigator:function(callback){
//        	require(['NavigatorView','models'],_.bind(function(NavigatorView){
//	    		var hv = this.selectView('navigator',_.bind(function(){
//	    			var result =  new NavigatorView({el:$('#navigator')[0],collection:new NavigatorItemCollection()});
//	    			result.render();
//	    			result.collection.reset([{link:'#home',text:'首页',icon:''}]);
//	    			return result;
//	    		},this));
//	    		this.toggleView(hv);
//	    	},this));
//        },
//        toggleMessagePanel:function(callback){
//        	return false;
//        },
        showView:function(view){
        	var options = {
    			changeHash:false,
    			reverse:false,
				transition:'none'
			};
        	$.mobile.changePage(view.$el, options);
        	this.currentView = view;
            view.trigger('active'); // trigger active to refresh
            this.trigger('hideNavigator', view);
        },
        changeView:function(view, options){
        	var transition = $.mobile.defaultPageTransition;
        	if(!this.currentView){
        		transition = 'none';
        	}
        	options = $.extend({
    			changeHash:false,
    			reverse:false,
				transition:transition
			}, options||{});
        	$.mobile.changePage(view.$el, options);
        	if (this.currentView)
        		view.prevView=this.currentView.key;
        	this.currentView = view;
            view.trigger('active'); // trigger active to refresh
        	this.trigger('hideNavigator', view);
        },
        toggleView:function(view){
        	view.$el.panel('toggle');
        },
        openView:function(view){
        	view.$el.panel('open',{});
        },
        closeView:function(view){
        	view.$el.panel('close');
        },
//        home: function () {
//        	require(['ProductListView','models'],_.bind(function(ProductListView){
//	    		var hv = this.selectView('home',function(){
//	    			var result =  new ProductListView({collection:new ProductCollection()});
//	    			this.pageContainer.append(result.$el);
//	    			result.render();
//	    			result.collection.fetch({reset:true});
//	    			return result;
//	    		});
//	    		this.changeView(hv);
//	    	},this));
//        },
//        productDetail:function(id){
//        	require(['ProductView','models'],_.bind(function(ProductView){
//        		var productView = this.selectView('productview_' + id,function(){
//        			var result =  new ProductView({model:new Product({id:id})});
//        			this.pageContainer.append(result.$el);
//        			return result;
//        		});
//        		productView.model.set({id:id});
//        		productView.model.fetch({
//        			cache:true,
//        			success:_.bind(function(data){
//        				this.changeView(productView);
//        			},this)
//        		});
//        	},this));
//        },
        /*employeeDetails: function (id) {
        	require(['EmployeeView','models'],_.bind(function(EmployeeView){
        		var employeeview = this.selectView('employeeview',function(){
        			return new EmployeeView({model:new Employee()});
        		});
        		employeeview.model.set({id:id});
        		employeeview.model.fetch({
        			cache:true,
        			success:_.bind(function(data){
        				this.changeView(employeeview);
        			},this)
        		});
        	},this));
        },*/
        checkRight:function(options){// TODO 权限信息放在前台的用户信息里，后台也会验证相应权限
    		var sessionId = Gifted.Global.getSessionId();
        	if (sessionId && sessionId.length > 0) {//登录过
				if(options && options.checkRule){//有需要检查的权限
	        		var rules = options.checkRule;
	        		var rights = this.user.get('RIGHTS');
	        		var pass = false;
	        		for(var i=0;rules[i];i++){
	        			for(var j=0;rights[j];j++){
	        				if(rights[j] === rules[i]){//检查通过
	        					pass = true;
	        					break;
	        				}
	        			}
	        			if(!pass){//检查不通过
	        				if(options.trigger != false)
	        					this.trigger('route:'+rules[i].toLowerCase()); //触发获取相应权限的操作
	        				break;
	        			}
	        		}
	        		if(pass)//所有权限都通过了
	        			return true;
	        		return false;
	        	}
	        	return false;//没说明检查什么权限，或者参数错误
			} else {
				if (!options || options.trigger != false)
					this.trigger('security:notlogin'); //触发登录操作
				return false;
			}
        	
        }
    });
    return App;
});
