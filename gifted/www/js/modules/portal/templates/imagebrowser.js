define([],function(){
	var result = {};
	/*result.top= 
		'<span class="headbar_sign">'+
			'<div class="headbar_action">G</div>'+
		'</span>';*/
	result.content=
		'<div class="imageview_scroller imageview_content">' +
			'<div class="clearfix">'+
				'<div class="imageview_images" >' +
					'{{#each this.PHOTOURLS}}' +
						'<img alt="{{PHOTONAME}}" src="img/notexists.png" class="imageview_image imageview_{{PHOTOID}}" />' +
					'{{/each}}' +
				'</div>' +
			'</div>' +
		'</div>';
	/*result.bottom=
		'<span class="bottom_left">'+
			'<div class="bottom_action bottom_action_pre"></div>'+
		'</span>'+
		'<span class="bottom_right">'+
			'<div class="bottom_action bottom_action_next"></div>'+
		'</span>';*/
	return result;
});
