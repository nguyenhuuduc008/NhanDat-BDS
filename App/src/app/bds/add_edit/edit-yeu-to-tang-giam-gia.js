(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editYeuToTangGiamGiaCtrl", editYeuToTangGiamGiaCtrl);
	/** @ngInject */
	function editYeuToTangGiamGiaCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, toaster, appUtils, bdsService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var appSettings = $rootScope.storage.appSettings;
		$scope.numberRegx = /^\d+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		vm.bdsId = $stateParams.bdsId;
		vm.khoBDSKey = $stateParams.khoId;

		vm.model = {};

		vm.showInvalid = true;
		vm.cacLoaiGiamGia = appSettings.cacLoaiGiamGia;

		vm.activeTab = 'yeuToTangGiamGia';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			lienKetUsers: {
				title: 'Liên Kết Users'
			},
			lienKetNhuCau: {
				title: 'Liên Kết Nhu Cầu'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá',
				url: './app/bds/add_edit/_tab-yeu-to-tang-giam-gia.tpl.html'
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

		vm.save = function () {
			appUtils.showLoading();
			delete vm.model.$id;
			bdsService.updateTab(vm.bdsId, vm.model, 'yeuToTangGiamGia').then(function (res) {
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg.message);
					return;
				}
				$scope.$apply(function () {
					toaster.success('Thành Công', "Lưu Bất Động Sản Thành Công!");
				});
				appUtils.hideLoading();
			}, function (res) {
				$ngBootbox.alert(res.errorMsg.message);
				appUtils.hideLoading();
				return;
			});
		};

		//Load Data
		function pageInit() {
			appUtils.showLoading();
			vm.model.khoBDSKey = vm.khoBDSKey;
			if (!!vm.bdsId && !!vm.khoBDSKey) {
				bdsService.getTab(vm.bdsId, 'yeuToTangGiamGia').then(function (rs) {
					if (!!rs) {
						vm.model = rs;
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