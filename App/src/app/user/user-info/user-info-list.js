  (function () {
    'use strict';

    angular.module('app.user')
	.controller('userInfoListCrtl', userInfoListCrtl);

    /** @ngInject */
    function userInfoListCrtl($rootScope,$q, $scope, $state,$timeout,$ngBootbox,appUtils,toaster, currentAuth, authService, userService, roleService,permissionService, $http) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentUser = $rootScope.storage.currentUser;
        // if(!currentUser.userRoles || (currentUser.userRoles && currentUser.userRoles.length <= 0)){
        //     window.location.href = '/#/home';
        //     return;
        // }
        var infoVm = this; // jshint ignore:line
        infoVm.keyword = '';
        infoVm.isAdmin = false;
        infoVm.groupedItems = [];
        infoVm.filteredItems = [];
        infoVm.pagedItems = [];
        infoVm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        
        //Load Data
        roleService.items().$loaded(function(data){
            infoVm.roles = data;
            console.log('infoVm.roles');
            console.log(infoVm.roles);
        });
        
      

        /*=============================================================*/
        function initPage(){
            infoVm.searchUser(infoVm.keyword);
        }
        
        //Functions
        infoVm.groupToPages = function () {
            infoVm.pagedItems = [];
            for (var i = 0; i < infoVm.filteredItems.length; i++) {
                if (i % infoVm.paging.pageSize === 0) {
                    infoVm.pagedItems[Math.floor(i / infoVm.paging.pageSize)] = [infoVm.filteredItems[i]];
                } else {
                    infoVm.pagedItems[Math.floor(i / infoVm.paging.pageSize)].push(infoVm.filteredItems[i]);
                }
            }
            infoVm.paging.totalPage = Math.ceil(infoVm.filteredItems.length / infoVm.paging.pageSize);
        };


        infoVm.changePage = function () {
              $('#select-all-user').attr('checked', false);
              infoVm.groupToPages();
        };
        
        infoVm.searchUser = function (keyword) {
            appUtils.showLoading();
            userService.searchInfo(keyword).then(function (result) {
                appUtils.hideLoading();
                infoVm.filteredItems = appUtils.sortArray(result,'timestampCreated');
                console.log('UESE LSIT', infoVm.filteredItems);
                infoVm.paging.totalRecord = result.length; 
                infoVm.paging.currentPage = 0;
                //group by pages
                infoVm.groupToPages();
            });
        };

        infoVm.selectAllUser = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };

        infoVm.edit= function(userPhone){
            $state.go('user.editInfo', {id: userPhone});
        };

        infoVm.applyAction = function (chkName, actionControl) {
            var lstUserIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstUserIds.push($(this).val() + '');
                }
            });

            var action = $('#' + actionControl).val();
            var actionTxt = $('#' + actionControl + ' option:selected').text();

            if (action === 0 || parseInt(action) === 0) {
                toaster.warning("Vui lòng chọn thao tác!");
                return;
            }

            if (lstUserIds.length === 0) {
                toaster.warning("Vui lòng chọn người dùng cần thao tác!");
                return;
            }

            $ngBootbox.confirm('Bạn có chắc muốn thực hiện thao tác ' + actionTxt + ' ?').then(function () {
                appUtils.showLoading();
                var reqs = [];
                if (action === 'delete') {
                    console.log(lstUserIds);
                    _.forEach(lstUserIds, function (obj, key) {
                        reqs.push(userService.deletePhone(obj));
                    });
                  
                    $q.all(reqs).then(function (res) {
                        appUtils.hideLoading();
                        var err = _.find(res, function (item) {
                            return item.result === false;
                        });

                        if (err === undefined) {
                            delete $rootScope.storage.usersList;
                            toaster.pop('success', 'Thành công', "Xóa thành công!");
                        } else {
                            toaster.pop('error', 'Thất bại', "Xóa thất bại!");
                        }
                        initPage();
                    });
                } else {
                    appUtils.hideLoading();
                }
            });
        };

        initPage();
    }
})();
