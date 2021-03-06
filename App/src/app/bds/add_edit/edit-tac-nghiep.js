(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editTacNghiepCtrl", editTacNghiepCtrl);
	/** @ngInject */
	function editTacNghiepCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		var currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;
		vm.model = {};
		vm.bdsId = $stateParams.bdsId;
		vm.khoBDSKey = $stateParams.khoId;
		vm.user = $stateParams.user;
		vm.currentUserId = currentUser.$id;
		vm.loaiTacNghiepList = [];
		var tacNghiepList = [];

		vm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;
		_.forEach(vm.cacLoaiTacNghiep, function (item, key) {
			if (!item.flagTacNghiepHeThong)
				vm.loaiTacNghiepList.push({
					text: item.text,
					value: key
				});
		});

		vm.activeTab = 'tacNghiep';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp',
				url: './app/bds/add_edit/_tab-tac-nghiep.tpl.html'
			},
			lienKetUsers: {
				title: 'Liên Kết Users'
			},
			lienKetNhuCau: {
				title: 'Liên Kết Nhu Cầu'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
			},
			loaiNoiThat: {
				title: 'Loại Nội Thất'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
		};

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, {
				bdsId: vm.bdsId,
				khoId: vm.khoBDSKey
			});
		};

		vm.groupedItems = [];
		vm.filteredItems = [];
		vm.pagedItems = [];
		vm.paging = {
			pageSize: 25,
			currentPage: 0,
			totalPage: 0,
			totalRecord: 0
		};

		vm.keyword = '';
		vm.groupToPages = function () {
			vm.pagedItems = [];
			for (var i = 0; i < vm.filteredItems.length; i++) {
				if (i % vm.paging.pageSize === 0) {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
				} else {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
				}
			}
			if (vm.filteredItems.length % vm.paging.pageSize === 0) {
				vm.paging.totalPage = vm.filteredItems.length / vm.paging.pageSize;
			} else {
				vm.paging.totalPage = Math.floor(vm.filteredItems.length / vm.paging.pageSize) + 1;
			}

		};

		$scope.changePage = function () {
			vm.groupToPages();
		};

		// vm.search = function (keyword) {
		// 	appUtils.showLoading();
		// 	tacNghiepService.search(vm.bdsId, keyword).then(function (result) {
		// 		appUtils.hideLoading();
		// 		vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
		// 		vm.paging.totalRecord = result.length;
		// 		vm.paging.currentPage = 0;
		// 		//group by pages
		// 		vm.groupToPages();
		// 	});
		// };

		vm.delete = function (tacNghiepKey) {
			$ngBootbox.customDialog({
				message: 'Bạn Muốn Xoá Tác Nghiệp Này?',
				buttons: {
					danger: {
						label: "Huỷ",
						className: "btn-default",
						callback: function () {
							console.log('cancel');
							appUtils.hideLoading();
						}
					},
					success: {
						label: "Chấp Nhận",
						className: "btn-success",
						callback: function () {
							removeTacNghiep(vm.bdsId, 'tacNghiep', tacNghiepKey);
							toaster.success("Xoá Tác Nghiệp Thành Công");
						}
					}
				}
			});
		};

		function removeTacNghiep(bdsId, tabPath, tacNghiepKey) {
			bdsService.removeTab(bdsId, tabPath, tacNghiepKey).then(function (res) {
				if (res.result) {
					appUtils.hideLoading();
					$scope.$apply(function () {
						_.remove(tacNghiepList, function (o) {
							return o.tacNghiepKey == tacNghiepKey;
						});
						vm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
						vm.groupToPages();
					});
					return;
				}
				appUtils.hideLoading();
				toaster.error("Xoá Tác Nghiệp Không Thành Công!");
			});
		}

		vm.save = function (form) {
			if (form.$invalid)
				return;
			appUtils.showLoading();
			vm.model.phoneNumber = currentUser.phoneNumber;
			vm.model.name = currentUser.lastName + " " + currentUser.firstName;
			vm.model.userKey = currentUser.$id;
			vm.model.timestampCreated = Date.now();
			$ngBootbox.customDialog({
				message: 'Bạn Có Muốn Thêm Tác Nghiệp Này?',
				buttons: {
					danger: {
						label: "Huỷ",
						className: "btn-default",
						callback: function () {
							console.log('cancel');
							$scope.$apply();
							appUtils.hideLoading();
						}
					},
					success: {
						label: "Chấp Nhận",
						className: "btn-success",
						callback: function () {
							delete vm.model.$id;
							editTacNghiep(vm.bdsId, vm.model, 'tacNghiep', true);
							toaster.success("Thêm Tác Nghiệp Thành Công");
							appUtils.showLoading();
						}
					}
				}
			});
		};

		function editTacNghiep(bdsId, model, tabPath, isLinked) {
			bdsService.updateTab(bdsId, model, tabPath, isLinked).then(function (res) {
				if (res.result) {
					appUtils.hideLoading();
					$scope.$apply(function () {
						vm.model.tacNghiepKey = res.linkedKey;
						addToList(vm.model);
					});
					return;
				}
				appUtils.hideLoading();
				toaster.error("Thêm Tác Nghiệp Không Thành Công!");
			});
		}

		function addToList(model) {
			var newModel = _.cloneDeep(model);
			vm.model.thongtin = '';
			vm.model.loaiTacNghiep = '';
			tacNghiepList.push(newModel);
			vm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
			vm.groupToPages();
		}

		vm.textLoaiTacNghiep = function (value) {
			var rs = _.find(vm.cacLoaiTacNghiep, function (o) {
				return o.value + '' === value + '';
			});
			if (rs) {
				return rs.text;
			}
			return 'Unknown';
		};

		//Load Data
		function pageInit() {
			if (!!vm.bdsId && !!vm.khoBDSKey) {
				appUtils.showLoading();
				vm.model.khoBDSKey = vm.khoBDSKey;
				bdsService.getTab(vm.bdsId, 'tacNghiep').then(function (result) {
					console.log('MODEL AC NGJIIE{', result);
					if (!!result) {
						_.forEach(result, function (item, key) {
							if (_.isObject(item)) {
								item.tacNghiepKey = key;
								tacNghiepList.push(item);
							}
						});
						vm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
						vm.paging.totalRecord = tacNghiepList.length;
						vm.paging.currentPage = 0;
						//group by pages
						vm.groupToPages();
						$scope.$apply();
					}
					appUtils.hideLoading();
				});
			} else {
				$state.go('bds.list');
			}
		}

		pageInit();
	}

})();