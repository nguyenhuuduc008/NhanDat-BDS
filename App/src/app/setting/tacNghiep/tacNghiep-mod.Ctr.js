(function(){
    'use strict';
    angular.module('app.setting')
    .controller('tacNghiepModCtr', tacNghiepModCtr);
    	/** @ngInject */
    function tacNghiepModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var tacNghiepModVm =this;// jshint ignore:line
        tacNghiepModVm.item={};
        tacNghiepModVm.idLoai=$stateParams.idLoai;
        console.log('tacNghiepModVm.idLoai');
        console.log(tacNghiepModVm.idLoai);
        
        //tacNghiepModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiTacNghiep(idLoai){
            settingService.getOnceLoaiTacNghiep(idLoai).then(function(res){
                if(res.result){
                    tacNghiepModVm.item=res.data;
                }
            });
        }
        tacNghiepModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiTacNghiep(tacNghiepModVm.idLoai,tacNghiepModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Tác Nghiệp thành công!");
                    $state.go('tacNghiep-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Tác Nghiệp không thành công!");
            });
        };
        tacNghiepModVm.cancel=function(){
            $state.go('tacNghiep-list');
        };

        tacNghiepModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiTacNghiep(tacNghiepModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Tác Nghiệp mới thành công!");
                    $state.go('tacNghiep-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Tác Nghiệp mới không thành công!");
            });
            
        };

        function init(){
            if(tacNghiepModVm.idLoai){
                getOnceLoaiTacNghiep(tacNghiepModVm.idLoai);
            }
        }
        init();
    } 
})();