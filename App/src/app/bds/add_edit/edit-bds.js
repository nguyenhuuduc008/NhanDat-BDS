(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editBdsCtrl", editBdsCtrl);
	/** @ngInject */
	function editBdsCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
		vm.bdsId = $stateParams.bdsId;
		vm.model = {};
		vm.model.$id = vm.bdsId;
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
				title: 'Thuộc Quy Hoạch'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
			lichSuGiaoDich: {
				title: 'Lịch Sử Giao Dịch'
			},
			capDo: {
				title: 'Cấp Độ'
			},
			lichSuGia: {
				title: 'Lịch Sử Giá'
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

		vm.save = function(){
			appUtils.showLoading();
			bdsService.update(vm.model).then(function(res){
                if(!res.result){				
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
                appUtils.hideLoading();
                toaster.pop('success','Success', "Save success!");
            }, function(res){
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            });
		};

		//Load Data
		function loadBDSDetails() {
			appUtils.showLoading();
			bdsService.getLinkToCategory(vm.model.$id).$loaded().then(function (bdsCateResult) {
				if (bdsCateResult && !bdsCateResult.isDeleted && bdsCateResult.danhMucId !== '-1') {
					bdsService.get(bdsCateResult.danhMucId, vm.model.$id).$loaded().then(function (result) {
						if (result) {
							vm.model = result;
						}else{
                            toaster.pop('error', 'Error', "Cann't load data!");
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
