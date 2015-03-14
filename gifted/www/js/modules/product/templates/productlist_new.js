define(['css!modules/product/styles/productlist.css'],function(){
	var result = {};
	result.top =
		'<span class="headbar_sign">\
			<div class="headbar_action headbar_action_navigator">G</div>\
		</span>\
		<span class="header_right header_camera"></span>\
		<span class="header_right header_refresh"></span>\
		<span class="header_right header_search"></span>';
	// <!--img src="" class="product_list_refresh" /-->
	result.content = 
		'<div class="product_scroller product_list_content">\
			<div class="product_list_columns clearfix">\
				<div class="product_column product_column_1"></div>\
				<div class="product_column product_column_2"></div>\
				<div class="product_column product_column_3"></div>\
				<div class="product_column product_column_4"></div>\
				<div class="product_column product_column_5"></div>\
			</div> \
			<div style="height:30px;">&nbsp;</div>\
		</div>';
	return result;
});
//srcset="http://gifted.qiniudn.com/BBB?imageView/2/w/200/q/50 480w,
//http://gifted.qiniudn.com/BBB?imageView/2/w/800/q/50 768w,
//http://gifted.qiniudn.com/BBB?imageView/2/w/800/q/50 979w"/>\