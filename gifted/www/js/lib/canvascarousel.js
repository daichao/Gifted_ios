/**
 * 
 */
define(['jquery','underscore'],function($,_){
	CanvasCarousel = function(options){
		this.mouseStepPixer = 50;
		this.rotationStepAngle = 15;
		this.noiseAngle = 4;
		_.extend(this,options);
	};
	_.extend(CanvasCarousel.prototype,{
		init:function(el){
			this.$el = $(el);
			this.imgs = this.$el.find("img");
			this.imgs.hide();
			this.maxPosition = this.imgs.length-1;
			var canvas =$('<canvas></canvas>')
			canvas.attr('width',this.width || this.$el.width());
			canvas.attr('height',this.height || this.$el.height());
			this.$el.prepend(canvas);
			this.canvas = this.$el.find('canvas')[0];
			this.ctx = this.canvas.getContext('2d');
			this.drawImage(0);
			this.mouseHandler = _.bind(function(event){
				if(!this.lastX){
					this.lastX=event.clientX;
					return;
				}
				var delta = event.clientX-this.lastX;
				this.lastX = event.clientX;
				this.stepImage(delta/this.mouseStepPixer);
			},this);
			this.rotationHandler = _.bind(function(event){
				console.log('rotationHandler:alpha=' + event.alpha + ",beta=" +event.beta +
						",gamma=" + event.gamma);
				//这里需要考虑减噪的需求，
				if(!this.lastX){
					this.lastX=event.gamma;
					return;
				}
				var delta = event.gamma-this.lastX;
				if(Math.abs(delta)<this.noiseAngle)
					return;
				this.lastX = event.clientX;
				this.stepImage(delta/this.rotationStepAngle);
			},this)
			this.active(true);
		},
		/*
		 * 只有处于active状态的控件才会监听鼠标移动或者手持设备的x轴变动
		 */
		active:function(active){
			if(this.active == active){
				return;
			}
			this.active = active;
			this.doActive();
		},
		doActive:function(){
			if(this.active){
				this.activeListener();
			}else{
				this.removeListener();
			}
		},
		activeListener:function(){
			if(window.DeviceOrientationEvent && !this.mouseOnly){
				console.log('start deviceorientation');
				window.addEventListener('deviceorientation',this.rotationHandler,false);
			}else{
				console.log('start mousemove');
				this.canvas.addEventListener('mousemove',this.mouseHandler,false);
			}
		},
		removeListener:function(){
			if(window.DeviceOrientationEvent && !this.mouseOnly){
				console.log('end deviceorientation');
				window.removeEventListener('deviceorientation',this.rotationHandler,false);
			}else{
				this.canvas.removeEventListener('mousemove',this.mouseHandler,false);
			}
		},
		stepImage:function(delta){
			this.currentImagePosition += delta;
			this.drawImage(this.currentImagePosition);
		},
		drawImage:function(n){
			if(n<0)
				n=0;
			if(n>this.maxPosition)
				n = this.maxPosition;
			this.currentImagePosition = n;
			var floorPosition = Math.floor(n);
			var ceilPosition = Math.ceil(n);
			var opacity = n- floorPosition;
			if(opacity==0)
				opacity = 1;
			this.realDrawImg(this.getImage(ceilPosition),opacity);
			if(floorPosition!=ceilPosition){
				this.realDrawImg(this.getImage(floorPosition),1-opacity);
			}
		},
		getImage:function(position){
			return this.imgs[position];
		},
		realDrawImg:function(img,opacity){
			this.ctx.save();
			this.ctx.globalAlpha = opacity;
			this.ctx.drawImage(img,0,0);
			this.ctx.restore();
		},
		destroy:function(){
			this.imgs.css('display',"");
			delete this.imgs;
			this.active(false);
//			this.canvas.removeEventListener('mousemove',this.handler)
			delete this.ctx;
			$(this.canvas).remove();
			delete this.canvas;
			this.$el.data
			delete this.$el;
		}
	});
	$.fn.carousel = function(options){
        return this.each(function () {
            if ($(this).data("canvascarousel") === true) {
            	return false;
            }
            $(this).data("canvascarousel", true);
            var carousel = new CanvasCarousel(options);
            carousel.init(this);
            $.data(this, "carousel", carousel);
        });
	},
	$.fn.carouseldestroy = function(){
        return this.each(function () {
            var carousel = $.data(this, "carousel");
            carousel.destroy();
            $(this).data('canvascarousel',false);
            $.data(this, "carousel", null);
        });
	}
});