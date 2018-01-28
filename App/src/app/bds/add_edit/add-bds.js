(function () {
	'use strict';

	angular.module("app.bds")
		.controller("addBdsCtrl", addBdsCtrl);
	/** @ngInject **/
	function addBdsCtrl($rootScope, $scope, $state, $ngBootbox, bdsService, authService, currentAuth, appUtils, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		if ($rootScope.reProcessSideBar) {
			$rootScope.reProcessSideBar = false;
		}
		var currentUser = $rootScope.storage.currentUser;
		var vm = this; // jshint ignore:line
		var appSettings = $rootScope.storage.appSettings;
		vm.cities = appSettings.thanhPho;
		vm.cacLoaiDuong = appSettings.cacLoaiDuong;
		vm.cacLoaiViTri = appSettings.cacLoaiViTri;
		vm.cacLoaiHuong = appSettings.cacLoaiHuong;
		vm.cacNguonBDS = appSettings.cacNguonBDS;
		vm.cacDuAn = appSettings.cacDuAn;

		vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		vm.cacLoaiHau = appSettings.cacLoaiHau;
		vm.cacLoaiBDS = appSettings.cacLoaiBDS;
		vm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;

		vm.showInvalid = false;
		$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		$scope.numberRegx = /^\d+$/;
		$scope.currencyRegx = /^\$\d/;
		$scope.emailRegx = /^[^!'"\/ ]+$/;

		vm.activeTab = 'thongTin';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			}
		};

		vm.model = {
			// danhMuc: '',
			// soNha: '',
			// tenDuong: '',
			// xaPhuong: '',
			// quanHuyen: '',
			// thanhPho: '',
			// loaiDuong: '',
			// loaiViTri: '',
			// ngang: 0,
			// dai: 0,
			// hau: '',
			// dienTichKhuonVien: 0,
			// dienTichSuDung: 0,
			// dienTichXayDung: 0,
			// tongGia: '',
			// huong: '',
			// donGia: '',
			// phongKhach: '',
			// phongNgu: '',
			// phongAn: '',
			// nhaBep: '1',
			// wc: '',
			// sanTruoc: '',
			// sanSau: '',
			// sanThuong: '',
			// giengTroi: '',
			// tangLung: '',
			// ham: '',
			// hoBoi: '',
			// gym: '',
			// ttThuongMai: '',
			// tang: '',
			// cvMoiGioi: '',
			// dienThoai: '',
			// email: '',
			// diaChiKhac: '',
			// nguon: '',
			// soDangKy: '',
			// loaiBDS: '',
			// tyLeMG: '',
			// phiMG: '',
			// dienGiai: '',
			// phapLy: '',
			// namXayDung: '',
			// duAn: ''
		};

		//Functions
		vm.save = function (form) {
			appUtils.showLoading();
			// vm.showInvalid = true;
			if (form.$invalid) {
				return;
			}
			var onFail = function (res) {
				$ngBootbox.alert(res.errorMsg.message);
				appUtils.hideLoading();
				return;
			};
			vm.model.soNha = vm.model.soNha.trim();
			vm.model.tenDuong = vm.model.tenDuong.trim();
			var fullAddress = vm.model.soNha + ' ' + vm.model.tenDuong + ' ' + vm.model.thanhPho + ' ' + vm.model.quanHuyen + ' ' + vm.model.xaPhuong;
			bdsService.checkAddressExist(fullAddress).then(function (res) {
				if (res.data !== null && res.data.length >= 1) {
					appUtils.hideLoading();
					$ngBootbox.alert("This address already exists. Please enter another.");
					return false;
				}//Address exists.
				else {
					vm.model.createdBy = currentUser.email.trim();
					vm.model.uid = currentUser.$id;
					bdsService.create(vm.model.danhMuc.trim(), vm.model).then(function (res) {
						if (!res.result) {
							$ngBootbox.alert(res.errorMsg.message);
							return;
						}

						appUtils.hideLoading();
						toaster.pop('success', 'Success', "Created success!");
						vm.model = {};
						$state.go('bds.thongTin', { bdsId: res.key });
					}, function (res) {
						$ngBootbox.alert(res.errorMsg.message);
						appUtils.hideLoading();
						return;
					});
				}
			}, onFail);
		};

		vm.cancel = function (form) {
			$state.go('abs.list');
		};

		vm.changeCity = function () {
			var districts = appSettings.quanHuyen[vm.model.thanhPho];
			vm.districts = districts;
		};

		vm.changeDistrict = function () {
			var wards = appSettings.phuongXa[vm.model.quanHuyen];
			vm.wards = wards;
		};
	}
})();
