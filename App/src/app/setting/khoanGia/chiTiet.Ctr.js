(function () {
    'use strict';
    angular.module('app.setting')
    .controller('chiTietCtr', chiTietCtr);
    /** @ngInject */
    function chiTietCtr($rootScope, $stateParams, $scope, $state, $q, settingService, appUtils, $ngBootbox, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;

        // da kiem tra
        $scope.model = {
            id: $stateParams.id == "" ? -1 : $stateParams.id
        };

        // da kiem tra
        if ($scope.model.id == -1) {
            $scope.pageTitle = "Thêm mới Khoản giá";
        } else {
            $scope.pageTitle = "Chỉnh sửa Khoản giá";
            initData($scope.model.id);
        }

        // da kiem tra
        $scope.btnSave_Click = function (form) {
            if ($scope.model.giaTu > $scope.model.giaDen) {
                toaster.warning("vui lòng nhập Giá từ nhỏ hơn Giá đến.");
                return;
            }

            if ($scope.model.id == -1) {
                doInsert();
            } else {
                doUpdate();
            }
        };

        // da kiem tra
        function doInsert() {
            appUtils.showLoading();
            settingService.createKhoanGia($scope.model).then(function (res) {
                if (res.result) {
                    $scope.model.id = res.data;
                    toaster.success("Thêm mới Khoản giá thành công.");
                } else {
                    toaster.warning("Thêm mới Khoản giá thành công.");
                }
                appUtils.hideLoading();
                $scope.btnCancel_Click();
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Thêm mới Khoản giá thành công.");
            });
        }

        // da kiem tra
        function doUpdate() {
            appUtils.showLoading();
            settingService.updateKhoanGia($scope.model).then(function (res) {
                if (res.result) {
                    toaster.success("Cập nhật Khoản giá thành công.");
                    $scope.btnCancel_Click();
                } else {
                    toaster.warning("Cập nhật Khoản giá không thành công.");
                }
                appUtils.hideLoading();
            }).catch(function (res) {
                toaster.warning(res.errMsg);
                appUtils.hideLoading();
            });
        }

        // da kiem tra
        function initData(id) {
            appUtils.showLoading();
            settingService.getKhoanGiaById(id).then(function (res) {
                if (res.result) {
                    $scope.model = res.data;
                    toaster.success("Lấy dữ liệu thành công.");
                } else {
                    toaster.warning(res.data);
                }
                appUtils.hideLoading();
            });
        }

        // da kiem tra
        $scope.btnCancel_Click = function () {
            if (!confirm("Chọn 'OK' để tiếp tục quay về.")) {
                return;
            }

            $rootScope.reProcessSideBar = true;
            $state.go('khoanGia');
        };
    }
})();