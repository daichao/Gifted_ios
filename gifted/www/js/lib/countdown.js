/**
 * jquery countdown函数，根据界面上元素的data-time数据进行计数，
 * data-time是一个秒数，函数会把这个描述格式化为需要的现实文本
 * 
 */
define(['jquery','underscore','translate','handlebars'],function($){
	Handlebars.registerHelper('toseconds',function(time){
		if(time)
			return Math.floor(time.asSeconds());
		return "";
	});
	CountDown = function(domlist){
		this.domlist = domlist;
		this.start();
	};
	CountDown.prototype.start = function(){
		if(!this.timer)
			this.timer = setInterval(_.bind(this.onTick,this),1000);
	};
	CountDown.prototype.destroy = function(){
		this.stop();
		this.domlist=null;
		delete this.domlist;
	};
	CountDown.prototype.stop = function(){
		if(this.timer){
			clearInterval(this.timer);
		}
	};
	CountDown.prototype.daySecond = 60*60*24;
	CountDown.prototype.hourSecond = 60*60;
	CountDown.prototype.minuteSecond = 60;
	CountDown.prototype.format = function(time){
		var days = Math.floor(time/this.daySecond);
		time = time % this.daySecond;
		var hours =Math.floor(time/this.hourSecond);
		time = time % this.hourSecond;
		var minutes = Math.floor(time/this.minuteSecond);
		time = time % this.minuteSecond;
		return TRANSLATE.translate('countdown',[days,hours,minutes,time]);
	};
	CountDown.prototype.onTick = function(){
		_.each(this.domlist,function(item){
			item.time--;
			item.dom.html(this.format(item.time));
			item.dom.attr('data-time',item.time);
		},this);
	};
	$.fn.countdown=function(options){
		var domlist = [];
		this.each(function(){
			if($(this).is('[data-time]')){
				var data = {};
				data.dom = $(this);
				data.time = $(this).attr('data-time');
				domlist.push(data);
			}
		});
		return new CountDown(domlist);
	};
});