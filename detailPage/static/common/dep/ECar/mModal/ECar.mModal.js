;
(function($, ECar) {
	ECar.mModal = (function() {
		//默认配置
		var _settings = {
			title: "提示",
			type: "alert",
			width: 690, //数字或带单位的字符串
			height: 300, //数字或带单位的字符串
			content: "", //内容
			okTxt: "确定", //确定按钮文本信息
			cancelTxt: "取消", //取消按钮文本信息
			hasTitle: true, //是否显示标题， 默认true
			base: 75, //设计稿尺寸
			okFn: null,
			cancelFn: null,
			loadFn: null
		};

		//modal
		var oModal = (function() {
			var aModalType = ["alert", "confirm", "warn"],
				zModal = null,
				zModalContainer = null;

			//init modal
			function initModal(_settings) {
				zModal = $("<div>").addClass("ECar_mModal");
				zModalContainer = $("<div>").addClass("ECar_mModal_container");

				//mask
				var zContainer = zModalContainer,
					zMask = $("<div>").addClass("ECar_mModal_mask"),
					zModalTitle = $("<div>").addClass("ECar_mModal_title");

				//title mModal_title_hidden
				_settings.hasTitle ? "" : zModalTitle.addClass("mModal_title_hidden");
				zModalTitle.append($("<h3>").text(_settings.title));
				zContainer.append(zModalTitle);

				//content
				var sType = _settings.type;
				if (_settings.content.length > 0) {
					addContent(_settings, zContainer);
				}

				//button
				if (sType === "confirm" || sType === "alert") {
					addButton(_settings, zContainer, sType);
				}

				zModal.append(zMask);
				zModal.append(zContainer);
				$(document.body).append(zModal);

				return zModal;
			}
			//update modal
			function updateModal(_settings) {
				var sType = _settings.type;

				//update title
				var zModalTitle = $(".ECar_mModal_title");
				zModalTitle.find("h3").text(_settings.title);
				_settings.hasTitle ? zModalTitle.removeClass("mModal_title_hidden") : zModalTitle.addClass("mModal_title_hidden");


				if (aModalType.join().indexOf(sType) !== -1) {

					//remove button
					var zModalButton = $(".ECar_mModal_button");
					zModalButton.remove();

					//add or update content
					var zModalContent = $(".ECar_mModal_content");
					if (_settings.content.length > 0) {
						zModalContent.length ? updateContent(_settings, zModalContent) : addContent(_settings, zModalContainer);
					} else if (zModalContent.length > 0) {
						zModalContent.remove();
					}

					// add or update button
					addButton(_settings, zModalContainer, sType);
				}
			}
			//setStyle
			function setStyle(_settings) {
				var nWidth = parseInt(("" + _settings.width).replace("px", "")),
					nHeight = parseInt(("" + _settings.height).replace("px", "")),
					nBase = _settings.base,
					oStyle = {
						"width": px2rem(nBase, nWidth),
						"height": px2rem(nBase, nHeight),
						"marginLeft": px2rem(nBase, -nWidth / 2),
						"marginTop": px2rem(nBase, -nHeight / 2),
					};
				zModalContainer.css(oStyle); //设置弹出层位置
			}
			//add content
			function addContent(_settings, zModalContainer) {
				var zModalContent = $("<div>").addClass("ECar_mModal_content");
				zModalContent.html(_settings.content);
				zModalContainer.append(zModalContent);
			}
			//update content
			function updateContent(_settings, zModalContent) {
				zModalContent.html(_settings.content);
			}
			//add button
			function addButton(_settings, zModalContainer, sType) {
				var zModalButton = $(".ECar_mModal_button"),
					zButton = null;
				if (zModalButton.length === 0 && (sType === "alert" || sType === "confirm")) {
					zModalButton = $("<div>").addClass("ECar_mModal_button");

					if (sType === "confirm") {
						zModalButton.append($("<button>").addClass("cancel").text(_settings.cancelTxt));
					}
					zModalButton.append($("<button>").addClass("confirm").text(_settings.okTxt));

					zModalContainer.append(zModalButton);
				} else if (sType === "warn") { // "warn"类型弹框无需按钮
					zModalButton.remove();
				} else {
					zModalButton.html("");
					if (sType === "confirm") {
						zModalButton.append($("<button>").addClass("cancel").text(_settings.cancelTxt));
					}
					zModalButton.append($("<button>").addClass("confirm").text(_settings.okTxt));
				}
			}
			//px2rem
			function px2rem(base, num) {
				return (num / base) + "rem";
			}
			return {
				flag: true,
				get: function(_settings) {
					return zModal || (this.flag = false, initModal(_settings));
				},
				update: function(_settings) {
					updateModal(_settings);
				},
				show: function(fn) {
					this.get().show();
					fn && setTimeout(fn, 0);
				},
				hide: function(fn) {
					this.get().hide();
					fn && setTimeout(fn, 0);
				},
				setStyle: function(_settings) {
					setStyle(_settings);
				}
			}
		})();

		function addEvent(obj, fn) {
			$(obj).on("click", function(e) {
				oModal.hide(fn);
				e.preventDefault();
				e.stopPropagation();
			})
		}

		function show(option, type) {
			var settings = $.extend({}, _settings, option);
			settings.type = type;

			oModal.flag ? oModal.get(settings) : oModal.update(settings);

			oModal.setStyle(settings);
			oModal.show(function() {
				settings.loadFn && setTimeout(settings.loadFn, 0);
				addEvent($(".ECar_mModal .confirm"), settings.okFn);
				addEvent($(".ECar_mModal .cancel"), settings.cancelFn);
			});
		}

		function hide(fn) {
			oModal.hide(fn);
		}

		return {
			"alert": function() {
				show(arguments[0], "alert");
			},
			"confirm": function() {
				show(arguments[0], "confirm");
			},
			"warn": function() {
				show(arguments[0], "warn");
			},
			"otherTemplate": function() {
				show(arguments[0], "otherTemplate");
			},
			"hide": function() {
				hide(arguments[0]);
			}
		}
	})();

})(Zepto, window.ECar || (window.ECar = {}));