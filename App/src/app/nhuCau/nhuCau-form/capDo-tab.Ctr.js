(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauCapDoCtr', nhuCauCapDoCtr);
    	/** @ngInject */
    function nhuCauCapDoCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauCapDoVm =this;// jshint ignore:line
        //
        nhuCauCapDoVm.model = {};
        console.log('NHU CAU APP',appSettings);
        nhuCauCapDoVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauCapDoVm.cacLoaiCapDo = appSettings.cacLoaiCapDo;

        //Function
        nhuCauCapDoVm.save = function (form) {
            appUtils.showLoading();
            if (nhuCauCapDoVm.isEdit) {
                switch (nhuCauCapDoVm.model.loaiNhuCauKey) {
                    case 'ban':
                        editBDSBan();
                        break;
                    case 'mua':
                        editBDSMua();
                        break;
                    case 'thue':
                        editBDSMua();
                        break;
                    case 'cho-thue':
                        editBDSBan();
                        break;
                }
            }
        };

        function editBDSMua() {
            nhuCauService.updateTabNhuCauMua(nhuCauCapDoVm.model.khoBDSKey, 'capDo', nhuCauCapDoVm.model, nhuCauCapDoVm.model.bdsKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Lưu Nhu Cầu Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Lưu Nhu Cầu Không Thành Công!");
            });
        }

        function editBDSBan() {
            nhuCauService.updateTabNhuCauMua(nhuCauCapDoVm.model.khoBDSKey, 'capDo', nhuCauCapDoVm.model, nhuCauCapDoVm.model.bdsKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Lưu Nhu Cầu Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Lưu Nhu Cầu Không Thành Công!");
            });
        }


        if(!!$stateParams.bdsId) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            console.log('PARMS DIDS', stateParams);
            nhuCauCapDoVm.isEdit = true;
            nhuCauCapDoVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
            nhuCauCapDoVm.model.khoBDSKey = $stateParams.bdsKho;
            nhuCauCapDoVm.model.bdsKey = $stateParams.bdsId;
            if (nhuCauCapDoVm.model.loaiNhuCauKey === 'ban' || nhuCauCapDoVm.model.loaiNhuCauKey === 'cho-thue') {
                nhuCauService.getTabNhuCauMua('capDo', nhuCauCapDoVm.model.bdsKey).then(function (result) {
                    console.log('FINAL RESUAL CAPTDO', result);
                    nhuCauCapDoVm.model = result;
                    if(!!nhuCauCapDoVm.model)
                        delete nhuCauCapDoVm.model.$id;
                    else
                        nhuCauCapDoVm.model = {};
                    nhuCauCapDoVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauCapDoVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauCapDoVm.model.bdsKey = $stateParams.bdsId;
                    console.log('PRAMS CAP DO', nhuCauCapDoVm.model);
                });
            } else {
                nhuCauService.getTabNhuCauMua('capDo', nhuCauCapDoVm.model.bdsKey).then(function (result) {
                    nhuCauCapDoVm.model = result;
                    if(!!nhuCauCapDoVm.model)
                        delete nhuCauCapDoVm.model.$id;
                    else
                        nhuCauCapDoVm.model = {};
                    nhuCauCapDoVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauCapDoVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauCapDoVm.model.bdsKey = $stateParams.bdsId;
                });
            }
            
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            $state.go('nhuCauListing');
        }
    } 
})();