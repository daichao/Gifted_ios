define([],function(){ 
	return '<ul data-role="listview" data-rel="close">{{#each this}} \
			<li data-icon="false"><a href="{{link}}" class="gifted-link navigator-item" id="{{id}}" data-rel="close">{{text}}</a></li>\
	{{/each}}</ul>';
});