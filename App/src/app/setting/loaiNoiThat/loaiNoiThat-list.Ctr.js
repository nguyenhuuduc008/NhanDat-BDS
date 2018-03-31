(function(){
    'use strict';
    angular.module('app.setting')
    .controller('loaiNoiThatListCtr', loaiNoiThatListCtr);
    	/** @ngInject */
    function loaiNoiThatListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var loaiNoiThatListVm =this;// jshint ignore:line
        loaiNoiThatListVm.items=[];
        loaiNoiThatListVm.selectAction = 'Chọn';

        loaiNoiThatListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        loaiNoiThatListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = loaiNoiThatListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn thực hiện thao tác ' + loaiNoiThatListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiNoiThat(id));
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
        
        function getCacLoaiNoiThat(){
            settingService.getCacLoaiNoiThat().$loaded().then(function(res){
                loaiNoiThatListVm.items=res;                
            });
        }
        function init(){
            getCacLoaiNoiThat();
        }
        init();
    } 
})();