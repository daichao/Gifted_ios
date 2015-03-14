define([],function(){
	return '<div class="product_item" dataid="{{ID}}" createrid="{{CREATEUSER}}"> \
			<div class="clearfix product_img_wrap" href="#product/detail/{{ID}}"> \
				<img class="product_image product_list_image product_image_{{ID}}" src="img/notexists.png" /></div> \
            {{#if _timeover}}<div class="product_item_yxq_timeover"></div>{{else}}{{/if}}\
			<div class="product_item_images product_list_images" > \
                <!--div class="product_item_title">rowNum:{{__rowNum}}</div--> \
                <div class="product_item_detail"> \
					<div class="product_item_title">{{NAME}}</div> \
					<div class="product_item_date">{{UPDATEDATE}}</div> \
					<div class="product_item_fav fav_{{ID}}"></div> \
				</div> \
                <div class="product_item_detail"> \
                    <span class="product_item_qdl" data-translate="MinQuantity" data-translate-param="{{QDL}}"></span> \
                    <span class="product_item_price" data-translate="Price" data-translate-param="{{__CURRENCY__Option__}}|{{PRICE}}"></span> \
                </div> \
				<div class="product_item_detail"> \
					<div class="product_item_yxq_progess">\
						<div style="width:{{_timeleft_percent}}%" class="product_item_yxq_currentprogess"></div>\
					</div>\
					<span class="product_item_yxq" data-time="{{toseconds _timeleft_monent}}"></span> \
				</div> \
            </div> \
		</div>';
});