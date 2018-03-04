(function(){
    'use strict';
    angular.module('app.setting')
    .controller('quyHoachListCtr', quyHoachListCtr);
    	/** @ngInject */
    function quyHoachListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyHoachListVm =this;// jshint ignore:line
        quyHoachListVm.items=[];
        quyHoachListVm.selectAction = 'Bulk Actions';

        quyHoachListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        quyHoachListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = quyHoachListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + quyHoachListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiQuyHoach(id));
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
        console.log('quyHoachListCtr');
        function getCacLoaiQuyHoach(){
            settingService.getCacLoaiQuyHoach().$loaded().then(function(res){
                quyHoachListVm.items=res;
                console.log(' quyHoachListVm.items');
                console.log( quyHoachListVm.items);
            });
        }
        function init(){
            getCacLoaiQuyHoach();
        }
        init();
    } 
})();