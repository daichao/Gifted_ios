define(['modules/portal/templates/settings', 'handlebars'],function(mod0){
	var SettingsView = Gifted.View.extend({
		templateTop:Handlebars.compile(mod0.top),
		templateContent:Handlebars.compile(mod0.content),
	    events:{
	    	"tap .headbar_sign":"back",
			"change .settings-language-radio":"switchLanguage",
			"change .settings-servers":"switchServer",
			"change .settings-currency":"switchCurrency",
			"tap .settings-logout":"logout",
			"tap .settings-clearcache":"clearCache"
		},
		initialize:function(){
			this.app.user.on('logoutComplete',this.logoutComplete,this);
	    	SettingsView.__super__.initialize.apply(this, arguments);
		},
		switchServer:function(event){
			this.model.trigger('switchServer', $(event.target).val(), [this]);
		},
		switchLanguage:function(event){
			this.model.trigger('switchLanguage', $(event.target).val(), [this]);
		},
		switchCurrency:function(event){
			this.model.trigger('switchCurrency', $(event.target).val(), [this]);
		},
		clearCache:function(event){
			this.model.trigger('clearcache');
		},
		logout:function(event){
			this.app.user.logout();
		},
		logoutComplete:function(){
			this.app.trigger('reset');
			Backbone.history.history.back();
		},
		contentRender:function(){
			var list = Gifted.Config.serverList; // this.model==this.app.settings
			this.$contentEl.html(this.templateContent({serverList:list}));
			this.$el.find('.settings-currency').val(Gifted.Config.Currency);
			this.$el.find('.settings-servers').val(Gifted.Config.serverURL);
			if (Gifted.Config.Locale.localeName=='zh_CN') {
				this.$el.find('#settings-language-zh_CN').attr('checked',true);
			} else {
				this.$el.find('#settings-language-en').attr('checked',true);
			}
		},
		remove:function(){
	    	this.app.user.off('logoutComplete',this.logoutComplete,this);
            SettingsView.__super__.remove.apply(this, arguments);
		}
	});
	return SettingsView;
});
