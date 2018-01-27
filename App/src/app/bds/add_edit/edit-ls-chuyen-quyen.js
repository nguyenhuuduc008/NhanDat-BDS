(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editLSChuyenQuyenCtrl", editLSChuyenQuyenCtrl);
	/** @ngInject */
	function editLSChuyenQuyenCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, lichSuChuyenQuyenService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$scope.emailRegx = /^[^!'"\/ ]+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;
		vm.model = {};
		vm.bdsId = $stateParams.bdsId;
		if ($stateParams.id) {
			vm.model.$id = $stateParams.id;
		}
		vm.showInvalid = false;
		vm.showAddNew = true;
		vm.formTitle = 'Tạo Mới';
		vm.selectAction = 'Bulk Actions';

		vm.activeTab = 'lichSuChuyenQuyen';
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
				title: 'Liên Kết Users'
			},
			giamGia: {
				title: 'Giảm Giá'
			},
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
			},
			thuocQuyHoach: {
				title: 'Thuộc Quy Hoạch'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền',
				url: './app/bds/add_edit/_tab-ls-chuyen-quyen.tpl.html'
			},
			lichSuGiaoDich: {
				title: 'Lịch Sử Giao Dịch'
			},
			capDo: {
				title: 'Cấp Độ'
			},
			lichSuGia: {
				title: 'Lịch Sử Giá'
			},
			media: {
				title: 'Media'
			}
		};

		//Functions
		vm.loadTab = function(key){
			vm.activeTab = key;
            $state.go('bds.' + key, { bdsId: vm.bdsId });
		};

		//Load Data
		function loadBDSTacNghiep() {
			if (vm.bdsId && vm.bdsId !== '' && vm.model.$id) {
				appUtils.showLoading();
				lichSuChuyenQuyenService.get(vm.bdsId, vm.model.$id).$loaded().then(function (item) {
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
		};

		$scope.changePage = function () {
			vm.groupToPages();
		};

		vm.search = function (keyword) {
			appUtils.showLoading();
			lichSuChuyenQuyenService.search(vm.bdsId, keyword).then(function (result) {
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
					lichSuChuyenQuyenService.deleteItem(vm.model.$id).then(function (rs) {
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
							removeRs.push(lichSuChuyenQuyenService.deleteItem(id));
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
			vm.model.from = item.from;
			vm.model.to = item.to;
			vm.model.ngayChuyenQuyen = item.ngayChuyenQuyen;
		};

		vm.cancel = function () {
			// $state.go('bds.lichSuChuyenQuyen', { bdsId: vm.bdsId });
			vm.showAddNew = true;
			vm.showInvalid = false;
			vm.formTitle = 'Tạo Mới';
			vm.model = {};
		};

		vm.save = function () {
			appUtils.showLoading();
			var self = this;
			var update = null;
			if (vm.model.$id) {
				lichSuChuyenQuyenService.get(vm.bdsId, vm.model.$id).$loaded().then(function (data) {
					update = data;
					update.from = vm.model.from;
					update.to = vm.model.to;
					update.ngayChuyenQuyen = vm.model.ngayChuyenQuyen;
					update.uid = vm.currentUser.$id;
					update.timestampModified = appUtils.getTimestamp();
					lichSuChuyenQuyenService.update(update).then(function (rs) {
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
				lichSuChuyenQuyenService.create(vm.bdsId, vm.model).then(function (rs) {
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

		vm.search('');
		loadBDSTacNghiep();
	}

})();
