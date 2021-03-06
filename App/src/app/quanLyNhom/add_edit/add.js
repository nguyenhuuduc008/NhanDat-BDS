(function () {
    'use strict';

    angular.module("app.quanLyNhom")
		.controller("addCtr", addCtr);
    /** @ngInject **/
    function addCtr($rootScope, $stateParams, $q, $scope, $state, $ngBootbox, authService, currentAuth, appUtils, toaster, settingService, userService, quanLyNhomService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;

        $scope.model = {
            id: $stateParams.id == "" ? -1 : $stateParams.id,
            Members: []
        };

        var addMembers = [];
        var deleteMembers = [];

        if ($scope.model.id == -1) {
            $scope.pageTitle = "Tạo mới nhóm";
            $scope.isAdmin = true;
        } else {
            $scope.pageTitle = "Cập nhật thông tin nhóm";
            $scope.isAdmin = false;
        }

        initData();
        // da kiem tra
        function initData() {
            $scope.Users = [];
            $scope.CurrentUser = {};
            $scope.Cities = [];
            _.forEach(appSettings.cacLoaiHanhChinh.capTinh, function (item, key) {
                $scope.Cities.push({
                    $id: key,
                    text: item.text
                });
            });
            $scope.model.tinhThanh = $scope.Cities[0].$id;
            GetDistricts();
            GetMembers($scope.model.id);
        }

        // da kiem tra
        function GetDistricts() {
            var districts = {};
            _.forEach(appSettings.cacLoaiHanhChinh.capHuyen, function (item, key) {
                if (key === $scope.model.tinhThanh) {
                    districts = item;
                }
            });

            $scope.Districts = [];
            _.forEach(districts, function (item, key) {
                $scope.Districts.push({
                    $id: key,
                    text: item.text
                });
            });

            if ($scope.Districts.length > 0) {
                $scope.model.quanHuyen = $scope.Districts[0].$id;
            }
        }

        function checkExistInSelectedUser(key, data) {
            var r = _.filter(data, function (item) {
                return key.$id === item.id;
            });
            if (r.length > 0) {
                return true;
            }
            return false;
        }

        // da kiem tra
        function GetMembers(groupId) {
            if (groupId == -1) {
                $scope.model.Members = [{
                    id: currentUser.$id,
                    fullName: currentUser.firstName + " " + currentUser.lastName,
                    phoneNumber: currentUser.phoneNumber,
                    isAdmin: true
                }];
                $scope.CurrentUser.isAdmin = true;
                return;
            }

            quanLyNhomService.getById(groupId).then(function (group) {
                if (group.result) {
                    $scope.model = group.data;
                    $scope.model.id = $stateParams.id == "" ? -1 : $stateParams.id;

                    $.each($scope.model.Members, function () {
                        if (this.id == currentUser.$id) {
                            $scope.CurrentUser.isAdmin = this.isAdmin;
                            $scope.isAdmin = true;
                        }
                    });
                }

                $.each($rootScope.storage.currentUser.userRoles, function () {
                    console.log(this);
                    if (this == '-L88BRKv7sbA7-Or5KOi') {
                        $scope.CurrentUser.isAdmin = true;
                        $scope.isAdmin = true;
                    }
                });

                if ($scope.isAdmin == false) {
                    $state.go('quanLyNhom');
                }
            });
        }

        // da kiem tra
        function doInsert() {
            appUtils.showLoading();
            $scope.model.Author = currentUser.$id;
            $scope.model.Members = JSON.parse(angular.toJson($scope.model.Members));
            quanLyNhomService.create($scope.model).then(function (res) {
                if (res.result) {
                    $scope.model.id = res.data;
                    appUtils.hideLoading();
                    toaster.success("Thêm mới Loại nhóm  thành công!");
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Thêm mới Loại nhóm không thành công!");
            });
        }

        // da kiem tra
        function doUpdate() {
            appUtils.showLoading();
            $scope.model.Members = JSON.parse(angular.toJson($scope.model.Members));
            quanLyNhomService.update($scope.model).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    doSync($scope.model);
                    toaster.success("Cập nhật Loại nhóm thành công!");
                }
            }).catch(function () {
                appUtils.hideLoading();
                toaster.warning("Cập nhật Loại nhóm không thành công!");
            });
        }

        // da kiem tra
        function doSync(dataModel) {
            if ($scope.model.id == -1) {
                return;
            }

            quanLyNhomService.addMembers(dataModel, $scope.model.id);

            $.each(deleteMembers, function () {
                quanLyNhomService.removeMember(this.phoneNumber, $scope.model.id);
            });

            $.each(addMembers, function () {
                quanLyNhomService.addMember(this.phoneNumber, $scope.model, $scope.model.id);
            });

            addMembers = [];
            deleteMembers = [];
        }

        // da kiem tra
        $scope.changeCity = function changeCity() {
            GetDistricts();
        };

        // da kiem tra
        $scope.chkSelectAll_Click = function (key) {
            if (key == "users") {
                $.each($scope.Users, function () {
                    this.Selected = !this.Selected;
                });
                return;
            }

            $.each($scope.model.Members, function () {
                this.Selected = !this.Selected;
            });
        };

        // da kiem tra
        $scope.btnSave_Click = function (form) {
            if ($scope.model.id == -1) {
                doInsert();
            } else {
                doUpdate();
            }
        };

        // da kiem tra
        $scope.btnCancel_Click = function () {
            $rootScope.reProcessSideBar = true;
            $state.go('quanLyNhom');
        };

        // da kiem tra
        $scope.btnSearchUser_Click = function (key) {
            appUtils.showLoading();
            userService.search(key).then(function (users) {
                $scope.Users = users;
                appUtils.hideLoading();
            });
        };

        // da kiem tra
        $scope.btnAddToMembers_Click = function () {
            $.each($scope.Users, function (i) {
                if (this.Selected == true && !checkExistInSelectedUser(this, $scope.model.Members)) {
                    var obj = {
                        id: this.$id,
                        fullName: this.firstName + " " + this.lastName,
                        phoneNumber: this.phoneNumber,
                        isAdmin: false
                    };
                    $scope.model.Members.splice(1, 0, obj);
                    addMembers.push(obj);
                }
            });
        };

        // da kiem tra
        $scope.btnRemoveMenber_Click = function (key) {
            if (!confirm("Chọn 'OK' để xóa thành viên vừa chọn ra khỏi nhóm.")) {
                return;
            }

            var temps = [];
            angular.copy($scope.model.Members, temps);
            $.each(temps, function (i) {
                if (this.phoneNumber == key) {
                    $scope.model.Members.splice(i, 1);
                    deleteMembers.push(this);
                    console.log(deleteMembers);
                    return;
                }
            });
        };
    }
})();
