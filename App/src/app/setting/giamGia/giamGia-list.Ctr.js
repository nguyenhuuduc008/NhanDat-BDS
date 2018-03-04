(function(){
    'use strict';
    angular.module('app.setting')
    .controller('giamGiaListCtr', giamGiaListCtr);
    	/** @ngInject */
    function giamGiaListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var giamGiaListVm =this;// jshint ignore:line
        giamGiaListVm.items=[];
        giamGiaListVm.selectAction = 'Bulk Actions';

        giamGiaListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        giamGiaListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = giamGiaListVm.selectAction.indexOf('Delete');
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
            $ngBootbox.confirm('Are you sure want to apply ' + giamGiaListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiGiamGia(id));
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
        function getCacLoaiGiamGia(){
            settingService.getCacLoaiGiamGia().$loaded().then(function(res){
                giamGiaListVm.items=res;
                console.log(' giamGiaListVm.items');
                console.log( giamGiaListVm.items);
            });
        }
        function init(){
            getCacLoaiGiamGia();
        }
        init();
    } 
})();