(function () {
	'use strict';

	angular.module("app.nhuCau")
		.controller("nhuCauAdd", nhuCauAdd);
	/** @ngInject */
	function nhuCauAdd($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$rootScope.settings.layout.pageSidebarClosed = true;
		var nhuCauAddVm = this; // jshint ignore:line
		nhuCauAddVm.currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
		nhuCauAddVm.cities = appSettings.thanhPho;
		nhuCauAddVm.cacLoaiDuong = appSettings.cacLoaiDuong;
		nhuCauAddVm.cacLoaiViTri = appSettings.cacLoaiViTri;
		nhuCauAddVm.cacLoaiHuong = appSettings.cacLoaiHuong;
		nhuCauAddVm.cacNguonBDS = appSettings.cacNguonBDS;
		nhuCauAddVm.cacDuAn = appSettings.cacDuAn;
		
		nhuCauAddVm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		nhuCauAddVm.cacLoaiHau = appSettings.cacLoaiHau;
		nhuCauAddVm.cacLoaiBDS = appSettings.cacLoaiBDS;
		nhuCauAddVm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;

		nhuCauAddVm.bdsId = $stateParams.bdsId;
		nhuCauAddVm.model = {};
		nhuCauAddVm.model.$id = nhuCauAddVm.bdsId;
		$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		$scope.numberRegx = /^\d+$/;
        $scope.currencyRegx = /^\$\d/;
		$scope.emailRegx = /^[^!'"\/ ]+$/;
		nhuCauAddVm.showInvalid = true;
		
		nhuCauAddVm.activeTab='thongTin';
		nhuCauAddVm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				url: './app/nhuCau/nhuCau-addNew/nhuCau-addNew.tpl.html'
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
			media: {
				title: 'Media'
			},
		};

		//Functions
		nhuCauAddVm.loadTab = function(key){
			nhuCauAddVm.activeTab = key;
            $state.go('bds.' + key, { bdsId: nhuCauAddVm.bdsId });
		};

		nhuCauAddVm.save = function(){
			appUtils.showLoading();
			bdsService.update(nhuCauAddVm.model).then(function(res){
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

		nhuCauAddVm.changeCity = function(){
			var districts = appSettings.quanHuyen[nhuCauAddVm.model.thanhPho];
			nhuCauAddVm.districts = districts;
		};
		
		nhuCauAddVm.changeDistrict = function () {
			var wards = appSettings.phuongXa[nhuCauAddVm.model.quanHuyen];
			nhuCauAddVm.wards = wards;
		};

		//Load Data
		function loadBDSDetails() {
			appUtils.showLoading();
			bdsService.getLinkToCategory(nhuCauAddVm.model.$id).$loaded().then(function (bdsCateResult) {
				if (bdsCateResult && !bdsCateResult.isDeleted && bdsCateResult.danhMucId !== '-1') {
					bdsService.get(bdsCateResult.danhMucId, nhuCauAddVm.model.$id).$loaded().then(function (result) {
						if (result) {
							nhuCauAddVm.model = result;
							var districts = appSettings.quanHuyen[nhuCauAddVm.model.thanhPho];
							nhuCauAddVm.districts = districts;
							var wards = appSettings.phuongXa[nhuCauAddVm.model.quanHuyen];
							nhuCauAddVm.wards = wards;
						}else{
                            toaster.pop('error', 'Error', "Cann't load data!");
						}
						appUtils.hideLoading();
					});
				} else {
					appUtils.hideLoading();
					$state.go('bds.list');
				}
			});
		}

		loadBDSDetails();
	}

})();
