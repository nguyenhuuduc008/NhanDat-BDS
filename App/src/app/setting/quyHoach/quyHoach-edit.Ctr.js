(function(){
    'use strict';
    angular.module('app.setting')
    .controller('quyHoachEditCtr', quyHoachEditCtr);
    	/** @ngInject */
    function quyHoachEditCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyHoachAddVm =this;// jshint ignore:line
        quyHoachAddVm.item={};
        var idLoai=$stateParams.id;
        
        quyHoachAddVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiQuyHoach(idLoai){
            settingService.getOnceLoaiQuyHoach(idLoai).then(function(res){
                if(res.result){
                    quyHoachAddVm.item=res.data;
                }
            });
        }
        quyHoachAddVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiQuyHoach(idLoai,quyHoachAddVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Quy Hoạch thành công!");
                    $state.go('quyHoach-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Quy Hoạch không thành công!");
            });
        };
        quyHoachAddVm.cancel=function(){
            $state.go('quyHoach-list');
        };

        function init(){
            getOnceLoaiQuyHoach(idLoai);
        }

        init();
    } 
})();