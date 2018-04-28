(function(){
	'use strict';

	angular.module("app.user")
	.controller("addUserInfoCtrl" , addUserInfoCtrl);
	/** @ngInject **/
	function addUserInfoCtrl($rootScope, $scope, $state, $stateParams, $ngBootbox, $window, userService, authService, currentAuth,appUtils, toaster, nhuCauService, bdsService){
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        if($rootScope.reProcessSideBar){
            $rootScope.reProcessSideBar = false;
        }

		var infoAddVm = this; // jshint ignore:line		
		infoAddVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        infoAddVm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;
        infoAddVm.cities = [];
		infoAddVm.districts = [];       
		infoAddVm.linked = {}; 
		infoAddVm.linked.pLinkedKey = $stateParams.linkedId;
		infoAddVm.linked.loaiId = $stateParams.loaiId;
		var duplicate = null;

		infoAddVm.existedPhone=false;
		infoAddVm.showInvalid = false;
		$scope.phoneRegx=/^(0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.A-Za-z ]*$/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		infoAddVm.user = {
			name: '',
			phone: '',
			city: 'notSelect',
			district: 'notSelect',
			ward: 'notSelect',
			address: '',
		};
		if(!!$stateParams.phone)
			infoAddVm.user.phone = $stateParams.phone;

		_.forEach(infoAddVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            infoAddVm.cities.push({
                $id: key,
                text: item.text
            });
        });

		//Functions
		infoAddVm.create = function (form) {
			appUtils.showLoading();
			infoAddVm.showInvalid = true;
			if (form.$invalid) {
				appUtils.hideLoading();
				return;
			}
			infoAddVm.user.phone = $.trim(infoAddVm.user.phone) === '' ? ' ' : infoAddVm.user.phone;
			infoAddVm.user.timestampCreated = Date.now();
			infoAddVm.user.timestampModified = Date.now();
			console.log('USE THOGN TIN', infoAddVm.user);
			userService.setPhone(infoAddVm.user).then(function (res) {
				//debugger;								
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg);
					return;
				}
				toaster.success('Thành công', "Thông Tin Người Dùng đã được tạo.");
				appUtils.hideLoading();

				if (!!infoAddVm.linked.pLinkedKey && !!infoAddVm.linked.loaiId) {
					infoAddVm.linked.phone = infoAddVm.user.phone;
					infoAddVm.linked.userKey = res.data;
					infoAddVm.linked.name = infoAddVm.user.name;
					infoAddVm.linked.timeCreated = Date.now();
					infoAddVm.linked.nhuCauKey = $stateParams.linkedId;
					infoAddVm.linked.khoBDSKey = $stateParams.khoId;
					delete infoAddVm.linked.pLinkedKey;
					var linkedItem = {
						activeTab: 'lienKetUsers'
					};
					if (!!duplicate) {
						nhuCauService.removeTabNhuCau('lienKetUser', infoAddVm.linked.nhuCauKey, duplicate.linkedKey);
					}
					nhuCauService.updateTabNhuCau('lienKetUser', infoAddVm.linked, infoAddVm.linked.nhuCauKey, true).then(function (linkRs) {
						$state.go('lienKetUsersNhuCau', { khoId: $stateParams.khoId, loaiId: $stateParams.loaiId, nhuCauId: $stateParams.linkedId, item: linkedItem });
					});
				}
				else if (!!infoAddVm.linked.pLinkedKey) {
					infoAddVm.linked.phone = infoAddVm.user.phone;
					infoAddVm.linked.userKey = res.data;
					infoAddVm.linked.name = infoAddVm.user.name;
					infoAddVm.linked.timeCreated = Date.now();
					infoAddVm.linked.bdsKey = $stateParams.linkedId;
					infoAddVm.linked.khoBDSKey = $stateParams.khoId;
					delete infoAddVm.linked.pLinkedKey;
					delete infoAddVm.linked.loaiId;

					if (!!duplicate) {
						bdsService.removeTab(infoAddVm.linked.bdsKey, 'lienKetUser', duplicate.linkedKey);
					}
					bdsService.updateTab(infoAddVm.linked.bdsKey, infoAddVm.linked, 'lienKetUser', true).then(function (linkRs) {
						$state.go('bds.lienKetUsers', { khoId: $stateParams.khoId, bdsId: $stateParams.linkedId });
					});
				}
				else {
					$state.go('user.details', { id: res.data });
				}
			}, function (res) {
				$ngBootbox.alert(res.errorMsg);
				appUtils.hideLoading();
				return;
			});
		};

		infoAddVm.checkDupLinked = function (form) {
			if (!!infoAddVm.linked.pLinkedKey) {
				if(!!infoAddVm.linked.loaiId) {
					nhuCauService.getTabNhuCau('lienKetUser', infoAddVm.linked.pLinkedKey).then(function (result) {
						_.forEach(result, function (item, key) {
							if(item.loaiLienKetUser === infoAddVm.linked.loaiLienKetUser) {
								item.linkedKey = key;
								duplicate = item;
							}
						});
						console.log('DUPLICA OBJ', duplicate);
						if (!!duplicate) {
							$ngBootbox.customDialog({
								message: 'Loại Liên Kết Đã Tồn Tại, Tiếp Tục Sẽ Thay Thế Liên Kết Cũ?',
								buttons: {
									danger: {
										label: "Huỷ",
										className: "btn-default",
										callback: function () {
											console.log('cancel');
											infoAddVm.linked.loaiLienKetUser = '';
											duplicate = {};
											$scope.$apply();
											appUtils.hideLoading();
										}
									},
									success: {
										label: "Chấp Nhận",
										className: "btn-success",
										callback: function () {
											infoAddVm.create(form);
										}
									}
								}
							});
						}
						else {
							infoAddVm.create(form);
						}
					});
				}
				else {
					bdsService.getTab(infoAddVm.linked.pLinkedKey, 'lienKetUser').then(function (result) {
						_.forEach(result, function (item, key) {
							if(item.loaiLienKetUser === infoAddVm.linked.loaiLienKetUser) {
								item.linkedKey = key;
								duplicate = item;
							}
						});
						console.log('DUPLICA OBJ`111111', result);
						if (!!duplicate) {
							$ngBootbox.customDialog({
								message: 'Loại Liên Kết Đã Tồn Tại, Tiếp Tục Sẽ Thay Thế Liên Kết Cũ?',
								buttons: {
									danger: {
										label: "Huỷ",
										className: "btn-default",
										callback: function () {
											console.log('cancel');
											infoAddVm.linked.loaiLienKetUser = '';
											duplicate = {};
											$scope.$apply();
											appUtils.hideLoading();
										}
									},
									success: {
										label: "Chấp Nhận",
										className: "btn-success",
										callback: function () {
											infoAddVm.create(form);
										}
									}
								}
							});
						}
						else {
							infoAddVm.create(form);
						}
					});
				}
			}
			else {
				infoAddVm.create(form);
			}
		};

		infoAddVm.cancel = function(form){
			$window.history.back();
		};
		
		infoAddVm.changeCity = function (quanHuyen, phuongXa) {		
            infoAddVm.wards = [];
            infoAddVm.districts = [];
            infoAddVm.user.ward = "notSelect";
            infoAddVm.user.district = "notSelect";
            if (!!quanHuyen)
                infoAddVm.user.district = quanHuyen;
            if (!!phuongXa)
                infoAddVm.user.ward = phuongXa;
            if (infoAddVm.user.thanhPho === "notSelect") {
                return;
            }
            infoAddVm.districts = [];
            _.forEach(infoAddVm.cacLoaiHanhChinh.capHuyen[infoAddVm.user.city], function (item, key) {
                infoAddVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
		};

		infoAddVm.changeDistrict = function (phuongXa) {		
			infoAddVm.ward = [];
            infoAddVm.user.ward = "notSelect";
            if (infoAddVm.user.district === "notSelect") {
                return;
            }
            infoAddVm.wards = [];
            _.forEach(infoAddVm.cacLoaiHanhChinh.capXa[infoAddVm.user.city][infoAddVm.user.district], function (item, key) {
                infoAddVm.wards.push({
                    $id: key,
                    text: item.text
                });
            });
            if (!!phuongXa)
                infoAddVm.user.ward = phuongXa;
		};
	}
})();
