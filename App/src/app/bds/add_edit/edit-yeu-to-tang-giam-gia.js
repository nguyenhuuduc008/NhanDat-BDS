(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editYeuToTangGiamGiaCtrl", editYeuToTangGiamGiaCtrl);
	/** @ngInject */
	function editYeuToTangGiamGiaCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, toaster, appUtils, bdsService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var appSettings = $rootScope.storage.appSettings;
		$scope.numberRegx = /^\d+$/;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		vm.bdsId = $stateParams.bdsId;
		vm.model = {
			noHau: false,
			khuCompound: false,
			canGoc: false,
			ganCho: false,
			sieuThi: false,
			truongHoc: false,
			benhVien: false,
			congVien: false,
			coQuanHanhChinh: false,

			topHau: false,
			cotDien: false,
			cayXanh: false,
			congTruocNha: false,
			damDuong: false,
			ganCoSoTonGIao: false,
			nhaTangLe: false,
			tuongChung: false
		};
		vm.showInvalid = true;
		vm.cacLoaiGiamGia = appSettings.cacLoaiGiamGia;

		vm.activeTab = 'yeuToTangGiamGia';
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
				title: 'Yếu Tố Tăng Giảm Giá',
				url: './app/bds/add_edit/_tab-yeu-to-tang-giam-gia.tpl.html'
			},
			thuocQuyHoach: {
				title: 'Thuộc Quy Hoạch'
			},
			lichSuChuyenQuyen: {
				title: 'Lịch Sử Chuyển Quyền'
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
		};

		//Functions
		vm.loadTab = function (key) {
			vm.activeTab = key;
			$state.go('bds.' + key, { bdsId: vm.bdsId });
		};

		vm.save = function () {
			appUtils.showLoading();
			var obj = {
				noHau: vm.model.noHau,
				khuCompound: vm.model.khuCompound,
				canGoc: vm.model.canGoc,
				ganCho: vm.model.ganCho,
				sieuThi: vm.model.sieuThi,
				truongHoc: vm.model.truongHoc,
				benhVien: vm.model.benhVien,
				congVien: vm.model.congVien,
				coQuanHanhChinh: vm.model.coQuanHanhChinh,

				topHau: vm.model.topHau,
				cotDien: vm.model.cotDien,
				cayXanh: vm.model.cayXanh,
				congTruocNha: vm.model.congTruocNha,
				damDuong: vm.model.damDuong,
				ganCoSoTonGIao: vm.model.ganCoSoTonGIao,
				nhaTangLe: vm.model.nhaTangLe,
				tuongChung: vm.model.tuongChung
			};
			bdsService.updateYeuToTangGiamGia(vm.bdsId, obj).then(function (res) {
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
			bdsService.getYeuToTangGiamGia(vm.bdsId).$loaded().then(function(rs){
				if(rs && rs.timestampCreated){
					vm.model = rs;
				}
				appUtils.hideLoading();
			});
		}

		loadBDSDetails();
	}

})();
