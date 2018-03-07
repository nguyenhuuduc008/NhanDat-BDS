(function(){
    'use strict';
    angular.module('app.setting')
    .controller('loaiTacNghiepModCtr', loaiTacNghiepModCtr);
    	/** @ngInject */
    function loaiTacNghiepModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var loaiTacNghiepModVm =this;// jshint ignore:line
        loaiTacNghiepModVm.item={};
        loaiTacNghiepModVm.idLoai=$stateParams.idLoai;
        console.log('loaiTacNghiepModVm.idLoai');
        console.log(loaiTacNghiepModVm.idLoai);
        
        //loaiTacNghiepModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        function getOnceLoaiTacNghiep(idLoai){
            settingService.getOnceLoaiTacNghiep(idLoai).then(function(res){
                if(res.result){
                    loaiTacNghiepModVm.item=res.data;
                }
            });
        }
        loaiTacNghiepModVm.edit=function(form){
            appUtils.showLoading();
            settingService.updateLoaiTacNghiep(loaiTacNghiepModVm.idLoai,loaiTacNghiepModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Loại Tác Nghiệp thành công!");
                    $state.go('loaiTacNghiep-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Loại Tác Nghiệp không thành công!");
            });
        };
        loaiTacNghiepModVm.cancel=function(){
            $state.go('loaiTacNghiep-list');
        };

        loaiTacNghiepModVm.add=function(form){
            appUtils.showLoading();
            settingService.addLoaiTacNghiep(loaiTacNghiepModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm Loai Tác Nghiệp mới thành công!");
                    $state.go('loaiTacNghiep-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm Loai Tác Nghiệp mới không thành công!");
            });
            
        };

        function init(){
            if(loaiTacNghiepModVm.idLoai){
                getOnceLoaiTacNghiep(loaiTacNghiepModVm.idLoai);
            }
        }
        init();
    } 
})();