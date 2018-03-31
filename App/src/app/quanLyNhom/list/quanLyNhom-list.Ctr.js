(function () {
    'use strict';

    angular.module('app.quanLyNhom')
        .controller('quanLyNhomCtrl', quanLyNhomCtrl);

    /** @ngInject */
    function quanLyNhomCtrl($rootScope, $q, $scope, $state, $timeout, $ngBootbox, appUtils, toaster, currentAuth, settingService, authService, $http, quanLyNhomService, $stateParams) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentUser = $rootScope.storage.currentUser;


        var appSettings = $rootScope.storage.appSettings;

        //$scope.quanLyNhom = this; // jshint ignore:line
        //$scope.quanLyNhom.keyword = '';
        //$scope.quanLyNhom.bdsCate = '-1';
        //$scope.groupedItems = [];
        //$scope.quanLyNhom.filteredItems = [];
        //$scope.quanLyNhom.pagedItems = [];
        //$scope.quanLyNhom.paging = {
        //    pageSize: 25,
        //    currentPage: 0,
        //    totalPage: 0,
        //    totalRecord: 0
        //};

        // da kiem tra
        $scope.btnAddNew_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('quanLyNhom.detail');
        };



        GetGroup();
        function GetGroup() {
            $scope.Groups = [];
            quanLyNhomService.getAll().$loaded().then(function (groups) {
                $scope.Groups = groups;
            });
        }

        //quanLyNhom.groupToPages = function () {
        //    quanLyNhom.pagedItems = [];
        //    for (var i = 0; i < quanLyNhom.filteredItems.length; i++) {
        //        if (i % quanLyNhom.paging.pageSize === 0) {
        //            quanLyNhom.pagedItems[Math.floor(i / quanLyNhom.paging.pageSize)] = [quanLyNhom.filteredItems[i]];
        //        } else {
        //            quanLyNhom.pagedItems[Math.floor(i / quanLyNhom.paging.pageSize)].push(quanLyNhom.filteredItems[i]);
        //        }
        //    }
        //    if (quanLyNhom.filteredItems.length % quanLyNhom.paging.pageSize === 0) {
        //        quanLyNhom.paging.totalPage = quanLyNhom.filteredItems.length / quanLyNhom.paging.pageSize;
        //    } else {
        //        quanLyNhom.paging.totalPage = Math.floor(quanLyNhom.filteredItems.length / quanLyNhom.paging.pageSize) + 1;
        //    }

        //};
    }
})();
