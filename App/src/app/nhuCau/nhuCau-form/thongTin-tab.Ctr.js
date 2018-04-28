(function () {
    'use strict';
    angular.module('app.nhuCau')
        .controller('nhuCauThongTinCtr', nhuCauThongTinCtr);
    /** @ngInject */
    function nhuCauThongTinCtr($rootScope, $scope, $state, $stateParams, $q, $filter, nhuCauService, appUtils, $ngBootbox, toaster, settingService, bdsService, userService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;

        var nhuCauThongTinVm = this;// jshint ignore:line
        //
        nhuCauThongTinVm.cacKhoBDS = appSettings.cacKhoBDS;
        nhuCauThongTinVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        nhuCauThongTinVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        nhuCauThongTinVm.cacLoaiViTri = appSettings.cacLoaiViTri;
        nhuCauThongTinVm.cacDuAn = appSettings.cacDuAn;
        nhuCauThongTinVm.cacLoaiHuong = appSettings.cacLoaiHuong;
        nhuCauThongTinVm.loaiBDSList = appSettings.cacLoaiBDS;

        nhuCauThongTinVm.contactUser = {};
        nhuCauThongTinVm.khoBDSList = [];
        nhuCauThongTinVm.cities = [];
        nhuCauThongTinVm.districts = [];
        var bdsKey;
        console.log('APPSETTING', appSettings);

        //Load data
        _.forEach(nhuCauThongTinVm.cacKhoBDS, function (item, key) {
            if (key != 'khoDefault') {
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
                nhuCauThongTinVm.bds.media[metadata.generation] = mediaData;
                nhuCauService.updateMediaData(nhuCauThongTinVm.model.khoBDSKey, bdsKey, mediaData, metadata.generation);
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

        nhuCauThongTinVm.saveMedia = function (mediaObj) {
            appUtils.showLoading();
            var mediaModel = {
                fileDescription: mediaObj.fileDescription,
            };
            nhuCauService.updateMediaData(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.bdsKey, mediaModel, mediaObj.mediaKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Thay Đổi Hình Ảnh / Video Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thay Đổi Hình Ảnh / Video Không Thành Công!");
            });
        };

        nhuCauThongTinVm.deleteMedia = function (mediaObj) {
            nhuCauService.deleteMediaData(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.bdsKey, mediaObj.mediaKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        nhuCauService.deleteMediaStorage(mediaObj.fullPath);

                        var media = _.filter(nhuCauThongTinVm.filteredItems, function (o) {
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
            var defLatitude = 56.162939;
            var defLongitude = 10.203921;
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

            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
                'address': tinhThanh + ',' + quanHuyen + ',' + phuongXa + ',' + duongPho
            }, function (result, status) {
                var lat = result[0].geometry.location.lat();
                var lon = result[0].geometry.location.lng();
                setLatLong(lat, lon);
            });
        }

        $scope.$watchCollection("marker.coords", function (newVal, oldVal) {
            if (_.isEqual(newVal, oldVal))
                return;
            nhuCauThongTinVm.bds.lat = newVal.latitude;
            nhuCauThongTinVm.bds.lon = newVal.longitude;
        });

        nhuCauThongTinVm.getToaDo = function () {
            var thanhPho = nhuCauThongTinVm.bds.thanhPho === "notSelect" ? getTextByKey(nhuCauThongTinVm.cities, null) : getTextByKey(nhuCauThongTinVm.cities, nhuCauThongTinVm.bds.thanhPho);
            var quanHuyen = nhuCauThongTinVm.bds.quanHuyen === "notSelect" ? getTextByKey(nhuCauThongTinVm.districts, null) : getTextByKey(nhuCauThongTinVm.districts, nhuCauThongTinVm.bds.quanHuyen);
            var phuongXa = nhuCauThongTinVm.bds.phuongXa === "notSelect" ? getTextByKey(nhuCauThongTinVm.xaList, null) : getTextByKey(nhuCauThongTinVm.xaList, nhuCauThongTinVm.bds.phuongXa);
            var duongPho = nhuCauThongTinVm.bds.duongPho === "notSelect" ? getTextByKey(nhuCauThongTinVm.duongList, null) : getTextByKey(nhuCauThongTinVm.duongList, nhuCauThongTinVm.bds.duongPho);

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
        }

        function error(err) {
            console.warn(`ERROR(${err.code}): ${err.message}`);
        }

        nhuCauThongTinVm.getGPS = function () {
            navigator.geolocation.getCurrentPosition(success, error, options);
        };

        //function
        nhuCauThongTinVm.changeCity = function (quanHuyen, phuongXa, duongPho) {
            nhuCauThongTinVm.xaList = [];
            nhuCauThongTinVm.duongList = [];
            nhuCauThongTinVm.districts = [];
            nhuCauThongTinVm.bds.phuongXa = "notSelect";
            nhuCauThongTinVm.bds.duongPho = "notSelect";
            nhuCauThongTinVm.bds.quanHuyen = "notSelect";
            if (!!quanHuyen)
                nhuCauThongTinVm.bds.quanHuyen = quanHuyen;
            if (!!phuongXa)
                nhuCauThongTinVm.bds.phuongXa = phuongXa;
            if (!!duongPho)
                nhuCauThongTinVm.bds.duongPho = duongPho;
            if (nhuCauThongTinVm.bds.thanhPho === "notSelect") {
                return;
            }
            nhuCauThongTinVm.districts = [];
            _.forEach(nhuCauThongTinVm.cacLoaiHanhChinh.capHuyen[nhuCauThongTinVm.bds.thanhPho], function (item, key) {
                nhuCauThongTinVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
        };

        nhuCauThongTinVm.changeDistrict = function (phuongXa, duongPho) {
            nhuCauThongTinVm.xaList = [];
            nhuCauThongTinVm.duongList = [];
            nhuCauThongTinVm.bds.phuongXa = "notSelect";
            nhuCauThongTinVm.bds.duongPho = "notSelect";
            if (nhuCauThongTinVm.bds.quanHuyen === "notSelect") {
                return;
            }
            nhuCauThongTinVm.xaList = [];
            var capXa = !!nhuCauThongTinVm.cacLoaiHanhChinh.capXa[nhuCauThongTinVm.bds.thanhPho] ? nhuCauThongTinVm.cacLoaiHanhChinh.capXa[nhuCauThongTinVm.bds.thanhPho] : {};
            _.forEach(capXa[nhuCauThongTinVm.bds.quanHuyen], function (item, key) {
                nhuCauThongTinVm.xaList.push({
                    $id: key,
                    text: item.text
                });
            });
            var duong = !!nhuCauThongTinVm.cacLoaiHanhChinh.duong[nhuCauThongTinVm.bds.thanhPho] ? nhuCauThongTinVm.cacLoaiHanhChinh.duong[nhuCauThongTinVm.bds.thanhPho] : {};
            nhuCauThongTinVm.duongList = [];
            _.forEach(duong[nhuCauThongTinVm.bds.quanHuyen], function (item, key) {
                nhuCauThongTinVm.duongList.push({
                    $id: key,
                    text: item.text
                });
            });
            if (!!phuongXa)
                nhuCauThongTinVm.bds.phuongXa = phuongXa;
            if (!!duongPho)
                nhuCauThongTinVm.bds.duongPho = duongPho;
        };

        nhuCauThongTinVm.changeStreet = function () {
            //if(nhuCauThongTinVm.isMapInit) return;
        };

        nhuCauThongTinVm.changeLoaiBDS = function (item) {
            var loaiBDSSelected = _.find(nhuCauThongTinVm.loaiBDSList, function (o) {
                return o.value == item;
            });
            nhuCauThongTinVm.loaiBDSForm = loaiBDSSelected.loaiForm;
        };

        //Function
        function changeForm(key, khoKey) {
            switch (key) {
                case 'ban':
                    nhuCauThongTinVm.showMapMedia = true;
                    createDropzone(khoKey, key);
                    break;
                case 'mua':
                    nhuCauThongTinVm.showMapMedia = false;
                    break;
                case 'thue':
                    nhuCauThongTinVm.showMapMedia = false;
                    break;
                case 'cho-thue':
                    nhuCauThongTinVm.showMapMedia = true;
                    createDropzone(khoKey, key);
                    break;
            }
        }

        nhuCauThongTinVm.save = function (form) {
            appUtils.showLoading();
            if (nhuCauThongTinVm.isEdit) {
                if (nhuCauThongTinVm.model.loaiNhuCauKey === 'ban' || nhuCauThongTinVm.model.loaiNhuCauKey === 'cho-thue') {
                    if (!!nhuCauThongTinVm.model.activeTab)
                        delete nhuCauThongTinVm.model.activeTab;

                    editNhuCauWithBDS(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.bds, $stateParams.nhuCauId);
                }
                else {
                    nhuCauThongTinVm.model = _.assignIn(nhuCauThongTinVm.model, nhuCauThongTinVm.bds);
                    editNhuCauBDS(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, $stateParams.nhuCauId);
                }
            }
            else {
                if (nhuCauThongTinVm.model.loaiNhuCauKey === 'ban' || nhuCauThongTinVm.model.loaiNhuCauKey === 'cho-thue') {
                    delete nhuCauThongTinVm.model.donGiaFrom;
                    delete nhuCauThongTinVm.model.donGiaTo;
                    delete nhuCauThongTinVm.model.tongGiaFrom;
                    delete nhuCauThongTinVm.model.tongGiaTo;
                    delete nhuCauThongTinVm.bds.dienTichFrom;
                    delete nhuCauThongTinVm.bds.dienTichTo;
                    addNhuCauWithBDS(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model, nhuCauThongTinVm.bds);
                }
                else {
                    nhuCauThongTinVm.model = _.assignIn(nhuCauThongTinVm.model, nhuCauThongTinVm.bds);
                    addNhuCauBDS(nhuCauThongTinVm.model.khoBDSKey, nhuCauThongTinVm.model.loaiNhuCauKey, nhuCauThongTinVm.model);
                }
            }
        };

        function addNhuCauBDS(khoBDSId, loaiNhuCauId, nhuCauModel) {
            nhuCauService.addNhuCau(khoBDSId, loaiNhuCauId, nhuCauModel).then(function (res) {
                if (res.result) {
                    $scope.$apply(function () {
                        var linkCreateUser = {
                            phone: currentUser.phoneNumber,
                            name: currentUser.lastName + ' ' + currentUser.firstName,
                            loaiLienKetUser: "createUserUniq",
                            timeCreated: Date.now(),
                            khoBDSKey: nhuCauThongTinVm.model.khoBDSKey,
                            loaiNhuCauKey: nhuCauThongTinVm.model.loaiNhuCauKey
                        };
                        nhuCauService.updateTabNhuCau('lienKetUser', linkCreateUser, res.key, true);

                        toaster.success("Thêm Mới Nhu Cầu Thành Công");
                        $state.go('nhuCauListing');
                    });
                    appUtils.hideLoading();
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Không Thành Công!");
            });
        }

        function editNhuCauBDS(khoBDSId, loaiNhuCauId, nhuCauModel, nhuCauKey) {
            nhuCauService.updateNhuCau(khoBDSId, loaiNhuCauId, nhuCauModel, nhuCauKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Sửa Nhu Cầu Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Không Thành Công!");
            });
        }

        function addNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel, nhuCauKey) {
            nhuCauService.addNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel, nhuCauKey).then(function (res) {
                if (res.result) {
                    $scope.$apply(function () {
                        bdsKey = res.bdsKey;
                        nhuCauThongTinVm.dzMethods.processQueue();

                        setTimeout(function () {
                            var linkCreateUser = {
                                phone: currentUser.phoneNumber,
                                name: currentUser.lastName + ' ' + currentUser.firstName,
                                loaiLienKetUser: "createUserUniq",
                                timeCreated: Date.now(),
                                khoBDSKey: nhuCauThongTinVm.model.khoBDSKey,
                                loaiNhuCauKey: nhuCauThongTinVm.model.loaiNhuCauKey
                            };
                            nhuCauService.updateTabNhuCau('lienKetUser', linkCreateUser, res.nhuCaukey, true);
                            bdsService.updateTab(bdsKey, linkCreateUser, 'lienKetUser', true);
                        }, 500);
                        toaster.success("Thêm Mới Nhu Cầu Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Không Thành Công!");
            });
        }

        function editNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel, nhuCauKey) {
            nhuCauService.updateNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel, nhuCauKey).then(function (res) {
                if (res.result) {
                    $scope.$apply(function () {
                        bdsKey = res.bdsKey;
                        nhuCauThongTinVm.dzMethods.processQueue();
                        toaster.success("Sửa Nhu Cầu Thành Công");
                        $state.go('nhuCauListing');
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Không Thành Công!");
            });
        }

        nhuCauThongTinVm.cancel = function () {
            $state.go('nhuCauListing');
        };

        function getTextByKey(list, key) {
            if (!!key) {
                var result = _.find(list, ['$id', key]);
                return result.text;
            }
        }

        nhuCauThongTinVm.selectDonvi = function (donVi, loaiGia) {
            if (loaiGia === "donGia") {
                if (donVi === 'deal') {
                    nhuCauThongTinVm.model.donGia = 0;
                }
            }
            else {
                if (donVi === 'deal') {
                    nhuCauThongTinVm.model.tongGia = 0;
                }
            }
        };

        nhuCauThongTinVm.donGiaSlider = function () {
            if (nhuCauThongTinVm.model.donGiaFrom == nhuCauThongTinVm.model.donGiaTo && nhuCauThongTinVm.model.donGiaTo == 100000000)
                return 'Giá Dưới ' + $filter('currency')(nhuCauThongTinVm.model.donGiaFrom, "", 0) + ' VNĐ';
            if (nhuCauThongTinVm.model.donGiaFrom == nhuCauThongTinVm.model.donGiaTo && nhuCauThongTinVm.model.donGiaTo == 10000000000)
                return 'Giá Trên ' + $filter('currency')(nhuCauThongTinVm.model.donGiaTo, "", 0) + ' VNĐ';
            return 'Giá Từ ' + $filter('currency')(nhuCauThongTinVm.model.donGiaFrom, "", 0) + ' Đến ' + $filter('currency')(nhuCauThongTinVm.model.donGiaTo, "", 0) + ' VNĐ';
        };

        nhuCauThongTinVm.tongGiaSlider = function () {
            if (nhuCauThongTinVm.model.tongGiaFrom == nhuCauThongTinVm.model.tongGiaTo && nhuCauThongTinVm.model.tongGiaTo == 100000000)
                return 'Giá Dưới ' + $filter('currency')(nhuCauThongTinVm.model.tongGiaFrom, "", 0) + ' VNĐ';
            if (nhuCauThongTinVm.model.tongGiaFrom == nhuCauThongTinVm.model.tongGiaTo && nhuCauThongTinVm.model.tongGiaTo == 10000000000)
                return 'Giá Trên ' + $filter('currency')(nhuCauThongTinVm.model.tongGiaTo, "", 0) + ' VNĐ';
            return 'Giá Từ ' + $filter('currency')(nhuCauThongTinVm.model.tongGiaFrom, "", 0) + ' Đến ' + $filter('currency')(nhuCauThongTinVm.model.tongGiaTo, "", 0) + ' VNĐ';
        };

        nhuCauThongTinVm.dienTichSlider = function () {
            if (nhuCauThongTinVm.bds.dienTichFrom == nhuCauThongTinVm.bds.dienTichTo && nhuCauThongTinVm.bds.dienTichTo == 50)
                return 'Diện Tích Dưới ' + $filter('currency')(nhuCauThongTinVm.bds.dienTichFrom, "", 0);
            if (nhuCauThongTinVm.bds.dienTichFrom == nhuCauThongTinVm.bds.dienTichTo && nhuCauThongTinVm.bds.dienTichTo == 500)
                return 'Diện Tích Trên ' + $filter('currency')(nhuCauThongTinVm.bds.dienTichTo, "", 0);
            return 'Diện Tích Từ ' + $filter('currency')(nhuCauThongTinVm.bds.dienTichFrom, "", 0) + ' Đến ' + $filter('currency')(nhuCauThongTinVm.bds.dienTichTo, "", 0);
        };

        function checkContactUser(loaiNhuCauId, linkedList) {
            var find;
            switch (loaiNhuCauId) {
                case 'ban':
                    find = _.find(linkedList, function (o) {
                        return o.loaiLienKetUser == "1";
                    });
                    break;
                case 'cho-thue':
                    find = _.find(linkedList, function (o) {
                        return o.loaiLienKetUser == "1";
                    });
                    break;
                case 'mua':
                    find = _.find(linkedList, function (o) {
                        return o.loaiLienKetUser == "-LA44NgCmhU6d05Alyx5";
                    });
                    break;
                case 'thue':
                    find = _.find(linkedList, function (o) {
                        return o.loaiLienKetUser == "-LA44UJaXJ-KlSyJ6Wj6";
                    });
                    break;
            }
            return find;
        }

        //set type of form 
        function setForm() {
            if (!!$stateParams.nhuCauId) {
                nhuCauThongTinVm.model = {
                    donGiaFrom: 100000000,
                    donGiaTo: 100000000,
                    tongGiaFrom: 100000000,
                    tongGiaTo: 100000000,
                };
                nhuCauThongTinVm.bds = {
                    dienTichFrom: 50,
                    dienTichTo: 50,
                };
                changeForm($stateParams.loaiId, $stateParams.khoId);
                nhuCauThongTinVm.isEdit = true;
                googleMapInit();
                nhuCauService.getOnceNhuCau($stateParams.khoId, $stateParams.loaiId, $stateParams.nhuCauId).then(function (res) {
                    nhuCauThongTinVm.model = res;
                    if ($stateParams.loaiId === "mua" || $stateParams.loaiId === "thue") {
                        delete nhuCauThongTinVm.model.$id;
                        nhuCauThongTinVm.bds = nhuCauThongTinVm.model;

                        var loaiBDS = _.find(nhuCauThongTinVm.loaiBDSList, function (o) {
                            return o.value == nhuCauThongTinVm.bds.loaiBDS;
                        });
                        nhuCauThongTinVm.loaiBDSForm = loaiBDS.loaiForm;
                        var phuongXa = _.cloneDeep(nhuCauThongTinVm.bds.phuongXa);
                        var duongPho = _.cloneDeep(nhuCauThongTinVm.bds.duongPho);
                        if (nhuCauThongTinVm.bds.thanhPho)
                            nhuCauThongTinVm.changeCity(nhuCauThongTinVm.bds.quanHuyen);
                        if (nhuCauThongTinVm.bds.quanHuyen)
                            nhuCauThongTinVm.changeDistrict(phuongXa, duongPho);

                        $scope.$apply();
                    }
                    else {
                        bdsService.getBDS($stateParams.khoId, nhuCauThongTinVm.model.bdsKey).then(function (result) {
                            nhuCauThongTinVm.bds = result;
                            delete nhuCauThongTinVm.bds.$id;
                            delete nhuCauThongTinVm.model.$id;

                            var loaiBDS = _.find(nhuCauThongTinVm.loaiBDSList, function (o) {
                                return o.value == nhuCauThongTinVm.bds.loaiBDS;
                            });
                            nhuCauThongTinVm.loaiBDSForm = loaiBDS.loaiForm;
                            var phuongXa = _.cloneDeep(nhuCauThongTinVm.bds.phuongXa);
                            var duongPho = _.cloneDeep(nhuCauThongTinVm.bds.duongPho);
                            if (nhuCauThongTinVm.bds.thanhPho)
                                nhuCauThongTinVm.changeCity(nhuCauThongTinVm.bds.quanHuyen, nhuCauThongTinVm.bds.phuongXa, nhuCauThongTinVm.bds.duongPho);
                            if (nhuCauThongTinVm.bds.quanHuyen)
                                nhuCauThongTinVm.changeDistrict(phuongXa, duongPho);
                            if (!nhuCauThongTinVm.bds.media)
                                nhuCauThongTinVm.bds.media = {};
                            loadMedia(nhuCauThongTinVm.bds.media);
                            if (!!nhuCauThongTinVm.bds.lat && !!nhuCauThongTinVm.bds.lon)
                                setLatLong(nhuCauThongTinVm.bds.lat, nhuCauThongTinVm.bds.lon);
                            $scope.$apply();
                        });
                    }
                });
                // nhuCauService.getTabNhuCau('lienKetUser', $stateParams.nhuCauId).then(function (result) {
                //     var contactUser = checkContactUser($stateParams.loaiId, result);
                //     console.log('LIEN KET', contactUser);
                //     if (!!contactUser) {
                //         userService.get(contactUser.phone).$loaded().then(function (userRs) {
                //             console.log('LIEN KET USER', userRs);
                //             nhuCauThongTinVm.contactUser = {
                //                 contactName: userRs.lastName + ' ' + userRs.firstName || '',
                //                 address: userRs.address || '',
                //                 email: userRs.email || '',
                //                 phone: userRs.phoneNumber || '',
                //                 cellPhone: userRs.cellPhone || ''
                //             };
                //         });
                //     }
                // });
            } else {
                nhuCauThongTinVm.isEdit = false;
                var loaiBDSDefault = _.find(nhuCauThongTinVm.loaiBDSList, function (o) {
                    return o.loaiForm == 'form1';
                });
                nhuCauThongTinVm.model = {
                    donGiaFrom: 100000000,
                    donGiaTo: 100000000,
                    tongGiaFrom: 100000000,
                    tongGiaTo: 100000000,
                    donViDonGia: '1',
                    donViTongGia: '1',
                };
                nhuCauThongTinVm.bds = {
                    loaiViTri: "notSelect",
                    duAn: "notSelect",
                    dienTichFrom: 50,
                    dienTichTo: 50,
                    thanhPho: "notSelect",
                    quanHuyen: "notSelect",
                    phuongXa: "notSelect",
                    duongPho: "notSelect",
                    loaiBDS: loaiBDSDefault.value,
                    media: {}
                };
                nhuCauThongTinVm.loaiBDSForm = loaiBDSDefault.loaiForm;
                nhuCauThongTinVm.model.khoBDSKey = !!nhuCauThongTinVm.khoBDSDefault ? nhuCauThongTinVm.khoBDSDefault : 'allKho';
                nhuCauThongTinVm.model.loaiNhuCauKey = $stateParams.loaiId;
                changeForm($stateParams.loaiId, $stateParams.khoId);
                googleMapInit();
            }
        }

        function init() {
            setForm();
        }

        init();
    }
})();