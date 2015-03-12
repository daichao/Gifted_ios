define([],function(){
	var result = {};
	result.top = 
			'<span class="headbar_sign">'+
				'<div class="headbar_action headbar_action_back">G</div>'+
			'</span>';
	result.content = 
			'<div data-role="content" data-theme="d" class="content_wrapper">'+
				'<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false" '+
					'type="text" placeholder="'+Gifted.Lang['registerEmail']+'" class="forget-email" name="email" required maxlength="100"/> '+
				'<input style="text-align:center" data-wrapper-class="input_underline" data-corners="false" data-shadow="false" '+
					'type="text" placeholder="'+Gifted.Lang['IdentifyingCode']+'" class="identifying-code" name="code" required maxlength="10"/> '+
				'<button class="send-identifying-code-btn gifted-link" data-rel="login" data-role="button" data-inline="true" '+
					'data-theme="e" data-icon="" data-translate="SendIdentifyingCode"></button>'+
				'<button class="reset-password-btn gifted-link" data-rel="login" data-role="button" data-inline="true" '+
					'data-theme="e" data-icon="" data-translate="ResetPassWord"></button>'+
			'</div>';
	return result;
});