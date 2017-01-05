/*
*  author: zx@varnull.cn
*  date: 2016.03.31
*/
(function(window, document) {

	"use strict";

	// XScrollSelect CLASS DEFINITION
  	// ======================
	var XScrollSelect = function(options) {

		this.options = options || {};
		this.$selectbox = document.querySelectorAll("#xScrollSelect .select-box")[0];
		this.$selectcover = document.querySelectorAll("#xScrollSelect .select-box-cover")[0];
		this.$wrapper = document.getElementById('xScrollSelectwrapper');
		this.$lis = null;
		this.selectScroll = null;

		var defaults = {
			showCover: true,
			itemWidth: 40,
			items: [],
			spaceNum: 2,
			probeType: 2,
			onScrollEnd: function() {}, //回调函数，参数包含{index: index, data: data} 滚动结束后的index和对应的data数据
			onConfirm: function() {}
		};

		for (var option in defaults) {
            if (typeof this.options[option] === 'undefined') {
                this.options[option] = defaults[option];
            }
        }

        this.scrollEndData = {
			index: 0,
			data: this.options.items[0]
		};

        //初始化HTML结构
        _init.call(this);
	}

	// API方法
  	// ======================

    //隐藏滚动选择
    XScrollSelect.prototype.hide = function() {
    	this.$selectcover.style.display = 'none';
    	this.$selectbox.style.transform = 'translate3d(0, '+ this.$selectbox.clientHeight +'px, 0)';
    	var self = this;
    	setTimeout(function() {
	    	self.selectScroll.scrollTo(0, 0);
	    	_switchActiveClass(0, self);
	        self.scrollEndData = {
				index: 0,
				data: self.options.items[0]
			};
    	}, 500);
    };

    //显示滚动选择
    XScrollSelect.prototype.show = function() {
    	if(this.options.showCover) {
    		this.$selectcover.style.display = 'block';
    	}    	
    	this.$selectbox.style.transition = 'all ease-in-out 0.5s';
    	this.$selectbox.style.transform = 'translate3d(0, 0, 0)';
    };


  	// 私有方法
  	// ======================

	//初始化组件结构
	function _init() {

		//所有选项信息
		var items = this.options.items;

		//空位添加使首选项居中
		var spaces = '';
		var count = 0;
		var options = '';

		while(count < this.options.spaceNum) {
			spaces += '<li></li>';
			count ++;
		}

		options = spaces;

		for(var i=0; i<items.length; i++) {
			options += '<li>' + (items[i].name ? items[i].name : '') + '</li>';
		}
	
		options += spaces;
		
		this.$wrapper.innerHTML = '<ul>' + options + '</ul>';
		var $wrapper = this.$wrapper;
		this.$lis = $wrapper.getElementsByTagName('ul')[0].children;
		var $lis = this.$lis;

		var $indicator = document.querySelectorAll("#xScrollSelect .indicator")[0];

		//初始化滚动区域高度
		$wrapper.style.height = (this.options.spaceNum * 2 + 1) * this.options.itemWidth + 'px';

		//初始化item的高度
		for(var li=0; li<$lis.length; li ++) {
			$lis[li].style.height = this.options.itemWidth + 'px';
			$lis[li].style.lineHeight = this.options.itemWidth + 'px';
		}
		
		//初始化indicator高度
		$indicator.style.height = this.options.itemWidth + 'px'; 

		//初始化高亮
		$lis[this.options.spaceNum].classList.add('active');

		//初始化iscroll5
		var self = this;
		this.selectScroll = new IScroll('#xScrollSelectwrapper', {
			probeType: self.options.probeType
		});

		var getActiveIndex = function(posY) {
			var index = -Math.round(posY / self.options.itemWidth);
			if(index > self.options.items.length - 1) {
				index = self.options.items.length - 1;
			}
			if(index <= 0) {
				index = 0;
			}
			return index;
		};
		
		this.selectScroll.on('scrollEnd', function() {
			var index = getActiveIndex(this.y);
			_switchActiveClass(index, self);
			this.scrollTo(0, - index * self.options.itemWidth);
			self.scrollEndData = {
				index: index,
				data: self.options.items[index]
			};
			self.options.onScrollEnd(self.scrollEndData);
		});

		this.selectScroll.on('scroll', function() {
			var index = getActiveIndex(this.y);
			_switchActiveClass(index, self);
		});

		// document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);

		//添加取消和确定的监听
		document.querySelectorAll('#xScrollSelect .header>.cancel')[0].addEventListener('click', function() {
			self.hide();
		}, false);
		document.querySelectorAll('#xScrollSelect .header>.confirm')[0].addEventListener('click', function() {
			self.hide();
			self.options.onConfirm(self.scrollEndData);
		}, false);

		//添加遮罩的监听
		this.$selectcover.addEventListener('click', function() {
			self.hide();
		}, false);

		//初始化的时候隐藏
		this.hide();
		
	};

	//改变active的item
	function _switchActiveClass(index, self) {
		for(var li=0; li<self.$lis.length; li ++) {
			self.$lis[li].classList.remove('active');
		}

		self.$lis[index + self.options.spaceNum].classList.add('active');
	};


	window.xScrollSelect = XScrollSelect;

}(window, document));