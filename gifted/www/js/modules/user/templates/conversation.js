define(['css!modules/user/styles/conversation.css'],function(){
	var result = {};
	result.top = '<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_back">G</div>'+
		'</span>';
	result.content = '{{#each this}}' +
				'<div messageId={{MESSAGEID}} class="conversation_message clearfix conversation_dir_{{direction}}">' +
					'<img class="message_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
					'<div class="message_body bubble_{{direction}}">'+
						'{{#if title}}' +
							'<span class="message_title">{{title}}</span>' +
						'{{/if}}' +
						'{{#if imageUri}}' +
							'<img class="message_image" src="{{imageUri}}?imageView/1/w/80/h/80/q/80" />'+
						'{{/if}}' +
						'<span class="message_content">{{content}}</span>' +
						'<span class="message_time">{{dataformnow time_MOMENT}}</span>' +
					'</div>' +
				'</div>' +
			'{{/each}}';
	result.bottom='<div class="conversation_send">\
					<input class="conversation_input" data-role="none" type="text">\
					<button class="conversation_send_button" data-role="none" translate="send"></button>\
				<div>';
	result.message = 
		'<div messageId={{MESSAGEID}} class="conversation_message clearfix conversation_dir_{{direction}}">' +
			'<img class="message_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
			'<div class="message_body bubble_{{direction}}">'+
				'{{#if title}}' +
					'<span class="message_title">{{title}}</span>' +
				'{{/if}}' +
				'{{#if imageUri}}' +
					'<img class="message_image" src="{{imageUri}}?imageView/1/w/80/h/80/q/80" />'+
				'{{/if}}' +
				'<span class="message_content">{{content}}</span>' +
				'<span class="message_time">{{dataformnow time_MOMENT}}</span>' +
			'</div>' +
		'</div>';
	//result.head = 
	//	'<img class="conversation_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
	//	'<span class="conversation_name">{{NAME}}</span>';
	return result;
});