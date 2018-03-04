(function(){
    'use strict';
    angular.module('app.setting')
    .controller('capDoEditCtr', capDoEditCtr);
    	/** @ngInject */
    function capDoEditCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var capDoEditVm =this;// jshint ignore:line
        capDoEditVm.item={};
        var idLoai=$stateParams.id;
        
        capDoEditVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
       // updateLoaiCapDo
        function getOnceLoaiCapDo(idLoai){
            settingService.getOnceLoaiCapDo(idLoai).then(function(res){
                if(res.result){
                    capDoEditVm.item=res.data;
                }
            });
        }

        capDoEditVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiCapDo(idLoai,capDoEditVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Cấp Độ thành công!");
                    $state.go('capDo-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Cấp Độ không thành công!");
            });
        };
        capDoEditVm.cancel=function(){
            $state.go('capDo-list');
        };

        function init(){
            getOnceLoaiCapDo(idLoai);
        }

        init();
    } 
})();