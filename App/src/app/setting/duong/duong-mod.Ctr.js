(function(){
    'use strict';
    angular.module('app.setting')
    .controller('duongModCtr', duongModCtr);
    	/** @ngInject */
    function duongModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var duongModVm =this;// jshint ignore:line
        duongModVm.item={};
        duongModVm.idLoai=$stateParams.idLoai;
        console.log('duongModVm.idLoai');
        console.log(duongModVm.idLoai);
        
        //duongModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiDuong(idLoai){
            settingService.getOnceLoaiDuong(idLoai).then(function(res){
                if(res.result){
                    duongModVm.item=res.data;
                }
            });
        }
        duongModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiDuong(duongModVm.idLoai,duongModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Đường thành công!");
                    $state.go('duong-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Đường không thành công!");
            });
        };
        duongModVm.cancel=function(){
            $state.go('duong-list');
        };

        duongModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiDuong(duongModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Đường mới thành công!");
                    $state.go('duong-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Đường mới không thành công!");
            });
            
        };

        function init(){
            if(duongModVm.idLoai){
                getOnceLoaiDuong(duongModVm.idLoai);
            }
        }
        init();
    } 
})();