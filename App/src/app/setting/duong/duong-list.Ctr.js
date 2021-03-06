(function(){
    'use strict';
    angular.module('app.setting')
    .controller('duongListCtr', duongListCtr);
    	/** @ngInject */
    function duongListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var duongListVm =this;// jshint ignore:line
        duongListVm.items=[];
        duongListVm.selectAction = 'Chọn';

        duongListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        duongListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = duongListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + duongListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiDuong(id));
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
        function getCacLoaiDuong(){
            settingService.getCacLoaiDuong().$loaded().then(function(res){
                duongListVm.items=res;
                console.log(' duongListVm.items');
                console.log( duongListVm.items);
            });
        }
        function init(){
            getCacLoaiDuong();
        }
        init();
    } 
})();