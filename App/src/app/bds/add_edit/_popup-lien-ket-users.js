(function () {
    'use strict';

    angular.module('app.bds')
        .controller('lienKetUsersCtrl', lienKetUsersCtrl);

    /** @ngInject */
    function lienKetUsersCtrl($rootScope, $scope, $state, $ngBootbox, $uibModalInstance, appUtils, userService, bdsService, lienKetUsersService, bdsId, lstUserIds, toaster) {
        var currentUser = $rootScope.storage.currentUser;
        var appSettings = $rootScope.storage.appSettings;
        var vm = this; // jshint ignore:line
        vm.bdsId = bdsId;
        vm.lstUserIds = lstUserIds;
        vm.states = appUtils.getAllState();
        vm.cacLoaiLienKetUser = appSettings.cacLoaiLienKetUser;

        //Load Data
        function loadData() {
            appUtils.showLoading();
            bdsService.getLinkToCategory(vm.bdsId).$loaded().then(function (danhMucRs) {
                if (danhMucRs) {
                    userService.get(danhMucRs.uid).$loaded().then(function(userRs){
                        if(userRs && !userRs.isDeleted){
                            vm.user = userRs;
                        }
                    });
                }
                appUtils.hideLoading();
            });
        }

        loadData();

        //Functions
        vm.close = function () {
            $uibModalInstance.dismiss('cancel');
        };

        vm.saveLienKetUsers = function(){
            appUtils.showLoading();
            var obj = {
                users: vm.lstUserIds,
            };
            lienKetUsersService.create(vm.bdsId, obj).then(function(res){
                if(!res.result){				
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
                appUtils.hideLoading();
                toaster.pop('success','Success', "Save success!");
                vm.close();
            }, function(res){
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            });
        };

    }

})();
