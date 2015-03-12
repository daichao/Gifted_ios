define([],function(){
	var result = {};
	result.top = 
			'<span class="headbar_sign">'+
				'<div class="headbar_action headbar_action_back">G</div>'+
			'</span>'+
			'<span class="header_right user_userinfo_edit"></span>';
	result.content = 
			'<div class="content_wrapper">'+
				'<img class="userinfo_image userinfo_portrait" src="img/noportrait.png" />' +
				//'<img class="userinfo_portrait" src="{{#if PORTRAIT}}{{PORTRAIT}}?imageView/1/w/80/h/80/q/50{{else}}img/noportrait.png{{/if}}" />' +
				'<span class="userinfo_username">{{NAME}}</span><br/>' +
				'<div class="useredit_contract">' +
					'<span class="userinfo_mobile" data-translate="mobile"></span>:&nbsp;&nbsp;' +
					'<span class="useredit_mobile"><a href="tel:+{{COUNTRYCODE}}{{MOBILE}}">+{{COUNTRYCODE}}{{MOBILE}}</a></span>&nbsp;&nbsp;' +
				'</div>' +
				'<div class="useredit_businesscard">' +
					'<span data-translate="businesscard"></span>' +
					'<img class="userinfo_image useredit_businesscard_pic" src="img/notexists_80_80.png" />' +
					//'<img class="useredit_businesscard_pic" src="{{#if BUSINESSCARD}}{{BUSINESSCARD}}?imageView/1/w/80/h/80/q/50{{else}}img/notexists_80_80.png{{/if}}" />' +
				'</div>' +
				'<div class="useredit_businesslicence">' +
					'<span data-translate="businesslicence"></span>' +
					'<img class="userinfo_image useredit_businesslicence_pic" src="img/notexists_80_80.png" />' +
					//'<img class="useredit_businesslicence_pic" src="{{#if BUSINESSLICENCE}}{{BUSINESSLICENCE}}?imageView/1/w/80/h/80/q/50{{else}}img/notexists_80_80.png{{/if}}" />' +
				'</div>' +
				'<span class="userinfo_title" data-translate="selfintroduction"></span>' +
				'<div class="useredit_selfintroduction">' +
					'<div name="SELFINTRODUCTION" >{{SELFINTRODUCTION}}</div>' +
				'</div>' +
		'</div>';
	return result;
});