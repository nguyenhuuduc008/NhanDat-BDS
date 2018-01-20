(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editLienKetUsersCtrl", editLienKetUsersCtrl);
	/** @ngInject */
	function editLienKetUsersCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, lienKetUsersService, roleService, permissionService, userService, bdsService, bdsViTriService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;

		vm.bdsId = $stateParams.bdsId;
		vm.model = {};

		vm.activeTab = 'lienKetUsers';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			viTri: {
				title: 'Vị Trí'
			},
			lienKetUsers: {
				title: 'Liên Kết Users',
				url: './app/bds/add_edit/_tab-lien-ket-users.tpl.html'
			},
		};

		vm.keyword = '';
		vm.isAdmin = false;
		vm.groupedItems = [];
		vm.filteredItems = [];
		vm.pagedItems = [];
		vm.paging = {
			pageSize: 25,
			currentPage: 0,
			totalPage: 0,
			totalRecord: 0
		};

		vm.linkedUsers = [];

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, { bdsId: vm.bdsId });
		};


		/*=============================================================*/
		function initPage() {
			lienKetUsersService.get(vm.bdsId).$loaded().then(function (linkedRs) {
				if (linkedRs) {
					vm.linkedUsers = linkedRs.users;
				}
			});

			userService.search('').then(function (result) {
				vm.allUsers = result.length;
				vm.adminUser = _.filter(result, function (user) {
					if (user.userRoles) {
						return user.userRoles.indexOf('-KTlccaZaxPCGDaFPSc5') !== -1;
					}
					return false;
				}).length;
			});

			vm.searchUser(vm.keyword);
			userService.insertState();
		}

		function updateLinkedUsers(obj){
			lienKetUsersService.create(vm.bdsId, obj).then(function (res) {
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg.message);
					return;
				}
				appUtils.hideLoading();
				toaster.pop('success', 'Success', "Unlinks success!");
			}, function (res) {
				$ngBootbox.alert(res.errorMsg.message);
				appUtils.hideLoading();
				return;
			});
		}

		//Functions
		vm.groupToPages = function () {
			vm.pagedItems = [];
			for (var i = 0; i < vm.filteredItems.length; i++) {
				if (i % vm.paging.pageSize === 0) {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
				} else {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
				}
			}
			vm.paging.totalPage = Math.ceil(vm.filteredItems.length / vm.paging.pageSize);
		};


		vm.changePage = function () {
			$('#select-all-user').attr('checked', false);
			vm.groupToPages();
		};

		vm.searchUser = function (keyword) {
			appUtils.showLoading();
			userService.search(keyword, vm.isAdmin).then(function (result) {
				appUtils.hideLoading();
				if (vm.isAdmin) {
					result = _.filter(result, function (item) {
						return item.userRoles !== undefined && item.userRoles !== null && item.userRoles !== '';
					});
				}
				vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
				vm.paging.totalRecord = result.length;
				vm.paging.currentPage = 0;
				//group by pages
				vm.groupToPages();
			});
		};

		vm.getAllUsers = function () {
			vm.isAdmin = false;
			vm.searchUser('');
		};

		vm.getAddminUsers = function () {
			vm.isAdmin = true;
			vm.searchUser('');
		};

		vm.selectAllUser = function (controlId, name) {
			appUtils.checkAllCheckBox(controlId, name);
		};

		vm.dataLetterPic = function (item) {
			var dateLetter = item.firstName.charAt(0).toUpperCase() + item.lastName.charAt(0).toUpperCase();
			return dateLetter;
		};

		vm.edit = function (userKey) {
			$state.go('user.details', { id: userKey });
		};

		vm.applyAction = function (chkName, actionControl) {
			var lstUserIds = [];
			$('input[name=' + chkName + ']').each(function () {
				if (this.checked === true) {
					lstUserIds.push($(this).val() + '');
				}
			});

			var action = $('#' + actionControl).val();
			var actionTxt = $('#' + actionControl + ' option:selected').text();

			if (action === 0 || parseInt(action) === 0) {
				toaster.warning("Please choose action to execute!");
				return;
			}

			if (lstUserIds.length === 0) {
				toaster.warning("Please choose some users to execute action!");
				return;
			}

			var reqs = [];
			if (action === 'linksToUsers') {
				var modalInstance = $uibModal.open({
					templateUrl: 'app/bds/add_edit/_popup-lien-ket-users.tpl.html',
					controller: 'lienKetUsersCtrl as vm',
					size: 'lg',
					scope: $scope,
					backdrop: 'static',
					resolve: {
						bdsId: function () {
							return vm.bdsId;
						},
						lstUserIds: function () {
							return lstUserIds;
						}
					}
				});
			} else {
				$ngBootbox.confirm('Are you sure want to apply ' + actionTxt + ' action as selected?').then(function () {
					appUtils.showLoading();
					if (action === 'delete') {
						_.forEach(lstUserIds, function (obj, key) {
							reqs.push(userService.deleteUser(obj));
						});
						$q.all(reqs).then(function (res) {
							appUtils.hideLoading();
							var err = _.find(res, function (item) {
								return item.result === false;
							});
							if (err === undefined) {
								delete $rootScope.storage.usersList;
								toaster.pop('success', 'Success', "Delete Successful!");
							} else {
								toaster.pop('error', 'Error', "Delete Error!");
							}
							initPage();
						});
					} else if (action === 'disable') {
						_.forEach(lstUserIds, function (obj, key) {
							reqs.push(userService.unAuthorizedUser(obj));
						});
						$q.all(reqs).then(function (res) {
							appUtils.hideLoading();
							var err = _.find(res, function (item) {
								return item.result === false;
							});
							if (err === undefined) {
								delete $rootScope.storage.usersList;
								toaster.pop('success', 'Success', "Disable Successful!");
							} else {
								toaster.pop('error', 'Error', "Disable Error!");
							}
							initPage();
						});
					} else if (action === 'enable') {
						_.forEach(lstUserIds, function (obj, key) {
							reqs.push(userService.authorizedUser(obj));
						});
						$q.all(reqs).then(function (res) {
							appUtils.hideLoading();
							var err = _.find(res, function (item) {
								return item.result === false;
							});
							if (err === undefined) {
								delete $rootScope.storage.usersList;
								toaster.pop('success', 'Success', "Enable Successful!");
							} else {
								toaster.pop('error', 'Error', "Enable Error!");
							}
							initPage();
						});
					} else {
						appUtils.hideLoading();
					}
				});
			}
		};

		vm.getPhotoProfile = function (imgUri) {
			return appUtils.getImageFBUrl(imgUri).then(function (data) {
				return data.imgUrl;
			});
		};

		vm.deserializeRole = function (rolesIds) {
			if (rolesIds !== undefined && rolesIds.length > 0) {
				var permissions = [];
				_.forEach(rolesIds, function (roleId, key) {
					var role = _.find(vm.roles, { $id: roleId });
					if (role) {
						permissions.push(role.name);
					}
				});
				return permissions.join(", ");
			}
			return '';
		};

		vm.addNew = function () {
			$rootScope.reProcessSideBar = true;
			$state.go('user.add');
		};

		vm.getLinkedRs = function (userId) {
			var rs = _.find(vm.linkedUsers, function (o) { return o === userId; });
			if (rs) {
				return true;
			}
			return false;
		};

		vm.removeLinkedUser = function (userId) {
			appUtils.showLoading();
			vm.linkedUsers = _.filter(vm.linkedUsers, function (o) { return o !== userId; });
			var obj = {
				users: vm.linkedUsers,
			};
			updateLinkedUsers(obj);
		};

		// vm.addLinkedUser = function (userId) {
		// 	appUtils.showLoading();
		// 	vm.linkedUsers.push(userId);
		// 	var obj = {
		// 		users: vm.linkedUsers,
		// 	};
		// 	updateLinkedUsers(obj);
		// };

		//Load Data
		roleService.items().$loaded(function (data) {
			vm.roles = data;
		});
		initPage();

	}

})();
