;
(function($, ECar, window) {
	"use strict";

	ECar.mSelect = (function() {
		var _settings = {
				selector: "",
				provinceUrl: "",
				cityUrl: "",
				regionUrl: "",
				data: { // [code, name]
					"province": {
						"code": "",
						"name": ""
					},
					"city": {
						"code": "",
						"name": ""
					},
					"region": {
						"code": "",
						"name": ""
					}
				},
				headerMsg: "所在地区",
				selectMsg: "请选择",
				saveType: 0, //数据存储方式,0-sessionStorage、1-localStorage
				closeFn: null,
				doneFn: null
			},
			mSelect = null,
			result = _settings.data,
			storage = null;

		var select = (function() {
			var $select = null;

			function init(_settings) {
				var $area = $select = $("<div>").addClass("select_area"),
					$mask = $("<div>").addClass("select_msak"),
					$container = $("<dl>").addClass("select_container");

				// header
				var $header = $("<dt>").addClass("select_header");
				$header.append($("<span>").text(_settings.headerMsg)).append($("<i>").text("×"));

				// result
				var $result = $("<dd>").addClass("select_result"),
					$result_ul = $("<ul>");
				$result_ul.append($("<li data-type='province'>").addClass("result_item current").append($("<a href='javascript:;'>").data("code", "0").text(_settings.selectMsg)))
				$result_ul.append($("<li data-type='city'>").addClass("result_item").append($("<a href='javascript:;'>").data("code", "0").text(_settings.selectMsg)))
				$result_ul.append($("<li data-type='region'>").addClass("result_item").append($("<a href='javascript:;'>").data("code", "0").text(_settings.selectMsg)))
				$result.append($result_ul);

				// list
				var $list = $("<dd>").addClass("select_list");
				$list.append($("<ul data-item-type='province'>").addClass("list province_list active"));
				$list.append($("<ul data-item-type='city'>").addClass("list city_list"));
				$list.append($("<ul data-item-type='region'>").addClass("list region_list"));

				$container.append($header).append($result).append($list);
				$area.append($mask).append($container);
				$("body").append($area);

				storage = {
					type: _settings.saveType === 0 ? "sessionStorage" : "localStorage",
					setItem: function(key, value) {
						window[this.type].setItem(key, JSON.stringify((value)));
					},
					getItem: function(key) {
						return JSON.parse(window[this.type].getItem(key));
					}
				};

				// 初始化数据
				createItem("province", getRegionData("province", "province", _settings), "");
			}

			function update(_settings) {
				// 更新选中地区
				var $result = $(".select_result"),
					data = _settings.data;
				for (var key in _settings.data) {
					if (_settings.data.hasOwnProperty(key)) {
						$result.find("li[data-type='" + key + "'] a")
							.data("code", (data[key].code == "" ? "0" : data[key].code))
							.attr("href", (data[key].code == "" ? "javascript:;" : "#" + data[key].code))
							.text((data[key].name == "" ? _settings.selectMsg : data[key].name));
					}
				}
				if (_settings.data.city.code) {
					toggleState($result.find("li[data-type='region']"), "current");
					createItem("city", getRegionData("city", data.province.code, _settings), data.city.name);
					createItem("region", getRegionData("region", data.city.code, _settings), data.region.name);
					toggleDisplay(3);
				} else if (_settings.data.province.code) {
					toggleState($result.find("li[data-type='city']"), "current");
					createItem("city", getRegionData("city", data.province.code, _settings), data.city.name);
					toggleDisplay(2);
				} else {
					toggleState($result.find("li[data-type='province']"), "current");
					toggleDisplay(1);
				}

				// 更新数据
				createItem("province", getRegionData("province", "province", _settings), data.province.name);
			}

			function createItem(type, data, name) {
				var $Selector = $(".select_list").find("ul[data-item-type='" + type + "']");

				if ($Selector.length && data) {
					$Selector.html("");
					var $Li = null,
						regionName = "";

					for (var i = 0; i < data.length; i++) {
						regionName = data[i].regionName;

						$Li = $("<li>").attr("id", data[i].regionCode).append($("<p>").text(regionName)).data("code", data[i].regionCode).data("name", regionName);

						if (regionName === name) {
							$Li.addClass("current");
						}

						$Selector.append($Li);
					}
				}
			}

			return {
				flag: true,
				get: function(_settings) {
					return $select || (this.flag = false, init(_settings));
				},
				update: function(_settings) {
					update(_settings);
				},
				show: function(fn) {
					this.get().show();
					fn && setTimeout(fn, 0);
				},
				hide: function(fn) {
					this.get().hide();
					fn && setTimeout(fn, 0);
				},
				createItem: function(type, data, name) {
					createItem(type, data, name);
				}
			}
		})();

		// 展示地址选择区域
		function show(option) {
			var settings = $.extend({}, _settings, option);

			result = settings.data;

			select.flag ? select.get(settings) : select.update(settings);

			select.show(function() {
				// 关闭按钮事件
				$(".select_header i").tap(function() {
					select.hide(settings.closeFn);
				});

				// 省市区切换
				$(".result_item a").tap(function() {
					var parent = $(this).parent(),
						type = parent.data("type"),
						listType = "";

					switch (type) {
						case "province":
							listType = type;
							break;
						case "city":
							if ($("li[data-type='province'] a").data("code") !== "0") {
								listType = type;
							}
							break;
						case "region":
							if ($("li[data-type='city'] a").data("code") !== "0") {
								listType = type;
							}
							break;
					}

					if (listType.length) {
						parent.addClass("current").siblings().removeClass("current");
						$(".list").hide();
						$("." + listType + "_list").show();
					}
				});

				// 地区选择
				$(".select_list ul").tap(function(e) {
					var self = e.target,
						tagName = self.tagName.toLowerCase();

					if (!(tagName === "li" || tagName === "p")) return;

					var that = tagName === "li" ? $(self) : $(self).parents("li"),
						parent = that.parent(),
						text = that.data("name"),
						code = that.data("code"),
						sType = parent.data("item-type"),
						nType = regionMap(sType);

					//更新导航显示区域
					updateNavTxt(sType, text, code);

					// 切换标签显示状态
					if (that.hasClass("current")) return;
					toggleState(that, "current");
					toggleState(parent, "active");

					// 切换导航显示状态
					if (nType === 1) { // 省
						updateNavTxt("city", "请选择", 0);
						updateNavTxt("region", "请选择", 0);
						select.createItem("city", getRegionData("city", code, settings), "");
					} else if (nType === 2) {
						updateNavTxt("region", "请选择", 0);
						select.createItem("region", getRegionData("region", code, settings), "");
					} else {
						var _province = $("li[data-type='province'] a"),
							_city = $("li[data-type='city'] a"),
							_region = $("li[data-type='region'] a");
						result = {
							"province": {
								"code": _province.data("code"),
								"name": _province.data("name")
							},
							"city": {
								"code": _city.data("code"),
								"name": _city.data("name")
							},
							"region": {
								"code": _region.data("code"),
								"name": _region.data("name")
							}
						}
						hide(settings.closeFn);
					}

					nType = nType > 2 ? 0 : (nType + 1);
					toggleDisplay(nType);

				})
			});
		}

		// 隐藏地址选择区域
		function hide(fn) {
			mSelect.result = result;
			select.hide(fn);
		}

		// 数据字典
		function regionMap(type) {
			var mapping = {
				"province": 1,
				"city": 2,
				"region": 3
			};

			return mapping[type] ? mapping[type] : 0;
		}

		// 切换元素状态
		function toggleState(o, className) {
			o.addClass(className).siblings().removeClass(className);
		}

		// 切换显示省市区
		function toggleDisplay(type) {
			var nav = "",
				item = "";
			switch (type) {
				case 1:
					nav = "data-type='province'";
					item = "data-item-type='province'";
					break;
				case 2:
					nav = "data-type='city'";
					item = "data-item-type='city'";
					break;
				case 3:
					nav = "data-type='region'";
					item = "data-item-type='region'";
					break;
			}

			if (nav && item) {
				//显示对应的导航
				toggleState($(".select_result").find("li[" + nav + "]"), "current");
				//显示对应的区域
				$(".select_list").find("ul[" + item + "]").show().siblings().hide();
			}
		}

		// 更新导航显示区域
		function updateNavTxt(type, text, code) {
			var selector = $(".select_result").find("li[data-type='" + type + "'] a");

			if (selector.length === 1) {
				selector.eq(0).attr("href", code === 0 ? "javascript:;" : "#" + code).data("code", code).data("name", text).text(text.slice(0, 5));
			}
		}

		// 获取省市区数据
		function getRegionData(type, code, _settings) {
			var result = storage.getItem(code),
				url = _settings[type + "Url"] ? _settings[type + "Url"] : "";
			if (result) return result;

			if (url.length) {
				$.ajax({
					url: url,
					type: "get",
					async: false,
					data: {
						"parentCode": code
					},
					dataType: "json",
					success: function(data) {
						if (data.result) {
							result = JSON.parse(data.result);
							storage.setItem(code, result);
						}
					}
				});
			}

			return result;
		}

		mSelect = {
			"result": result,
			"show": function() {
				show(arguments[0]);
			},
			"hide": function() {
				hide(arguments[0]);
			}
		}

		return mSelect;
	})();

})(Zepto, window.ECar || (window.ECar = {}), window);