define(['css!lib/owl.carousel/owl.carousel.css', 'css!lib/owl.carousel/owl.theme.css',
	'css!modules/product/styles/productdetail.css'],function(){
	var result = {};
	result.top =
			'<span class="headbar_sign">' +
				'<div class="headbar_action headbar_action_back">G</div>' +
			'</span>' +
			'<span class="header_mid">{{NAME}}</span>'+
			'<span class="header_right header_edit" style="display:none;"></span>' +
			//'<span class="header_right header_refresh"></span>' +
			'<span class="header_right header_share"></span>';
	result.content =
			'<div class="product_scroller product_detail_content">' +
				'<div class="clearfix">'+
					'<div class="product_detail_publisher">' +
						// result.publisher
					'</div>' +
					'<div class="product_detail_itemfav fav_{{ID}}"></div>' +
					'<div class="product_item_images product_detail_images" >' + 
						'{{#each this.PHOTOURLS}}' +
							'<img class="product_detail_image product_image product_image_{{PHOTOID}}" src="img/notexists.png" alt="{{PHOTOID}}" />' +
						'{{/each}}' +
						//'<img class="product_detail_image product_image product_image_0" src="img/notexists.png" alt="0" />' +
					'</div>' +
					'<div class="product_detail_infoblock1">' +
						'<div class="product_detail_publisher2">'+
							// result.publisher
						'</div>' +
						'<div class="product_detail_group1">' +
            				'{{#if _timeover}}<div class="product_item_yxq_timeover product_detail_yxq_timeover"></div>{{else}}{{/if}}'+
		                    '<span class="product_detail_qdl product_item_qdl" data-translate="MinQuantity" data-translate-param="{{QDL}}"></span>' +
		                    '<span class="product_detail_price product_item_price" data-translate="Price" data-translate-param="{{__CURRENCY__Option__}}|{{PRICE}}"></span>' +
						'</div>' +
						'<div class="product_item_detail product_detail_detail">'+
							'<div class="product_item_yxq_progess">'+
								'<div style="width:{{_timeleft_percent}}%" class="product_item_yxq_currentprogess"></div>'+
							'</div>'+
							'<span class="product_item_yxq" data-time="{{toseconds _timeleft_monent}}"></span>' +
						'</div>'+
					'</div>' +
					'<div class="split">'+Gifted.Lang['Description'] +'</div>'+
					'<div class="product_detail_infoblock2">' +
						'<div class="product_detail_name">{{NAME}}</div>' +
						'<div class="product_detail_descrpition">{{DESCRIPTION}}</div>' +
					'</div>' +
					'<div class="split product_detail_publishedby" data-translate="PublishedBy" data-translate-param="{{publisher.NAME}}"></div>'+
					'<div class="product_detail_infoblock">' +
						//'<span><a class="product_detail_label" data-translate="PublishedBy" data-translate-param="{{publisher.NAME}}"></a></span>' +
						//'<span><a class="gifted-link product_detail_openmoreproducts" data-role="button" data-inline="true" data-theme="e" data-icon="" >More...</a></span>'+
						'<div class="product_detail_others">' +
							// result.others
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>';
	result.publisher = 
			'<div class="product_detail_person">'+
				'<div class="publisher_img"><img src="{{#if publisher.PORTRAIT}}{{publisher.PORTRAIT}}?imageView/1/w/40/h/40/q/50{{else}}img/noportrait_30_30.png{{/if}}"/></div>' +
				'<div class="publisher_name">{{publisher.NAME}}</div>'+
			'</div>';
	result.publisher2 = 
			'<div class="publisher_position" style="display:none;">{{#if publisher.POSITION}}{{publisher.POSITION.latitude}},{{publisher.POSITION.longitude}}{{else}}Not specified{{/if}}</div>' +
			'<div class="publisher_email" {{#if publisher.EMAIL}}{{else}}style="color:gray;"{{/if}}><a href="mailto:{{publisher.EMAIL}}"></a></div>' +
			'<div class="publisher_mobile" {{#if publisher.MOBILE}}{{else}}style="color:gray;"{{/if}}><a href="tel:+{{publisher.COUNTRYCODE}}{{publisher.MOBILE}}"></a></div>' +
			'<div class="publisher_conversation" ></div>'+
			'<div class="publisher_zoomup" ></div>';
	result.others = 
			'{{#each this.others}}' +
				'<a href="#product/detail/{{ID}}">' +
					'<img alt="{{PHOTONAME}}" src="{{PHOTOURL}}?imageView/1/w/200/h/150/q/50" class="product_detail_otherimage" />' +
				'</a>' +
			'{{/each}}'+
			'<a>' +
				'<img alt="More" src="img/navigate-right256.png" class="product_detail_otherimage product_detail_openmoreproducts" />' +
			'</a>';
	return result;
});