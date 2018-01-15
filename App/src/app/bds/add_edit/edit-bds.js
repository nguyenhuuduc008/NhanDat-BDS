(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editBdsCtrl", editBdsCtrl);
	/** @ngInject */
	function editBdsCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		// if ($rootScope.reProcessSideBar) {
		// 	$rootScope.reProcessSideBar = false;
		// }
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
		vm.bdsId = $stateParams.id;
		vm.model = {};
		vm.model.$id = vm.bdsId;
		console.log('--------vm.model.$id');
		console.log(vm.model.$id);
		$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		vm.showInvalid = true;
		
		vm.activeTab='thongTin';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
			tacNghiep: {
				title: 'Tác Nghiệp',
				// url: './app/bds/add_edit/_tab-tac-nghiep.tpl.html'
			},
			desc: {
				title: 'Descriptions',
				// url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
			info2: {
				title: 'Info',
				// url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},			
		};
		
		vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		vm.cacLoaiHau = appSettings.cacLoaiHau;
		vm.cacLoaiBDS = appSettings.cacLoaiBDS;
		vm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;

		//Functions
		vm.loadTab = function(key){
			vm.activeTab = key;
            $state.go('bds.' + key, { bdsId: vm.bdsId });
		};

		//Load Data
		function loadBDSDetails() {
			appUtils.showLoading();
			bdsService.getLinkToCategory(vm.model.$id).$loaded().then(function (bdsCateResult) {
				console.log('---------bdsCateResult');
				console.log(bdsCateResult);
				if (bdsCateResult && !bdsCateResult.isDeleted && bdsCateResult.danhMucId !== '-1') {
					bdsService.get(bdsCateResult.danhMucId, vm.model.$id).$loaded().then(function (result) {
						console.log('---------result');
						console.log(result);
						if (result) {
						}
						appUtils.hideLoading();
					});
				} else {
					appUtils.hideLoading();
				}
			});
		}

		loadBDSDetails();
	}

})();
