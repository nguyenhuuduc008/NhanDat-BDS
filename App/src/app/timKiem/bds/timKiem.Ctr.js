(function () {
    'use strict';
    angular.module('app.timKiem')
    .controller('timKiemCtr', bdsListCtr);
    /** @ngInject */
    function bdsListCtr($rootScope, $scope, $state, $q, $stateParams, $timeout, appUtils, $ngBootbox, toaster, timKiemService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;

        var type = $stateParams.type ? $stateParams.type : 'All';
        var bdsType = $stateParams.bdsType ? $stateParams.bdsType : 'All';
        var city = $stateParams.city ? $stateParams.city : 'All';
        var district = $stateParams.district ? $stateParams.district : 'All';
        var direction = $stateParams.bdsType ? $stateParams.direction : 'All';
        

        var timKiemCtrVm = this;
        timKiemCtrVm.bdsTypes = [];
        timKiemCtrVm.city = [];
        timKiemCtrVm.type = [];
        timKiemCtrVm.district = [];
        timKiemCtrVm.direction = [];
        
        //result 
        timKiemCtrVm.lstBDS = [];

        //cri
        timKiemCtrVm.cri = {
            type: type,
            bdsType: bdsType,
            city: city,
            district: district,
            direction: direction,
            priceFrom: 0,
            priceTo: 0,
            areaFrom: 0, 
            areaTo: 0,
            from: 0,
            size: 15,
        }

        //paging
        timKiemCtrVm.paging = {
            pageSize: 15,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

        timKiemCtrVm.paging.currentPage =  $stateParams.page ? parseInt($stateParams.page) : 0;

        //treat select box change
        $scope.$watch('timKiemCtrVm.cri.type', function(val){
            if(val === null){
                timKiemCtrVm.cri.type = $stateParams.type || 'All';
            }
        });

        $scope.$watch('timKiemCtrVm.cri.bdsType', function(val){
            if(val === null){
                timKiemCtrVm.cri.bdsType = $stateParams.bdsType || 'All';
            }
        });

        $scope.$watch('timKiemCtrVm.cri.city', function(val){
            if(val === null){
                timKiemCtrVm.cri.city = $stateParams.city || 'All';
            }else{

            }
        });

        $scope.$watch('timKiemCtrVm.cri.district', function(val){
            if(val === null){
                timKiemCtrVm.cri.district = $stateParams.district || 'All';
            }
        });

        $scope.$watch('timKiemCtrVm.cri.direction', function(val){
            if(val === null){
                timKiemCtrVm.cri.direction = $stateParams.direction || 'All';
            }
        });
        
        $scope.changePage = function () {
            timKiemCtrVm.cri.from = timKiemCtrVm.paging.currentPage * timKiemCtrVm.cri.size;
			search();
        };

        function initPage(){

        }

        timKiemService.search({size: 1, from: 0, city: 'ho-chi-minh'}).then(function (result) {
            console.log(result);
        }); 

        function search(init){
            if(init){
                timKiemCtrVm.paging.currentPage = 0;
                timKiemCtrVm.cri.from = 0;
            }
            appUtils.showLoading();
            timKiemService.search(timKiemCtrVm.cri).then(function (result) {
                appUtils.hideLoading();
                timKiemCtrVm.lstBDS = result.items;
                //timKiemCtrVm.totalAllProducts = result.totalRecords;
                angular.extend(timKiemCtrVm.paging, {
					totalRecord: result.totalRecords,
					totalPage: result.pages
                });

                $timeout(angular.noop,500);
            }); 
        }
    }
})();