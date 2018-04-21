(function () {
	'use strict';

	angular.module("app.bds")
		.controller("editBdsCtrl", editBdsCtrl);
	/** @ngInject */
	function editBdsCtrl($q, $rootScope, $timeout, $scope, $state, $stateParams, $ngBootbox, $uibModal, appUtils, bdsService, authService, toaster, nhuCauService) {
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showPageHead = true;
		$rootScope.settings.layout.guestPage = false;
		$rootScope.settings.layout.pageSidebarClosed = true;
		var vm = this; // jshint ignore:line
		vm.currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
		vm.cities = appSettings.thanhPho;
		vm.cacLoaiDuong = appSettings.cacLoaiDuong;
		vm.cacLoaiViTri = appSettings.cacLoaiViTri;
		vm.cacLoaiHuong = appSettings.cacLoaiHuong;
		vm.cacNguonBDS = appSettings.cacNguonBDS;
        vm.cacDuAn = appSettings.cacDuAn;
        vm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
		
		vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
		vm.cacLoaiHau = appSettings.cacLoaiHau;
		vm.loaiBDSList = appSettings.cacLoaiBDS;
		vm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;

        vm.bdsId = $stateParams.bdsId;
        vm.khoBDSKey = $stateParams.khoId;
		vm.model = {};
        vm.model.$id = vm.bdsId;
        vm.cities = [];

        _.forEach(vm.cacLoaiHanhChinh.capTinh, function (item, key) {
            vm.cities.push({
                $id: key,
                text: item.text
            });
        });
		/*$scope.zipcodeRegx = /(^\d{5}$)|(^\d{5}-\d{4}$)/;
		$scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
		$scope.addressRegx = /^(a-z|A-Z|0-9)*[^!$%^&*()'"\/\\;:@=+,?\[\]]*$/;
		$scope.numberRegx = /^\d+$/;
        $scope.currencyRegx = /^\$\d/;
		$scope.emailRegx = /^[^!'"\/ ]+$/;*/
		vm.showInvalid = true;
		
		vm.activeTab='thongTin';
		vm.tabs = {
			thongTin: {
				title: 'Thông Tin',
				url: './app/bds/add_edit/_tab-thong-tin.tpl.html'
			},
			tacNghiep: {
				title: 'Tác Nghiệp'
			},
			lienKetUsers: {
				title: 'Liên Kết Users'
            },
            lienKetNhuCau: {
				title: 'Liên Kết Nhu Cầu'
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
		};

		//Functions
		vm.loadTab = function(key){
			vm.activeTab = key;
            $state.go('bds.' + key, { bdsId: vm.bdsId, khoId: vm.khoBDSKey});
		};

		vm.save = function(){
            appUtils.showLoading();
            delete vm.model.$id;
            console.log('MODEL UDPDATE', vm.model);
            if(!!vm.model.media) {
                _.forEach(vm.model.media, function(item, key) {
                    if(!!item.$$hashKey)
                        delete item.$$hashKey;
                });
            }
			bdsService.update(vm.khoBDSKey, vm.bdsId, vm.model).then(function(res){
                if(!res.result){				
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
                appUtils.hideLoading();
                $scope.$apply(function () {
                    toaster.success('Thành Công', "Lưu Bất Động Sản Thành Công!");
                });
            }, function(res){
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            });
		};

        //function
        vm.changeCity = function (quanHuyen, phuongXa, duongPho) {
            vm.xaList = [];
            vm.duongList = [];
            vm.districts = [];
            vm.model.phuongXa = "notSelect";
            vm.model.duongPho = "notSelect";
            vm.model.quanHuyen = "notSelect";
            if (!!quanHuyen)
                vm.model.quanHuyen = quanHuyen;
            if (!!phuongXa)
                vm.model.phuongXa = phuongXa;
            if (!!duongPho)
                vm.model.duongPho = duongPho;
            if (vm.model.thanhPho === "notSelect") {
                return;
            }
            var districts = [];
            vm.districts = [];
            _.forEach(vm.cacLoaiHanhChinh.capHuyen, function (item, key) {
                if(key === vm.model.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                vm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
        };
        
        vm.changeDistrict = function (phuongXa, duongPho) {
            vm.xaList = [];
            vm.duongList = [];
            vm.model.phuongXa = "notSelect";
            vm.model.duongPho = "notSelect";
            if (!!phuongXa)
                vm.model.phuongXa = phuongXa;
            if (!!duongPho)
                vm.model.duongPho = duongPho;
            if(vm.model.quanHuyen === "notSelect") {
                return;
            }
            var xaList = [];
            _.forEach(vm.cacLoaiHanhChinh.capXa, function (item, key) {
                if(key === vm.model.quanHuyen) {
                    xaList = item;
                }
            });
            _.forEach(xaList, function (item, key) {
                vm.xaList.push({
                    $id: key,
                    text: item.text
                });
            });
       
            var duongList = [];
            _.forEach(vm.cacLoaiHanhChinh.duong, function (item, key) {
                if(key === vm.model.quanHuyen) {
                    duongList = item;
                }
            });
            _.forEach(duongList, function (item, key) {
                vm.duongList.push({
                    $id: key,
                    text: item.text
                });
            });
        };

        vm.changeLoaiBDS = function(item) {
            var loaiBDSSelected = _.find(vm.loaiBDSList, function(o) {
                return o.value == item;
            });
            vm.loaiBDSForm = loaiBDSSelected.loaiForm;
        };

        function getTextByKey(list, key) {
            if(!!key) {
                var result = _.find(list , ['$id', key]);
                return result.text; 
            }
        }

		//media 
        function createDropzone(khoBDSKey) {
            Dropzone.autoDiscover = false;
            vm.dzOptions = {
                url: 'bds_media/' + khoBDSKey ,
                firebaseStorage: true,
                parallelUploads: 10,
                dictDefaultMessage: '(Click để tải ảnh hoặc kéo thả ảnh vào đây)',
                autoProcessQueue: false
            };
        }

        vm.dzCallbacks = {
            'addedfile': function (file) {
          
                //nhuCauService.uploadMediaStorage(vm.dzOptions.url, file, metadata);
            },
            'success': function (file, response) {
                var metadata = {
                    "fileName": file.name,
                    "fileSize": file.size,
                    "fileType": file.type,
                    "lastModified": file.lastModified,
                };
                nhuCauService.uploadMediaStorage(vm.dzOptions.url, file, metadata);

                var snapshot = {};
                _.each(response, function (task, key) {
                    snapshot[key] = task.snapshot;
                });
                metadata = snapshot.ori.metadata;
                var mediaData = {
                    "downloadUrl": snapshot.ori.downloadURL,
                    "fileName": metadata.name,
                    "fileSize": metadata.size,
                    "fileType": metadata.contentType,
                    "fullPath": metadata.fullPath,
                    "lowRes": {
                        "downloadUrl": snapshot.lowres ? snapshot.lowres.downloadURL : '',
                        "fileName": snapshot.lowres ? snapshot.lowres.metadata.name : '',
                        "fullPath": snapshot.lowres ? snapshot.lowres.metadata.fullPath : ''
                    },
                    "storageLocation": 'gs://' + metadata.bucket + '/' + metadata.fullPath,
                    "thumbnail": {
                        "downloadUrl": snapshot.thumb ? snapshot.thumb.downloadURL : '',
                        "fileName": snapshot.thumb ? snapshot.thumb.metadata.name : '',
                        "fullPath": snapshot.thumb ? snapshot.thumb.metadata.fullPath : ''
                    },
                };
                vm.model.media[metadata.generation] = mediaData;
                nhuCauService.updateMediaData(vm.model.khoBDSKey, vm.bdsId, mediaData, metadata.generation);
            },
            'error': function (file, err) {
                console.log('upload img error');
                console.log(file);
                console.log(err);
            }
        };

        vm.dzMethods = {};

        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 1,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

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

        function loadMedia(media) {
            _.forEach(media, function (item, key) {
                item.mediaKey = key;
                vm.filteredItems.push(item);
            });
            vm.paging.totalRecord = vm.filteredItems.length;
            vm.paging.currentPage = 0;

            vm.groupToPages();
        }


        vm.changePage = function () {
            vm.groupToPages();
        };

        vm.saveMedia = function(mediaObj) {
            appUtils.showLoading();
            var mediaModel = {
                fileDescription: mediaObj.fileDescription,
            };
            nhuCauService.updateMediaData(vm.model.khoBDSKey, vm.model.bdsKey, mediaModel, mediaObj.mediaKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thay Đổi Hình Ảnh / Video Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thay Đổi Hình Ảnh / Video Không Thành Công!");
            });
        };

        vm.deleteMedia = function(mediaObj) {
            nhuCauService.deleteMediaData(vm.model.khoBDSKey, vm.model.bdsKey, mediaObj.mediaKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        nhuCauService.deleteMediaStorage(mediaObj.fullPath);

                        var media = _.filter(vm.filteredItems, function(o) {
                            return (mediaObj.mediaKey != o.mediaKey);
                        });
                        vm.filteredItems = [];
                        vm.pagedItems = [];
                        loadMedia(media);
                        toaster.success("Xoá Hình Ảnh / Video Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Xoá Hình Ảnh / Video Không Thành Công!");
            });
        };

        //Google map
        function googleMapInit() {
            var defLatitude = 56.162939;
            var defLongitude = 10.203921;
            console.log('TEST LONGTIDUE', defLongitude);
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
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: defLatitude,
                    longitude: defLongitude
                },
                options: {
                    draggable: true
                }
            };
        }

        function setLatLong(lat, lon) {
            $scope.map = {
                center: {
                    latitude: lat,
                    longitude: lon
                },
                zoom: 15
            };
            $scope.marker = {
                id: 0,
                coords: {
                    latitude: lat,
                    longitude: lon
                },
            };
            $scope.$apply();
        }
        
        function getLatLong(tinhThanh, quanHuyen, phuongXa, duongPho) {
            tinhThanh = tinhThanh || '';
            quanHuyen = quanHuyen || '';
            phuongXa = phuongXa || '';
            duongPho = duongPho || '';
            console.log('tinhThanh', tinhThanh);
            console.log('quanHuyen', quanHuyen);
            console.log('phuongXa', phuongXa);
            console.log('duongPho', duongPho);
            
            
            var geocoder =  new google.maps.Geocoder();
            geocoder.geocode({
                'address': tinhThanh + ',' + quanHuyen + ',' + phuongXa + ',' + duongPho
            }, function(result, status) {
                var lat = result[0].geometry.location.lat();
                var lon = result[0].geometry.location.lng();
                setLatLong(lat, lon);
            });
        }

        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
            if (_.isEqual(newVal, oldVal))
                return;
            vm.model.lat = newVal.latitude;
            vm.model.lon = newVal.longitude;
        });

        vm.getToaDo = function() {
            console.log('gettoado');
            var thanhPho = vm.model.thanhPho === "notSelect" ? getTextByKey(vm.cities, null) : getTextByKey(vm.cities, vm.model.thanhPho);
            var quanHuyen = vm.model.quanHuyen === "notSelect" ? getTextByKey(vm.districts, null) : getTextByKey(vm.districts, vm.model.quanHuyen);
            var phuongXa = vm.model.phuongXa === "notSelect" ? getTextByKey(vm.xaList, null) : getTextByKey(vm.xaList, vm.model.phuongXa);
            var duongPho = vm.model.duongPho === "notSelect" ? getTextByKey(vm.duongList, null) : getTextByKey(vm.duongList, vm.model.duongPho);
            
            getLatLong(thanhPho, quanHuyen, phuongXa, duongPho);
        };

        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

        function success(pos) {
            var crd = pos.coords;

            setLatLong(crd.latitude, crd.longitude);
            console.log(`Latitude : ${crd.latitude}`);
            console.log(`Longitude: ${crd.longitude}`);
            console.log(`More or less ${crd.accuracy} meters.`);
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        vm.getGPS = function () {
            navigator.geolocation.getCurrentPosition(success, error, options);
        };

		//Load Data
		function pageInit() {
            createDropzone(vm.khoBDSKey);
            googleMapInit();
			bdsService.getBDS(vm.khoBDSKey, vm.bdsId).then(function(res) {
                console.log('BDS KHO ', res);
                if(!!res) {
                    vm.model = res;

                    var loaiBDS = _.find(vm.loaiBDSList, function (o) {
                        return o.value == vm.model.loaiBDS;
                    });
                    vm.loaiBDSForm = loaiBDS.loaiForm;
                    if (vm.model.thanhPho)
                        vm.changeCity(vm.model.quanHuyen, vm.model.phuongXa, vm.model.duongPho);
                    if (vm.model.quanHuyen)
                        vm.changeDistrict(vm.model.phuongXa, vm.model.duongPho);
                    if (!vm.model.media)
                        vm.model.media = {};
                    loadMedia(vm.model.media);
                    if (!!vm.model.lat && !!vm.model.lon)
                        setLatLong(vm.model.lat, vm.model.lon);
                    $scope.$apply();
                }
                else {
                    $state.go('bds.list');
                }
            });
        }
        
        pageInit();
	}

})();
