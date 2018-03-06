(function(){
    'use strict';
    angular.module('app.setting')
    .controller('danhMucBDSModCtr', danhMucBDSModCtr);
    	/** @ngInject */
    function danhMucBDSModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentDanhMucBDS = $rootScope.storage.currentDanhMucBDS;
        var danhMucBDSModVm =this;// jshint ignore:line
        danhMucBDSModVm.item={};
        danhMucBDSModVm.idLoai=$stateParams.idLoai;
        console.log('danhMucBDSModVm.idLoai');
        console.log(danhMucBDSModVm.idLoai);
        
        //danhMucBDSModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiDanhMucBDS(idLoai){
            settingService.getOnceLoaiDanhMucBDS(idLoai).then(function(res){
                if(res.result){
                    danhMucBDSModVm.item=res.data;
                }
            });
        }
        danhMucBDSModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiDanhMucBDS(danhMucBDSModVm.idLoai,danhMucBDSModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Danh Mục BĐS thành công!");
                    $state.go('danhMucBDS-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Danh Mục BĐS không thành công!");
            });
        };
        danhMucBDSModVm.cancel=function(){
            $state.go('danhMucBDS-list');
        };

        danhMucBDSModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiDanhMucBDS(danhMucBDSModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Danh Mục BĐS mới thành công!");
                    $state.go('danhMucBDS-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Danh Mục BĐS mới không thành công!");
            });
            
        };

        function init(){
            if(danhMucBDSModVm.idLoai){
                getOnceLoaiDanhMucBDS(danhMucBDSModVm.idLoai);
            }
        }
        init();
    } 
})();