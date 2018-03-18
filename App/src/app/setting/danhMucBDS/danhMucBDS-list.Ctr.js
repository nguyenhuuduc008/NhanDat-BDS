(function(){
    'use strict';
    angular.module('app.setting')
    .controller('danhMucBDSListCtr', danhMucBDSListCtr);
    	/** @ngInject */
    function danhMucBDSListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentDanhMucBDS = $rootScope.storage.currentDanhMucBDS;
        var danhMucBDSListVm =this;// jshint ignore:line
        danhMucBDSListVm.items=[];
        danhMucBDSListVm.selectAction = 'Bulk Actions';

        danhMucBDSListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };

        danhMucBDSListVm.toEdit = function(item) {
            $state.go('danhMucBDS-edit', {item: item});
        };

        danhMucBDSListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = danhMucBDSListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + danhMucBDSListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiDanhMucBDS(id));
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
        function getCacLoaiDanhMucBDS(){
            settingService.getCacLoaiDanhMucBDS().$loaded().then(function(res){
                danhMucBDSListVm.items = _.filter(res, function(o) {
                    return o.$id !== "khoDefault";
                });
                danhMucBDSListVm.itemDefault = _.find(res, ['$id','khoDefault']);
            });
        }
        function init(){
            getCacLoaiDanhMucBDS();
        }
        init();
    } 
})();