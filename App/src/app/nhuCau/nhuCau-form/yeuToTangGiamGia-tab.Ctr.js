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
            delete nhuCauYeuToGiaVm.model.$id;
            if($stateParams.loaiId === 'ban' || $stateParams.loaiId === 'cho-thue') {
                editTabBDS('yeuToTangGiamGia', nhuCauYeuToGiaVm.model, nhuCauYeuToGiaVm.model.bdsKey);
            }
            else {
                editTab('yeuToTangGiamGia', nhuCauYeuToGiaVm.model, nhuCauYeuToGiaVm.model.nhuCauKey, false);
            }
        };

        function editTabBDS(nhuCauTab, nhuCauModel, bdsKey) {
            nhuCauService.updateTabNhuCauToBDS(nhuCauTab, nhuCauModel, bdsKey).then(function(res) {
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

        function editTab(nhuCauTab, nhuCauModel, nhuCauKey, isLinked) {
            nhuCauService.updateTabNhuCau(nhuCauTab, nhuCauModel, nhuCauKey, isLinked).then(function (res) {
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


        if (!!$stateParams.item) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            nhuCauYeuToGiaVm.model = {};
            nhuCauYeuToGiaVm.model.loaiNhuCauKey = $stateParams.loaiId;
            nhuCauYeuToGiaVm.model.khoBDSKey = $stateParams.khoId;
            nhuCauYeuToGiaVm.model.nhuCauKey = $stateParams.nhuCauId;
            if($stateParams.loaiId === 'ban' || $stateParams.loaiId === 'cho-thue') {
                nhuCauYeuToGiaVm.model.bdsKey = $stateParams.item.bdsKey;
                nhuCauService.getTabNhuCauFromBDS('yeuToTangGiamGia', nhuCauYeuToGiaVm.model.bdsKey).then(function (result) {
                    if (!!result) {
                        nhuCauYeuToGiaVm.model = result;
                        $scope.$apply();
                    }
                });
            }
            else {
                nhuCauService.getTabNhuCau('yeuToTangGiamGia', nhuCauYeuToGiaVm.model.nhuCauKey).then(function (result) {
                    if (!!result) {
                        nhuCauYeuToGiaVm.model = result;
                        $scope.$apply();
                    }
                });
            }
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            $state.go('nhuCauListing');
        }
    } 
})();