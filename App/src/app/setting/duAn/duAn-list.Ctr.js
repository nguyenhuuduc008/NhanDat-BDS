(function(){
    'use strict';
    angular.module('app.setting')
    .controller('duAnListCtr', duAnListCtr);
    	/** @ngInject */
    function duAnListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var duAnListVm =this;// jshint ignore:line
        duAnListVm.items=[];
        duAnListVm.selectAction = 'Chọn';

        duAnListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        duAnListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = duAnListVm.selectAction.indexOf('Xóa');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn thao tác!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn dự án cần thao tác!");
                return;
            }
            $ngBootbox.confirm('Bạn có chắc muốn thực hiện thao tác ' + duAnListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiDuAn(id));
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
        function getCacLoaiDuAn(){
            settingService.getCacLoaiDuAn().$loaded().then(function(res){
                duAnListVm.items=res;
                console.log(' duAnListVm.items');
                console.log( duAnListVm.items);
            });
        }
        function init(){
            getCacLoaiDuAn();
        }
        init();
    } 
})();