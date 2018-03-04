(function(){
    'use strict';
    angular.module('app.setting')
    .controller('lienKetUserModCtr', lienKetUserModCtr);
    	/** @ngInject */
    function lienKetUserModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var lienKetUserModVm =this;// jshint ignore:line
        lienKetUserModVm.item={};
        lienKetUserModVm.idLoai=$stateParams.idLoai;
        console.log('lienKetUserModVm.idLoai');
        console.log(lienKetUserModVm.idLoai);
        
        //lienKetUserModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiLienKetUser(idLoai){
            settingService.getOnceLoaiLienKetUser(idLoai).then(function(res){
                if(res.result){
                    lienKetUserModVm.item=res.data;
                }
            });
        }
        lienKetUserModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiLienKetUser(lienKetUserModVm.idLoai,lienKetUserModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Liên Kết User thành công!");
                    $state.go('lienKetUser-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Liên Kết User không thành công!");
            });
        };
        lienKetUserModVm.cancel=function(){
            $state.go('lienKetUser-list');
        };

        lienKetUserModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiLienKetUser(lienKetUserModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Liên Kết User mới thành công!");
                    $state.go('lienKetUser-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Liên Kết User mới không thành công!");
            });
            
        };

        function init(){
            if(lienKetUserModVm.idLoai){
                getOnceLoaiLienKetUser(lienKetUserModVm.idLoai);
            }
        }
        init();
    } 
})();