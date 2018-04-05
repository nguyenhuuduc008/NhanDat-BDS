(function(){
    'use strict';
    angular.module('app.setting')
    .controller('userModCtr', userModCtr);
    	/** @ngInject */
    function userModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var userModVm =this;// jshint ignore:line
        userModVm.item={};
        userModVm.idLoai=$stateParams.idLoai;
        console.log('userModVm.idLoai');
        console.log(userModVm.idLoai);
        
        //userModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiUser(idLoai){
            settingService.getOnceLoaiUser(idLoai).then(function(res){
                if(res.result){
                    userModVm.item=res.data;
                }
            });
        }
        userModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiUser(userModVm.idLoai,userModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại User thành công!");
                    $state.go('user-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại User không thành công!");
            });
        };
        userModVm.cancel=function(){
            $state.go('user-list');
        };

        userModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiUser(userModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loại User mới thành công!");
                    $state.go('user-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loại User mới không thành công!");
            });
            
        };

        function init(){
            if(userModVm.idLoai){
                getOnceLoaiUser(userModVm.idLoai);
            }
        }
        init();
    } 
})();