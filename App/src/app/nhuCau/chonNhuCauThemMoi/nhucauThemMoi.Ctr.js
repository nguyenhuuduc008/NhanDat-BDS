(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauThemMoiCtr', nhuCauThemMoiCtr);
    	/** @ngInject */
    function nhuCauThemMoiCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauThemMoiVm =this;// jshint ignore:line
        //
        nhuCauThemMoiVm.cacKhoBDS = appSettings.cacKhoBDS;
        nhuCauThemMoiVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        nhuCauThemMoiVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        nhuCauThemMoiVm.cacLoaiViTri = appSettings.cacLoaiViTri;
        nhuCauThemMoiVm.cacDuAn = appSettings.cacDuAn;
        nhuCauThemMoiVm.cacLoaiHuong = appSettings.cacLoaiHuong;
        
        nhuCauThemMoiVm.khoBDSList = [];
        nhuCauThemMoiVm.cities = [];
        nhuCauThemMoiVm.districts = [];
        var districts;
        var bdsKey;
        console.log('APPSETTING', appSettings);
        
        nhuCauThemMoiVm.options = {
            start: [20, 70],
            range: {min: 0, max: 100}
        };

        //Load data
        _.forEach(nhuCauThemMoiVm.cacKhoBDS, function(item, key) {
            if(key != 'khoDefault') {
                nhuCauThemMoiVm.khoBDSList.push({
                    $id: key,
                    text: item.text
                });
            } else 
                nhuCauThemMoiVm.khoBDSDefault = item;
        });

        _.forEach(nhuCauThemMoiVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            nhuCauThemMoiVm.cities.push({
                $id: key,
                text: item.text
            });
        });

        //media 
        function createDropzone(khoBDSKey, loaiNhuCauKey) {
            Dropzone.autoDiscover = false;
            nhuCauThemMoiVm.dzOptions = {
                url: 'bds_nhucau/' + khoBDSKey + '/' + loaiNhuCauKey,
                firebaseStorage: true,
                parallelUploads: 10,
                dictDefaultMessage: '(Click để tải ảnh hoặc kéo thả ảnh vào đây)',
                autoProcessQueue: false
            };
        }

        nhuCauThemMoiVm.dzCallbacks = {
            'addedfile': function (file) {
          
                //nhuCauService.uploadMediaStorage(nhuCauThemMoiVm.dzOptions.url, file, metadata);
            },
            'success': function (file, response) {
                console.log('RESPON', response);
                var metadata = {
                    "fileName": file.name,
                    "fileSize": file.size,
                    "fileType": file.type,
                    "lastModified": file.lastModified,
                };
                nhuCauService.uploadMediaStorage(nhuCauThemMoiVm.dzOptions.url, file, metadata);

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
                console.log('MD5', metadata.md5Hash);
                nhuCauThemMoiVm.model.media[metadata.generation] = mediaData;
                nhuCauService.updateNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model, bdsKey);
            },
            'error': function (file, err) {
                console.log('upload img error');
                console.log(file);
                console.log(err);
            }
        };

        nhuCauThemMoiVm.dzMethods = {};
      
        //function
        nhuCauThemMoiVm.changeCity = function () {
            nhuCauThemMoiVm.districts = [];
            _.forEach(nhuCauThemMoiVm.cacLoaiHanhChinh.capHuyen, function (item, key) {
                if(key === nhuCauThemMoiVm.model.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                nhuCauThemMoiVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });
        };
        
        nhuCauThemMoiVm.changeDistrict = function () {
            settingService.getListChildHanhChinh('capXa', nhuCauThemMoiVm.model.quanHuyen).then(function(data) {
                nhuCauThemMoiVm.xaList = data;
            });
            settingService.getListChildHanhChinh('duong', nhuCauThemMoiVm.model.quanHuyen).then(function(data) {
                nhuCauThemMoiVm.duongList = data;
            });
		};

        //Function
        nhuCauThemMoiVm.changeForm = function (key) {
            console.log('KEYEEEEEEEE', key);
            switch (key) {
                case 'ban':
                    createDropzone(nhuCauThemMoiVm.model.khoBDSKey, key);
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/ban-form.tpl.html';
                    break;
                case 'mua':
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/mua-form.tpl.html';
                    break;
                case 'thue':
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/thue-form.tpl.html';
                    break;
                case 'cho-thue':
                    createDropzone(nhuCauThemMoiVm.model.khoBDSKey, key);
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/choThue-form.tpl.html';
                    break;
            }
        };

        nhuCauThemMoiVm.save = function (form) {
            appUtils.showLoading();
            if(nhuCauThemMoiVm.isEdit) {
                switch (nhuCauThemMoiVm.model.loaiNhuCauKey) {
                    case 'ban':
                        editBDSBan();
                        break;
                    case 'mua':
                        editBDSMua();
                        break;
                    case 'thue':
                        editBDSThue();
                        break;
                    case 'cho-thue':
                        editBDSChoThue();
                        break;
                }
            } else {
                switch (nhuCauThemMoiVm.model.loaiNhuCauKey) {
                    case 'ban':
                        addBDSBan();
                        break;
                    case 'mua':
                        addBDSMua();
                        break;
                    case 'thue':
                        addBDSThue();
                        break;
                    case 'cho-thue':
                        addBDSChoThue();
                        break;
                }
            }
        };

        function addBDSBan() {
            nhuCauService.addNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThemMoiVm.dzMethods.processQueue();
                        toaster.success("Thêm Mới Nhu Cầu Bán Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Bán Không Thành Công!");
            });            
        }

        function addBDSChoThue() {
            nhuCauService.addNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThemMoiVm.dzMethods.processQueue();
                        toaster.success("Thêm Mới Nhu Cầu Cho Thuê Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Cho Thuê Không Thành Công!");
            });            
        }

        function addBDSMua() {
            nhuCauService.addNhuCauMua(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thêm Mới Nhu Cầu Mua Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Mua Không Thành Công!");
            });            
        }

        function addBDSThue() {
            nhuCauService.addNhuCauMua(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thêm Mới Nhu Cầu Thuê Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Thuê Không Thành Công!");
            });            
        }

        function editBDSBan() {
            nhuCauService.updateNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model, nhuCauThemMoiVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThemMoiVm.dzMethods.processQueue();
                        toaster.success("Sửa Nhu Cầu Bán Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Bán Không Thành Công!");
            });            
        }

        function editBDSChoThue() {
            nhuCauService.updateNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model, nhuCauThemMoiVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        bdsKey = res.key;
                        nhuCauThemMoiVm.dzMethods.processQueue();
                        toaster.success("Sửa Nhu Cầu Cho Thuê Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Cho Thuê Không Thành Công!");
            });            
        }

        function editBDSMua() {
            nhuCauService.updateNhuCauMua(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model, nhuCauThemMoiVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Sửa Nhu Cầu Mua Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Mua Không Thành Công!");
            });            
        }

        function editBDSThue() {
            nhuCauService.updateNhuCauMua(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model, nhuCauThemMoiVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Sửa Nhu Cầu Thuê Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Sửa Nhu Cầu Thuê Không Thành Công!");
            });            
        }

        nhuCauThemMoiVm.cancel = function() {
            $state.go('nhuCauListing');
        };

        //set type of form 
        function setForm() {
            if($stateParams.isEdit) {
                nhuCauThemMoiVm.model = $stateParams.item;
                console.log('PARANS', nhuCauThemMoiVm.model);
                nhuCauThemMoiVm.isEdit = $stateParams.isEdit;
                nhuCauThemMoiVm.changeForm(nhuCauThemMoiVm.model.loaiNhuCauKey);
                if(nhuCauThemMoiVm.model.thanhPho) 
                    nhuCauThemMoiVm.changeCity(nhuCauThemMoiVm.model.thanhPho);
                if(nhuCauThemMoiVm.model.quanHuyen) 
                    nhuCauThemMoiVm.changeDistrict(nhuCauThemMoiVm.model.quanHuyen);    
            } else {
                nhuCauThemMoiVm.model = {};
                nhuCauThemMoiVm.model.loaiNhuCauKey = '0';
                nhuCauThemMoiVm.model.media = {};
                nhuCauThemMoiVm.model.khoBDSKey = !!nhuCauThemMoiVm.khoBDSDefault ? nhuCauThemMoiVm.khoBDSDefault: 'allKho';
            }
        }

        function init() {
            setForm();
        }

        init();
    } 
})();