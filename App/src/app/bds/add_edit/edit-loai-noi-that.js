(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editloaiNoiThatCtrl", editloaiNoiThatCtrl);
	/** @ngInject */
	function editloaiNoiThatCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams,
		$ngBootbox, toaster, appUtils, bdsService, settingService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var appSettings = $rootScope.storage.appSettings;
		$scope.numberRegx = /^\d+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		vm.bdsId = $stateParams.bdsId;
		vm.model = {};

		vm.cacLoaiNoiThat = [];

		vm.showInvalid = true;

		vm.activeTab = 'loaiNoiThat';
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
			yeuToTangGiamGia: {
				title: 'Yếu Tố Tăng Giảm Giá'
			},
			loaiNoiThat: {
				title: 'Loại Nội Thất',
				url: './app/bds/add_edit/_tab-loai-noi-that.tpl.html'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
			},
		};

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, {
				bdsId: vm.bdsId
			});
		};

		vm.save = function () {
			appUtils.showLoading();
			var obj = {
				loaiNoiThatId: vm.loaiNoiThatId
			};
			bdsService.updateLoaiNoiThat(vm.bdsId, obj).then(function (res) {
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg.message);
					return;
				}
				$scope.$apply(function () {
					toaster.success('Success', "Save success!");
				});
				appUtils.hideLoading();
			}, function (res) {
				$ngBootbox.alert(res.errorMsg.message);
				appUtils.hideLoading();
				return;
			});
		};

		//Load Data		
		function loadBDSDetails() {
			appUtils.showLoading();
			settingService.getCacLoaiNoiThat().$loaded().then(function (res) {
				if (res) {
					vm.cacLoaiNoiThat = res;
					bdsService.getLoaiNoiThat(vm.bdsId).$loaded().then(function (rs) {
						if (rs) {
							vm.loaiNoiThatId = rs.loaiNoiThatId;
						}

					});
				}
				appUtils.hideLoading();
			});
			/* bdsService.getLoaiNoiThat(vm.bdsId).$loaded().then(function (rs) {
				if (rs) {
					vm.loaiNoiThatId = rs.loaiNoiThatId;
				}
				appUtils.hideLoading();
			}); */
		}

		loadBDSDetails();
	}

})();