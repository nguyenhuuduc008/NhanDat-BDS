(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauThemMoiCtr', nhuCauThemMoiCtr);
    	/** @ngInject */
    function nhuCauThemMoiCtr($rootScope, $scope, $state,$q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauThemMoiVm =this;// jshint ignore:line
        //
        nhuCauThemMoiVm.model = {};
        nhuCauThemMoiVm.model.loaiNhuCauKey = '0';
        //nhuCauThemMoiVm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
        nhuCauThemMoiVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        
        nhuCauThemMoiVm.options = {
            start: [20, 70],
            range: {min: 0, max: 100}
        };

        //Load data
        settingService.getCacLoaiDanhMucBDS().$loaded().then(function (data) {
            nhuCauThemMoiVm.khoBDSList = _.filter(data, function (o) {
                return o.$id !== "khoDefault";
            });
            nhuCauThemMoiVm.khoBDSDefault = _.find(data, ['$id', 'khoDefault']);
            nhuCauThemMoiVm.model.khoBDSKey = !!nhuCauThemMoiVm.khoBDSDefault ? nhuCauThemMoiVm.khoBDSDefault.$value : 'allKho';
        });
        settingService.getListLoaiHanhChinh('capTinh').then(function(data) {
            nhuCauThemMoiVm.cities = data;
        });

        nhuCauThemMoiVm.changeCity = function () {
            settingService.getListChildHanhChinh('capHuyen', nhuCauThemMoiVm.model.thanhPho).then(function(data) {
                nhuCauThemMoiVm.districts = data;
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
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/ban-form.tpl.html';
                    break;
                case 'mua':
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/mua-form.tpl.html';
                    break;
                case 'thue':
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/thue-form.tpl.html';
                    break;
                case 'cho-thue':
                    nhuCauThemMoiVm.formLink = './app/nhuCau/nhuCau-form/choThue-form.tpl.html';
                    break;
            }
        };

        nhuCauThemMoiVm.save = function (form) {
            appUtils.showLoading();
            console.log('DATAAAAAAAAAAAAAAA', nhuCauThemMoiVm.model);
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
        };

        function addBDSBan() {
            nhuCauService.addNhuCauBan(nhuCauThemMoiVm.model.khoBDSKey, nhuCauThemMoiVm.model.loaiNhuCauKey, nhuCauThemMoiVm.model).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Thêm Mới Nhu Cầu Bán Thành Công");
                        return;
                    });
                   
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
                        toaster.success("Thêm Mới Nhu Cầu Cho Thuê Thành Công");
                        return;
                    });
                   
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
                        return;
                    });
                   
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
                        return;
                    });
                   
                }
                appUtils.hideLoading();
                toaster.error("Thêm Mới Nhu Cầu Thuê Không Thành Công!");
            });            
        }

        // nhuCauThemMoiVm.xacNhan=function(idLoaiNhuCau){
        //     //check valid
        //     var idLoaiNhuCauValue=$('#' + idLoaiNhuCau).val();
        //     var idLoaiNhuCauText=$('#'+idLoaiNhuCau + ' option:selected').text();
        //     console.log('idLoaiNhuCauText');
        //     console.log(idLoaiNhuCauText);
        //     if(idLoaiNhuCauValue=='0'){
        //         toaster.warning("Lựa Chọn chưa được chọn!");
        //         return;
        //     }
        //     //ban + cho thue
        //     if(idLoaiNhuCauText=='Bán'){
        //         console.log('Ban');
                
        //         $state.go('ban_choThueAdd',{
        //             activeTab:'thongTin',
        //             loaiNhuCauId:idLoaiNhuCauValue,
        //             loaiNhuCauText:idLoaiNhuCauText
        //         });
        //     }
        //     if(idLoaiNhuCauText=='Cho Thuê'){
        //         console.log('Cho thue');
        //         $state.go('ban_choThueAdd',{
        //             activeTab:'thongTin',
        //             loaiNhuCauId:idLoaiNhuCauValue,
        //             loaiNhuCauText:idLoaiNhuCauText
        //         });
        //     } 
        //     //mua _ thue

        // };

        nhuCauThemMoiVm.cancel = function() {
            $state.go('nhuCauListing');
        };

    } 
})();