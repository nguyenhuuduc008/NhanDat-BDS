(function(){
    'use strict';
    angular.module('app.setting')
    .controller('giamGiaModCtr', giamGiaModCtr);
    	/** @ngInject */
    function giamGiaModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var giamGiaModVm =this;// jshint ignore:line
        giamGiaModVm.item={};
        giamGiaModVm.idLoai=$stateParams.idLoai;
        console.log('giamGiaModVm.idLoai');
        console.log(giamGiaModVm.idLoai);
        
        //giamGiaModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiGiamGia(idLoai){
            settingService.getOnceLoaiGiamGia(idLoai).then(function(res){
                if(res.result){
                    giamGiaModVm.item=res.data;
                }
            });
        }
        giamGiaModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiGiamGia(giamGiaModVm.idLoai,giamGiaModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Giảm Giá thành công!");
                    $state.go('giamGia-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Giảm Giá không thành công!");
            });
        };
        giamGiaModVm.cancel=function(){
            $state.go('giamGia-list');
        };

        giamGiaModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiGiamGia(giamGiaModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Giảm Giá mới thành công!");
                    $state.go('giamGia-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Giảm Giá mới không thành công!");
            });
            
        };

        function init(){
            if(giamGiaModVm.idLoai){
                getOnceLoaiGiamGia(giamGiaModVm.idLoai);
            }
        }
        init();
    } 
})();