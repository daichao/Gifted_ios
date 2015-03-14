define(['css!lib/owl.carousel/owl.carousel.css', 'css!lib/owl.carousel/owl.theme.css'],function(){
	var result = {};
	result.top = 
		'<span class="headbar_sign">'+
			'<div class="headbar_action headbar_action_navigator">G</div>'+
		'</span>' +
		'<span class="header_mid">{{this.userInfo.NAME}}</span>'+
		'<span class="header_right header_right_text gifted-link-text userinteractive_changepwd" data-translate="changepwd"></span>';
	result.content=
		'<div class="content_wrapper">' +
			'<div class="userinteractive_blank userinteractive_head"></div>' +
			//'<div class="userinteractive_blank userinteractive_interactive"></div>' +
			'<div class="userinteractive_blank userinteractive_infolinks"></div>'+
			'<div class="userinteractive_blank userinteractive_product"></div>' +
		'</div>';
	result.head =
		'<table><tr>'+
		'<td class="userinteractive_portrait ui-block-portrait">'+
			'<img class="userinteractive_img" src="img/noportrait.png" />' +
			//'<img class="userinteractive_img" src="{{#if this.userInfo.PORTRAIT}}{{this.userInfo.PORTRAIT}}?imageView/1/w/80/h/80/q/50{{else}}img/noportrait.png{{/if}}" />' +
			//'<span class="userinteractive_username">{{this.userInfo.NAME}}</span>'+
			//'<span class="userinteractive_position"></span>' +
		'</td>' +
		'<td class="userinteractive_moreproducts ui-block-portrait" >' +
			'<h3>{{this.userInfo.PRODUCT}}</h3>' +
			'<p data-translate="productsCount"></p>' +
		'</td>'+
		'<td class="userinteractive_follow ui-block-portrait" >' +
			'<h3>{{this.userInfo.FOLLOW}}</h3>' +
			'<p data-translate="FOLLOW"></p>' +
		'</td>' +
		'<td class="userinteractive_follower ui-block-portrait" >' + // ui-block-portrait
			'<h3>{{this.userInfo.FOLLOWER}}</h3>' +
			'<p data-translate="FOLLOWER"></p>' + // class="ui-block-p" 
		'</td>' +
		'</tr></table>';
	result.links = 
		'<div class="userinteractive_favorite">' +
			'<a class="userinteractive_favorite_link" data-translate="favorites" data-translate-param="{{this.userInfo.NAME}}"></a>&nbsp;(EN/CN)' +
			'<span class="userinteractive_favorites_count">{{this.userInfo.FAVORITE}}</span>' +
		'</div>' +
		'<a class="userinteractive_userinfo" data-translate="userArchives"></a>';
		//'<div><a class="gifted-link userinteractive_invite" data-translate="invite"></a></div>'
		//'<div><a class="gifted-link userinteractive_settings" data-translate="Settings"></a></div>'
	result.products = 
		'{{#each this.products}}' +
		'<a href="#product/detail/{{ID}}">' + // imageView/3/w/200/h/150/q/50
			'<img alt="{{PHOTONAME}}" src="{{PHOTOURL}}?imageView/1/w/200/h/150/q/50" class="userinteractive_other_img" />' +
		'</a>' +
		'{{/each}}' +
		'<a>' +
			'<img alt="More" src="img/navigate-right256.png" class="userinteractive_other_img userinteractive_openmoreproducts" />' +
		'</a>';
	result.interactive = 
		'<a class="userinteractive_follow ui-btn ui-btn-inline" data-icon=""></a>' +
		'<a class="userinteractive_contact ui-btn ui-btn-inline" data-icon="" data-translate="Contact"></a>' ;
	return result;
});