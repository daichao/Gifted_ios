define([],function(){
	var result = {};
	result.top= 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_back">G</div>'+
		'</span>';
	result.content=
		'<div class="imageview_scroller imageview_content">' +
			'<div class="clearfix">'+
				'<div class="imageview_images '+(Gifted.Config.isCanvasCarouel?'canvascarousel':'owl-carousel')+'" >' +
					'{{#each this.PHOTOURLS}}' +
						'<img class="imageview_image imageview_{{PHOTOID}}" src="img/notexists.png" alt="{{PHOTOID}}" />' +
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
