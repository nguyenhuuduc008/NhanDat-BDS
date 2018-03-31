(function(){
	'use strict';

	angular.module("app.user")
	.controller("addUserCtrl" , addUserCtrl);
	/** @ngInject **/
	function addUserCtrl($rootScope, $scope, $state,$ngBootbox, userService, authService, currentAuth,appUtils, toaster){
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        if($rootScope.reProcessSideBar){
            $rootScope.reProcessSideBar = false;
        }

		var userAddVm = this; // jshint ignore:line		
		userAddVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        userAddVm.cities = [];
        userAddVm.districts = [];        

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
								$state.go('user.details', {id: res.data});		
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
