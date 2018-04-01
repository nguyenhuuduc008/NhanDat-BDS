(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauYeuToTangGiamGiaCtr', nhuCauYeuToTangGiamGiaCtr);
    	/** @ngInject */
    function nhuCauYeuToTangGiamGiaCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauYeuToGiaVm =this;// jshint ignore:line
        //
        nhuCauYeuToGiaVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauYeuToGiaVm.model = {};

        //load data


        //Function
        nhuCauYeuToGiaVm.save = function (form) {
            appUtils.showLoading();
            if (nhuCauYeuToGiaVm.isEdit) {
                switch (nhuCauYeuToGiaVm.model.loaiNhuCauKey) {
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
            nhuCauService.updateTabNhuCauMua(nhuCauYeuToGiaVm.model.khoBDSKey, 'yeuToTangGiamGia', nhuCauYeuToGiaVm.model, nhuCauYeuToGiaVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
                        toaster.success("Lưu Nhu Cầu Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Lưu Nhu Cầu Không Thành Công!");
            });            
        }

        function editBDSBan() {
            nhuCauService.updateTabNhuCauBan(nhuCauYeuToGiaVm.model.khoBDSKey, 'yeuToTangGiamGia', nhuCauYeuToGiaVm.model, nhuCauYeuToGiaVm.model.bdsKey).then(function(res) {
                if(res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function() {
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
            nhuCauYeuToGiaVm.isEdit = true;
            nhuCauYeuToGiaVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
            nhuCauYeuToGiaVm.model.khoBDSKey = $stateParams.bdsKho;
            nhuCauYeuToGiaVm.model.bdsKey = $stateParams.bdsId;
            if (nhuCauYeuToGiaVm.model.loaiNhuCauKey === 'ban' || nhuCauYeuToGiaVm.model.loaiNhuCauKey === 'cho-thue') {
                nhuCauService.getTabNhuCauBan(nhuCauYeuToGiaVm.model.khoBDSKey, 'yeuToTangGiamGia', nhuCauYeuToGiaVm.model.bdsKey).then(function (result) {
                    nhuCauYeuToGiaVm.model = result;
                    if(!!nhuCauYeuToGiaVm.model)
                        delete nhuCauYeuToGiaVm.model.$id;
                    else
                        nhuCauYeuToGiaVm.model = {};
                    nhuCauYeuToGiaVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauYeuToGiaVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauYeuToGiaVm.model.bdsKey = $stateParams.bdsId;
                });
            } else {
                nhuCauService.getTabNhuCauMua(nhuCauYeuToGiaVm.model.khoBDSKey, 'yeuToTangGiamGia', nhuCauYeuToGiaVm.model.bdsKey).then(function (result) {
                    nhuCauYeuToGiaVm.model = result;
                    if(!!nhuCauYeuToGiaVm.model)
                        delete nhuCauYeuToGiaVm.model.$id;
                    else
                        nhuCauYeuToGiaVm.model = {};
                    nhuCauYeuToGiaVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauYeuToGiaVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauYeuToGiaVm.model.bdsKey = $stateParams.bdsId;
                });
            }
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            $state.go('nhuCauListing');
        }
    } 
})();