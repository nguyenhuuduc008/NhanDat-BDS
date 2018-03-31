(function(){
    'use strict';
    angular.module('app.setting')
    .controller('loaiNoiThatEditCtr', loaiNoiThatEditCtr);
    	/** @ngInject */
    function loaiNoiThatEditCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var loaiNoiThatAddVm =this;// jshint ignore:line
        loaiNoiThatAddVm.item={};
        var idLoai=$stateParams.id;
        
        loaiNoiThatAddVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiNoiThat(idLoai){
            settingService.getOnceLoaiNoiThat(idLoai).then(function(res){
                if(res.result){
                    loaiNoiThatAddVm.item=res.data;
                }
            });
        }
        loaiNoiThatAddVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiNoiThat(idLoai,loaiNoiThatAddVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Nội Thất thành công!");
                    $state.go('loaiNoiThat-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Nội Thất không thành công!");
            });
        };
        loaiNoiThatAddVm.cancel=function(){
            $state.go('loaiNoiThat-list');
        };

        function init(){
            getOnceLoaiNoiThat(idLoai);
        }

        init();
    } 
})();