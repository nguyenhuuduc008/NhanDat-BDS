(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editLienKetNhuCauCtrl", editLienKetNhuCauCtrl);
	/** @ngInject */
	function editLienKetNhuCauCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, nhuCauService, authService, toaster) {
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
		vm.nhuCauList = [];

		vm.activeTab = 'lienKetNhuCau';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp',
			},
			lienKetUsers: {
				title: 'Liên Kết Users'
			},
			lienKetNhuCau: {
				title: 'Liên Kết Nhu Cầu',
				url: './app/bds/add_edit/_tab-lien-ket-nhu-cau.tpl.html'
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

		vm.keyword = '';

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
				bdsService.getBDS(vm.khoBDSKey, vm.bdsId).then(function (result) {
					console.log('Lien kET Nhu CAU', result);
					if (!!result.listNhuCauKey) {
						_.forEach(result.listNhuCauKey, function (item, key) {
							nhuCauService.getOnceNhuCau(vm.khoBDSKey, 'ban', item).then(function (res) {
								if (!!res) {
									nhuCauService.getTabNhuCau('lienKetUser', item).then(function (linkedRs) {
										var create = _.find(linkedRs, function (o) {
											return o.loaiLienKetUser === "createUserUniq";
										});
										vm.nhuCauList.push({
											tieuDe: res.tieuDe,
											createUser: create.userName,
											timestampCreated: create.timeCreated
										});
										$scope.$apply();
									});
								}
							});
							nhuCauService.getOnceNhuCau(vm.khoBDSKey, 'cho-thue', item).then(function (res) {
								if (!!res) {
									nhuCauService.getTabNhuCau('lienKetUser', item).then(function (linkedRs) {
										var create = _.find(linkedRs, function (o) {
											return o.loaiLienKetUser === "createUserUniq";
										});
										nhuCauList.push({
											tieuDe: res.tieuDe,
											createUser: create.userName,
											timestampCreated: create.timeCreated
										});
										$scope.$apply();
									});
								}
							});
						});
						console.log('LIST NHU CAU', vm.nhuCauList);
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