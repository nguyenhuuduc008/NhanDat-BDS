(function () {
	'use strict';

	angular.module("app.nhuCau")
		.controller("ban_choThueEditCtr", ban_choThueEditCtr);
	/** @ngInject */
	function ban_choThueEditCtr($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, authService, toaster,bdsService,nhuCauService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$rootScope.settings.layout.pageSidebarClosed = true;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var currentUser=$rootScope.storage.currentUser;
		console.log('currentUser');
		console.log(currentUser);
		var appSettings = $rootScope.storage.appSettings;
		// data chose
		vm.cacLoaiNhuCau=appSettings.cacLoaiNhuCau;
		console.log('vm.cacLoaiNhuCau');
		console.log(vm.cacLoaiNhuCau);
		
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
		//load data from params
		vm.id=$stateParams.id;
		vm.bdsId=$stateParams.bdsId;
		vm.activeTab=$stateParams.activeTab;
		vm.loaiNhuCauId=$stateParams.loaiNhuCauId;
		
		
		console.log('bdsService');
		console.log(bdsService);
		
		vm.model = {};
		vm.model.$id = vm.bdsId;
		vm.showInvalid = true;
		vm.tabs = {
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
		console.log('vm.tabs');
		console.log(vm.tabs);
		//
		//Functions
		vm.loadTab = function(key){
			vm.activeTab = key;
            $state.go('nhuCau' + key, { bdsId: vm.bdsId });
		};
		vm.changeCity = function () {
			var districts = appSettings.quanHuyen[vm.model.thanhPho];
			vm.districts = districts;
		};

		vm.changeDistrict = function () {
			var wards = appSettings.phuongXa[vm.model.quanHuyen];
			vm.wards = wards;
		};
		//function
		vm.save = function(form){
			appUtils.showLoading();
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
					bdsService.update(vm.model).then(function(res){
						if(!res.result){				
							$ngBootbox.alert(res.errorMsg.message);
							return;
						}
						//update thanh cong, up date trong nhu cau
						nhuCauService.getOnceNhuCau(vm.loaiNhuCauId,vm.id).$loaded().then(function(res){
							res.noiDung=fullAddress;
							res.$save().then(function () {
								appUtils.hideLoading();
								toaster.pop('success','Success', "Save success!");
							}).catch(function (error) {
								appUtils.hideLoading();
								$ngBootbox.alert(res.errorMsg.message);
							});
						});
	
					}, function(res){
						$ngBootbox.alert(res.errorMsg.message);
						appUtils.hideLoading();
						return;
					});
				}
			}, onFail);
			
		};

		//Load Data
		function loadBDSDetails() {
			appUtils.showLoading();
			bdsService.getLinkToCategory(vm.model.$id).$loaded().then(function (bdsCateResult) {
				if (bdsCateResult && !bdsCateResult.isDeleted && bdsCateResult.danhMucId !== '-1') {
					bdsService.get(bdsCateResult.danhMucId, vm.model.$id).$loaded().then(function (result) {
						if (result) {
							vm.model = result;
							var districts = appSettings.quanHuyen[vm.model.thanhPho];
							vm.districts = districts;
							var wards = appSettings.phuongXa[vm.model.quanHuyen];
							vm.wards = wards;
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

