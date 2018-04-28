
(function () {
    'use strict';
    angular.module('app.setting')
    .controller('listCtr', listCtr);
    /** @ngInject */
    function listCtr($rootScope, $stateParams, $scope, $state, $q, settingService, appUtils, $ngBootbox, toaster) {

        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;

        $scope.DanhSachKhoanGia = [];
        initData();
        // da kiem tra
        function initData() {
            appUtils.showLoading();
            settingService.getKhoanGia().then(function (res) {
                $scope.DanhSachKhoanGia = res.data;
                $.each($scope.DanhSachKhoanGia, function () {
                    this.giaTu = this.giaTu.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                    this.giaDen = this.giaDen.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
                });
                appUtils.hideLoading();
            });
        }

        // da kiem tra
        $scope.btnDelKhoanGia_Click = function (key) {
            if (!confirm("Chọn 'OK' để xóa Khoản giá.")) {
                return;
            }

            settingService.delKhoanGia(key).then(function (res) {
                if (!res.result) {
                    toaster.warning(res.errMsg);
                    appUtils.hideLoading();
                    return;
                }

                var temps = [];
                angular.copy($scope.DanhSachKhoanGia, temps);
                $.each(temps, function (i) {
                    if (this.$id == key) {
                        $scope.DanhSachKhoanGia.splice(i, 1);
                        return;
                    }
                });
                appUtils.hideLoading();
                toaster.success("Xóa khoản giá thành công.");
            });
        };

        // da kiem tra
        $scope.btnAddNew_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('khoanGia.chiTiet');
        };
    }

})();