define([],function(){
	var result = {};
	result.top= '<span class="headbar_sign">'+
					'<div class="headbar_action headbar_action_navigator">G</div>'+
				'</span>';
	result.content='<div class="content_wrapper">'+
				'<ul data-role="listview" class="setting_list">' +
					'<li>' +
						'<label data-translate="Language" data-translate-param=""></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal">' +
							'<input type="radio" name="settings-language" id="settings-language-zh_CN" class="settings-language-radio settings_field" value="zh_CN" />' +
							'<label for="settings-language-zh_CN">中文</label>' +
							'<input type="radio" name="settings-language" id="settings-language-en" class="settings-language-radio settings_field" value="en" />' +
							'<label for="settings-language-en">English</label>' +
						'</fieldset>' +
					'</li>' +
					'<li>'+
						'<label data-translate="Servers"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal">' +
							'<select class="settings-servers settings_field a">' +
								'{{#each this.serverList}}<option value="{{url}}" checked="{{checked}}">{{key}}</option>{{/each}}' +
							'</select>'+
						'</fieldset>' +
					'</li>' +
					'<li>'+
						'<label data-translate="Currency"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal">' +
							'<select class="settings-currency settings_field a">' +
						        '<option value="1">$(USD)</option>' +
						        '<option value="2">€(EUR)</option>' +
						        '<option value="3">¥(CNY)</option>' +
						        '<!--option value="4">¥(JPY)</option-->' +
						    '</select>' +
						'</fieldset>' +
					'</li>' +
					'<li>' +
						'<label data-translate="Others"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal">' +
							'<a class="settings-clearcache settings_field a" data-role="button" data-inline="true"'+
								'data-theme="e" data-icon="" data-translate="alterUserTable"></a>'+
						'</fieldset>' +
					'</li>' +
				'</ul>' +
				'<a class="settings-logout" data-role="button" data-inline="true"'+
					'data-theme="e" data-icon="" data-translate="logout"></a>'+
			'</div>';
	return result;
});
