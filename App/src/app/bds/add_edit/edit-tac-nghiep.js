(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editTacNghiepCtrl", editTacNghiepCtrl);
	/** @ngInject */
	function editTacNghiepCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, tacNghiepService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;
		vm.model = {};
		vm.bdsId = $stateParams.bdsId;
		vm.model.$id = $stateParams.id;
		console.log('--------vm.bdsId');
		console.log(vm.bdsId);
		vm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		vm.showInvalid = false;
		vm.showAddNew = true;
		vm.formTitle = 'Tạo Mới';
		vm.selectAction = 'Bulk Actions';

		vm.activeTab = 'tacNghiep';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				// url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
			tacNghiep: {
				title: 'Tác Nghiệp',
				url: './app/bds/add_edit/_tab-tac-nghiep.tpl.html'
			},
			desc: {
				title: 'Descriptions',
				// url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
			info2: {
				title: 'Info',
				// url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
		};

		vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		vm.cacLoaiHau = appSettings.cacLoaiHau;
		vm.cacLoaiBDS = appSettings.cacLoaiBDS;
		vm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, { id: vm.bdsId });
		};

		//Load Data
		function loadBDSTacNghiep() {
			if (vm.bdsId && vm.bdsId !== '' && vm.model.$id) {
				appUtils.showLoading();
				tacNghiepService.get(vm.bdsId, vm.model.$id).$loaded().then(function (item) {
					if (item) {
						vm.edit(item);
					}
					appUtils.hideLoading();
				});
			}
		}

		vm.groupedItems = [];
		vm.filteredItems = [];
		vm.pagedItems = [];
		vm.paging = {
			pageSize: 25,
			currentPage: 0,
			totalPage: 0,
			totalRecord: 0
		};

		vm.keyword = '';
		vm.groupToPages = function () {
			vm.pagedItems = [];
			for (var i = 0; i < vm.filteredItems.length; i++) {
				if (i % vm.paging.pageSize === 0) {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
				} else {
					vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
				}
			}
			if (vm.filteredItems.length % vm.paging.pageSize === 0) {
				vm.paging.totalPage = vm.filteredItems.length / vm.paging.pageSize;
			} else {
				vm.paging.totalPage = Math.floor(vm.filteredItems.length / vm.paging.pageSize) + 1;
			}

		};

		vm.changePage = function () {
			vm.groupToPages();
		}

		$scope.changePage = function () {
			vm.groupToPages();
		};

		vm.search = function (keyword) {
			appUtils.showLoading();
			tacNghiepService.search(vm.bdsId, keyword).then(function (result) {
				console.log('---------search');
				console.log(result);
				appUtils.hideLoading();
				vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
				vm.paging.totalRecord = result.length;
				vm.paging.currentPage = 0;
				//group by pages
				vm.groupToPages();
			});
		};

		vm.delete = function () {
			$ngBootbox.confirm('Are you sure want to delete ' + vm.model.name + '?')
				.then(function () {
					tacNghiepService.remove(vm.bdsId, vm.model.$id).then(function (rs) {
						if (rs.result) {
							toaster.success("Delete success!");
						} else {
							toaster.error(rs.errorMsg);
						}
					});
				}, function () {
				});

		};

		vm.selectAll = function (controlId, name) {
			appUtils.checkAllCheckBox(controlId, name);
		};

		vm.apply = function (chkName) {
			appUtils.showLoading();
			var self = this;
			var lstIds = [];
			$('input[name=' + chkName + ']').each(function () {
				if (this.checked === true) {
					lstIds.push($(this).val() + '');
				}
			});
			var removeIndex = vm.selectAction.indexOf('Delete');
			if (removeIndex === -1) {
				appUtils.hideLoading();
				toaster.warning("Please choose action to execute!");
				return;
			}

			if (lstIds.length <= 0) {
				appUtils.hideLoading();
				toaster.warning("Please choose some items to execute action!");
				return;
			}
			$ngBootbox.confirm('Are you sure want to apply ' + vm.selectAction + ' action as selected?')
				.then(function () {
					var removeRs = [];
					if (removeIndex > -1) {
						_.forEach(lstIds, function (id) {
							removeRs.push(tacNghiepService.remove(vm.bdsId, id));
						});

						$q.all(removeRs).then(function (rs) {
							appUtils.hideLoading();
							toaster.success("Delete success!");
							self.search('');
						});
					}

				}, function () {
					appUtils.hideLoading();
				});
		};

		vm.edit = function (item) {
			vm.showInvalid = true;
			vm.formTitle = 'Thay Đổi';
			vm.showAddNew = false;
			vm.model.$id = item.$id;
			vm.model.ten = item.ten;
			vm.model.loaiTacNghiep = item.loaiTacNghiep;
			vm.model.ngayTacNghiep = item.ngayTacNghiep;
		};

		vm.cancel = function () {
			$state.go('bds.thongTin', { id: vm.bdsId });
		};

		vm.save = function () {
			appUtils.showLoading();
			var self = this;
			var update = null;
			// var existedName;
			// var existedNumber;
			if (vm.model.$id) {
				tacNghiepService.get(vm.bdsId, vm.model.$id).$loaded().then(function (data) {
					update = data;
					// existedName = _.filter(vm.items, function(t) { 
					//     if(t.name){
					//         if(t.name.toLowerCase() === vm.model.name.toLowerCase())
					//         {
					//             return update.name.toLowerCase() !== vm.model.name.toLowerCase();
					//         }
					//     }
					// });
					// if(existedName.length > 0){
					//     appUtils.hideLoading();
					//     toaster.warning('The name is ' + vm.model.name + " has existed, please try another!");
					//     return;
					// }
					// existedNumber = _.filter(vm.items, function(t) { 
					//         if(t.number){
					//             if(t.number === vm.model.number)
					//             {
					//                 return update.number !== vm.model.number;
					//             }
					//         }
					//     });
					// if(existedNumber.length > 0){
					//     appUtils.hideLoading();
					//     toaster.warning('The number is ' + vm.model.number + " has existed, please try another!");
					//     return;
					// }

					update.ten = vm.model.ten;
					update.loaiTacNghiep = vm.model.loaiTacNghiep;
					update.ngayTacNghiep = vm.model.ngayTacNghiep;
					update.uid = vm.currentUser.$id;
					update.timestampModified = appUtils.getTimestamp();
					tacNghiepService.update(update).then(function (rs) {
						appUtils.hideLoading();
						if (rs.result) {
							toaster.success("Save success!");
							self.search('');
						} else {
							toaster.error(rs.errorMsg);
						}
					});
				});
			} else {
				// existedName = _.filter(vm.items, function(t) { 
				//     if(t.name){
				//         return t.name.toLowerCase() == vm.model.name.toLowerCase();
				//     }
				// });
				// if(existedName.length > 0){
				//     appUtils.hideLoading();
				//     toaster.warning('The name is ' + vm.model.name + " has existed, please try another!");
				//     return;
				// }
				// existedNumber = _.filter(vm.items, function(t) { 
				//         if(t.number){
				//             return t.number == vm.model.number;
				//         }
				//     });
				// if(existedNumber.length > 0){
				//     appUtils.hideLoading();
				//     toaster.warning('The number is ' + vm.model.number + " has existed, please try another!");
				//     return;
				// }

				tacNghiepService.create(vm.bdsId, vm.model).then(function (rs) {
					appUtils.hideLoading();
					if (rs.result) {
						self.search('');
						toaster.success("Save success!");
						vm.model = {};
					} else {
						toaster.error(rs.errorMsg);
					}
				});
			}
		};

		vm.textLoaiTacNghiep = function (value) {
			var rs = _.find(vm.cacLoaiTacNghiep, function (o) {
				return o.value + '' === value + '';
			});
			if (rs) {
				return rs.text;
			}
			return 'Unknown';
		};

		// loadBDSDetails();
		vm.search('');
		loadBDSTacNghiep();
	}

})();