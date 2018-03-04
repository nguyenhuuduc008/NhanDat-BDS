(function(){
    'use strict';
    angular.module('app.setting')
    .controller('tacNghiepListCtr', tacNghiepListCtr);
    	/** @ngInject */
    function tacNghiepListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var tacNghiepListVm =this;// jshint ignore:line
        tacNghiepListVm.items=[];
        tacNghiepListVm.selectAction = 'Bulk Actions';

        tacNghiepListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        tacNghiepListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = tacNghiepListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + tacNghiepListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiTacNghiep(id));
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
        function getCacLoaiTacNghiep(){
            settingService.getCacLoaiTacNghiep().$loaded().then(function(res){
                tacNghiepListVm.items=res;
                console.log(' tacNghiepListVm.items');
                console.log( tacNghiepListVm.items);
            });
        }
        function init(){
            getCacLoaiTacNghiep();
        }
        init();
    } 
})();