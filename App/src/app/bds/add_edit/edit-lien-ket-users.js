(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editLienKetUsersCtrl", editLienKetUsersCtrl);
	/** @ngInject */
	function editLienKetUsersCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, $window, appUtils, nhuCauService, permissionService, userService, bdsService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;
		vm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;

		vm.bdsId = $stateParams.bdsId;
		vm.khoBDSKey = $stateParams.khoId;
		vm.isUserExit = false;
		vm.model = {};
		vm.userLinkedList = [];

		vm.allLinkedUserIds = [];
		vm.allLinkedUser = [];

		vm.activeTab = 'lienKetUsers';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			lienKetUsers: {
				title: 'Liên Kết Users',
				url: './app/bds/add_edit/_tab-lien-ket-users.tpl.html'
			},
			lienKetNhuCau: {
				title: 'Liên Kết Nhu Cầu'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
			},
			loaiNoiThat: {
				title: 'Loại Nội Thất'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
		};

		vm.keyword = '';

		vm.groupLinkedUsers = [];

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, {
				bdsId: vm.bdsId,
				khoId: vm.khoBDSKey
			});
		};

		vm.keyword = '';
		vm.phoneValid = function (e) {
			var iKeyCode = (e.which) ? e.which : e.keyCode;
			if (iKeyCode < 48 || iKeyCode > 57)
				e.preventDefault();
		};

		/*=============================================================*/
		//Function 
		vm.searchUserByPhone = function () {
			appUtils.showLoading();
			if (vm.keyword === '' || vm.keyword === null || vm.keyword === undefined) {
				appUtils.hideLoading();
				return;
			}
			userService.getExitedPhone(vm.keyword).then(function (res) {
				if (res.data.userId === undefined || res.data.userId === null) {
					$ngBootbox.customDialog({
						message: 'Số Điện Thoại Chưa Được Đăng Ký!',
						buttons: {
							danger: {
								label: "Huỷ",
								className: "btn-default",
								callback: function () {
									console.log('cancel');
									vm.isUserExit = false;
									$scope.$apply();
									appUtils.hideLoading();
								}
							},
							success: {
								label: "Tạo mới",
								className: "btn-success",
								callback: function () {
									$state.go('user.add', { linkedId: $stateParams.bdsId, khoId: $stateParams.khoId});
									appUtils.hideLoading();
								}
							}
						}
					});
				} else {
					appUtils.hideLoading();
					vm.isUserExit = true;
					vm.model.phone = res.data.phone;
					vm.userEmail = res.data.userEmail;
					vm.model.userKey = res.data.userId;
					vm.model.name = res.data.userName;
					vm.model.timeCreated = Date.now();
				}
			});
		};

		//Function save data
		vm.save = function (form) {
			var duplicate = _.find(vm.userLinkedList, function (o) {
				return o.loaiLienKetUser === vm.model.loaiLienKetUser;
			});
			if (!!duplicate) {
				$ngBootbox.customDialog({
					message: 'Loại Người Dùng Đã Có Liên Kết, Tiếp Tục Sẽ Thay Thế Liên Kết Cũ?',
					buttons: {
						danger: {
							label: "Huỷ",
							className: "btn-default",
							callback: function () {
								console.log('cancel');
								vm.isUserExit = false;
								$scope.$apply();
								appUtils.hideLoading();
							}
						},
						success: {
							label: "Chấp Nhận",
							className: "btn-success",
							callback: function () {
								editLinked(vm.bdsId, vm.model, 'lienKetUser', true);
								removeLinked(vm.bdsId, 'lienKetUser', duplicate.linkedKey);
								toaster.success("Liên Kết Người Dùng Thành Công");
								appUtils.showLoading();
							}
						}
					}
				});
			} else {
				$ngBootbox.customDialog({
					message: 'Bạn Có Muốn Liên Kết Với User Này?',
					buttons: {
						danger: {
							label: "Huỷ",
							className: "btn-default",
							callback: function () {
								console.log('cancel');
								vm.isUserExit = false;
								$scope.$apply();
								appUtils.hideLoading();
							}
						},
						success: {
							label: "Chấp Nhận",
							className: "btn-success",
							callback: function () {
								editLinked(vm.bdsId, vm.model, 'lienKetUser', true);
								toaster.success("Liên Kết Người Dùng Thành Công");
								appUtils.showLoading();
							}
						}
					}
				});
			}
		};

		function editLinked(bdsId, model, tabPath, isLinked) {
			bdsService.updateTab(bdsId, model, tabPath, isLinked).then(function (res) {
				if (res.result) {
					appUtils.hideLoading();
					$scope.$apply(function () {
						vm.model.linkedKey = res.linkedKey;
						addToLinkedList(vm.model);
					});
					return;
				}
				appUtils.hideLoading();
				toaster.error("Liên Kết Người Dùng Không Thành Công!");
			});
		}

		//function 
		function addToLinkedList(linkedModel) {
			vm.userLinkedList.push({
				phone: linkedModel.phone,
				name: linkedModel.name,
				loaiLienKetUser: linkedModel.loaiLienKetUser,
				timeCreated: linkedModel.timeCreated,
				linkedKey: linkedModel.linkedKey
			});
			vm.isUserExit = false;
		}

		//Function remove item
		vm.removeLinkedUser = function (linkedKey) {
			$ngBootbox.customDialog({
				message: 'Bạn Muốn Dừng Liên Kết Với User Này?',
				buttons: {
					danger: {
						label: "Huỷ",
						className: "btn-default",
						callback: function () {
							console.log('cancel');
							appUtils.hideLoading();
						}
					},
					success: {
						label: "Chấp Nhận",
						className: "btn-success",
						callback: function () {
							console.log('DDDDDLIST MODEL KEY', vm.userLinkedList);
							console.log('PHONE ID USER', linkedKey);
							removeLinked(vm.bdsId, 'lienKetUser', linkedKey);
							toaster.success("Dừng Liên Kết Thành Công");
						}
					}
				}
			});
		};

		function removeLinked(bdsId, tabPath, linkedKey) {
			bdsService.removeTab(bdsId, tabPath, linkedKey).then(function (res) {
				if (res.result) {
					appUtils.hideLoading();
					$scope.$apply(function () {
						_.remove(vm.userLinkedList, function (o) {
							return o.linkedKey == linkedKey;
						});
					});
					return;
				}
				appUtils.hideLoading();
				toaster.error("Dừng Liên Kết Không Thành Công!");
			});
		}

		vm.displayLoaiLienKet = function (lienKetUserId) {
			var find = _.find(vm.cacLoaiLienKetUser, function (o) {
				return o.value == lienKetUserId;
			});
			if (lienKetUserId === 'createUserUniq')
				return 'Người Tạo BDS';
			else if (find === undefined || find === null)
				return '';
			else
				return find.text;
		};

		//Load Data
		function pageInit() {
			if (!!vm.bdsId && !!vm.khoBDSKey) {
				appUtils.showLoading();
				vm.model.khoBDSKey = vm.khoBDSKey;
				bdsService.getTab(vm.bdsId, 'lienKetUser').then(function (result) {
					console.log('LIEN KET USER resukt', result);
					if (!!result) {
						_.forEach(result, function (item, key) {
							if (_.isObject(item)) {
								vm.userLinkedList.push({
									phone: item.phone,
									name: item.name,
									loaiLienKetUser: item.loaiLienKetUser,
									timeCreated: item.timeCreated,
									linkedKey: key
								});
							}
						});
						$scope.$apply();
					}
					appUtils.hideLoading();
				});
			} else {
				$state.go('bds.list');
			}
		}

		pageInit();

	}

})();