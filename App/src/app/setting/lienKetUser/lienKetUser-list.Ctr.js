(function(){
    'use strict';
    angular.module('app.setting')
    .controller('lienKetUserListCtr', lienKetUserListCtr);
    	/** @ngInject */
    function lienKetUserListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var lienKetUserListVm =this;// jshint ignore:line
        lienKetUserListVm.items=[];
        lienKetUserListVm.selectAction = 'Bulk Actions';

        lienKetUserListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        lienKetUserListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = lienKetUserListVm.selectAction.indexOf('Delete');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Please choose action to execute!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Please choose some items to execute action!");
                return;
            }
            $ngBootbox.confirm('Are you sure want to apply ' + lienKetUserListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiLienKetUser(id));
                });
                $q.all(removePromise).then(function(rs){
                    appUtils.hideLoading();
                    toaster.success("Delete success!");
                    init();
                });
            }, function() {
                appUtils.hideLoading();
            });

        };
        function getCacLoaiLienKetUser(){
            settingService.getCacLoaiLienKetUser().$loaded().then(function(res){
                lienKetUserListVm.items=res;
                console.log(' lienKetUserListVm.items');
                console.log( lienKetUserListVm.items);
            });
        }
        function init(){
            getCacLoaiLienKetUser();
        }
        init();
    } 
})();