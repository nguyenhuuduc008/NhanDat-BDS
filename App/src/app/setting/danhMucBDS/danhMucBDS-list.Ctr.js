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
        danhMucBDSListVm.selectAction = 'Chọn';

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
            var removeIndex = danhMucBDSListVm.selectAction.indexOf('Xóa');
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
            $ngBootbox.confirm('Bạn có chắc muốn chọn thao tác ' + danhMucBDSListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiDanhMucBDS(id));
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