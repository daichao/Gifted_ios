define([],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_back">G</div>'+
		'</span>';
	result.content =
		'<div  class="content_wrapper">' +
			'<div class="conversation_head">' +
			'</div>' +
			'<div class="conversation_content">' +
				'{{#each this}}' +
					'<div messageId={{MESSAGEID}} class="conversation_message conversation_{{direction}} message_{{MESSAGEID}}">' +
						'<img class="message_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
						'<span class="message_time">{{time}}</span>' +
						'<br/>' +
						'{{#if imageUri}}' +
							'<img class="message_image" src="{{imageUri}}?imageView/1/w/80/h/80/q/80" />'+
						'{{/if}}' +
						'{{#if title}}' +
							'<span class="message_title">{{title}}</span>' +
						'{{/if}}' +
						'<br/>' +
						'<span class="message_content">{{content}}</span>' +
					'</div>' +
				'{{/each}}' +
			'</div>' +
			'<div class="message_builder">' +
				'<input class="input_message" type="text">' +
				'<button class="message_send">发送</button>' +
			'</div>'+
		'</div>';
	result.message = 
		'<div messageId={{MESSAGEID}} class="conversation_message conversation_{{direction}} message_{{MESSAGEID}}">' +
			'<img class="message_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
			'<span class="message_time">{{time}}</span>' +
			'<br/>' +
			'{{#if imageUri}}' +
				'<img class="message_image" src="{{imageUri}}?imageView/1/w/80/h/80/q/80" />' +
			'{{/if}}' +
			'{{#if title}}' +
				'<span class="message_title">{{title}}</span>' +
			'{{/if}}' +
			'<br/>' +
			'<span class="message_content">{{content}}</span>' +
		'</div>';
	result.head = 
		'<img class="conversation_portrait" src="{{PORTRAIT}}?imageView/1/w/50/h/50/q/100">' +
		'<span class="conversation_name">{{NAME}}</span>';
	return result;
});