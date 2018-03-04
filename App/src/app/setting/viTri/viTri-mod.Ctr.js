(function(){
    'use strict';
    angular.module('app.setting')
    .controller('viTriModCtr', viTriModCtr);
    	/** @ngInject */
    function viTriModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var viTriModVm =this;// jshint ignore:line
        viTriModVm.item={};
        viTriModVm.idLoai=$stateParams.idLoai;
        console.log('viTriModVm.idLoai');
        console.log(viTriModVm.idLoai);
        
        //viTriModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiViTri(idLoai){
            settingService.getOnceLoaiViTri(idLoai).then(function(res){
                if(res.result){
                    viTriModVm.item=res.data;
                }
            });
        }
        viTriModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiViTri(viTriModVm.idLoai,viTriModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Vị Trí thành công!");
                    $state.go('viTri-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Vị Trí không thành công!");
            });
        };
        viTriModVm.cancel=function(){
            $state.go('viTri-list');
        };

        viTriModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiViTri(viTriModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Vị Trí mới thành công!");
                    $state.go('viTri-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Vị Trí mới không thành công!");
            });
            
        };

        function init(){
            if(viTriModVm.idLoai){
                getOnceLoaiViTri(viTriModVm.idLoai);
            }
        }
        init();
    } 
})();