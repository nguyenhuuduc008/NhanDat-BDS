(function(){
    'use strict';
    angular.module('app.setting')
    .controller('tacNghiepModCtr', tacNghiepModCtr);
    	/** @ngInject */
    function tacNghiepModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster, tacNghiepService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var tacNghiepModVm =this;// jshint ignore:line
        tacNghiepModVm.item={};
        console.log('PARAMS', $stateParams);
        tacNghiepModVm.item.thongtin = $stateParams.text;
        tacNghiepModVm.id = $stateParams.id;
        tacNghiepModVm.bdsId = $stateParams.bdsId;
        
        //tacNghiepModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        tacNghiepModVm.edit=function(form){
            appUtils.showLoading();
            tacNghiepService.updateInfo(tacNghiepModVm.id, tacNghiepModVm.bdsId, tacNghiepModVm.item).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Sửa Thông Tin Tác Nghiệp thành công!");
                    $state.go('tacNghiep-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Sửa Thông Tin Tác Nghiệp không thành công!");
            });
        };
        tacNghiepModVm.cancel=function(){
            $state.go('tacNghiep-list');
        };

        function init(){
            // if(tacNghiepModVm.idLoai){
            //     getOnceLoaiTacNghiep(tacNghiepModVm.idLoai);
            // }
        }
        init();
    } 
})();