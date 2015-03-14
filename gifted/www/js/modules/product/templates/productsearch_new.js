define(['css!modules/product/styles/productlist.css'
	,'css!modules/product/styles/productsearch.css'],function(){
	var result = {};
	result.top =
		'<span class="headbar_sign">'+
			'<div class="headbar_action">G</div>'+
		'</span>'+
		'<input type="search" class="header_right_input search_input" data-clear-btn="true" data-wrapper-class="searchbox"></input>'+
		'<div class="product_search_title vertical-align"></div>';
	result.content =
		'<div class="product_scroller product_list_content">'+
			'<div class="product_list_columns clearfix">'+
				'<div class="product_column product_column_1"></div>'+
				'<div class="product_column product_column_2"></div>'+
				'<div class="product_column product_column_3"></div>'+
				'<div class="product_column product_column_4"></div>'+
				'<div class="product_column product_column_5"></div>'+
			'</div>'+
			'<div style="height:30px;">&nbsp;</div>'+
		'</div>';
	//result.bottom=
	//	'<button class="bottombar_right_action bottombar_action_sort">SORT</button>';
	return result;
	// input_underline 
	/*<div data-theme="d" class="product_search_group"> \
		<label for="product_catalog" class="product_label" data-translate="Catalog"></label> \
		<select name="product_catalog" class="product_catalog_search product_field" data-highlight="true" \
	    	data-theme="a" data-role="none" data-mini="true" placeholder="Catalog" value="{{CATALOG}}"> \
	        <option value="1">大类1</option> \
	        <option value="2">大类2</option> \
	        <option value="3">大类3</option> \
	        <option value="4">大类4</option> \
	        <option value="5">大类5</option> \
	        <option value="6">大类6</option> \
	        <option value="7">大类7</option> \
	        <option value="8">大类8</option> \
	    </select> \
	    <input type="number" name="product_price_start" class="product_price_start product_field" data-highlight="true" value="0" \
			    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="10"/> \
	    <input type="number" name="product_price_end" class="product_price_end product_field" data-highlight="true" value="0" \
			    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="10"/> \
	    <input type="number" name="product_qdl_start" class="product_qdl_start product_field" data-highlight="true" value="0" \
			    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="10"/> \
	    <input type="number" name="product_qdl_end" class="product_qdl_end product_field" data-highlight="true" value="0" \
			    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="10"/> \
	</div> \*/
	//<option value="inputPrice">价格</option> 范围选择
	//<option value="inputQDL">起定量</option> 范围选择
	//<option value="inputYXQ">有效期</option> 范围选择
});