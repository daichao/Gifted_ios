define(['css!modules/product/styles/productcatalog.css'],function(){
	var result = {};
	result.top =
			'<span class="headbar_sign">'+
				'<div class="headbar_action headbar_action_back">G</div>'+
			'</span>'+
			'<span class="header_right header_search"></span>';
	result.content =
			'<div class="product_catalog_list clearfix"> '+
				'{{#each this.catalogs}}' +
					'<div catalog="{{key}}" class="product_catalog_item product_catalog_{{key}}" ><span>{{display}}</span></div>'+
				'{{/each}}' +
			'</div> ';
	return result;
});