(function () {
    'use strict';
    angular.module('app.setting')
    .controller('bDSModCtr', bDSModCtr);
    /** @ngInject */
    function bDSModCtr($rootScope, $scope, $state, $stateParams, $q, settingService, appUtils, $ngBootbox, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
        var bDSModVm = this;// jshint ignore:line
        bDSModVm.item = {};
        bDSModVm.idLoai = $stateParams.idLoai;
        console.log('bDSModVm.idLoai');
        console.log(bDSModVm.idLoai);

        //bDSModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiBDS(idLoai) {
            settingService.getOnceLoaiBDS(idLoai).then(function (res) {
                if (res.result) {
                    bDSModVm.item = res.data;
                    if (!bDSModVm.item.loaiForm) {
                        bDSModVm.item.loaiForm = 'form1';
                    }
                }
            });
        }
        bDSModVm.edit = function (form) {
            appUtils.showLoading();
            settingService.updateLoaiBDS(bDSModVm.idLoai, bDSModVm.item).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Bất Động Sản thành công!");
                    $state.go('bDS-list');
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Bất Động Sản không thành công!");
            });
        };
        bDSModVm.cancel = function () {
            $state.go('bDS-list');
        };

        bDSModVm.add = function (form) {
            appUtils.showLoading();
            settingService.addLoaiBDS(bDSModVm.item).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Bất Động Sản mới thành công!");
                    $state.go('bDS-list');
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Bất Động Sản mới không thành công!");
            });

        };

        function init() {
            if (bDSModVm.idLoai) {
                getOnceLoaiBDS(bDSModVm.idLoai);
            }
        }
        init();
    }
})();