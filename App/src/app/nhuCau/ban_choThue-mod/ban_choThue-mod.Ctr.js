(function () {
	'use strict';

	angular.module("app.nhuCau")
		.controller("ban_choThueModCtr", ban_choThueModCtr);
	/** @ngInject */
	function ban_choThueModCtr($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$rootScope.settings.layout.pageSidebarClosed = true;
		var ban_choThueModVm = this; // jshint ignore:line
		ban_choThueModVm.currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
		/*ban_choThueModVm.cities = appSettings.thanhPho;
		ban_choThueModVm.cacLoaiDuong = appSettings.cacLoaiDuong;
		ban_choThueModVm.cacLoaiViTri = appSettings.cacLoaiViTri;
		ban_choThueModVm.cacLoaiHuong = appSettings.cacLoaiHuong;
		ban_choThueModVm.cacNguonBDS = appSettings.cacNguonBDS;
		ban_choThueModVm.cacDuAn = appSettings.cacDuAn;
		
		ban_choThueModVm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		ban_choThueModVm.cacLoaiHau = appSettings.cacLoaiHau;
		ban_choThueModVm.cacLoaiBDS = appSettings.cacLoaiBDS;
		ban_choThueModVm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;
		*/
		ban_choThueModVm.bdsId = $stateParams.bdsId;
		ban_choThueModVm.activeTab=$stateParams.activeTab;
		console.log('ban_choThueModVm.bdsId ');
		console.log(ban_choThueModVm.bdsId);
		ban_choThueModVm.model = {};
		ban_choThueModVm.model.$id = ban_choThueModVm.bdsId;
		/*$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		$scope.numberRegx = /^\d+$/;
        $scope.currencyRegx = /^\$\d/;
		$scope.emailRegx = /^[^!'"\/ ]+$/;*/
		ban_choThueModVm.showInvalid = true;
		ban_choThueModVm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				url: './app/nhuCau/ban_choThue-mod/_tab-thong-tin.tpl.html'
			},
			viTriDiaLy: {
				title: 'Vị Trí Địa Lý',
				url: './app/nhuCau/ban_choThue-mod/_tab-vi-tri-dia-ly.tpl.html'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
			lichSuMaketing: {
				title: 'Lịch sử Marketing'
			},
			hienTrangNhaDat: {
				title: 'Hiện trạng nhà đất',
				url: './app/nhuCau/ban_choThue-mod/_tab-hien-trang-nha-dat.tpl.html'
			},
			phongThuy: {
				title: 'Phong thủy',
				url: './app/nhuCau/ban_choThue-mod/_tab-phong-thuy.tpl.html'
			},
			tienIch: {
				title: 'Tiện ích',
				url: './app/nhuCau/ban_choThue-mod/_tab-tien-ich.tpl.html'
			},
			capDo: {
				title: 'Cấp Độ',
				url: './app/nhuCau/ban_choThue-mod/_tab-cap-do.tpl.html'
			},
			tinDang:{
				title:'Tin Đăng',
				url: './app/nhuCau/ban_choThue-mod/_tab-tinDang.tpl.html'
			},
			lichSuGia: {
				title: 'Lịch Sử Giá ',
				url: './app/nhuCau/ban_choThue-mod/_tab-lsGia.tpl.html'
			},
			chonNguon: {
				title: 'Chọn Nguồn ',
				url: './app/nhuCau/ban_choThue-mod/_tab-chonNguon.tpl.html'
			},
			loaiBDS: {
				title: 'Loại BĐS ',
				url: './app/nhuCau/ban_choThue-mod/_tab-loaiBDS.tpl.html'
			},
			mucDich: {
				title: 'Mục Đích',
				url: './app/nhuCau/ban_choThue-mod/_tab-mucDich.tpl.html'
			},
			chonHuong: {
				title: 'Hướng',
				url: './app/nhuCau/ban_choThue-mod/_tab-huong.tpl.html'
			},
			loaiNhuCau: {
				title: 'Loại Nhu Cầu',
				url: './app/nhuCau/ban_choThue-mod/_tab-loaiNhuCau.tpl.html'
			}
		};
		console.log('ban_choThueModVm.tabs');
		console.log(ban_choThueModVm.tabs);
		//

		//Functions
		ban_choThueModVm.loadTab = function(key){
			ban_choThueModVm.activeTab = key;
            $state.go('nhuCau' + key, { bdsId: ban_choThueModVm.bdsId });
		};
		//edit
		function init(){
			if(ban_choThueModVm.bdsId){
				//load data
			}
		}
		init();
	}

})();
