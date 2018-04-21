(function () {
    'use strict';

    angular.module("app.raoVat").controller("addCtr", addCtr);
    /** @ngInject **/
    function addCtr($rootScope, $stateParams, $q, $scope, $state, $ngBootbox, authService, currentAuth, appUtils, toaster, settingService, userService, raoVatService) {

        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;

        $scope.trangThai = null;

        initData();
        // da kiem tra
        function initData() {
            $scope.model = {
                id: $stateParams.id == "" ? -1 : $stateParams.id,
                file: null
            };

            if ($scope.model.id == -1) {
                $scope.pageTitle = "Tạo mới Tin rao vặt";
                $scope.model.nguoiTao = $scope.model.nguoiSua = currentUser.$id;
            } else {
                $scope.pageTitle = "Cập nhật Tin rao vặt";
                $scope.model.nguoiSua = currentUser.$id;
                getById();
            }
        }

        // da kiem tra
        function doInsert() {
            appUtils.showLoading();
            raoVatService.create($scope.model).then(function (res) {
                if (res.result) {
                    $scope.model.id = res.data;
                    appUtils.hideLoading();
                    toaster.success("Thêm mới Tin rao vặt thành công!");
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Thêm mới Tin rao vặt không thành công!");
            });
        }

        // da kiem tra
        function doUpdate() {
            appUtils.showLoading();
            $scope.model = JSON.parse(angular.toJson($scope.model));
            raoVatService.update($scope.model).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    toaster.success("Cập nhật Tin rao vặt thành công!");
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Cập nhật Tin rao vặt không thành công!");
            });
        }

        // da kiem tra
        function getById() {
            appUtils.showLoading();
            raoVatService.getById($scope.model.id).then(function (res) {
                $scope.model = res.data;
                hienThiTrangThai();
                appUtils.hideLoading();
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Lỗi xay ra khi lấy dữ liệu, vui lòng thử  lại!");
            });
        }

        function hienThiTrangThai() {
            var date = new Date(Date.now()).toJSON().slice(0, 10).split("-").reverse().join("/");
            if ($scope.model.anTin == false && $scope.model.tuNgay <= date && date >= $scope.model.denNgay) {
                $scope.trangThai = true;
            } else {
                $scope.trangThai = false;
            }
        }

        // da kiem tra
        $scope.btnSave_Click = function (form) {
            if ($scope.model.tuNgay >= $scope.model.denNgay) {
                toaster.warning("Thời gian kết thúc Tin rao vặt phải lớn hơn thời gian bắt đầu.");
                $scope.thisForm.$valid = false;
                return;
            }
            if (hasChangeImg) {
                $scope.model.file = $scope.model.file.result;
            }
            if ($scope.model.id == -1) {
                doInsert();
            } else {
                doUpdate();
            }

            hienThiTrangThai();
        };

        // da kiem tra
        $scope.btnCancel_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('raoVat');
        };

        var hasChangeImg = false;
        // da kiem tra
        angular.element(document).ready(function () {
            $("#avatar-file").change(function () {
                $('#preViewImg').css('display', 'none');
                var file = $(this)[0].files[0];
                if (file) {
                    // Generate lowres and hires
                    var _URL = window.URL || window.webkitURL;
                    var img = new Image();
                    img.src = _URL.createObjectURL(file);
                    img.onload = function () {
                        // Generate avatar img
                        var maxWidth = 150;
                        var quality = 1;
                        var avatar = appUtils.getAvatar(img, maxWidth, quality, file.type);
                        $scope.model.file = file;
                        hasChangeImg = true;
                    };
                }
            });
        });
    }
})();
