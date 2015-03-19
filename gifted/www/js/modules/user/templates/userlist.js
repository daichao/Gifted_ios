define(['css!modules/user/styles/conversation.css'],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_navigator">G</div>'+
		'</span>' +
		'<span class="header_mid">{{this.NAME}}</span>';
	result.content=
		'<div class="content_wrapper">' +
			'<div class="user_list_content">' +
				'{{#each this}}' +
					'<div userId="{{ID}}" class="user_list_user">'+
						'<img class="user_list_user_img" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
						'<span class="user_list_user_name">{{NAME}}</span>' +	
					'</div>' +
				'{{/each}}' +
			'</div>' +
		'</div>';
	result.user = 
		'<div userId="{{ID}}" class="user_list_user">'+
			'<img class="user_list_user_img" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
			'<span class="user_list_user_name">{{NAME}}</span>' +	
		'</div>' ;
	return result;
		
});