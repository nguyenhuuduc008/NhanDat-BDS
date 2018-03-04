(function(){
    'use strict';
    angular.module('app.setting')
    .controller('mucDichModCtr', mucDichModCtr);
    	/** @ngInject */
    function mucDichModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var mucDichModVm =this;// jshint ignore:line
        mucDichModVm.item={};
        mucDichModVm.idLoai=$stateParams.idLoai;
        console.log('mucDichModVm.idLoai');
        console.log(mucDichModVm.idLoai);
        
        //mucDichModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiMucDich(idLoai){
            settingService.getOnceLoaiMucDich(idLoai).then(function(res){
                if(res.result){
                    mucDichModVm.item=res.data;
                }
            });
        }
        mucDichModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiMucDich(mucDichModVm.idLoai,mucDichModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Mục Đích thành công!");
                    $state.go('mucDich-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Mục Đích không thành công!");
            });
        };
        mucDichModVm.cancel=function(){
            $state.go('mucDich-list');
        };

        mucDichModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiMucDich(mucDichModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Mục Đích mới thành công!");
                    $state.go('mucDich-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Mục Đích mới không thành công!");
            });
            
        };

        function init(){
            if(mucDichModVm.idLoai){
                getOnceLoaiMucDich(mucDichModVm.idLoai);
            }
        }
        init();
    } 
})();