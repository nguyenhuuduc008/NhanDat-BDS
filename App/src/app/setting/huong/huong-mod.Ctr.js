(function(){
    'use strict';
    angular.module('app.setting')
    .controller('huongModCtr', huongModCtr);
    	/** @ngInject */
    function huongModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var huongModVm =this;// jshint ignore:line
        huongModVm.item={};
        huongModVm.idLoai=$stateParams.idLoai;
        console.log('huongModVm.idLoai');
        console.log(huongModVm.idLoai);
        
        //huongModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiHuong(idLoai){
            settingService.getOnceLoaiHuong(idLoai).then(function(res){
                if(res.result){
                    huongModVm.item=res.data;
                }
            });
        }
        huongModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiHuong(huongModVm.idLoai,huongModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Hướng thành công!");
                    $state.go('huong-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Hướng không thành công!");
            });
        };
        huongModVm.cancel=function(){
            $state.go('huong-list');
        };

        huongModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiHuong(huongModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Hướng mới thành công!");
                    $state.go('huong-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Hướng mới không thành công!");
            });
            
        };

        function init(){
            if(huongModVm.idLoai){
                getOnceLoaiHuong(huongModVm.idLoai);
            }
        }
        init();
    } 
})();