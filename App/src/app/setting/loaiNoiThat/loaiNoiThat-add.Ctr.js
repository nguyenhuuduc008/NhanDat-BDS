(function(){
    'use strict';
    angular.module('app.setting')
    .controller('loaiNoiThatAddCtr', loaiNoiThatAddCtr);
    	/** @ngInject */
    function loaiNoiThatAddCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var loaiNoiThatAddVm =this;// jshint ignore:line
        loaiNoiThatAddVm.item={};

        loaiNoiThatAddVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;        

        loaiNoiThatAddVm.create=function(form){
            appUtils.showLoading();
            settingService.addLoaiNoiThat(loaiNoiThatAddVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Nội Thất mới thành công!");
                    $state.go('loaiNoiThat-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loại Nội Thất mới không thành công!");
            });
            
        };

        loaiNoiThatAddVm.cancel=function(){
            $state.go('loaiNoiThat-list');
        };
    } 
})();