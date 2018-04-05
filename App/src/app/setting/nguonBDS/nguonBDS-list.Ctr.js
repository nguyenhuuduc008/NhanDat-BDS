(function(){
    'use strict';
    angular.module('app.setting')
    .controller('nguonBDSListCtr', nguonBDSListCtr);
    	/** @ngInject */
    function nguonBDSListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nguonBDSListVm =this;// jshint ignore:line
        nguonBDSListVm.items=[];
        nguonBDSListVm.selectAction = 'Chọn';

        nguonBDSListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        nguonBDSListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = nguonBDSListVm.selectAction.indexOf('Xóa');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn thao tác!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn dòng cần thao tác!");
                return;
            }
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + nguonBDSListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiNguonBDS(id));
                });
                $q.all(removePromise).then(function(rs){
                    appUtils.hideLoading();
                    toaster.success("Xóa thành công!");
                    init();
                });
            }, function() {
                appUtils.hideLoading();
            });

        };
        function getCacLoaiNguonBDS(){
            settingService.getCacLoaiNguonBDS().$loaded().then(function(res){
                nguonBDSListVm.items=res;
                console.log(' nguonBDSListVm.items');
                console.log( nguonBDSListVm.items);
            });
        }
        function init(){
            getCacLoaiNguonBDS();
        }
        init();
    } 
})();