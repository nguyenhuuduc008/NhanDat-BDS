(function(){
    'use strict';
    angular.module('app.setting')
    .controller('settingNhuCauListCtr', settingNhuCauListCtr);
    	/** @ngInject */
    function settingNhuCauListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentNhuCau = $rootScope.storage.currentNhuCau;
        var nhuCauListVm =this;// jshint ignore:line
        nhuCauListVm.items=[];
        nhuCauListVm.selectAction = 'Chọn';

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
            var removeIndex = nhuCauListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + nhuCauListVm.selectAction + ' ?')
            .then(function() {
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiNhuCau(id));
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