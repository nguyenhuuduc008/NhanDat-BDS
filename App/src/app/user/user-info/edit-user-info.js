(function(){
	'use strict';

	angular.module("app.user")
	.controller("editUserInfoCtrl" , editUserInfoCtrl);
	/** @ngInject **/
	function editUserInfoCtrl($rootScope, $scope, $state, $stateParams, $ngBootbox, $window, userService, authService,appUtils, toaster){
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        if($rootScope.reProcessSideBar){
            $rootScope.reProcessSideBar = false;
        }

		var infoEditVm = this; // jshint ignore:line		
		infoEditVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        infoEditVm.cities = [];
		infoEditVm.districts = [];       

		infoEditVm.existedPhone=false;
		infoEditVm.showInvalid = false;
		$scope.phoneRegx=/^(0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.A-Za-z ]*$/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		infoEditVm.user = {
			name: '',
			phone: '',
			city: 'notSelect',
			district: 'notSelect',
			ward: 'notSelect',
			address: '',
		};
		if(!!$stateParams.id)
			infoEditVm.user.phone = $stateParams.id;
		else
			$state.go('user.infoList');

		//Load details
		userService.getExitedPhone(infoEditVm.user.phone).then(function(res) {
			delete res.data.$$conf;
			delete res.data.$id;
			delete res.data.$priority;
			delete res.data.$resolved;

			infoEditVm.user = res.data;
			var phuongXa = _.cloneDeep(infoEditVm.user.ward);
			if (infoEditVm.user.city)
				infoEditVm.changeCity(infoEditVm.user.district);
			if (infoEditVm.user.district)
				infoEditVm.changeDistrict(phuongXa);
		});

		_.forEach(infoEditVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            infoEditVm.cities.push({
                $id: key,
                text: item.text
            });
        });

		//Functions
		infoEditVm.edit = function (form) {
			appUtils.showLoading();
			infoEditVm.showInvalid = true;
			console.log('form',form);
			if (form.$invalid) {
				appUtils.hideLoading();
				return;
			}
			infoEditVm.user.phone = $.trim(infoEditVm.user.phone) === '' ? ' ' : infoEditVm.user.phone;
			infoEditVm.user.timestampCreated = Date.now();
			infoEditVm.user.timestampModified = Date.now();
			console.log('USE THOGN TIN', infoEditVm.user);
			userService.setPhone(infoEditVm.user).then(function (res) {
				//debugger;								
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg);
					return;
				}
				toaster.success('Thành công', "Sửa Thông Tin Người Dùng Thành Công.");
				appUtils.hideLoading();

				$state.go('user.infoList');
			}, function (res) {
				$ngBootbox.alert(res.errorMsg);
				appUtils.hideLoading();
				return;
			});
		};

		infoEditVm.cancel = function(form){
			$window.history.back();
		};
		
		infoEditVm.changeCity = function (quanHuyen, phuongXa) {		
            infoEditVm.wards = [];
            infoEditVm.districts = [];
            infoEditVm.user.ward = "notSelect";
            infoEditVm.user.district = "notSelect";
            if (!!quanHuyen)
                infoEditVm.user.district = quanHuyen;
            if (!!phuongXa)
                infoEditVm.user.ward = phuongXa;
            if (infoEditVm.user.thanhPho === "notSelect") {
                return;
            }
            infoEditVm.districts = [];
            _.forEach(infoEditVm.cacLoaiHanhChinh.capHuyen[infoEditVm.user.city], function (item, key) {
                infoEditVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
		};

		infoEditVm.changeDistrict = function (phuongXa) {		
			infoEditVm.ward = [];
            infoEditVm.user.ward = "notSelect";
            if (infoEditVm.user.district === "notSelect") {
                return;
            }
            infoEditVm.wards = [];
            _.forEach(infoEditVm.cacLoaiHanhChinh.capXa[infoEditVm.user.city][infoEditVm.user.district], function (item, key) {
                infoEditVm.wards.push({
                    $id: key,
                    text: item.text
                });
            });
            if (!!phuongXa)
                infoEditVm.user.ward = phuongXa;
		};
	}
})();
