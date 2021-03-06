(function () {
    'use strict';
    angular.module('app.setting')
        .controller('hanhChinhListCtr', hanhChinhListCtr);
    /** @ngInject */
    function hanhChinhListCtr($rootScope, $scope, $state, $q, settingService, appUtils, $ngBootbox, toaster, MarkRemoval) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
        var hanhChinhListVm = this;// jshint ignore:line

        var nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
        hanhChinhListVm.isRegex = false;
        hanhChinhListVm.input = 'Cấp Tỉnh';
        hanhChinhListVm.model = {};
        hanhChinhListVm.hanhChinhPath = "capTinh";
        hanhChinhListVm.listCapTinh = [];
        hanhChinhListVm.listCapHuyen = [];
        hanhChinhListVm.listCapXa = [];
        hanhChinhListVm.listDuong = [];
        hanhChinhListVm.capTinhActive = -1;
        hanhChinhListVm.capHuyenActive = -1;
        hanhChinhListVm.capXaActive = -1;
        hanhChinhListVm.isAddChild = false;
        hanhChinhListVm.isEditChild = false;
        hanhChinhListVm.parentKey = '';
        hanhChinhListVm.isAdd = true;
        hanhChinhListVm.buttonType = "Thêm Mới";


        function getListLoaiHanhChinh(loai, parentKey, rootKey) {
            switch (loai) {
                case 'capTinh':
                    settingService.getListLoaiHanhChinh('capTinh').then(function (data) {
                        hanhChinhListVm.listCapTinh = data;
                    });
                    break;
                case 'capHuyen':
                    settingService.getListChildHanhChinh('capHuyen', parentKey).then(function (data) {
                        hanhChinhListVm.listCapHuyen = data;
                    });
                    break;
                case 'capXa':
                    settingService.getListChildHanhChinh('capXa', parentKey, rootKey).then(function (data) {
                        console.log('CAPXA', data);
                        hanhChinhListVm.listCapXa = data;
                    });
                    settingService.getListChildHanhChinh('duong', parentKey, rootKey).then(function (data) {
                        hanhChinhListVm.listDuong = data;
                    });
                    break;
                // default:
                //     settingService.getListChildHanhChinh('duong', parentKey).then(function (data) {
                //         hanhChinhListVm.listDuong = data;
                //     });
            }
        }

        hanhChinhListVm.addInput = function (input) {
            switch (input) {
                case 'capTinh':
                    hanhChinhListVm.input = 'Cấp Tỉnh';
                    hanhChinhListVm.isAddChild = false;
                    break;
                case 'capHuyen':
                    if (hanhChinhListVm.capTinhActive < -1)
                        return;
                    hanhChinhListVm.input = 'Cấp Huyện';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capTinhKey;
                    break;
                case 'capXa':
                    if (hanhChinhListVm.capHuyenActive < -1)
                        return;
                    hanhChinhListVm.input = 'Cấp Xã';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capHuyenKey;
                    break;
                default:
                    if (hanhChinhListVm.capHuyenActive < -1)
                        return;
                    hanhChinhListVm.input = 'Đường';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capHuyenKey;
            }
            hanhChinhListVm.buttonType = "Thêm Mới";
            hanhChinhListVm.model = {};
            hanhChinhListVm.isAdd = true;
            hanhChinhListVm.hanhChinhPath = input;
        };

        function addHanhChinh(isAddChild, parentKey, key, rootKey) {
            if (isAddChild) {
                hanhChinhListVm.model.parentKey = parentKey;
                settingService.updateChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey, key, rootKey).then(function (res) {
                    if (!res) {
                        toaster.error('Lỗi', 'Thêm không thành công');
                        return;
                    }
                    $scope.$apply(function () {
                        toaster.success('Thành Công', 'Thêm thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            } else {
                settingService.updateLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, key).then(function (res) {
                    if (!res) {
                        toaster.error('Lỗi', 'Thêm không thành công');
                        return;
                    }
                    $scope.$apply(function () {
                        toaster.success('Thành Công', 'Thêm thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            }
        }

        function updateHanhChinh(isEditChild, parentKey, key, rootKey) {
            if (isEditChild) {
                settingService.updateChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey, key, rootKey).then(function (res) {
                    if (!res) {
                        toaster.error('Lỗi', 'Sửa không thành công');
                        return;
                    }
                    $scope.$apply(function () {
                        toaster.success('Thành Công', 'Sửa thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            } else {
                delete hanhChinhListVm.model.parentKey;
                settingService.updateLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, key).then(function (res) {
                    if (!res) {
                        toaster.error('Lỗi', 'Sửa không thành công');
                        return;
                    }
                    $scope.$apply(function () {
                        toaster.success('Thành Công', 'Sửa thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            }
        }

        hanhChinhListVm.actionHanhChinh = function (formInput) {
            var regex = formInput.search(nameRegx);
            if (regex < 0) {
                hanhChinhListVm.isRegex = true;
                return;
            }
            if (formInput == '' || formInput == null || formInput == undefined)
                return;
            hanhChinhListVm.isRegex = false;

            if (hanhChinhListVm.isAdd) {
                var key = MarkRemoval.removeUnicode(hanhChinhListVm.model.text);
                if (hanhChinhListVm.hanhChinhPath == 'capHuyen')
                    addHanhChinh(hanhChinhListVm.isAddChild, hanhChinhListVm.parentKey, key);
                else
                    addHanhChinh(hanhChinhListVm.isAddChild, hanhChinhListVm.parentKey, key, hanhChinhListVm.capTinhKey);
            } else {
                if (hanhChinhListVm.hanhChinhPath == 'capHuyen')
                    updateHanhChinh(hanhChinhListVm.isEditChild, hanhChinhListVm.model.parentKey, hanhChinhListVm.parentKey);
                else
                    updateHanhChinh(hanhChinhListVm.isEditChild, hanhChinhListVm.model.parentKey, hanhChinhListVm.parentKey, hanhChinhListVm.capTinhKey);
            }
        };

        function deleteHanhChinhNoParent(key) {
            hanhChinhListVm.model = {
                text: null,
            };
            settingService.updateLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, key).then(function (res) {
                if (!res) {
                    toaster.error('Lỗi', 'Xóa không thành công');
                    return;
                }
                $scope.$apply(function () {
                    toaster.success('Thành Công', 'Xóa thành công');
                    hanhChinhListVm.parentKey = parentKey;
                    hanhChinhListVm.isAdd = true;
                });
            });
        }

        function deleteHanhChinhWithParent(parentKey, key, rootKey) {
            hanhChinhListVm.model = {
                text: null,
                parentKey: null
            };
            settingService.updateChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey, key, rootKey).then(function (res) {
                if (!res) {
                    toaster.error('Lỗi', 'Xóa không thành công');
                    return;
                }
                $scope.$apply(function () {
                    toaster.success('Thành Công', 'Xóa thành công');
                    hanhChinhListVm.parentKey = parentKey;
                    hanhChinhListVm.isAdd = true;
                });
            });
        }

        function deleteChildHanhChinh(pathArrIndex, key) {
            if (pathArrIndex >= hanhChinhListVm.deleteArray.length) {
                return;
            }

            settingService.deleteLoaiHanhChinh(hanhChinhListVm.deleteArray[pathArrIndex], key);
            if (hanhChinhListVm.deleteArray[pathArrIndex] == 'capXa') {
                settingService.deleteLoaiHanhChinh('duong', key);
            }
            pathArrIndex++;
            deleteChildHanhChinh(pathArrIndex, key);
        }

        hanhChinhListVm.deleteHanhChinh = function (path, item) {
            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa ' + item.text + ' ?').then(function () {
                switch (path) {
                    case 'capTinh':
                        deleteHanhChinhNoParent(item.$id);
                        hanhChinhListVm.capTinhActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.deleteArray = ['capHuyen', 'capXa'];
                        deleteChildHanhChinh(0, item.$id);
                        break;
                    case 'capHuyen':
                        deleteHanhChinhWithParent(hanhChinhListVm.capTinhKey, item.$id);
                        hanhChinhListVm.capHuyenActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.deleteArray = ['capXa'];
                        deleteChildHanhChinh(0, hanhChinhListVm.capTinhKey);
                        break;
                    case 'capXa':
                        deleteHanhChinhWithParent(hanhChinhListVm.capHuyenKey, item.$id, hanhChinhListVm.capTinhKey);
                        //hanhChinhListVm.capXaActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        // hanhChinhListVm.deleteArray = ['duong'];
                        // deleteChildHanhChinh(0, item.$id);
                        break;
                    default:
                        deleteHanhChinhWithParent(hanhChinhListVm.capHuyenKey, item.$id, hanhChinhListVm.capTinhKey);
                        hanhChinhListVm.buttonType = "Thêm Mới";
                }

            }, function () {
                console.log('cancel');
            });
        };

        hanhChinhListVm.chooseHanhChinh = function (choice, path, activeIndex) {
            hanhChinhListVm.buttonType = "Sửa";
            hanhChinhListVm.isAdd = false;
            hanhChinhListVm.parentKey = choice.$id;
            hanhChinhListVm.model.text = choice.text;
            hanhChinhListVm.model.parentKey = choice.parentKey;
            switch (path) {
                case 'capHuyen':
                    hanhChinhListVm.hanhChinhPath = 'capTinh';
                    hanhChinhListVm.capTinhActive = activeIndex;
                    hanhChinhListVm.capTinhKey = choice.$id;
                    hanhChinhListVm.isEditChild = false;
                    hanhChinhListVm.input = 'Cấp Tỉnh';
                    hanhChinhListVm.listCapXa = [];
                    hanhChinhListVm.listDuong = [];
                    hanhChinhListVm.capHuyenActive = -1;
                    hanhChinhListVm.capXaActive = -1;
                    getListLoaiHanhChinh(path, choice.$id);
                    break;
                case 'capXa':
                    hanhChinhListVm.hanhChinhPath = 'capHuyen';
                    hanhChinhListVm.capHuyenActive = activeIndex;
                    hanhChinhListVm.capHuyenKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Cấp Huyện';
                    hanhChinhListVm.capXaActive = -1;
                    hanhChinhListVm.duongActive = -1;
                    getListLoaiHanhChinh(path, choice.$id, hanhChinhListVm.capTinhKey);
                    getListLoaiHanhChinh('duong', choice.$id, hanhChinhListVm.capTinhKey);
                    break;
                case 'duong':
                    hanhChinhListVm.hanhChinhPath = 'capXa';
                    hanhChinhListVm.capXaActive = activeIndex;
                    hanhChinhListVm.capXaKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Cấp Xã';
                    hanhChinhListVm.duongActive = -1;
                    break;
                default:
                    hanhChinhListVm.hanhChinhPath = 'duong';
                    hanhChinhListVm.duongActive = activeIndex;
                    hanhChinhListVm.duongKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Đường';
                    hanhChinhListVm.capXaActive = -1;
                    return;
            }
        };

        function init() {
            getListLoaiHanhChinh('capTinh');
        }
        init();
    }
})();