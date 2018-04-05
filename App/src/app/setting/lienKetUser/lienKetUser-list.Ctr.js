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
        lienKetUserListVm.selectAction = 'Chọn';

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
            var removeIndex = lienKetUserListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + lienKetUserListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiLienKetUser(id));
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