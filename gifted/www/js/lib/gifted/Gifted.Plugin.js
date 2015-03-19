/*******************************************************************************
 * 调用Phonegap的Navtive的实现
 * 
 * 单例
 ******************************************************************************/
 define([],function(){
	// namespace
	if (typeof Gifted == 'undefined')
		Gifted = {};
	//================================== Plugin ==================================//
	if (Gifted.Plugin)
		return Gifted.Plugin;
	Gifted.Plugin = {
		gotoActivity : function(page,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('gotoActivity,page='+page);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success)
						success(val);
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"GotoActivity", "gotoActivity", [page]);
		},
		dispatch : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('dispatch,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success)
						success(val);
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"Dispatch", action, paras || []);
		},
		messageUtil : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('messageUtil,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success)
						success(val);
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"MessageUtil", action, paras || []);
		},
		socialSharing  : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('socialSharing,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success) {
						if (action=='available')
							success(val?true:false);
						else
							success(val);
					}
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"SocialSharing", action, paras || []);
			//"available", []
			//"share", [message, subject, image, url]
			//"shareViaWhatsApp", [message, null, image, url]
			//"canShareVia", [message, subject, image, url, via]
		},
		zip : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('zip,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success) {
						success(val);
					}
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"Zip", action, paras || []);
			//"zip", [[files], zipfile]
			//"unzip", [zipfile, outfile]
		},
		phoneNumber : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('phoneNumber,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success)
						success(val);
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"PhoneNumber", action, paras || []);
		},
		phonePick : function(action,paras,success,error) {
			if (!Gifted.Config.isRealPhone) {
				console.log('phonePick,action='+action);
				return;
			}
			var exec = cordova.require('cordova/exec');
			exec( //
				function(val) {
					if (success)
						success(val);
				}, //
				function(err) {
					if (error)
						error(err);
				}, //
				"MutiPicPick", action, paras || []);
		}
	};
	return Gifted.Plugin;
});