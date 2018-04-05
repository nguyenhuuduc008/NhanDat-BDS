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
        var editForm = '';
        var nhuCauModVm =this;// jshint ignore:line
        
        //nhuCauModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
        if($stateParams.item == null || $stateParams.item == undefined) {
            nhuCauModVm.item={};
            nhuCauModVm.isAdd = true;
            settingService.getCacLoaiNhuCau().$loaded().then(function(res){
                nhuCauModVm.items=res;
                console.log('TESTETSE', res);
            });
        }
        else {
            nhuCauModVm.item={
                text: $stateParams.item.text,
                form: $stateParams.item.value,
            };       
            nhuCauModVm.isAdd = false;    
            editForm = $stateParams.item.value;
        }


        nhuCauModVm.edit=function(form){
            appUtils.showLoading();
            if(nhuCauModVm.item.form == editForm) {
                settingService.updateLoaiNhuCau(nhuCauModVm.item.form, nhuCauModVm.item).then(function (res) {
                    if (res.result) {
                        appUtils.hideLoading();
                        toaster.success("Sửa Loại Nhu Cầu thành công!");
                        $state.go('nhuCau-list');
                    }
                }).catch(function () {
                    appUtils.hideLoading();
                    toaster.warning("Sửa Loại Nhu Cầu không thành công!");
                });
                return;
            } 
            appUtils.hideLoading();
            toaster.warning('Mẫu loại nhu cầu đã tồn tại!');
        };
        nhuCauModVm.cancel=function(){
            $state.go('nhuCau-list');
        };

        nhuCauModVm.add=function(form){
            appUtils.showLoading();
            var res = _.find(nhuCauModVm.items, function(o) {
                return o.value == nhuCauModVm.item.form;
            });
            if(res == undefined) {
                settingService.updateLoaiNhuCau(nhuCauModVm.item.form, nhuCauModVm.item).then(function(res){
                    if(res.result){
                        appUtils.hideLoading();
                        toaster.success("Thêm loại Nhu Cầu mới thành công!");
                        $state.go('nhuCau-list');
                    }
                }).catch(function(){
                    appUtils.hideLoading();
                    toaster.warning("Thêm loại Nhu Cầu mới không thành công!");
                });    
                return;            
            }
            appUtils.hideLoading();
            toaster.warning('Mẫu loại nhu cầu đã tồn tại!');
        };

        function init(){
            if(nhuCauModVm.idLoai){
                getOnceLoaiNhuCau(nhuCauModVm.idLoai);
            }
        }
        init();
    } 
})();