(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauLichSuGiaCtr', nhuCauLichSuGiaCtr);
    	/** @ngInject */
    function nhuCauLichSuGiaCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauLichSuGiaVm =this;// jshint ignore:line
        //

        nhuCauLichSuGiaVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu

        //Function
        if($stateParams.item.isEdit) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
        }
    } 
})();