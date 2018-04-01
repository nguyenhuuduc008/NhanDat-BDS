(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauThongTinCtr', nhuCauThongTinCtr);
    	/** @ngInject */
    function nhuCauThongTinCtr($rootScope, $scope, $state, $stateParams, $q, $filter, nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        if($stateParams.item == null || $stateParams.item == undefined)
            $state.go('nhuCauListing');

        var nhuCauThongTinVm =this;// jshint ignore:line
        //
        nhuCauThongTinVm.cacKhoBDS = appSettings.cacKhoBDS;
        nhuCauThongTinVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        nhuCauThongTinVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        nhuCauThongTinVm.cacLoaiViTri = appSettings.cacLoaiViTri;
        nhuCauThongTinVm.cacDuAn = appSettings.cacDuAn;
        nhuCauThongTinVm.cacLoaiHuong = appSettings.cacLoaiHuong;
        nhuCauThongTinVm.loaiBDSList = appSettings.cacLoaiBDS;
        
        nhuCauThongTinVm.khoBDSList = [];
        nhuCauThongTinVm.cities = [];
        nhuCauThongTinVm.districts = [];
        var districts;
        var bdsKey;
        console.log('APPSETTING', appSettings);
        
        //Load data
        _.forEach(nhuCauThongTinVm.cacKhoBDS, function(item, key) {
            if(key != 'khoDefault') {
                nhuCauThongTinVm.khoBDSList.push({
                    $id: key,
                    text: item.text
                });
            } else 
                nhuCauThongTinVm.khoBDSDefault = item;
        });

        _.forEach(nhuCauThongTinVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            nhuCauThongTinVm.cities.push({
                $id: key,
                text: item.text
            });
        });

        //media 
        function createDropzone(khoBDSKey, loaiNhuCauKey) {
            Dropzone.autoDiscover = false;
            nhuCauThongTinVm.dzOptions = {
                url: 'bds_nhucau/' + khoBDSKey + '/' + loaiNhuCauKey,
                firebaseStorage: true,
                parallelUploads: 10,
                dictDefaultMessage: '(Click để tải ảnh hoặc kéo thả ảnh vào đây)',
                autoProcessQueue: false
            };
        }

        nhuCauThongTinVm.dzCallbacks = {
            'addedfile': function (file) {
          
                //nhuCauService.uploadMediaStorage(nhuCauThongTinVm.dzOptions.url, file, metadata);
            },
            'success': function (file, response) {
                console.log('RESPON', response);
                var metadata = {
                    "fileName": file.name,
                    "fileSize": file.size,
                    "fileType": file.type,
                    "lastModified": file.lastModified,
                };
                nhuCauService.uploadMediaStorage(nhuCauThongTinVm.dzOptions.url, file, metadata);

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
                console.log('MD5', metadata);
                nhuCauThongTinVm.model.media[metadata.generation] = mediaData;
                nhuCauService.updateNhuCauBan(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, bdsKey);
            },
            'error': function (file, err) {
                console.log('upload img error');
                console.log(file);
                console.log(err);
            }
        };

        nhuCauThongTinVm.dzMethods = {};

        nhuCauThongTinVm.filteredItems = [];
        nhuCauThongTinVm.pagedItems = [];
        nhuCauThongTinVm.paging = {
            pageSize: 1,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

        nhuCauThongTinVm.groupToPages = function () {
            nhuCauThongTinVm.pagedItems = [];
            for (var i = 0; i < nhuCauThongTinVm.filteredItems.length; i++) {
                if (i % nhuCauThongTinVm.paging.pageSize === 0) {
                    nhuCauThongTinVm.pagedItems[Math.floor(i / nhuCauThongTinVm.paging.pageSize)] = [nhuCauThongTinVm.filteredItems[i]];
                } else {
                    nhuCauThongTinVm.pagedItems[Math.floor(i / nhuCauThongTinVm.paging.pageSize)].push(nhuCauThongTinVm.filteredItems[i]);
                }
            }
            if (nhuCauThongTinVm.filteredItems.length % nhuCauThongTinVm.paging.pageSize === 0) {
                nhuCauThongTinVm.paging.totalPage = nhuCauThongTinVm.filteredItems.length / nhuCauThongTinVm.paging.pageSize;
            } else {
                nhuCauThongTinVm.paging.totalPage = Math.floor(nhuCauThongTinVm.filteredItems.length / nhuCauThongTinVm.paging.pageSize) + 1;
            }
        };

        function loadMedia(media) {
            _.forEach(media, function (item, key) {
                item.mediaKey = key;
                nhuCauThongTinVm.filteredItems.push(item);
            });
            nhuCauThongTinVm.paging.totalRecord = nhuCauThongTinVm.filteredItems.length;
            nhuCauThongTinVm.paging.currentPage = 0;

            nhuCauThongTinVm.groupToPages();
        }


        nhuCauThongTinVm.changePage = function () {
            nhuCauThongTinVm.groupToPages();
        };

        nhuCauThongTinVm.saveMedia = function(mediaObj) {
            appUtils.showLoading();
            var mediaModel = {
                fileDescription: mediaObj.fileDescription,
            };
            nhuCauService.updateMediaData(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model.bdsKey, mediaModel, mediaObj.mediaKey).then(function(res) {
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

        nhuCauThongTinVm.deleteMedia = function(mediaObj) {
            nhuCauService.deleteMediaData(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model.bdsKey, mediaObj.mediaKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        nhuCauService.deleteMediaStorage(mediaObj.fullPath);

                        var media = _.filter(nhuCauThongTinVm.filteredItems, function(o) {
                            return (mediaObj.mediaKey != o.mediaKey);
                        });
                        nhuCauThongTinVm.filteredItems = [];
                        nhuCauThongTinVm.pagedItems = [];
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
            nhuCauThongTinVm.isMapInit = false;
            var defLatitude = nhuCauThongTinVm.model.lat || 56.162939;
            var defLongitude = nhuCauThongTinVm.model.lon || 10.203921;
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
        
        function getLatLong(tinhThanh, quanHuyen, phuongXa, duongPho) {
            tinhThanh = tinhThanh || '';
            quanHuyen = quanHuyen || '';
            phuongXa = phuongXa || '';
            duongPho = duongPho || '';
            
            var geocoder =  new google.maps.Geocoder();
            geocoder.geocode({
                'address': tinhThanh + ',' + quanHuyen + ',' + phuongXa
            }, function(result, status) {
                console.log('GEOCODE', result);
                var lat = result[0].geometry.location.lat();
                var lon = result[0].geometry.location.lng();
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
            });
        }

        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
            if (_.isEqual(newVal, oldVal))
                return;
            console.log('COORRD', newVal);
            nhuCauThongTinVm.model.lat = newVal.latitude;
            nhuCauThongTinVm.model.lon = newVal.longitude;
        });

      
        //function
        nhuCauThongTinVm.changeCity = function () {
            if(nhuCauThongTinVm.model.thanhPho === "notSelect") {
                nhuCauThongTinVm.districts = [];
                nhuCauThongTinVm.xaList = [];
                nhuCauThongTinVm.duongList = [];
                nhuCauThongTinVm.model.quanHuyen = "notSelect";
                nhuCauThongTinVm.model.phuongXa = "notSelect";
                nhuCauThongTinVm.model.duongPho = "notSelect";
                return;
            }
            nhuCauThongTinVm.districts = [];
            _.forEach(nhuCauThongTinVm.cacLoaiHanhChinh.capHuyen, function (item, key) {
                if(key === nhuCauThongTinVm.model.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                nhuCauThongTinVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
            if(nhuCauThongTinVm.isMapInit) return;
            nhuCauThongTinVm.model.quanHuyen = "notSelect";
            nhuCauThongTinVm.model.phuongXa = "notSelect";
            nhuCauThongTinVm.model.duongPho = "notSelect";

            var thanhPho = getTextByKey(nhuCauThongTinVm.cities, nhuCauThongTinVm.model.thanhPho);
            var quanHuyen = nhuCauThongTinVm.model.quanHuyen === "notSelect" ? getTextByKey(nhuCauThongTinVm.districts, null) : getTextByKey(nhuCauThongTinVm.districts, nhuCauThongTinVm.model.quanHuyen);
            var phuongXa = nhuCauThongTinVm.model.phuongXa === "notSelect" ? getTextByKey(nhuCauThongTinVm.xaList, null) : getTextByKey(nhuCauThongTinVm.xaList, nhuCauThongTinVm.model.phuongXa);
            var duongPho = nhuCauThongTinVm.model.duongPho === "notSelect" ? getTextByKey(nhuCauThongTinVm.duongList, null) : getTextByKey(nhuCauThongTinVm.duongList, nhuCauThongTinVm.model.duongPho);
            
            getLatLong(thanhPho, quanHuyen, phuongXa, duongPho);
        };
        
        nhuCauThongTinVm.changeDistrict = function () {
            if(nhuCauThongTinVm.model.quanHuyen === "notSelect") {
                nhuCauThongTinVm.xaList = [];
                nhuCauThongTinVm.duongList = [];
                nhuCauThongTinVm.model.phuongXa = "notSelect";
                nhuCauThongTinVm.model.duongPho = "notSelect";
                return;
            }
            settingService.getListChildHanhChinh('capXa', nhuCauThongTinVm.model.quanHuyen).then(function(data) {
                nhuCauThongTinVm.xaList = data;
            });
            settingService.getListChildHanhChinh('duong', nhuCauThongTinVm.model.quanHuyen).then(function(data) {
                nhuCauThongTinVm.duongList = data;
            });
            if(nhuCauThongTinVm.isMapInit) return;
            nhuCauThongTinVm.model.phuongXa = "notSelect";
            nhuCauThongTinVm.model.duongPho = "notSelect";
            var thanhPho = getTextByKey(nhuCauThongTinVm.cities, nhuCauThongTinVm.model.thanhPho);
            var quanHuyen = getTextByKey(nhuCauThongTinVm.districts, nhuCauThongTinVm.model.quanHuyen);
            var phuongXa = nhuCauThongTinVm.model.phuongXa === "notSelect" ? getTextByKey(nhuCauThongTinVm.xaList, null) : getTextByKey(nhuCauThongTinVm.xaList, nhuCauThongTinVm.model.phuongXa);
            var duongPho = nhuCauThongTinVm.model.duongPho === "notSelect" ? getTextByKey(nhuCauThongTinVm.duongList, null) : getTextByKey(nhuCauThongTinVm.duongList, nhuCauThongTinVm.model.duongPho);
            
            getLatLong(thanhPho, quanHuyen, phuongXa, duongPho);
        };
        
        nhuCauThongTinVm.changeStreet = function () {
            if(nhuCauThongTinVm.isMapInit) return;
            var thanhPho = getTextByKey(nhuCauThongTinVm.cities, nhuCauThongTinVm.model.thanhPho);
            var quanHuyen = getTextByKey(nhuCauThongTinVm.districts, nhuCauThongTinVm.model.quanHuyen);
            var phuongXa = nhuCauThongTinVm.model.phuongXa === "notSelect" ? getTextByKey(nhuCauThongTinVm.xaList, null) : getTextByKey(nhuCauThongTinVm.xaList, nhuCauThongTinVm.model.phuongXa);
            var duongPho = nhuCauThongTinVm.model.duongPho === "notSelect" ? getTextByKey(nhuCauThongTinVm.duongList, null) : getTextByKey(nhuCauThongTinVm.duongList, nhuCauThongTinVm.model.duongPho);
            
            getLatLong(thanhPho, quanHuyen, phuongXa, duongPho);
        };

        nhuCauThongTinVm.changeLoaiBDS = function(item) {
            var loaiBDSSelected = _.find(nhuCauThongTinVm.loaiBDSList, function(o) {
                return o.value == item;
            });
            console.log('loaiBDSSLECT', loaiBDSSelected);
            nhuCauThongTinVm.loaiBDSForm = loaiBDSSelected.loaiForm;
        };

        //Function
        function changeForm(key) {
            console.log('KEYEEEEEEEE', key);
            switch (key) {
                case 'ban':
                    createDropzone(nhuCauThongTinVm.model.khoBDSKey, key);
                    nhuCauThongTinVm.isMapInit = true;
                    break;
                case 'mua':
                    nhuCauThongTinVm.noMapImg = true;
                    break;
                case 'thue':
                    nhuCauThongTinVm.noMapImg = true;
                    break;
                case 'cho-thue':
                    nhuCauThongTinVm.isMapInit = true;
                    createDropzone(nhuCauThongTinVm.model.khoBDSKey, key);
                    break;
            }
        }

        nhuCauThongTinVm.save = function (form) {
            appUtils.showLoading();
            if (nhuCauThongTinVm.isEdit) {
                switch (nhuCauThongTinVm.model.loaiNhuCauKey) {
                    case 'ban':
                        delete nhuCauThongTinVm.model.giaFrom;
                        delete nhuCauThongTinVm.model.giaTo;
                        delete nhuCauThongTinVm.model.dienTichFrom;
                        delete nhuCauThongTinVm.model.dienTichTo;
                        editBDSBan();
                        break;
                    case 'mua':
                        editBDSMua();
                        break;
                    case 'thue':
                        editBDSThue();
                        break;
                    case 'cho-thue':
                        delete nhuCauThongTinVm.model.giaFrom;
                        delete nhuCauThongTinVm.model.giaTo;
                        delete nhuCauThongTinVm.model.dienTichFrom;
                        delete nhuCauThongTinVm.model.dienTichTo;
                        editBDSChoThue();
                        break;
                }
            } else {
                switch (nhuCauThongTinVm.model.loaiNhuCauKey) {
                    case 'ban':
                        delete nhuCauThongTinVm.model.giaFrom;
                        delete nhuCauThongTinVm.model.giaTo;
                        delete nhuCauThongTinVm.model.dienTichFrom;
                        delete nhuCauThongTinVm.model.dienTichTo;
                        addBDSBan();
                        break;
                    case 'mua':
                        addBDSMua();
                        break;
                    case 'thue':
                        addBDSThue();
                        break;
                    case 'cho-thue':
                        delete nhuCauThongTinVm.model.giaFrom;
                        delete nhuCauThongTinVm.model.giaTo;
                        delete nhuCauThongTinVm.model.dienTichFrom;
                        delete nhuCauThongTinVm.model.dienTichTo;
                        addBDSChoThue();
                        break;
                }
            }
        };

        function addBDSBan() {
            nhuCauService.addNhuCauBan(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThongTinVm.dzMethods.processQueue();
                        toaster.success("Thêm Mới Nhu Cầu Bán Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Bán Không Thành Công!");
            });            
        }

        function addBDSChoThue() {
            nhuCauService.addNhuCauBan(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThongTinVm.dzMethods.processQueue();
                        toaster.success("Thêm Mới Nhu Cầu Cho Thuê Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Cho Thuê Không Thành Công!");
            });            
        }

        function addBDSMua() {
            nhuCauService.addNhuCauMua(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thêm Mới Nhu Cầu Mua Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Mua Không Thành Công!");
            });            
        }

        function addBDSThue() {
            nhuCauService.addNhuCauMua(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thêm Mới Nhu Cầu Thuê Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Thuê Không Thành Công!");
            });            
        }

        function editBDSBan() {
            nhuCauService.updateNhuCauBan(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThongTinVm.dzMethods.processQueue();
                        toaster.success("Sửa Nhu Cầu Bán Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Bán Không Thành Công!");
            });            
        }

        function editBDSChoThue() {
            nhuCauService.updateNhuCauBan(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThongTinVm.dzMethods.processQueue();
                        toaster.success("Sửa Nhu Cầu Cho Thuê Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Cho Thuê Không Thành Công!");
            });            
        }

        function editBDSMua() {
            nhuCauService.updateNhuCauMua(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Sửa Nhu Cầu Mua Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Mua Không Thành Công!");
            });            
        }

        function editBDSThue() {
            nhuCauService.updateNhuCauMua(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Sửa Nhu Cầu Thuê Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Thuê Không Thành Công!");
            });            
        }

        nhuCauThongTinVm.cancel = function() {
            $state.go('nhuCauListing');
        };

        function getTextByKey(list, key) {
            if(!!key) {
                var result = _.find(list , ['$id', key]);
                console.log('RESLACAPCHINH', result);
                return result.text; 
            }
        }

        nhuCauThongTinVm.giaSlider = function() {
            if(nhuCauThongTinVm.model.giaFrom == nhuCauThongTinVm.model.giaTo && nhuCauThongTinVm.model.giaTo == 100000000)
                return 'Giá Dưới ' + $filter('currency')(nhuCauThongTinVm.model.giaFrom, "", 0) + ' VNĐ';
            if (nhuCauThongTinVm.model.giaFrom == nhuCauThongTinVm.model.giaTo && nhuCauThongTinVm.model.giaTo == 10000000000)
                return 'Giá Trên ' + $filter('currency')(nhuCauThongTinVm.model.giaTo, "", 0) + ' VNĐ';   
            return 'Giá Từ ' + $filter('currency')(nhuCauThongTinVm.model.giaFrom, "", 0) + ' Đến ' + $filter('currency')(nhuCauThongTinVm.model.giaTo, "", 0) + ' VNĐ'; 
        };

        nhuCauThongTinVm.dienTichSlider = function() {
            if(nhuCauThongTinVm.model.dienTichFrom == nhuCauThongTinVm.model.dienTichTo && nhuCauThongTinVm.model.dienTichTo == 50)
                return 'Diện Tích Dưới ' + $filter('currency')(nhuCauThongTinVm.model.dienTichFrom, "", 0) + ' m2';
            if (nhuCauThongTinVm.model.dienTichFrom == nhuCauThongTinVm.model.dienTichTo && nhuCauThongTinVm.model.dienTichTo == 500)
                return 'Diện Tích Trên ' + $filter('currency')(nhuCauThongTinVm.model.dienTichTo, "", 0) + ' m2';   
            return 'Diện Tích Từ ' + $filter('currency')(nhuCauThongTinVm.model.dienTichFrom, "", 0) + ' Đến ' + $filter('currency')(nhuCauThongTinVm.model.dienTichTo, "", 0) + ' m2'; 
        };

        //set type of form 
        function setForm() {
            if($stateParams.item) {
                if($stateParams.item.isEdit) {
                    nhuCauThongTinVm.model = $stateParams.item;
                    nhuCauThongTinVm.model.giaFrom = $stateParams.item.giaFrom || 100000000;
                    nhuCauThongTinVm.model.giaTo = $stateParams.item.giaTo || 100000000;
                    nhuCauThongTinVm.model.dienTichFrom = $stateParams.item.giaFrom || 50;
                    nhuCauThongTinVm.model.dienTichTo = $stateParams.item.giaTo || 50;
                    nhuCauThongTinVm.model.media = {};
                    nhuCauThongTinVm.isEdit = $stateParams.item.isEdit;
                    nhuCauThongTinVm.model.loaiNhuCauKey = $stateParams.item.loaiNhuCauKey;
                    changeForm(nhuCauThongTinVm.model.loaiNhuCauKey);
                    
                    if(nhuCauThongTinVm.model.thanhPho) 
                        nhuCauThongTinVm.changeCity(nhuCauThongTinVm.model.thanhPho);
                    if(nhuCauThongTinVm.model.quanHuyen) 
                        nhuCauThongTinVm.changeDistrict(nhuCauThongTinVm.model.quanHuyen);   
                        
                    loadMedia(nhuCauThongTinVm.model.media);    
                    googleMapInit();
                } else {
                    var loaiBDSDefault = _.find(nhuCauThongTinVm.loaiBDSList, function(o) {
                        return o.loaiForm == 'form1';
                    });
                    nhuCauThongTinVm.model = {
                        thanhPho: "notSelect",
                        quanHuyen: "notSelect",
                        phuongXa: "notSelect",
                        duongPho: "notSelect",
                        loaiViTri: "notSelect",
                        duAn: "notSelect",
                        thoaThuan: "notSelect",
                        loaiBDS: loaiBDSDefault.value
                    };
                    nhuCauThongTinVm.loaiBDSForm = loaiBDSDefault.loaiForm;
                    nhuCauThongTinVm.model.giaFrom = 100000000;
                    nhuCauThongTinVm.model.giaTo = 100000000;
                    nhuCauThongTinVm.model.dienTichFrom = 50;
                    nhuCauThongTinVm.model.dienTichTo = 50;
                    nhuCauThongTinVm.model.media = {};
                    nhuCauThongTinVm.model.khoBDSKey = !!nhuCauThongTinVm.khoBDSDefault ? nhuCauThongTinVm.khoBDSDefault: 'allKho';
                    nhuCauThongTinVm.model.loaiNhuCauKey = $stateParams.item.loaiNhuCauKey;
                    changeForm(nhuCauThongTinVm.model.loaiNhuCauKey);
                    googleMapInit();
                }
            }
        }

        function init() {
            setForm();
        }

        init();
    } 
})();