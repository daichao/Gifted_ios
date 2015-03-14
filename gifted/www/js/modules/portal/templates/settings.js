define([],function(){
	var result = {};
	result.top= '<span class="headbar_sign">'+
					'<div class="headbar_action">G</div>'+
				'</span>';
	result.content='<div class="content_wrapper">'+
				'<ul data-role="listview" class="setting_list">' +
					'<li class="ui-grid-d">' +
						'<label data-translate="Language" data-translate-param="" class="ui-block-a"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal" class="ui-block-b|c|d">' +
							'<input type="radio" name="settings-language" id="settings-language-zh_CN" class="settings-language-radio settings_field" value="zh_CN" />' +
							'<label for="settings-language-zh_CN">中文</label>' +
							'<input type="radio" name="settings-language" id="settings-language-en" class="settings-language-radio settings_field" value="en" />' +
							'<label for="settings-language-en">English</label>' +
						'</fieldset>' +
					'</li>' +
					'<li class="ui-grid-d">'+
						'<label data-translate="Servers" data-translate-param="" class="ui-block-a"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal" class="ui-block-b|c|d">' +
							'<select class="settings-servers settings_field a">' +
								'{{#each this.serverList}}<option value="{{url}}" checked="{{checked}}">{{key}}</option>{{/each}}' +
							'</select>'+
						'</fieldset>' +
					'</li>' +
					'<li class="ui-grid-d">'+
						'<label data-translate="Currency" data-translate-param="" class="ui-block-a"></label>' +
						'<fieldset data-role="controlgroup" data-type="horizontal" class="ui-block-b|c|d">' +
							'<select class="settings-currency settings_field a">' +
						        '<option value="1">$(USD)</option>' +
						        '<option value="2">€(EUR)</option>' +
						        '<option value="3">¥(CNY)</option>' +
						        '<!--option value="4">¥(JPY)</option-->' +
						    '</select>' +
						'</fieldset>' +
					'</li>' +
				'</ul>' +
				'<a class="settings-clearcache setting-button" data-role="button" data-inline="true"'+
					'data-theme="e" data-icon="" data-translate="alterUserTable"></a>'+
				'<a class="settings-logout setting-button" data-role="button" data-inline="true"'+
					'data-theme="e" data-icon="" data-translate="logout"></a>'+
			'</div>';
	return result;
});
