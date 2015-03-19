define(['modules/user/models/models'
	,'css!modules/user/styles/userinit.css'
	,deviceIsIOS?'css!../../../css/styles-ios.css':'css!../../../css/styles-android.css'],function(){
	var module = new (function(){
		//this.dependents=['portal'];
		this.viewCache = [];
		this.init = function(app){
			this.app = app;
			this.app.on('reset',this.resetViewCache,this);
			app.user = new User();
        	app.route('user/login','login');
        	app.route('user/logout','logout');
        	app.route('user/userinfo/:userId','userinfo');
        	app.route('user/userinteractive/:userId','userinteractive');
        	app.route('user/useredit','useredit');
        	app.route('user/register','register');
        	app.route('user/modifypassword','modifypassword');
        	app.route('user/forgetpassword','forgetpassword');
        	app.route('user/resetpassword','resetpassword');
        	app.route('user/conversation/:friendId(/:productId)','conversation');
        	app.route('user/conversationList','conversationList');
        	app.route('user/followerList/:userId','followerList');
        	app.route('user/followList/:userId','followList');
        	app.on('security:login',this.login,this);
        	app.on('security:seller',this.noSellerRight,this);
        	app.on('route:login',this.login,this);
        	app.on('route:logout',this.logout,this);
        	app.on('route:userinfo',this.userInfo,this);
        	app.on('route:userinteractive',this.userInteractive,this);
        	app.on('route:useredit',this.userEdit,this);
        	app.on('route:modifypassword',this.modifyPassword,this);
        	app.on('route:register',this.register,this);
        	app.on('route:forgetpassword',this.forgetPassword,this);
        	app.on('route:resetpassword',this.resetPassword,this);
        	app.on('route:conversation',this.conversation,this);
        	app.on('route:conversationList',this.conversationList,this);
        	app.on('route:followerList',this.followerList,this);
        	app.on('route:followList',this.followList,this);
        	if (app.user.inited) {
        		this.trigger('inited',this);
        	} else {
				app.user.on('userModuleInitialized',_.bind(function(){
					this.trigger('inited',this);
				},this));
			}
		};
		this.resetViewCache = function(){
			_.each(this.viewCache,this.removeCacheView,this);
			this.viewCache = [];
		};
		this.addCacheView = function(v){
			this.viewCache.push(v);
		};
		this.removeCacheView = function(v){
			this.app.removeView(v.key);
		};
		this.noSellerRight = function(){
			var user = this.app.user;
			var rights = user.get('RIGHTS');
			if (!rights) {
				this.app.navigate('user/login', {trigger:true});
				return;
			} else {
				if (!user.get('BUSINESSCARD')||user.get('BUSINESSCARD')=='null'||user.get('BUSINESSCARD')=='undefined') {
					Gifted.Global.alert(Gifted.Lang['consummateData']);
					this.app.navigate('user/useredit', {trigger:true});
				} else {
					Gifted.Global.alert(Gifted.Lang['consummateAuditing']);
				}
			}
		};
        this.login = function(app){
        	require(['modules/user/views/UserLoginView'],_.bind(function(UserLoginView){
        		//this.app.user.logout(true);
	    		var hv = this.app.selectView('login',_.bind(function(){
	    			var result = new UserLoginView({app:this.app,model:this.app.user});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.logout = function(app){
        	this.app.user.logout();
        };
        this.register = function(app){
        	require(['modules/user/views/UserRegisterView'],_.bind(function(RegisterView){
	    		var hv = this.app.selectView('register',_.bind(function(){
	    			var result = new RegisterView({app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.followerList = function(userId){
        	require(['modules/user/views/UserListView'],_.bind(function(UserListView){
        		if (!userId){
        			alert('init followerList userId is null');
        			return;
        		}
	    		var hv = this.app.selectView('userfollowerlist_'+userId,_.bind(function(){
	    			var collection = new UserFollowerListCollection();
	    			collection.ID = userId;
	    			var result = new UserListView({collection:collection,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			this.addCacheView(result);
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.followList = function(userId){
        	require(['modules/user/views/UserListView'],_.bind(function(UserListView){
        		if (!userId){
        			alert('init followList userId is null');
        			return;
        		}
	    		var hv = this.app.selectView('userfollowlist_'+userId,_.bind(function(){
	    			var collection = new UserFollowListCollection();
	    			collection.ID = userId;
	    			var result = new UserListView({collection:collection,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			this.addCacheView(result);
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.userInteractive = function(userId){
        	require(['modules/user/views/UserInteractiveView'],_.bind(function(UserInteractiveView){
        		if (!userId || userId == 'navigate')
        			userId = this.app.user.get('ID'); // 看自己的信息
        		var hv = this.app.selectView('userinteractive_'+userId,_.bind(function(){
	    		//var hv = this.app.createView('userinteractive_'+userId,_.bind(function(){
	    			var model = new UserInteractiveModel(userId); // 复合 Model
	    			var result = new UserInteractiveView({model:model,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
					result.loadData();
					this.addCacheView(result);
	    			return result;
	    		},this));
	    		if (this.app.currentView && 
	    			(this.app.currentView.key=='UserInfoView' 
	    			|| this.app.currentView.key=='ProductDetailView'
	    			|| this.app.currentView.key=='ProductSearchView')) {
	    			this.app.changeView(hv,{reverse:true});
	    		} else {
	    			this.app.changeView(hv);
	    		}
        	},this));
        };
        this.userInfo = function(userId){
        	require(['modules/user/views/UserInfoView'],_.bind(function(UserInfoView){
        		if (!userId || userId == 'navigate')
        			userId = this.app.user.get('ID'); // 看自己的信息
	    		var hv = this.app.selectView('userinfo_'+userId,_.bind(function(){
	    		//var hv = this.app.createView('userinfo_'+userId,_.bind(function(){
	    			var model = new Publisher(userId); // Bean Model
	    			var result = new UserInfoView({model:model,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
					result.loadData();
					this.addCacheView(result);
	    			return result;
	    		},this));
	    		if (this.app.currentView && this.app.currentView.key=='UserEditView') 
	    			this.app.changeView(hv,{reverse:true}); 
	    		else
	    			this.app.changeView(hv); 
        	},this));
        };
        this.userEdit = function(){
        	require(['modules/user/views/UserEditView'],_.bind(function(UserEditView){
        		//if (!userId || userId == 'navigate')
        		//	  userId = this.app.user.get('ID'); // 看自己的信息
	    		//var hv = this.app.createView('useredit',_.bind(function(){
	    		var hv = this.app.selectView('useredit',_.bind(function(){
	    			var model = new UserEditModel(); // 复合 Model
	    			var result = new UserEditView({model:model,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			this.addCacheView(result);
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.modifyPassword = function(app){//TODO 其它验证，如邮箱手机等
        	if(!this.app.checkRight({checkRule:['LOGIN']}))
	    		return;
//        	this.app.navigate('user/resetpassword', {trigger:true});
        	require(['modules/user/views/ModifyPasswordView'],_.bind(function(ModifyPasswordView){
	    		var hv = this.app.selectView('modifyPassword',_.bind(function(){
	    			var result = new ModifyPasswordView();
	    			this.app.pageContainer.append(result.$el);
		    		result.app = this.app;
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.forgetPassword = function(app){
        	require(['modules/user/views/ForgetPasswordView'],_.bind(function(ForgetPasswordView){
	    		var hv = this.app.selectView('forgetpassword',_.bind(function(){
	    			var result = new ForgetPasswordView({app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
        };
        this.resetPassword = function(app){
        	require(['modules/user/views/ResetPasswordView'],_.bind(function(ResetPasswordView){
	    		var hv = this.app.selectView('resetpassword',_.bind(function(){
	    			var result = new ResetPasswordView({app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv); 
        	},this));
	    };
	    this.conversation = function(friendId,productId){
	    	require(['modules/user/views/ConversationView'],_.bind(function(ConversationView){
	    		var hv = this.app.selectView('conversation_'+friendId,_.bind(function(){
	    			var model = this.app.user.conversationList.get(friendId);
	    			if(!model)
	    				model = new ConversationModel({'CONVERSATIONID':friendId});
	    			var result = new ConversationView({model:model,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			this.addCacheView(result);
	    			return result;
	    		},this));
	    		if(productId){
	    			var model = new ProductDetail({});
	    			model.loadDetailItem(productId,false,_.bind(function(json){
    					var message = {'targetId':friendId,'title':json.NAME,'content':json.DESCRIPTION,'imageUri':json.PHOTOURLS[0].PHOTOURL};
    					this.sendMessage(message);
    				},hv));
    			}
	    		this.app.changeView(hv); 
        	},this));
	    };
	    this.conversationList = function(){
        	require(['modules/user/views/ConversationListView','modules/portal/models/models'],_.bind(function(ConversationListView){
	    		var hv = this.app.selectView('ConversationListView',_.bind(function(){
	    			var collection = this.app.user.conversationList;
	    			var result = new ConversationListView({collection:collection,app:this.app});
	    			this.app.pageContainer.append(result.$el);
	    			result.render();
	    			return result;
	    		},this));
	    		this.app.changeView(hv);
	    	},this));
        };
	})();
	_.extend(module,Backbone.Events);
	return module;
});