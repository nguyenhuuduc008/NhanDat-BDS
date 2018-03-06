(function(){
    'use strict';
    angular.module('app.setting')
    .controller('nhuCauModCtr', nhuCauModCtr);
    	/** @ngInject */
    function nhuCauModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentNhuCau = $rootScope.storage.currentNhuCau;
        var nhuCauModVm =this;// jshint ignore:line
        nhuCauModVm.item={};
        nhuCauModVm.idLoai=$stateParams.idLoai;
        console.log('nhuCauModVm.idLoai');
        console.log(nhuCauModVm.idLoai);
        
        //nhuCauModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiNhuCau(idLoai){
            settingService.getOnceLoaiNhuCau(idLoai).then(function(res){
                if(res.result){
                    nhuCauModVm.item=res.data;
                }
            });
        }
        nhuCauModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiNhuCau(nhuCauModVm.idLoai,nhuCauModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Nhu Cầu thành công!");
                    $state.go('nhuCau-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Nhu Cầu không thành công!");
            });
        };
        nhuCauModVm.cancel=function(){
            $state.go('nhuCau-list');
        };

        nhuCauModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiNhuCau(nhuCauModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Nhu Cầu mới thành công!");
                    $state.go('nhuCau-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Nhu Cầu mới không thành công!");
            });
            
        };

        function init(){
            if(nhuCauModVm.idLoai){
                getOnceLoaiNhuCau(nhuCauModVm.idLoai);
            }
        }
        init();
    } 
})();