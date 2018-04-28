(function () {
    'use strict';
    angular.module('app.nhuCau')
        .controller('nhuCauLienKetUsersCtr', nhuCauLienKetUsersCtr);
    /** @ngInject */
    function nhuCauLienKetUsersCtr($rootScope, $scope, $state, $stateParams, $window, $q, nhuCauService, appUtils, $ngBootbox, toaster, settingService, userService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauLienKetUsersVm = this; // jshint ignore:line
        //
        nhuCauLienKetUsersVm.model = {};
        nhuCauLienKetUsersVm.userLinkedList = [];

        nhuCauLienKetUsersVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauLienKetUsersVm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;

        //Function 
        nhuCauLienKetUsersVm.searchUserByPhone = function () {
            console.log(nhuCauLienKetUsersVm.keyword);
            appUtils.showLoading();
            if (nhuCauLienKetUsersVm.keyword === '' || nhuCauLienKetUsersVm.keyword === null || nhuCauLienKetUsersVm.keyword === undefined) {
                appUtils.hideLoading();
                return;
            }
            var res = userService.checkExistPhone(nhuCauLienKetUsersVm.keyword);
            console.log(res);
            if (res == null) {

                $ngBootbox.customDialog({
                    message: 'Số Điện Thoại Chưa Được Đăng Ký!',
                    buttons: {
                        danger: {
                            label: "Huỷ",
                            className: "btn-default",
                            callback: function () {
                                console.log('cancel');
                                nhuCauLienKetUsersVm.isUserExit = false;
                                $scope.$apply();
                                appUtils.hideLoading();
                            }
                        },
                        success: {
                            label: "Tạo mới",
                            className: "btn-success",
                            callback: function () {
                                //$window.location.href = '#/user/add';
                                $state.go('user.addInfo', {
                                    linkedId: $stateParams.nhuCauId,
                                    loaiId: $stateParams.loaiId,
                                    khoId: $stateParams.khoId,
                                    phone: nhuCauLienKetUsersVm.keyword
                                });
                                appUtils.hideLoading();
                            }
                        }
                    }
                });
            } else {
                appUtils.hideLoading();
                nhuCauLienKetUsersVm.isUserExit = true;
                nhuCauLienKetUsersVm.model.phone = res.phone;
                //nhuCauLienKetUsersVm.userEmail = res.userEmail;
                nhuCauLienKetUsersVm.model.userKey = res.phone;
                nhuCauLienKetUsersVm.model.name = res.name;
                nhuCauLienKetUsersVm.model.timeCreated = Date.now();
            }
            /* userService.getExitedPhone(nhuCauLienKetUsersVm.keyword).then(function(res) {
                if(res.data.userId === undefined || res.data.userId === null) {
                    $ngBootbox.customDialog({
                        message: 'Số Điện Thoại Chưa Được Đăng Ký!',
                        buttons: {
                            danger: {
                                label: "Huỷ",
                                className: "btn-default",
                                callback: function () {
                                    console.log('cancel');
                                    nhuCauLienKetUsersVm.isUserExit = false;
                                    $scope.$apply();
                                    appUtils.hideLoading();
                                }
                            },
                            success: {
                                label: "Tạo mới",
                                className: "btn-success",
                                callback: function () {
                                    //$window.location.href = '#/user/add';
                                    $state.go('user.addInfo', { linkedId: $stateParams.nhuCauId , loaiId: $stateParams.loaiId, khoId: $stateParams.khoId, phone: nhuCauLienKetUsersVm.keyword});
                                    appUtils.hideLoading();
                                }
                            }
                        }
                    });
                }
                else {
                    appUtils.hideLoading();
                    nhuCauLienKetUsersVm.isUserExit = true;
                    nhuCauLienKetUsersVm.model.phone = res.data.phone;
                    nhuCauLienKetUsersVm.userEmail = res.data.userEmail;
                    nhuCauLienKetUsersVm.model.userKey = res.data.userId;
                    nhuCauLienKetUsersVm.model.name = res.data.name;
                    nhuCauLienKetUsersVm.model.timeCreated = Date.now();
                }
            }); */

        };

        nhuCauLienKetUsersVm.displayLoaiLienKet = function (lienKetUserId) {
            var find = _.find(nhuCauLienKetUsersVm.cacLoaiLienKetUser, function (o) {
                return o.value == lienKetUserId;
            });
            if (lienKetUserId === 'createUserUniq')
                return 'Người Tạo BDS';
            else if (find === undefined || find === null)
                return '';
            else
                return find.text;
        };

        //Function remove item
        nhuCauLienKetUsersVm.removeLinkedUser = function (linkedKey) {
            $ngBootbox.customDialog({
                message: 'Bạn Muốn Dừng Liên Kết Với User Này?',
                buttons: {
                    danger: {
                        label: "Huỷ",
                        className: "btn-default",
                        callback: function () {
                            console.log('cancel');
                            appUtils.hideLoading();
                        }
                    },
                    success: {
                        label: "Chấp Nhận",
                        className: "btn-success",
                        callback: function () {
                            removeLinked('lienKetUser', nhuCauLienKetUsersVm.model.nhuCauKey, linkedKey);
                            toaster.success("Dừng Liên Kết Thành Công");
                        }
                    }
                }
            });
        };

        function removeLinked(nhuCauTab, nhuCauKey, linkedKey) {
            nhuCauService.removeTabNhuCau(nhuCauTab, nhuCauKey, linkedKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        _.remove(nhuCauLienKetUsersVm.userLinkedList, function (o) {
                            return o.linkedKey == linkedKey;
                        });
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Dừng Liên Kết Không Thành Công!");
            });
        }

        //Function save data
        nhuCauLienKetUsersVm.save = function (form) {
            var duplicate = _.find(nhuCauLienKetUsersVm.userLinkedList, function (o) {
                return o.loaiLienKetUser === nhuCauLienKetUsersVm.model.loaiLienKetUser;
            });
            if (!!duplicate) {
                $ngBootbox.customDialog({
                    message: 'Loại Người Dùng Đã Có Liên Kết, Tiếp Tục Sẽ Thay Thế Liên Kết Cũ?',
                    buttons: {
                        danger: {
                            label: "Huỷ",
                            className: "btn-default",
                            callback: function () {
                                console.log('cancel');
                                nhuCauLienKetUsersVm.isUserExit = false;
                                $scope.$apply();
                                appUtils.hideLoading();
                            }
                        },
                        success: {
                            label: "Chấp Nhận",
                            className: "btn-success",
                            callback: function () {
                                editLinked('lienKetUser', nhuCauLienKetUsersVm.model, nhuCauLienKetUsersVm.model.nhuCauKey, true);
                                removeLinked('lienKetUser', nhuCauLienKetUsersVm.model.nhuCauKey, duplicate.linkedKey);
                                toaster.success("Liên Kết Người Dùng Thành Công");
                                appUtils.hideLoading();
                            }
                        }
                    }
                });
            } else {
                $ngBootbox.customDialog({
                    message: 'Bạn Có Muốn Liên Kết Với User Này?',
                    buttons: {
                        danger: {
                            label: "Huỷ",
                            className: "btn-default",
                            callback: function () {
                                console.log('cancel');
                                nhuCauLienKetUsersVm.isUserExit = false;
                                $scope.$apply();
                                appUtils.hideLoading();
                            }
                        },
                        success: {
                            label: "Chấp Nhận",
                            className: "btn-success",
                            callback: function () {
                                editLinked('lienKetUser', nhuCauLienKetUsersVm.model, nhuCauLienKetUsersVm.model.nhuCauKey, true);
                                toaster.success("Liên Kết Người Dùng Thành Công");
                                appUtils.hideLoading();
                            }
                        }
                    }
                });
            }
        };

        function editLinked(nhuCauTab, nhuCauModel, nhuCauKey, isLinked) {
            console.log(nhuCauKey);
            nhuCauService.updateTabNhuCau(nhuCauTab, nhuCauModel, nhuCauKey, isLinked).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        nhuCauLienKetUsersVm.model.linkedKey = res.linkedKey;
                        addToLinkedList(nhuCauLienKetUsersVm.model);
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Liên Kết Người Dùng Không Thành Công!");
            });
        }

        //function 
        function addToLinkedList(linkedModel) {
            nhuCauLienKetUsersVm.userLinkedList.push({
                phone: linkedModel.phone,
                name: linkedModel.name,
                loaiLienKetUser: linkedModel.loaiLienKetUser,
                timeCreated: displayDate(linkedModel.timeCreated),
                linkedKey: linkedModel.linkedKey
            });
            nhuCauLienKetUsersVm.isUserExit = false;
        }

        function displayDate(timestamp) {
            var d = new Date(timestamp);
            return d.toLocaleString();
        }

        nhuCauLienKetUsersVm.keyword = '';
        nhuCauLienKetUsersVm.phoneValid = function (e) {
            var iKeyCode = (e.which) ? e.which : e.keyCode;
            if (iKeyCode < 48 || iKeyCode > 57)
                e.preventDefault();
        };

        if (!!$stateParams.nhuCauId) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            nhuCauLienKetUsersVm.isUserExit = false;
            nhuCauLienKetUsersVm.model.loaiNhuCauKey = $stateParams.loaiId;
            nhuCauLienKetUsersVm.model.khoBDSKey = $stateParams.khoId;
            nhuCauLienKetUsersVm.model.nhuCauKey = $stateParams.nhuCauId;
            nhuCauService.getTabNhuCau('lienKetUser', nhuCauLienKetUsersVm.model.nhuCauKey).then(function (result) {
                console.log('LIEN KET USER resukt', result);
                if (!!result) {
                    nhuCauLienKetUsersVm.userLinkedList = [];
                    _.forEach(result, function (item, key) {
                        if (_.isObject(item)) {
                            userService.getExitedPhone(item.phone).then(function (rs) {
                                nhuCauLienKetUsersVm.userLinkedList.push({
                                    phone: item.phone,
                                    name: item.name,
                                    loaiLienKetUser: item.loaiLienKetUser,
                                    timeCreated: displayDate(item.timeCreated),
                                    linkedKey: key
                                });
                            });
                        }
                    });
                }
            });
        } else {
            console.log('tab lien ket user - init error');
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
        }
    }
})();