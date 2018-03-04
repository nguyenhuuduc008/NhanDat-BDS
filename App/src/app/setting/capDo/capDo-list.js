
(function(){
    'use strict';
    angular.module('app.setting')
    .controller('capDoListCtr', capDoListCtr);
    	/** @ngInject */
    function capDoListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
            
        var currentUser = $rootScope.storage.currentUser;
        var capDoListVm =this;// jshint ignore:line
        capDoListVm.items=[];
        capDoListVm.selectAction = 'Bulk Actions';

        capDoListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        capDoListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = capDoListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + capDoListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiCapDo(id));
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
        function getCacLoaiCapDo(){
            settingService.getCacLoaiCapDo().$loaded().then(function(res){
                capDoListVm.items=res;
                console.log(' capDoListVm.items');
                console.log( capDoListVm.items);
            });
        }
        function init(){
            getCacLoaiCapDo();
        }
        init();
    }
    
})();