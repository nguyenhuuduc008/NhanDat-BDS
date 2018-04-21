(function(){
	'use strict';

	angular.module("app.user")
	.controller("addUserCtrl" , addUserCtrl);
	/** @ngInject **/
	function addUserCtrl($rootScope, $scope, $state, $stateParams, $ngBootbox, userService, authService, currentAuth,appUtils, toaster, nhuCauService, bdsService){
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        if($rootScope.reProcessSideBar){
            $rootScope.reProcessSideBar = false;
        }

		var userAddVm = this; // jshint ignore:line		
		userAddVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        userAddVm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;
        userAddVm.cities = [];
		userAddVm.districts = [];       
		userAddVm.linked = {}; 
		userAddVm.linked.pLinkedKey = $stateParams.linkedId;
		userAddVm.linked.loaiId = $stateParams.loaiId;
		var duplicate = null;

		userAddVm.existedPhone=false;
		userAddVm.showInvalid = false;
		$scope.emailRegx = /^[^!'"\/ ]+$/;
		$scope.phoneRegx=/^(0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.A-Za-z ]*$/;
		$scope.passwordRegx =/^(?=.*[0-9]+.*)(?=.*[a-zA-Z]+.*)[0-9a-zA-Z]{6,12}$/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		userAddVm.states = appUtils.getAllState();
		userAddVm.user = {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			userRoles: '',
			photoURL : '',
			state: '',
			city: '',
			address: '',
			zipCode:'',
			isAuthorized: true,
			isDeleted: false,
			timestampCreated: '',
			timestampModified: '',
			password : '',
			confirmPassword : ''
		};
		userAddVm.EnalblePhoneForm = function (form) {
			/* jshint ignore:start */

			userAddVm.existedPhone=false;
			/* jshint ignore:end */
		};

		_.forEach(userAddVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            userAddVm.cities.push({
                $id: key,
                text: item.text
            });
        });

		//Functions
		userAddVm.create = function(form){
			appUtils.showLoading();
			userAddVm.showInvalid = true;
			if(form.$invalid){
				appUtils.hideLoading();
				return;
			}	
			// check password
			var pvalid = $scope.passwordRegx.test(userAddVm.user.password);
			 if(!pvalid){
			 	$ngBootbox.alert('Mật khẩu phải dài từ 6-12 ký tự và bao gồm ít nhất một chữ cái và một số. Mật khẩu phân biệt chữ hoa chữ thường.');
				appUtils.hideLoading();
				return;		
			}
			userAddVm.user.phoneNumber = $.trim(userAddVm.Phone) === '' ? ' ' : userAddVm.Phone;
				//check phone existed
				userService.getExitedPhone(userAddVm.user.phoneNumber).then(function(resdata){
					var data = resdata.data;					
					if(data.phone){// phone đã tồn tại
						userAddVm.existedPhone=true;
						appUtils.hideLoading();
					} else {
						var onSuccess = function(res){							
							if(!res || !res.result){
								appUtils.hideLoading();
								$ngBootbox.alert(res.errorMsg);
								return;	
							}
							//Add more info of user in firebase
							delete userAddVm.user.password;
							delete userAddVm.user.confirmPassword;
			
							userService.createUser(userAddVm.user,res.uid).then(function(res){
								//debugger;								
								if(!res.result){				
									$ngBootbox.alert(res.errorMsg);
									return;
								}
								toaster.pop('success','Thành công', "Tài khoản người dùng đã được tạo.");
								appUtils.hideLoading();			
								//Delete users List storage
								//delete $rootScope.storage.usersList;
								//create succces go to edit view
								//$rootScope.reProcessSideBar = true;
								if(!!userAddVm.linked.pLinkedKey && !!userAddVm.linked.loaiId) {
									userAddVm.linked.phone = userAddVm.user.phoneNumber;
									userAddVm.linked.userKey = res.data;
									userAddVm.linked.name = userAddVm.user.lastName + ' ' + userAddVm.user.firstName;
									userAddVm.linked.timeCreated = Date.now();
									userAddVm.linked.nhuCauKey = $stateParams.linkedId;
									userAddVm.linked.khoBDSKey = $stateParams.khoId;
									delete userAddVm.linked.pLinkedKey;
									var linkedItem = {
										activeTab: 'lienKetUsers'
									};
									if (!!duplicate) {
										nhuCauService.removeTabNhuCau('lienKetUser', userAddVm.linked.nhuCauKey, duplicate.linkedKey);
									}
									nhuCauService.updateTabNhuCau('lienKetUser', userAddVm.linked, userAddVm.linked.nhuCauKey, true).then(function(linkRs) {
										$state.go('lienKetUsersNhuCau', {khoId: $stateParams.khoId, loaiId: $stateParams.loaiId, nhuCauId: $stateParams.linkedId, item: linkedItem});	
									});
								}
								else if (!!userAddVm.linked.pLinkedKey) {
									userAddVm.linked.phone = userAddVm.user.phoneNumber;
									userAddVm.linked.userKey = res.data;
									userAddVm.linked.name = userAddVm.user.lastName + ' ' + userAddVm.user.firstName;
									userAddVm.linked.timeCreated = Date.now();
									userAddVm.linked.bdsKey = $stateParams.linkedId;
									userAddVm.linked.khoBDSKey = $stateParams.khoId;
									delete userAddVm.linked.pLinkedKey;
									delete userAddVm.linked.loaiId;

									if (!!duplicate) {
										bdsService.removeTab(userAddVm.linked.bdsKey, 'lienKetUser', duplicate.linkedKey);
									}
									bdsService.updateTab(userAddVm.linked.bdsKey, userAddVm.linked, 'lienKetUser', true).then(function(linkRs) {
										$state.go('bds.lienKetUsers', {khoId: $stateParams.khoId, bdsId: $stateParams.linkedId});	
									});
								}
								else {
									$state.go('user.details', { id: res.data });
								}
							}, function(res){
								$ngBootbox.alert(res.errorMsg);
								appUtils.hideLoading();
								return;
							});
						};//on Success
			
						var onFail = function(res){
							$ngBootbox.alert(res.errorMsg);
							appUtils.hideLoading();
							return;
						};
								
						userService.checkUserIsDeleted(userAddVm.user.email).then(function(res){
							if(res === null){
								// isPhoneExistReq.then(function(res){
								// 	if(res){	
								// 		return;
								// 	}
									//Create auth user in firebase
									authService.createUserWithEmail(userAddVm.user).then(onSuccess, onFail);
								// });	
							}else{
								appUtils.hideLoading();
								$ngBootbox.confirm('Người dùng đã được lưu trữ. Bạn có muốn khôi phục lại người dùng đó ngay bây giờ?').then(function(){
									userService.restoreUser(res.$id).then(function(resRestore){
										if(resRestore.result){
											userService.get(res.$id).$loaded().then(function(userData){
												$state.go('user.details', {id: res.$id});
											});
										}
									});
								});
							}
						});
					}
				});			
		};

		userAddVm.checkDupLinked = function (form) {
			if (!!userAddVm.linked.pLinkedKey) {
				if(!!userAddVm.linked.loaiId) {
					nhuCauService.getTabNhuCau('lienKetUser', userAddVm.linked.pLinkedKey).then(function (result) {
						_.forEach(result, function (item, key) {
							if(item.loaiLienKetUser === userAddVm.linked.loaiLienKetUser) {
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
											userAddVm.linked.loaiLienKetUser = '';
											duplicate = {};
											$scope.$apply();
											appUtils.hideLoading();
										}
									},
									success: {
										label: "Chấp Nhận",
										className: "btn-success",
										callback: function () {
											userAddVm.create(form);
										}
									}
								}
							});
						}
						else {
							userAddVm.create(form);
						}
					});
				}
				else {
					bdsService.getTab(userAddVm.linked.pLinkedKey, 'lienKetUser').then(function (result) {
						_.forEach(result, function (item, key) {
							if(item.loaiLienKetUser === userAddVm.linked.loaiLienKetUser) {
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
											userAddVm.linked.loaiLienKetUser = '';
											duplicate = {};
											$scope.$apply();
											appUtils.hideLoading();
										}
									},
									success: {
										label: "Chấp Nhận",
										className: "btn-success",
										callback: function () {
											userAddVm.create(form);
										}
									}
								}
							});
						}
						else {
							userAddVm.create(form);
						}
					});
				}
			}
			else {
				userAddVm.create(form);
			}
		};

		userAddVm.cancel = function(form){
			$state.go('user.list');
		};
		
		userAddVm.changeCity = function(){
			var districts;			
			userAddVm.districts = [];
            _.forEach(userAddVm.cacLoaiHanhChinh.capHuyen, function (item, key) {                     
                if(key === userAddVm.user.city) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                userAddVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });     
		};
		
		userAddVm.changeDistrict = function () {			
			var wards;
			userAddVm.wards = [];
			_.forEach(userAddVm.cacLoaiHanhChinh.capXa, function(item, key){
				if(key === userAddVm.user.district){
					wards = item;
				}
			});
			_.forEach(wards, function(item, key){
				userAddVm.wards.push({
					$id: key,
					text: item.text
				});
			});
		};
	}
})();
