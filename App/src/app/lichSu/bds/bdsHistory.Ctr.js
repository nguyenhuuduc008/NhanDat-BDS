(function () {
    'use strict';

    angular.module('app.lichSu')
        .controller('bdsHistoryCtr', bdsHistoryCtr);

    /** @ngInject */
    function bdsHistoryCtr($rootScope, $q, $scope, $state, $timeout, $ngBootbox, appUtils, toaster, currentAuth, authService, $http,lichSuService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentUser = $rootScope.storage.currentUser;
        // if (!currentUser.userRoles || (currentUser.userRoles && currentUser.userRoles.length <= 0)) {
        //     window.location.href = '/#/home';
        //     return;
        // }

        var appSettings = $rootScope.storage.appSettings;

        var vm = this; // jshint ignore:line
        vm.keyword = '';
        
        vm.groupedItems = [];
        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        /*=============================================================*/

        //Functions
        vm.groupToPages = function () {
            vm.pagedItems = [];
            for (var i = 0; i < vm.filteredItems.length; i++) {
                if (i % vm.paging.pageSize === 0) {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
                } else {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
                }
            }
            console.log('vm.pagedItems');
            console.log(vm.pagedItems);
            vm.paging.totalPage = Math.ceil(vm.filteredItems.length / vm.paging.pageSize);
        };


        vm.changePage = function () {
            vm.groupToPages();
        };

        function getBDSHistory(){
            lichSuService.getBDSHistory().$loaded().then(function (res){
                console.log('res');
                console.log(res);
                vm.filteredItems = appUtils.sortArray(res, 'timestampCreated');
                console.log('vm.filteredItemsaaaaaaa');
                console.log(vm.filteredItems);
                vm.paging.totalRecord = res.length;
                vm.paging.currentPage = 0;
                //group by pages
                vm.groupToPages();
            });
        }
        //Init
        function init(){
            getBDSHistory();
        }
        init();
    }
})();
