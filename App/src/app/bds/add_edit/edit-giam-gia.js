(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editGiamGiaCtrl", editGiamGiaCtrl);
	/** @ngInject */
	function editGiamGiaCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, toaster, appUtils, bdsService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$scope.numberRegx = /^\d+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		vm.bdsId = $stateParams.bdsId;
		vm.model = {};
		vm.showInvalid = true;
		vm.cacLoaiGiamGia = [
			{
				text: 'Phần Trăm (%)',
				value: 0
			},
			{
				text: 'Số Tiền',
				value: 1
			}
		];

		vm.activeTab = 'giamGia';
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
				title: 'Giảm Giá',
				url: './app/bds/add_edit/_tab-giam-gia.tpl.html'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
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
				loaiGiamGia: vm.model.loaiGiamGia,
				amount: vm.model.amount,
			};
			bdsService.updateGiamGia(vm.bdsId, obj).then(function (res) {
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
			bdsService.getGiamGia(vm.bdsId).$loaded().then(function(rs){
				if(rs){
					vm.model = rs;
				}
				appUtils.hideLoading();
			});
		}

		loadBDSDetails();
	}

})();
