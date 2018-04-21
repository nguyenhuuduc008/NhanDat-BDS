(function () {
    'use strict';

    angular.module('app.raoVat').controller('raoVatCtrl', raoVatCtrl);

    /** @ngInject */
    function raoVatCtrl($rootScope, $q, $scope, $state, $timeout, $ngBootbox, appUtils, toaster, currentAuth, settingService, authService, $http, $stateParams, raoVatService) {

        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;

        $scope.keyWord = "";
        $scope.Data = [];
        $scope.DataBK = [];

        initData();
        //  da kiem tra
        function initData() {
            appUtils.showLoading();
            raoVatService.getAll().then(function (res) {
                $scope.Data = res.data;
                angular.copy($scope.Data, $scope.DataBK);

                var date = new Date(Date.now()).toJSON().slice(0, 10).split("-").reverse().join("/");
                $.each($scope.Data, function () {
                    if (this.anTin == false && this.tuNgay <= date && date >= this.denNgay) {
                        this.trangThai = true;
                    } else {
                        this.trangThai = false;
                    }
                });
                appUtils.hideLoading();
            });
        }

        //  da kiem tra
        $scope.btnRemoveMember_Click = function (key) {
            if (!confirm("Chọn 'OK' xóa Tin rao vặt.")) {
                return;
            }

            raoVatService.del(key).then(function (res) {
                if (!res.result) {
                    toaster.warning(res.errMsg);
                    appUtils.hideLoading();
                    return;
                }
                appUtils.hideLoading();
            });
        };

        // da kiem tra
        $scope.btnAddNew_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('raoVat.chiTiet');
        };

        // da kiem tra
        $scope.btnSearch_Click = function (key) {
            alert(1);
            appUtils.showLoading();
            if (key == "") {
                angular.copy($scope.DataBK, $scope.Data);
                appUtils.hideLoading();
                return;
            }

            var temps = [];
            $.each($scope.DataBK, function () {
                if (this.tieuDe.search(key) != -1) {
                    temps.push(this);
                } else if (this.moTa.search(key) != -1) {
                    temps.push(this);
                }
            });
            angular.copy(temps, $scope.Data);
            appUtils.hideLoading();
        };
    }
})();
