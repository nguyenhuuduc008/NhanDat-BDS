(function () {
	'use strict';

	angular.module("app.user")
		.controller("editUserCtrl", editUserCtrl);
	/** @ngInject */
	function editUserCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, userService, roleService, permissionService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var appSettings = $rootScope.storage.appSettings;
		if ($rootScope.reProcessSideBar) {
			$rootScope.reProcessSideBar = false;
		}
		var userDetailVm = this; // jshint ignore:line
		userDetailVm.currentUser = $rootScope.storage.currentUser;

		userDetailVm.cities = appSettings.thanhPho;
		userDetailVm.cacLoaiUser = appSettings.cacLoaiUser;
		userDetailVm.adminRole = true;
		userDetailVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
		userDetailVm.cities = [];
		userDetailVm.districts = [];
		var districts;
		// var adminRole = _.find(userDetailVm.currentUser.userRoles, function(o) { return o === "-KTlccaZaxPCGDaFPSc5"; });
		// userDetailVm.adminRole = adminRole;
		// console.log(adminRole);
		userDetailVm.existedPhone = false;
		userDetailVm.user = {};
		userDetailVm.user.$id = $stateParams.id;
		$scope.phoneRegx = /^(0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.A-Za-z ]*$/;
		$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		userDetailVm.showInvalid = true;
		var userPhone = '';
		userDetailVm.e_msges = {};
		userDetailVm.userRoles = [];
		// userDetailVm.states = appUtils.getAllState();
		var roles = [];

		roleService.items().$loaded().then(function (data) {
			roles = data;
		});

		_.forEach(userDetailVm.cacLoaiHanhChinh.capTinh, function (item, key) {
			userDetailVm.cities.push({
				$id: key,
				text: item.text
			});
		});

		//Load Data
		function loadUserDetails() {
			appUtils.showLoading();
			userService.get(userDetailVm.user.$id).$loaded().then(function (result) {
				if (result) {
					appUtils.hideLoading();
					setUser(result);
					return;
				}
			});
		}

		function loadRoles() {
			//Get UserRole Info
			userDetailVm.userRoles = [];
			var userRoles = userDetailVm.user.userRoles;
			if (userRoles !== null && userRoles !== undefined && userRoles.length > 0) {
				_.forEach(userRoles, function (roleId, key) {
					var role = _.find(roles, { $id: roleId });
					if (role) {
						var item = role;
						item.permissionstxt = '';
						permissionService.getPermissionByRole(item.$id).then(function (res) {
							var permissions = [];
							if (res.length > 0) {
								_.forEach(res, function (val, key) {
									permissions.push(val.name);
								});
								item.permissionstxt = angular.fromJson(permissions).join(', ');
							}
						});

						userDetailVm.userRoles.push(item);
					}
				});
			}
		}

		//Private Functions
		function checkPhoneExists(form) {
			/* jshint ignore:start */
			var deferred = $q.defer();
			var req = userService.checkPhoneExist(userDetailVm.Phone);
			req.then(function (res) {
				appUtils.hideLoading();
				if (res.data !== null && res.data.length >= 1) {
					if (userPhone != userDetailVm.Phone) {
						form.phonenumber.$setValidity('server', false);
						userDetailVm.e_msges['phonenumber'] = "Số điện thoại đã tồn tại. Vui lòng nhập số khác.";
						deferred.resolve({ result: true });
						return deferred.promise;
					}
				}//Phone exists.
				deferred.resolve({ result: false });
				return deferred.promise;
			}, function (res) {
				// show not found error
				form.phonenumber.$setValidity('server', false);
				userDetailVm.e_msges['phonenumber'] = "Số điện thoại đã tồn tại. Vui lòng nhập số khác.";
				deferred.resolve({ result: true });
			});
			/* jshint ignore:end */
			return deferred.promise;
		}

		function updateUser() {
			appUtils.showLoading();
			var req = userService.updateUser(userDetailVm.user);
			req.then(function (res) {
				if (!res.result) {
					appUtils.hideLoading();
					$ngBootbox.alert(res.errorMsg);
					return;
				}
				//Delete users List storage
				delete $rootScope.storage.usersList;
				appUtils.hideLoading();
				$scope.$apply(function () {
					toaster.pop('success', 'Thành công', "Tài khoản được cập nhật.");
				});
				userPhone = userDetailVm.user.phoneNumber;
				//Set new value for current user of local storage
				if (userDetailVm.currentUser.$id == userDetailVm.user.$id) {
					appUtils.transformObject(userDetailVm.currentUser, userDetailVm.user);
				}
			});
		}

		//Functions
		userDetailVm.saveEdit = function (form) {
			appUtils.showLoading();
			userDetailVm.existedPhone = false;
			userDetailVm.showInvalid = true;
			if (form.$invalid) {

				return;
			}
			userDetailVm.user.phoneNumber = $.trim(userDetailVm.Phone) === '' ? ' ' : userDetailVm.Phone;
			//Check user phone
			userService.getExitedPhone(userDetailVm.user.phoneNumber).then(function (res) {
				var data = res.data;
				if (data.phone) {//phone đã tồn tại

					if (data.userEmail == userDetailVm.user.email) {//phone tồn tại nhưng là của user cũ

						userService.setPhone({
							phone: userDetailVm.user.phoneNumber,
							userId: userDetailVm.user.$id,
							userEmail: userDetailVm.user.email,
							userName: userDetailVm.user.firstName + " " + userDetailVm.user.lastName
						}).then(function (res) {
							updateUser();
						});
					} else { //phone của user khác
						appUtils.hideLoading();
						userDetailVm.existedPhone = true;
					}
				} else {//chưa có sdt
					userService.setPhone({
						phone: userDetailVm.user.phoneNumber,
						userId: userDetailVm.user.$id,
						userEmail: userDetailVm.user.email,
						userName: userDetailVm.user.firstName + " " + userDetailVm.user.lastName
					}).then(function (res) {
						updateUser();
					});
				}
			}).catch(function (err) {
				$ngBootbox.alert('Lỗi xảy ra');
				return;
			});
		};

		userDetailVm.EnalblePhoneForm = function (form) {
			/* jshint ignore:start */

			userDetailVm.existedPhone = false;
			/* jshint ignore:end */
		};

		userDetailVm.changeCity = function (quanHuyen, phuongXa) {
			userDetailVm.wards = [];
			userDetailVm.districts = [];
			userDetailVm.user.ward = "notSelect";
			userDetailVm.user.district = "notSelect";
			if (!!quanHuyen)
				userDetailVm.user.district = quanHuyen;
			if (!!phuongXa)
				userDetailVm.user.ward = phuongXa;
			if (userDetailVm.user.thanhPho === "notSelect") {
				return;
			}
			userDetailVm.districts = [];
			_.forEach(userDetailVm.cacLoaiHanhChinh.capHuyen[userDetailVm.user.city], function (item, key) {
				userDetailVm.districts.push({
					$id: key,
					text: item.text
				});
			});
		};

		userDetailVm.changeDistrict = function (phuongXa) {
			userDetailVm.ward = [];
			userDetailVm.user.ward = "notSelect";
			if (userDetailVm.user.district === "notSelect") {
				return;
			}
			userDetailVm.wards = [];
            var capXa = !!userDetailVm.cacLoaiHanhChinh.capXa[userDetailVm.user.city] ? userDetailVm.cacLoaiHanhChinh.capXa[userDetailVm.user.city] : {};
			_.forEach(capXa[userDetailVm.user.district], function (item, key) {
				userDetailVm.wards.push({
					$id: key,
					text: item.text
				});
			});
			if (!!phuongXa)
				userDetailVm.user.ward = phuongXa;
		};

		function setUser(result) {
			userDetailVm.user = result;
			userDetailVm.dataLetterPic = userDetailVm.user.firstName.charAt(0).toUpperCase() + userDetailVm.user.lastName.charAt(0).toUpperCase(); //userDetailVm.user.email.charAt(0).toUpperCase();// Handle avatar    
			userPhone = userDetailVm.user.phoneNumber;
			userDetailVm.Phone = userDetailVm.user.phoneNumber;
			console.log('SUER DETAIL', result);

			var phuongXa = _.cloneDeep(userDetailVm.user.ward);
			if (userDetailVm.user.city)
				userDetailVm.changeCity(userDetailVm.user.district);
			if (userDetailVm.user.district)
				userDetailVm.changeDistrict(phuongXa);
			//Get UserRole Info
			loadRoles();
		}

		angular.element(document).ready(function () {
			$("#avatar-file").change(function () {
				appUtils.showLoading();
				var file = $(this)[0].files[0];
				if (file) {
					var metadata = {
						contentType: file.type
					};

					// Generate lowres and hires
					var _URL = window.URL || window.webkitURL;
					var img = new Image();
					img.src = _URL.createObjectURL(file);
					img.onload = function () {
						// Generate avatar img
						var maxWidth = 150;
						var quality = 1;
						var avatar = appUtils.getAvatar(img, maxWidth, quality, file.type);
						avatar.name = file.name;
						var path = 'Users/Avatar/' + userDetailVm.user.email;
						var uploadTask = userService.uploadAvatar(path, avatar.data, metadata);
						uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
							// Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
							var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						}, function (error) {
						}, function (data) {
							appUtils.hideLoading();
							// Upload completed successfully, now we can get the download URL
							var downloadURL = uploadTask.snapshot.downloadURL;
							userDetailVm.user.photoURL = downloadURL;
							userService.saveChangeAvatar(userDetailVm.user.$id, downloadURL);
							$('#avatar-file').val('');
							$('.fileinput').removeClass('fileinput-exists');
							$('.fileinput').addClass('fileinput-new');
							$timeout(angular.noop);
							//updateGeneralSetting();
						});
					};
				}
			});
		});
		var lstRolesDelete = [];
		userDetailVm.removeRole = function (index) {
			lstRolesDelete.push(userDetailVm.userRoles[index].name);
			userDetailVm.userRoles.splice(index, 1);
		};

		userDetailVm.loadData = function () {
			loadUserDetails();
		};

		userDetailVm.showPopupAddUserToRole = function () {
			var modalInstance = $uibModal.open({
				templateUrl: 'app/user/user_role/add-user-role.tpl.html',
				controller: 'userRoleCtrl as userRoleVm',
				size: 'lg',
				scope: $scope,
				backdrop: 'static',
				resolve: {
					user: function () {
						return userDetailVm.user;
					}
				}
			});
		};

		userDetailVm.cancelChangeUserRoles = function (index) {
			userDetailVm.cancel();
		};

		userDetailVm.saveChangeRole = function () {
			appUtils.showLoading();
			var updateUser = userDetailVm.user;
			var newRoles = [];
			_.forEach(userDetailVm.userRoles, function (val, key) {
				newRoles.push(val.$id);
			});
			updateUser.userRoles = newRoles;
			var req = userService.updateUser(updateUser, {
				userEmail: updateUser.email,
				lstRolesDelete: lstRolesDelete
			});
			req.then(function (res) {
				if (!res.result) {
					appUtils.hideLoading();
					$ngBootbox.alert(res.errorMsg);
					return;
				}
				//Delete users List storage
				delete $rootScope.storage.usersList;

				//Delete Side Bar Menus List storage
				if (userDetailVm.currentUser.$id == userDetailVm.user.$id) {
					delete $rootScope.storage.sidebarMenus;
				}

				appUtils.hideLoading();
				$scope.$apply(function () {
					toaster.pop('success', 'Thành công', "Thay đổi quyền người dùng thành công!");
				});
				$timeout(function () {
					loadUserDetails();
				}, 0);
			});
		};

		userDetailVm.loadUserDetails = function () {
			loadUserDetails();
		};

		userDetailVm.resetPassword = function () {
			$ngBootbox.confirm('Bạn có muốn thay đổi mật khẩu?').then(function () {
				appUtils.showLoading();
				authService.resetPasswordAuth(userDetailVm.user.email).then(function () {
					userService.resetPasswordHistory(userDetailVm.user.email);
					$scope.$apply(function () {
						toaster.pop('success', 'Thành công', "Yêu cầu đổi mật khẩu được gửi đến " + userDetailVm.user.email + "!");
					});
					appUtils.hideLoading();
				}).catch(function (error) {
					$scope.$apply(function () {
						toaster.pop('error', 'Lỗi', error);
					});
					appUtils.hideLoading();
				});
			});
		};

		userDetailVm.cancel = function () {
			$state.go('user.list');
		};

		loadUserDetails();
	}

})();