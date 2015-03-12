define(['css!modules/user/styles/conversation.css'],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_navigator">G</div>'+
		'</span>';
	result.content=
		'<div class="content_wrapper">' +
			'<div class="conversation_list_content">' +
				'{{#each this}}' +
					'<div conversationId="{{CONVERSATIONID}}" class="conversation clearfix">'+
						'<img class="conversation_img" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
						'<div class="conversation_text">' + 
							'<div class="conversation_title">{{NAME}}<span class="conversation_unreadcount">{{unreadCount}}<span></div>' +
							'<div class="conversation_content">{{content}}</div>' +
						'</div>' +
						'<span class="conversation_time vertical-align">{{time_fromnow}}</span>' +	
						'</div>' +
				'{{/each}}' +
			'</div>' +
		'</div>';
	result.conversation = 
		'<div conversationId="{{CONVERSATIONID}}" class="conversation clearfix">'+
				'<img class="conversation_img" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
				'<div class="conversation_text">' + 
					'<div class="conversation_title">{{NAME}}<span class="conversation_unreadcount">{{unreadCount}}<span></div>' +
					'<div class="conversation_content">{{content}}</div>' +
				'</div>' +
				'<span class="conversation_time vertical-align">{{time_fromnow}}</span>' +
		'</div>';
	return result;
		
});