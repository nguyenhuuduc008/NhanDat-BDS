(function(){
    'use strict';
    angular.module('app.setting')
    .controller('nhuCauListCtr', nhuCauListCtr);
    	/** @ngInject */
    function nhuCauListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentNhuCau = $rootScope.storage.currentNhuCau;
        var nhuCauListVm =this;// jshint ignore:line
        nhuCauListVm.items=[];
        nhuCauListVm.selectAction = 'Bulk Actions';

        nhuCauListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };

        var formType = {
            ban: 'Bán',
            mua: 'Mua',
            thue: 'Thuê',
            'cho-thue': 'Cho Thuê'
        };

        nhuCauListVm.changeForm = function(key) {
            return formType[key];
        };

        nhuCauListVm.toEdit = function(item) {
            $state.go('nhuCau-edit', {item: item});
        };

        nhuCauListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = nhuCauListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + nhuCauListVm.selectAction + ' action as selected?')
            .then(function() {
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiNhuCau(id));
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
        function getCacLoaiNhuCau(){
            settingService.getCacLoaiNhuCau().$loaded().then(function(res){
                nhuCauListVm.items=res;
            });
        }
        function init(){
            getCacLoaiNhuCau();
        }
        init();
    } 
})();