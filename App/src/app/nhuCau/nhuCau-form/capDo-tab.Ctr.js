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
        nhuCauCapDoVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauCapDoVm.cacLoaiCapDo = appSettings.cacLoaiCapDo;

        //Function
        nhuCauCapDoVm.save = function (form) {
            appUtils.showLoading();
            delete nhuCauCapDoVm.model.$id;
            editTab('capDo', nhuCauCapDoVm.model, nhuCauCapDoVm.model.nhuCauKey, false);
        };

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

        if (!!$stateParams.nhuCauId) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            nhuCauCapDoVm.model = {};
            nhuCauCapDoVm.model.loaiNhuCauKey = $stateParams.loaiId;
            nhuCauCapDoVm.model.khoBDSKey = $stateParams.khoId;
            nhuCauCapDoVm.model.nhuCauKey = $stateParams.nhuCauId;
            nhuCauService.getTabNhuCau('capDo', nhuCauCapDoVm.model.nhuCauKey).then(function (result) {
                if (!!result) {
                    nhuCauCapDoVm.model = result;
                    $scope.$apply();
                }
            });
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            $state.go('nhuCauListing');
        }
    } 
})();