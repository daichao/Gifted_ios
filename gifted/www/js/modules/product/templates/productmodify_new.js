define(['css!lib/mobiscroll/css/mobiscroll.custom-2.6.2.min.css',
		'css!modules/product/styles/productmodify.css'],function(){
	var result = {};
	result.top =
		'<span class="headbar_sign">\
			<div class="headbar_action headbar_action_back">G</div>\
		</span>\
		<span class="header_right header_commit"></span>';
	result.content =
		'<div class="product_modify_content"> \
			<div class="product_modify_images">  \
				<div><span class="product_image_del"></span><img class="a product_image_btn" index="1" src="img/takepicture.png" alt="all" /></div> \
				<div><span class="product_image_del"></span><img class="a product_image_btn" index="2" src="img/takepicture.png" alt="left" /></div> \
				<div><span class="product_image_del"></span><img class="a product_image_btn" index="3" src="img/takepicture.png" alt="right" /></div> \
				<div><span class="product_image_del"></span><img class="a product_image_btn" index="4" src="img/takepicture.png" alt="top" /></div> \
				<div><span class="product_image_del"></span><img class="a product_image_btn" index="5" src="img/takepicture.png" alt="bottom" /></div> \
			</div> \
			<form class="product_modify_form"> \
          	 	{{#if _timeover}}<div class="product_item_yxq_timeover product_modify_yxq_timeover"></div>{{else}}{{/if}} \
				<input type="hidden" name="ID" class="product_ID" value="{{ID}}" data-highlight="true" /> \
				<table> \
					<tr class="product_modify_text"> \
						<!--th colspan="1"><label for="NAME" class="product_label product_label_title" data-translate="Title"></label></th--> \
						<td colspan="4"><input name="NAME" class="product_name product_text" data-highlight="true" \
							data-theme="a" data-role="text" data-mini="true" placeholder="Product Name" value="{{NAME}}" required maxlength="100" /></td> \
					</tr> \
					<tr class="product_modify_select"> \
					    <!--th colspan="1"><label for="CATALOG" class="product_label product_label_catalog" data-translate="Catalog"></label></th--> \
					    <td colspan="4" style="width:45%"> \
					    	<!-- data-role="none" data-mini="true" --> \
						    <select name="CATALOG" class="product_catalog product_field" data-highlight="true" \
						    	data-theme="a" data-role="select" placeholder="Catalog" value="{{CATALOG}}"> \
						        {{#each this.catalogs}} \
						        	 <option value="{{key}}">{{display}}</option> \
								{{/each}} \
						    </select> \
						</td> \
					</tr> \
					<tr class="product_modify_spinbox"> \
					    <th colspan="1"><label for="QDL" class="product_label product_label_qdl" ><nobr>'+Gifted.Lang['MinQuantity2']+'</nobr></label></th> \
					    <td colspan="3"><input type="number" name="QDL" class="product_qdl product_field" data-highlight="true" value="{{QDL}}" \
					    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="10" required /></td> \
					</tr> \
					<tr class="product_modify_spinbox"> \
					    <td colspan="1" class="product_currency_wrapper"> \
						    <select name="CURRENCY" class="product_currency product_field" data-highlight="true" \
						    	data-theme="a" data-role="none" data-mini="true" placeholder="Currency" value="{{CURRENCY}}"> \
						        <option value="1">$(USD)</option> \
						        <option value="2">€(EUR)</option> \
						        <option value="3">¥(CNY)</option> \
						        <!--option value="4">¥(JPY)</option--> \
						    </select> \
						</td> \
					    <!--th colspan="1"><label for="PRICE" class="product_label product_label_price" data-translate="Price2"></label></th--> \
					    <td colspan="3"><input type="number" name="PRICE" class="product_price product_field" data-highlight="true" value="{{PRICE}}" \
					    	data-theme="a" data-role="spinbox" data-mini="true" min="0" max="99999" step="1" required /></td> \
					</tr> \
					<tr class="product_modify_date"> \
						<!--th colspan="1"><label for="YXQ_START" class="product_label product_label_yxq" data-translate="EffectTime"></label></th--> \
						<td colspan="4"><input type="text" name="YXQ_START" class="product_yxq_start product_field product_date" data-highlight="true" \
							data-theme="a" data-role="date" data-mini="true" placeholder="StartDate Of EffectTime" value="{{YXQ_START}}" required /></td> \
					</tr> \
					<tr class="product_modify_date"> \
						<!--th colspan="1"><label for="YXQ_END" class="product_label product_label_to">&nbsp;&nbsp;~</label></th--> \
						<td colspan="4"><input type="text" name="YXQ_END" class="product_yxq_end product_field product_date" data-highlight="true" \
							data-theme="a" data-role="date" data-mini="true" placeholder="EndDate Of EffectTime" value="{{YXQ_END}}" required /></td> \
					</tr> \
					<tr class="product_modify_area"> \
					    <!--th colspan="1"><label for="DESCRIPTION" class="product_label product_label_description" data-translate="Description"></label></th--> \
						<td colspan="3"><textarea name="DESCRIPTION" class="product_description product_area" data-highlight="true" \
					    	data-theme="a" data-role="textarea" placeholder="Description" required maxlength="2048" >{{DESCRIPTION}}</textarea></td> \
					</tr> \
				</table> \
			</form> \
			<div class="photo_select_wrap" style="display:none;"> \
				<ul class="photo_select_list" data-role="listview"> \
					<li value="1" style="margin-bottom:3px;" ><span class="photo_select_camera" ></span>&nbsp;Camera&nbsp;</li> \
					<li value="2" style="margin-bottom:3px;" ><span class="photo_select_file" ></span>&nbsp;&nbsp;&nbsp;&nbsp;File&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</li> \
					<li value="3" style="margin-bottom:3px;" ><span class="photo_select_delete" ></span>&nbsp;&nbsp;&nbsp;Delete&nbsp;&nbsp;</li> \
					<li value="4" style="margin-bottom:3px;margin-top:10px;" ><span class="photo_select_cancel" ></span>&nbsp;&nbsp;&nbsp;Cancel&nbsp;&nbsp;</li> \
				</ul> \
			</div> \
		</div>';
	return result;
});