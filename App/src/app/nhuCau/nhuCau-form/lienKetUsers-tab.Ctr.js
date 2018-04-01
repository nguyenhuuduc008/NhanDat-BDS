(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauLienKetUsersCtr', nhuCauLienKetUsersCtr);
    	/** @ngInject */
    function nhuCauLienKetUsersCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService, userService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauLienKetUsersVm =this;// jshint ignore:line
        //

        nhuCauLienKetUsersVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu

        //Function
        nhuCauLienKetUsersVm.groupedItems = [];
        nhuCauLienKetUsersVm.filteredItems = [];
        nhuCauLienKetUsersVm.pagedItems = [];
        nhuCauLienKetUsersVm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        nhuCauLienKetUsersVm.groupToPages = function () {
            nhuCauLienKetUsersVm.pagedItems = [];
            for (var i = 0; i < nhuCauLienKetUsersVm.filteredItems.length; i++) {
                if (i % nhuCauLienKetUsersVm.paging.pageSize === 0) {
                    nhuCauLienKetUsersVm.pagedItems[Math.floor(i / nhuCauLienKetUsersVm.paging.pageSize)] = [nhuCauLienKetUsersVm.filteredItems[i]];
                } else {
                    nhuCauLienKetUsersVm.pagedItems[Math.floor(i / nhuCauLienKetUsersVm.paging.pageSize)].push(nhuCauLienKetUsersVm.filteredItems[i]);
                }
            }
            nhuCauLienKetUsersVm.paging.totalPage = Math.ceil(nhuCauLienKetUsersVm.filteredItems.length / nhuCauLienKetUsersVm.paging.pageSize);
        };

        //load data all user
        userService.getAll().$loaded().then(function (data) {
            console.log('ALL USER LIST', data);
            nhuCauLienKetUsersVm.filteredItems = appUtils.sortArray(data, 'timestampCreated');
            nhuCauLienKetUsersVm.paging.totalRecord = data.length;
            nhuCauLienKetUsersVm.paging.currentPage = 0;
            //group by pages
            nhuCauLienKetUsersVm.groupToPages();
        });


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