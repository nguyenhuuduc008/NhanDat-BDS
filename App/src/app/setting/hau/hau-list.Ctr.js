(function(){
    'use strict';
    angular.module('app.setting')
    .controller('hauListCtr', hauListCtr);
    	/** @ngInject */
    function hauListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var hauListVm =this;// jshint ignore:line
        hauListVm.items=[];
        hauListVm.selectAction = 'Chọn';

        hauListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        hauListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = hauListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + hauListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiHau(id));
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
        function getCacLoaiHau(){
            settingService.getCacLoaiHau().$loaded().then(function(res){
                hauListVm.items=res;
                console.log(' hauListVm.items');
                console.log( hauListVm.items);
            });
        }
        function init(){
            getCacLoaiHau();
        }
        init();
    } 
})();