(function(){
    'use strict';
    angular.module('app.setting')
    .controller('capDoAddCtr', capDoAddCtr);
    	/** @ngInject */
    function capDoAddCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var capDoAddVm =this;// jshint ignore:line
        capDoAddVm.item={};

        capDoAddVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
        capDoAddVm.showInvalid=false;

        capDoAddVm.create=function(form){
            appUtils.showLoading();
            settingService.addLoaiCapDo(capDoAddVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loại Cấp Độ mới thành công!");
                    $state.go('capDo-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loại Cấp Độ mới không thành công!");
            });
        };
        capDoAddVm.cancel=function(){
            $state.go('capDo-list');
        };
    } 
})();