define([],function(){
	var result = {};
	result.top = '<span class="headbar_sign">\
					<div class="headbar_action">G</div>\
				</span>\
				<span class="header_right header_right_text gifted-link-text header_login" data-translate="login"></span>';
	result.content =
			'<div class="content_wrapper user_register_content">'+
				'<input type="text" data-wrapper-class="input_underline" class="register_name" name="name" placeholder="'+Gifted.Lang['registerName']+'" required autocomplete="on" maxlength="100">' +
				'<p/>'+
				'<input type="text" data-wrapper-class="input_underline" class="register_email" name="email" placeholder="'+Gifted.Lang['registerEmail']+'" required autocomplete="on" maxlength="100">' +
				'<p/>' +
				'<input type="password" data-wrapper-class="input_underline" class="register_password" name="password" placeholder="'+Gifted.Lang['registerPassword']+'" maxlength="100">'+
				'<p/>' +
				'<button data-rel="register" data-role="button" data-inline="true"'+
					'data-theme="e" data-icon="" class="register_button">'+Gifted.Lang['register']+'</button>'+
			'</div>';
	return result;
});