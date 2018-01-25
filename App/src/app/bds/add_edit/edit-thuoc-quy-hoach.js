(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editthuocQuyHoachCtrl", editthuocQuyHoachCtrl);
	/** @ngInject */
	function editthuocQuyHoachCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, toaster, appUtils, bdsService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var appSettings = $rootScope.storage.appSettings;
		$scope.numberRegx = /^\d+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		vm.bdsId = $stateParams.bdsId;
		vm.model = {
		};

		vm.cacLoaiQuyHoach = appSettings.cacLoaiQuyHoach;
		vm.showInvalid = true;

		vm.activeTab = 'thuocQuyHoach';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			viTri: {
				title: 'Vị Trí'
			},
			lienKetUsers: {
				title: 'Liên Kết Users'
			},
			giamGia: {
				title: 'Giảm Giá'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
			},
			thuocQuyHoach: {
				title: 'Thuộc Quy Hoạch',
				url: './app/bds/add_edit/_tab-thuoc-quy-hoach.tpl.html'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
		};

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, { bdsId: vm.bdsId });
		};

		vm.save = function () {
			appUtils.showLoading();
			var obj = {
				thuocQuyHoach: vm.model.thuocQuyHoach
			};
			bdsService.updateThuocQuyHoach(vm.bdsId, obj).then(function (res) {
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg.message);
					return;
				}
				$scope.$apply(function () {
					toaster.success('Success', "Save success!");
				});
				appUtils.hideLoading();
			}, function (res) {
				$ngBootbox.alert(res.errorMsg.message);
				appUtils.hideLoading();
				return;
			});
		};

		//Load Data
		function loadBDSDetails() {
			appUtils.showLoading();
			bdsService.getThuocQuyHoach(vm.bdsId).$loaded().then(function(rs){
				if(rs && rs.timestampCreated){
					vm.model = rs;
				}
				appUtils.hideLoading();
			});
		}

		loadBDSDetails();
	}

})();