(function(){
    'use strict';
    angular.module('app.setting')
    .controller('hauModCtr', hauModCtr);
    	/** @ngInject */
    function hauModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var hauModVm =this;// jshint ignore:line
        hauModVm.item={};
        hauModVm.idLoai=$stateParams.idLoai;
        console.log('hauModVm.idLoai');
        console.log(hauModVm.idLoai);
        
        //hauModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiHau(idLoai){
            settingService.getOnceLoaiHau(idLoai).then(function(res){
                if(res.result){
                    hauModVm.item=res.data;
                }
            });
        }
        hauModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiHau(hauModVm.idLoai,hauModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Hậu thành công!");
                    $state.go('hau-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Hậu không thành công!");
            });
        };
        hauModVm.cancel=function(){
            $state.go('hau-list');
        };

        hauModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiHau(hauModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loại Hậu mới thành công!");
                    $state.go('hau-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loại Hậu mới không thành công!");
            });
            
        };

        function init(){
            if(hauModVm.idLoai){
                getOnceLoaiHau(hauModVm.idLoai);
            }
        }
        init();
    } 
})();