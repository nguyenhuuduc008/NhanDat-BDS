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

        // var type = $stateParams.type ? $stateParams.type : 'All';
        // var bdsType = $stateParams.bdsType ? $stateParams.bdsType : 'All';
        // var city = $stateParams.city ? $stateParams.city : 'All';
        // var district = $stateParams.district ? $stateParams.district : 'All';
        // var direction = $stateParams.bdsType ? $stateParams.direction : 'All';


        var vm = this; // jshint ignore:line
        // vm.bdsTypes = [];
        // vm.city = [];
        // vm.type = [];
        // vm.district = [];
        // vm.direction = [];

        //Duc Nguyen
        vm.districts = [
            {
                key: 'key01',
                value: 'Quan 1'
            },
            {
                key: 'key02',
                value: 'Quan 2'
            },
            {
                key: 'key03',
                value: 'Quan 3'
            }
        ];


        vm.khoBDSList = [];
        vm.cacKhoBDS = appSettings.cacKhoBDS;
        vm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        vm.cacLoaiBDS = appSettings.cacLoaiBDS;
        vm.cacTinhThanhPho = appSettings.thanhPho;
        vm.cacLoaiHuong = appSettings.cacLoaiHuong;
        _.forEach(vm.cacKhoBDS, function (item, key) {
            if (key != 'khoDefault') {
                vm.khoBDSList.push({
                    value: key,
                    text: item.text
                });
            } else
                vm.khoBDSDefault = item;
        });
        vm.khoBDSKey = vm.khoBDSDefault;

        //End Duc Nguyen

        //result 
        vm.lstBDS = [];

        //cri
        vm.cri = {
            khoBDSKey: vm.khoBDSKey,
            loaiNhuCauKey: 'All',
            loaiBDSKey: 'All',
            tinhThanhPho: 'All',
            quanHuyen: [],
            huongNha: 'All',
            dienTichTu: 0,
            dienTichDen: 0,
            giaTu: 0,
            giaDen: 0,
            keyword: '',
            from: 0,
            size: 15
        };

        //paging
        vm.paging = {
            pageSize: 15,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

        vm.paging.currentPage = $stateParams.page ? parseInt($stateParams.page) : 0;

        //treat select box change
        // $scope.$watch('vm.cri.type', function (val) {
        //     if (val === null) {
        //         vm.cri.type = $stateParams.type || 'All';
        //     }
        // });

        // $scope.$watch('vm.cri.bdsType', function (val) {
        //     if (val === null) {
        //         vm.cri.bdsType = $stateParams.bdsType || 'All';
        //     }
        // });

        // $scope.$watch('vm.cri.thanhPho', function (val) {
        //     if (val === null) {
        //         vm.cri.thanhPho = $stateParams.thanhPho || 'All';
        //     } else {

        //     }
        // });

        // $scope.$watch('vm.cri.district', function (val) {
        //     if (val === null) {
        //         vm.cri.district = $stateParams.district || 'All';
        //     }
        // });

        // $scope.$watch('vm.cri.direction', function (val) {
        //     if (val === null) {
        //         vm.cri.direction = $stateParams.direction || 'All';
        //     }
        // });

        $scope.changePage = function () {
            vm.cri.from = vm.paging.currentPage * vm.cri.size;
            search();
        };

        function initPage() {

        }

        // timKiemService.search({ size: 1, from: 0, city: '-L75kBHGLdgJbU1PUQ4b' }).then(function (result) {
        //     console.log(result);
        // });

        function search(init) {
            console.log(vm.cri);
            if (init) {
                vm.paging.currentPage = 0;
                vm.cri.from = 0;
            }
            appUtils.showLoading();
            timKiemService.search2(vm.cri).then(function (result) {
                appUtils.hideLoading();
                vm.lstBDS = result.items;
                //vm.totalAllProducts = result.totalRecords;
                angular.extend(vm.paging, {
                    totalRecord: result.totalRecords,
                    totalPage: result.pages
                });

                $timeout(angular.noop, 500);
            });
        }

        vm.search = function () {
            search(false);
        };

        vm.changeCity = function () {
            var cacQuanHuyen = appSettings.quanHuyen[vm.cri.tinhThanhPho];
            vm.cacQuanHuyen = cacQuanHuyen;
        };

    }
})();