(function(){
    'use strict';
    angular.module('app.setting')
    .controller('quyHoachAddCtr', quyHoachAddCtr);
    	/** @ngInject */
    function quyHoachAddCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyHoachAddVm =this;// jshint ignore:line
        quyHoachAddVm.item={};

        quyHoachAddVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        quyHoachAddVm.create=function(form){
            appUtils.showLoading();
            settingService.addLoaiQuyHoach(quyHoachAddVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Quy Hoach mới thành công!");
                    $state.go('quyHoach-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Quy Hoach mới không thành công!");
            });
            
        };

        quyHoachAddVm.cancel=function(){
            $state.go('quyHoach-list');
        };
    } 
})();