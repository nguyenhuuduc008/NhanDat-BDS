(function(){
    'use strict';
    angular.module('app.setting')
    .controller('nguonBDSModCtr', nguonBDSModCtr);
    	/** @ngInject */
    function nguonBDSModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nguonBDSModVm =this;// jshint ignore:line
        nguonBDSModVm.item={};
        nguonBDSModVm.idLoai=$stateParams.idLoai;
        console.log('nguonBDSModVm.idLoai');
        console.log(nguonBDSModVm.idLoai);
        
        //nguonBDSModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiNguonBDS(idLoai){
            settingService.getOnceLoaiNguonBDS(idLoai).then(function(res){
                if(res.result){
                    nguonBDSModVm.item=res.data;
                }
            });
        }
        nguonBDSModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiNguonBDS(nguonBDSModVm.idLoai,nguonBDSModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Nguồn BDS thành công!");
                    $state.go('nguonBDS-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Nguồn BDS không thành công!");
            });
        };
        nguonBDSModVm.cancel=function(){
            $state.go('nguonBDS-list');
        };

        nguonBDSModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiNguonBDS(nguonBDSModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Nguồn BDS mới thành công!");
                    $state.go('nguonBDS-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Nguồn BDS mới không thành công!");
            });
            
        };

        function init(){
            if(nguonBDSModVm.idLoai){
                getOnceLoaiNguonBDS(nguonBDSModVm.idLoai);
            }
        }
        init();
    } 
})();