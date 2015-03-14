define([],function(){
	var result = {};
	result.top = 
			'<span class="headbar_sign">\
				<div class="headbar_action">G</div>\
			</span>\
			<span class="header_right header_right_text gifted-link-text header_register" data-translate="register"></span>';
	result.content = 
			'<div class="content_wrapper">\
				<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false"\
					type="text" placeholder="'+Gifted.Lang['registerEmail']+'" class="login-user" name="email" required autocomplete="on" maxlength="100"/>\
				<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false"\
					type="password" placeholder="'+Gifted.Lang['registerPassword']+'" class="login-password" name="password" required maxlength="100"/>\
				<span class="forgetpwd" style="font-size: 12px;">'+Gifted.Lang['forgetpwd']+'</span>\
				<button class="login_button gifted-link" data-rel="login" data-role="button" data-inline="true"\
					data-theme="e" data-icon="" data-translate="login"></button>\
			</div>';
	return result;
});