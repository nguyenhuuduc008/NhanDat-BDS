(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editViTriCtrl", editViTriCtrl);
	/** @ngInject */
	function editViTriCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, bdsViTriService, authService, toaster) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
		var appSettings = $rootScope.storage.appSettings;

		//Default lat lon of maps

		var defLatitude = 56.162939;
		var defLongitude = 10.203921;

		vm.bdsId = $stateParams.bdsId;
		vm.model = {};

		vm.activeTab = 'viTri';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			viTri: {
				title: 'Vị Trí',
				url: './app/bds/add_edit/_tab-vi-tri.tpl.html'
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

		function CreateViTri(lat, lon) {
			vm.model = {
				latitude: lat,
				longitude: lon
			};
			bdsViTriService.create(vm.bdsId, vm.model).then(function () {
				if (!res.result) {
					$ngBootbox.alert(res.errorMsg.message);
					return;
				} else {
					toaster.pop('success', 'Success', "Save success!");
				}
				appUtils.hideLoading();
			});
		}

		function setMapsLatLon(lat, lon) {
			$scope.marker.coords = {
				latitude: lat,
				longitude: lon
			};
			$scope.dynamicMoveCtr++;
			$timeout(function () {
				$scope.marker.coords = {
					latitude: lat,
					longitude: lon
				};
				$scope.dynamicMoveCtr++;
			}, 500);
		}

		//Google maps
		$scope.map = {
			center: {
				latitude: defLatitude,
				longitude: defLongitude
			},
			zoom: 14
		};
		$scope.options = {
			scrollwheel: false
		};
		$scope.coordsUpdates = 0;
		$scope.dynamicMoveCtr = 0;
		$scope.marker = {
			id: 0,
			coords: {
				latitude: defLatitude,
				longitude: defLongitude
			},
			options: {
				draggable: true
			},
			events: {
				dragend: function (marker, eventName, args) {
					var lat = marker.getPosition().lat();
					var lon = marker.getPosition().lng();

					$scope.marker.options = {
						draggable: true,
						labelContent: "",
						labelAnchor: "100 0",
						labelClass: "marker-labels"
					};

				}
			}
		};

		$scope.$watchCollection("marker.coords", function (newVal, oldVal) {
			$scope.map.center.latitude = $scope.marker.coords.latitude;
			$scope.map.center.longitude = $scope.marker.coords.longitude;
			if (_.isEqual(newVal, oldVal) || $scope.coordsUpdates === 0) {
				$scope.coordsUpdates++;
				return;
			}
			$scope.coordsUpdates++;
			appUtils.showLoading();
			bdsViTriService.get(vm.bdsId).$loaded().then(function (viTriRs) {
				if (viTriRs) {
					viTriRs.latitude = $scope.marker.coords.latitude;
					viTriRs.longitude = $scope.marker.coords.longitude;
					bdsViTriService.update(viTriRs).then(function (updatedRes) {
						if (!updatedRes.result) {
							$ngBootbox.alert(res.errorMsg.message);
							return;
						} else {
							toaster.pop('success', 'Success', "Save success!");
						}
						appUtils.hideLoading();
					});
				} else {
					CreateViTri($scope.marker.coords.latitude, $scope.marker.coords.longitude);
				}
			});
		});
		$timeout(function () {
			bdsViTriService.get(vm.bdsId).$loaded().then(function (viTriRs) {
				if (viTriRs && viTriRs.latitude && viTriRs.longitude) {
					setMapsLatLon(viTriRs.latitude, viTriRs.longitude);
				} else {
					//Set default lat lon
					setMapsLatLon(defLatitude, defLongitude);
				}
			});

		}, 100);
	}

})();
