(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauLienKetUsersCtr', nhuCauLienKetUsersCtr);
    	/** @ngInject */
    function nhuCauLienKetUsersCtr($rootScope, $scope, $state, $stateParams,$window, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService, userService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauLienKetUsersVm =this;// jshint ignore:line
        //
        nhuCauLienKetUsersVm.model = {};
        nhuCauLienKetUsersVm.lienKetUserList = [];

        nhuCauLienKetUsersVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauLienKetUsersVm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;

        //Function 
        nhuCauLienKetUsersVm.searchUserByPhone = function() {
            appUtils.showLoading();
            userService.getExitedPhone(nhuCauLienKetUsersVm.keyword).then(function(res) {
                console.log('RESULT SDT', res);
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
                                    $window.location.href = '#/user/add';
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
                    nhuCauLienKetUsersVm.model.userId = res.data.userId;
                    nhuCauLienKetUsersVm.userName = res.data.userName;
                    nhuCauLienKetUsersVm.model.timeCreated = Date.now();
                }
            });
        };

        nhuCauLienKetUsersVm.displayLoaiLienKet = function(lienKetUserId) {
            var find  = _.find(nhuCauLienKetUsersVm.cacLoaiLienKetUser, function(o) {
                return o.value == lienKetUserId;
            });
            if(lienKetUserId === 'createUserUniq')
                return 'Người Tạo BDS';
            else if(find === undefined || find === null)
                return '';
            else
                return find.text;
        };

        //Function remove item
        nhuCauLienKetUsersVm.removeLinkedUser = function(lienKetKey) {
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
                            console.log('PHONE ID USER', lienKetKey);
                            removeLinked(lienKetKey);
                        }
                    }
                }
            });
        };

        function removeLinked(lienKetKey) {
            nhuCauService.removeTabLienKetNhuCau(nhuCauLienKetUsersVm.model.khoBDSKey, 'lienKetUser', nhuCauLienKetUsersVm.model.bdsKey, lienKetKey).then(function(res) {
                if (res.result) {
                    appUtils.hideLoading();
                    _.remove(nhuCauLienKetUsersVm.lienKetUserList, function(o) {
                        return o.lienKetKey == lienKetKey;
                    });
                    $scope.$apply(function () {
                        toaster.success("Dừng Liên Kết Thành Công");
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Dừng Liên Kết Không Thành Công!");
            });
        }

        //Function save data
        nhuCauLienKetUsersVm.save = function (form) {
            if(!nhuCauLienKetUsersVm.model.loaiLienKetUser)
                return;
            appUtils.showLoading();
            if (nhuCauLienKetUsersVm.isEdit) {
                switch (nhuCauLienKetUsersVm.model.loaiNhuCauKey) {
                    case 'ban':
                        editBDSBan();
                        break;
                    case 'mua':
                        editBDSMua();
                        break;
                    case 'thue':
                        editBDSMua();
                        break;
                    case 'cho-thue':
                        editBDSBan();
                        break;
                }
            }
        };

        function editBDSMua() {
            nhuCauService.updateTabLienKetNhuCauMua(nhuCauLienKetUsersVm.model.khoBDSKey, 'lienKetUser', nhuCauLienKetUsersVm.model, nhuCauLienKetUsersVm.model.bdsKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Lưu Nhu Cầu Thành Công");
                    });
                    nhuCauLienKetUsersVm.model.lienKetKey = res.key;
                    addToListLienKet(nhuCauLienKetUsersVm.model);
                    nhuCauLienKetUsersVm.model.bdsKey = $stateParams.bdsId;
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Lưu Nhu Cầu Không Thành Công!");
            });
        }

        function editBDSBan() {
            nhuCauService.updateTabLienKetNhuCauMua(nhuCauLienKetUsersVm.model.khoBDSKey, 'lienKetUser', nhuCauLienKetUsersVm.model, nhuCauLienKetUsersVm.model.bdsKey).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        toaster.success("Lưu Nhu Cầu Thành Công");
                    });
                    nhuCauLienKetUsersVm.model.lienKetKey = res.key;
                    addToListLienKet(nhuCauLienKetUsersVm.model);
                    nhuCauLienKetUsersVm.model.bdsKey = $stateParams.bdsId;
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Lưu Nhu Cầu Không Thành Công!");
            });
        }

        //function 
        function addToListLienKet(modelAdd) {
            userService.getExitedPhone(modelAdd.phone).then(function(rs) {
                nhuCauLienKetUsersVm.lienKetUserList.push({
                    phone: rs.data.phone,
                    userName: rs.data.userName,
                    loaiLienKetUser: modelAdd.loaiLienKetUser,
                    timeCreated: displayDate(modelAdd.timeCreated),
                    lienKetKey: modelAdd.lienKetKey
                });
                nhuCauLienKetUsersVm.isUserExit = false;
            });
        }

        function displayDate(timestamp) {
            var d = new Date(timestamp);
            return d.toLocaleString();
        }

        if(!!$stateParams.bdsId) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            nhuCauLienKetUsersVm.isUserExit = false;
            nhuCauLienKetUsersVm.isEdit = true;
            nhuCauLienKetUsersVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
            nhuCauLienKetUsersVm.model.khoBDSKey = $stateParams.bdsKho;
            nhuCauLienKetUsersVm.model.bdsKey = $stateParams.bdsId;
            if (nhuCauLienKetUsersVm.model.loaiNhuCauKey === 'ban' || nhuCauLienKetUsersVm.model.loaiNhuCauKey === 'cho-thue') {
                nhuCauService.getTabNhuCauMua('lienKetUser', nhuCauLienKetUsersVm.model.bdsKey).then(function (result) {
                    nhuCauLienKetUsersVm.lienKetUserList = [];
                    _.forEach(result, function(item, key) {
                        if(_.isObject(item)) {
                            console.log('TEST LIEN KEYT', item);
                            userService.getExitedPhone(item.phone).then(function(rs) {
                                console.log('FINAL TEST 2', rs);
                                nhuCauLienKetUsersVm.lienKetUserList.push({
                                    phone: rs.data.phone,
                                    userName: rs.data.userName,
                                    loaiLienKetUser: item.loaiLienKetUser,
                                    timeCreated: displayDate(item.timeCreated),
                                    lienKetKey: item.lienKetKey
                                });
                            });
                        }
                    });
                    if(!!result)
                        delete nhuCauLienKetUsersVm.model.$id;
                    else
                        nhuCauLienKetUsersVm.model = {};
                    nhuCauLienKetUsersVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauLienKetUsersVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauLienKetUsersVm.model.bdsKey = $stateParams.bdsId;
                    console.log('PRAMS CAP DO', nhuCauLienKetUsersVm.lienKetUserList);
                });
            } else {
                nhuCauService.getTabNhuCauMua('lienKetUser', nhuCauLienKetUsersVm.model.bdsKey).then(function (result) {
                    nhuCauLienKetUsersVm.lienKetUserList = [];
                    _.forEach(result, function(item, key) {
                        if(_.isObject(item)) {
                            userService.getExitedPhone(item.phone).then(function(rs) {
                                nhuCauLienKetUsersVm.lienKetUserList.push({
                                    phone: rs.data.phone,
                                    userName: rs.data.userName,
                                    loaiLienKetUser: item.loaiLienKetUser,
                                    timeCreated: displayDate(item.timeCreated),
                                });
                            });
                        }
                    });
                    if(!!result)
                        delete nhuCauLienKetUsersVm.model.$id;
                    else
                        nhuCauLienKetUsersVm.model = {};
                    nhuCauLienKetUsersVm.model.loaiNhuCauKey = $stateParams.nhuCauId;
                    nhuCauLienKetUsersVm.model.khoBDSKey = $stateParams.bdsKho;
                    nhuCauLienKetUsersVm.model.bdsKey = $stateParams.bdsId;
                });
            }
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
        }
    } 
})();