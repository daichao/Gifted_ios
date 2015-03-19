define([],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action">G</div>'+
		'</span>'+
		'<span class="header_right header_commit"></span>'; // user_save
	result.content =
		'<div class="content_wrapper">'+
			'<div class="useredit_header">'+
				'<div class="useredit_header_c1">' +
					'<img class="gifted-image useredit-portrait" index="1" name="PORTRAIT" src="img/noportrait.png" />' +
					//'<img class="useredit-portrait" index="1" name="PORTRAIT" src="{{#if PORTRAIT}}{{PORTRAIT}}?imageView/1/w/80/h/80/q/50{{else}}img/noportrait.png{{/if}}" />'+
				'</div>' +
				'<ul class="useredit_header_c2">'+
					'<li><label data-translate="username"></label><input data-role="none" class="useredit_username" value="{{NAME}}" required></li>'+
					'<li><label data-translate="countryCode"></label><input data-role="none" class="useredit_countrycode" value="{{COUNTRYCODE}}"></li>'+
					'<li><label data-translate="mobile"></label><input data-role="none" class="useredit_mobile" value="{{MOBILE}}" required></li>'+
					'<li>' +
						//'<fieldset data-role="fieldcontain">'+
						//'<!--label data-translate="country"></label-->' +
						'<label data-translate="Address"></label>'+
						'<select data-role="none" data-native-menu="false" class="useredit_country" value="{{COUNTRY}}">'+
						'</select>'+
						//'</fieldset>'+
					'</li>'+
					'<li><!--label data-translate="Address"></label--><input data-role="none" class="useredit_address" value="{{ADDRESS}}" required></li>'+
				'</ul>'+
				'<div class="clearfix"></div>'+
			'</div>'+
			'<div class="useredit_businesscard">'+
				'<span data-translate="businesscard"></span>:'+
				'<img class="gifted-image useredit_businesscard_pic" name="BUSINESSCARD" index="2" src="img/takepicture.png" />' +
				//'<img class="useredit_businesscard_pic" name="BUSINESSCARD" index="2" src="{{#if BUSINESSCARD}}{{BUSINESSCARD}}?imageView/1/w/80/h/80/q/50{{else}}img/takepicture.png{{/if}}" />'+
			'</div>'+
			'<div class="useredit_businesslicence">'+
				'<span data-translate="businesslicence"></span>:'+
				'<img class="gifted-image useredit_businesslicence_pic" name="BUSINESSLICENCE" index="3" src="img/takepicture.png" />' +
				//'<img class="useredit_businesslicence_pic" name="BUSINESSLICENCE" index="3" src="{{#if BUSINESSLICENCE}}{{BUSINESSLICENCE}}?imageView/1/w/80/h/80/q/50{{else}}img/takepicture.png{{/if}}" />'+
			'</div>'+
			'<div class="useredit_selfintroduction">'+
				//'<span data-translate="selfintroduction"></span>:'+
				'<textarea class="useredit_selfintroduction_content" name="SELFINTRODUCTION" placeholder="'
					+Gifted.Lang['selfintroduction']+'">{{SELFINTRODUCTION}}</textarea>'+
			'</div>'+
			'<div class="photo_select_wrap" style="display:none;">'+
				'<div><ul class="photo_select_list" data-role="listview">'+
					'<li value="1" style="margin-bottom:3px;" ><span class="photo_select_camera" ></span>&nbsp;Camera&nbsp;</li>'+
					'<li value="2" style="margin-bottom:3px;" ><span class="photo_select_file" ></span>&nbsp;&nbsp;&nbsp;&nbsp;File&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li>'+
					'<li value="3" style="margin-bottom:3px;" ><span class="photo_select_delete" ></span>&nbsp;&nbsp;&nbsp;Delete&nbsp;&nbsp;</li> '+
					'<li value="4" style="margin-bottom:3px;margin-top:10px;" ><span class="photo_select_cancel" ></span>&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;</li> '+
				'</ul></div> '+
			'</div> '+
		'</div>';
	return result;
});