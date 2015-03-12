define([],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_back">G</div>'+
		'</span>';
	result.content =
		'<div class="content_wrapper">'+
			//'<span class="reset-email" name="email"></span>'+
			'<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false" '+
				'type="password" placeholder="'+Gifted.Lang['OldPassword']+'" class="old-password" name="oldpassword" required maxlength="100"/> '+
			'<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false" '+
				'type="password" placeholder="'+Gifted.Lang['Password']+'" class="reset-password" name="password" required maxlength="100"/> '+
			'<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false" '+
				'type="password" placeholder="'+Gifted.Lang['ConfirmPassword']+'" class="reset-password-ok" name="password-ok" required maxlength="100"/> '+
			'<button class="reset-password-ok-btn gifted-link" data-rel="login" data-role="button" data-inline="true" '+
				'data-theme="e" data-icon="" data-translate="OK"></button>'+
		'</div>';
	return result;
});