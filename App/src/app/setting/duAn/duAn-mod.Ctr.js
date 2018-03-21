(function(){
    'use strict';
    angular.module('app.setting')
    .controller('duAnModCtr', duAnModCtr);
    	/** @ngInject */
    function duAnModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var duAnModVm =this;// jshint ignore:line
        duAnModVm.item={};
        duAnModVm.idLoai=$stateParams.idLoai;
        console.log('duAnModVm.idLoai');
        console.log(duAnModVm.idLoai);
        
        //duAnModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiDuAn(idLoai){
            settingService.getOnceLoaiDuAn(idLoai).then(function(res){
                if(res.result){
                    duAnModVm.item=res.data;
                }
            });
        }
                
        duAnModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiDuAn(duAnModVm.idLoai,duAnModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Dự Án thành công!");
                    $state.go('duAn-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Dự Án không thành công!");
            });
        };        

        duAnModVm.cancel=function(){
            $state.go('duAn-list');
        };

        duAnModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiDuAn(duAnModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Dự Án mới thành công!");
                    $state.go('duAn-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Dự Án mới không thành công!");
            });
            
        };

        function init(){
            if(duAnModVm.idLoai){
                getOnceLoaiDuAn(duAnModVm.idLoai);
            }
        }
        init();
    } 
})();