(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauTacNghiepCtr', nhuCauTacNghiepCtr);
    	/** @ngInject */
    function nhuCauTacNghiepCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauTacNghiepVm =this;// jshint ignore:line
        //
        console.log('CMOEL TAC NGHIEP aaaaaa', currentUser);

        nhuCauTacNghiepVm.currentUserId = currentUser.$id;
        nhuCauTacNghiepVm.loaiTacNghiepList = [];
        nhuCauTacNghiepVm.cacKhoBDS = appSettings.cacKhoBDS; //key kho bds dung để lưu dữ liệu
        nhuCauTacNghiepVm.cacLoaiTacNghiep = appSettings.cacLoaiTacNghiep;
        _.forEach(nhuCauTacNghiepVm.cacLoaiTacNghiep, function (item, key) {
            if (!item.flagTacNghiepHeThong)
                nhuCauTacNghiepVm.loaiTacNghiepList.push({
                    text: item.text,
                    value: key
                });
        });

        //Function
        nhuCauTacNghiepVm.save = function (form) {
            if(form.$invalid)
                return;
            appUtils.showLoading();
            nhuCauTacNghiepVm.model.phoneNumber = currentUser.phoneNumber;
            nhuCauTacNghiepVm.model.name = currentUser.lastName + " " + currentUser.firstName;
            nhuCauTacNghiepVm.model.userKey = currentUser.$id;
            nhuCauTacNghiepVm.model.timestampCreated = Date.now();
            $ngBootbox.customDialog({
                message: 'Bạn Có Muốn Thêm Tác Nghiệp Này?',
                buttons: {
                    danger: {
                        label: "Huỷ",
                        className: "btn-default",
                        callback: function () {
                            console.log('cancel');
                            $scope.$apply();
                            appUtils.hideLoading();
                        }
                    },
                    success: {
                        label: "Chấp Nhận",
                        className: "btn-success",
                        callback: function () {
                            editTacNghiep('tacNghiep', nhuCauTacNghiepVm.model, nhuCauTacNghiepVm.model.nhuCauKey, true);
                            toaster.success("Thêm Tác Nghiệp Thành Công");
                            appUtils.showLoading();
                        }
                    }
                }
            });
        };

        nhuCauTacNghiepVm.textLoaiTacNghiep = function(loaiTacNghiep) {
            var finded = _.find(nhuCauTacNghiepVm.loaiTacNghiepList, function(o) {
                return o.value == loaiTacNghiep;
            });
            if(!!finded)
                return finded.text;
        };

        nhuCauTacNghiepVm.removeTacNghiep = function(tacNghiepKey) {
            $ngBootbox.customDialog({
                message: 'Bạn Muốn Xoá Tác Nghiệp Này?',
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
                            removeTacNghiep('tacNghiep', nhuCauTacNghiepVm.model.nhuCauKey, tacNghiepKey);
                            toaster.success("Xoá Tác Nghiệp Thành Công");
                        }
                    }
                }
            });
        };

        //page
        nhuCauTacNghiepVm.groupedItems = [];
        nhuCauTacNghiepVm.filteredItems = [];
        nhuCauTacNghiepVm.pagedItems = [];
        nhuCauTacNghiepVm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        nhuCauTacNghiepVm.groupToPages = function () {
            nhuCauTacNghiepVm.pagedItems = [];
            for (var i = 0; i < nhuCauTacNghiepVm.filteredItems.length; i++) {
                if (i % nhuCauTacNghiepVm.paging.pageSize === 0) {
                    nhuCauTacNghiepVm.pagedItems[Math.floor(i / nhuCauTacNghiepVm.paging.pageSize)] = [nhuCauTacNghiepVm.filteredItems[i]];
                } else {
                    nhuCauTacNghiepVm.pagedItems[Math.floor(i / nhuCauTacNghiepVm.paging.pageSize)].push(nhuCauTacNghiepVm.filteredItems[i]);
                }
            }
            nhuCauTacNghiepVm.paging.totalPage = Math.ceil(nhuCauTacNghiepVm.filteredItems.length / nhuCauTacNghiepVm.paging.pageSize);
        };
        //end page

        //function
        function editTacNghiep(nhuCauTab, nhuCauModel, nhuCauKey, isLinked) {
            nhuCauService.updateTabNhuCau(nhuCauTab, nhuCauModel, nhuCauKey, isLinked).then(function (res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        nhuCauTacNghiepVm.model.tacNghiepKey = res.linkedKey;
                        addToList(nhuCauTacNghiepVm.model);
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Thêm Tác Nghiệp Không Thành Công!");
            });
        }

        function removeTacNghiep(nhuCauTab, nhuCauKey, tacNghiepKey) {
            nhuCauService.removeTabNhuCau(nhuCauTab, nhuCauKey, tacNghiepKey).then(function(res) {
                if (res.result) {
                    appUtils.hideLoading();
                    $scope.$apply(function () {
                        _.remove(tacNghiepList, function (o) {
                            return o.tacNghiepKey == tacNghiepKey;
                        });
                        nhuCauTacNghiepVm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
                        nhuCauTacNghiepVm.groupToPages();
                    });
                    return;
                }
                appUtils.hideLoading();
                toaster.error("Xoá Tác Nghiệp Không Thành Công!");
            });
        }

        function addToList(model) {
            var newModel = _.cloneDeep(model);
            nhuCauTacNghiepVm.model.thongtin = '';
            nhuCauTacNghiepVm.model.loaiTacNghiep = '';
            tacNghiepList.push(newModel);
            nhuCauTacNghiepVm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
            nhuCauTacNghiepVm.groupToPages();
        }

        //Function
        if($stateParams.nhuCauId) {
            //$stateParams.item ---> chứa dữ liệu của bds được truyền từ NhuCau List page
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            ///xét trường hợp vào trang vào trang edit
            nhuCauTacNghiepVm.model = {};
            nhuCauTacNghiepVm.model.loaiNhuCauKey = $stateParams.loaiId;
            nhuCauTacNghiepVm.model.khoBDSKey = $stateParams.khoId;
            nhuCauTacNghiepVm.model.nhuCauKey = $stateParams.nhuCauId;
            var tacNghiepList = [];
            nhuCauService.getTabNhuCau('tacNghiep', nhuCauTacNghiepVm.model.nhuCauKey).then(function (result) {
                console.log('CAC LOAI TaC NGHIEP', result);
                if (!!result) {
                    _.forEach(result, function(item, key) {
                        if(_.isObject(item)) {
                            var rs = _.find(nhuCauTacNghiepVm.cacLoaiTacNghiep, function(o) {
                                return o.value == item.loaiTacNghiep;
                            });
                            if(!!rs.flagTacNghiepHeThong)
                                item.isSystem = rs.flagTacNghiepHeThong;
                            item.tacNghiepKey = key;
                            tacNghiepList.push(item);
                        }
                    });
              
                    console.log('FILIEE ITEM', tacNghiepList);
                    nhuCauTacNghiepVm.filteredItems = appUtils.sortArray(tacNghiepList, 'timestampCreated');
                    nhuCauTacNghiepVm.paging.totalRecord = tacNghiepList.length;
                    nhuCauTacNghiepVm.paging.currentPage = 0;
                    //group by pages
                    nhuCauTacNghiepVm.groupToPages();
                    $scope.$apply();
                }
            });
        } else {
            //xét trường hợp vào trang vào trang thêm mới
            //$stateParams.item.loaiNhuCauKey  --> //key loại nhu cầu dung để lưu dữ liệu
            $state.go('nhuCauListing');
        }
    } 
})();