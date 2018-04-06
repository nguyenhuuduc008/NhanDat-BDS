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

        initData(currentUser.phoneNumber);
        // da kiem tra
        function initData(userId) {
            appUtils.showLoading();
            $scope.Groups = [];
            quanLyNhomService.getByUserId(userId).then(function (groups) {
                $scope.Groups = groups.data;
                $.each($scope.Groups, function () {
                    if (this.author == currentUser.$id) {
                        this.IsAuthor = true;
                    } else {
                        this.IsAuthor = false;
                    }
                });
                appUtils.hideLoading();
            });
        }

        // da kiem tra
        $scope.btnRemoveMember_Click = function (key) {
            if (!confirm("Chọn 'OK' để rời khỏi nhóm.")) {
                return;
            }

            quanLyNhomService.removeMember(currentUser.phoneNumber, key).then(function (res) {
                if (!res.result) {
                    toaster.warning(res.errMsg);
                    appUtils.hideLoading();
                    return;
                }

                var temps = [];
                angular.copy($scope.Groups, temps);
                $.each(temps, function (i) {
                    if (this.$id == key) {
                        $scope.Groups.splice(i, 1);
                        return;
                    }
                });
                appUtils.hideLoading();
            });
        };

        // da kiem tra
        $scope.btnDeleteGroup_Click = function (key) {
            if (!confirm("Chọn 'OK' để hủy nhóm.")) {
                return;
            }
            appUtils.showLoading();
            quanLyNhomService.del(key).then(function (res) {
                if (!res.result) {
                    toaster.warning(res.errMsg);
                    appUtils.hideLoading();
                    return;
                }

                toaster.success("Hủy nhóm thành công.");
                var temps = [];
                angular.copy($scope.Groups, temps);
                $.each(temps, function (i) {
                    if (this.$id == key) {
                        $scope.Groups.splice(i, 1);
                        return;
                    }
                });
                appUtils.hideLoading();
            });
        };

        // da kiem tra
        $scope.btnAddNew_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('quanLyNhom.detail');
        };
    }
})();
