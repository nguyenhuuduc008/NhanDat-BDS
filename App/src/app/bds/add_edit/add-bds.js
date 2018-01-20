(function(){
	'use strict';

	angular.module("app.bds")
	.controller("addBdsCtrl" , addBdsCtrl);
	/** @ngInject **/
	function addBdsCtrl($rootScope, $scope, $state,$ngBootbox, bdsService, authService, currentAuth,appUtils, toaster){
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        if($rootScope.reProcessSideBar){
            $rootScope.reProcessSideBar = false;
        }
		var currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;

		var vm = this; // jshint ignore:line
		vm.showInvalid = false;
		vm.numberRegx = /^\d+$/;
		
		vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		vm.cacLoaiHau = appSettings.cacLoaiHau;
		vm.cacLoaiBDS = appSettings.cacLoaiBDS;
        
        vm.model = {
            danhMuc: 'bds-khosocap',
            soNha: '123',
            tenDuong: 'Le Loi',
            xaPhuong: '4',
			quanHuyen: 'Go Vap',
			thanhPho: 'Ho Chi Minh',
			loaiDuong: 'Duong Nhua',
			loaiViTri: 'Trung tam Tp',
			ngang: '5',
			dai: '12',
			hau: '0',
			dienTichKhuonVien: '20 m',
			dienTichSuDung: '60 m',
			dienTichXayDung: '60 m',
			tongGia: '2.000.000.000',
			huong: 'Dong Nam',
			donGia: '1.600.000.000',
			phongKhach: '1',
			phongNgu: '2',
			phongAn: '1',
			nhaBep: '1',
			wc: '2',
			sanTruoc: 'Co',
			sanSau: 'Co',
			sanThuong: 'Co',
			giengTroi: 'Co',
			tangLung: 'Co',
			ham: '1',
			hoBoi: '1',
			gym: '1',
			ttThuongMai: '1',
			tang: '2',
			cvMoiGioi: 'cvMoiGioi',
			dienThoai: '01234314008',
			email: 'bds@gmail.com',
			diaChiKhac: '123 dia chi khac',
			nguon: 'Internet',
			soDangKy: 'soDangKy001',
			loaiBDS: '0',
			tyLeMG: '12',
			phiMG: '10.000.000',
			dienGiai: 'Dien giai',
			phapLy: 'Phap ly',
			namXayDung: '2015',
			duAn: 'duAnABC01'
        };

		//Functions
		vm.create = function(form){
			appUtils.showLoading();
			// vm.showInvalid = true;
			if(form.$invalid){
				return;
			}

			vm.model.createdBy = currentUser.email.trim();
			vm.model.uid = currentUser.$id;
            bdsService.create(vm.model.danhMuc.trim(), vm.model).then(function(res){
                if(!res.result){				
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
				
                appUtils.hideLoading();
                toaster.pop('success','Success', "Created success!");
                vm.model = {};
				$state.go('bds.thongTin', { bdsId: res.key });
            }, function(res){
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            });
			
        };

		vm.cancel = function(form){
			$state.go('abs.list');
		};
	}
})();
