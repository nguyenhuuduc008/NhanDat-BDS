(function(){
    'use strict';
    angular.module('app.setting')
    .controller('danhMucBDSModCtr', danhMucBDSModCtr);
    	/** @ngInject */
    function danhMucBDSModCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster, MarkRemoval){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentDanhMucBDS = $rootScope.storage.currentDanhMucBDS;
        var danhMucBDSModVm =this;// jshint ignore:line
        danhMucBDSModVm.item={};
        danhMucBDSModVm.item.isDefault = false;
        console.log('danhMucBDSModVm.idLoai');
        console.log($stateParams.item);
        
        //danhMucBDSModVm.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;

        if($stateParams.item == undefined) {
            danhMucBDSModVm.isAdd = true;
        } else {
            danhMucBDSModVm.isAdd = false;
            danhMucBDSModVm.item = {
                text: $stateParams.item.text,
                key: $stateParams.item.$id,
            };
            danhMucBDSModVm.changeKey = $stateParams.item.$id;
            getKhoDefault();
        }

        function getKhoDefault() {
            settingService.getOnceLoaiDanhMucBDS('khoDefault').then(function(res) {
                danhMucBDSModVm.changeDefault = res.data.$value;
                console.log(res );
                danhMucBDSModVm.item.isDefault = (danhMucBDSModVm.changeDefault === $stateParams.item.$id) ? true : false;
            });
        }

        danhMucBDSModVm.convertTextToKey = function() {
            danhMucBDSModVm.item.key = MarkRemoval.removeUnicode(danhMucBDSModVm.item.text);
        };

        danhMucBDSModVm.edit=function(form){
            appUtils.showLoading();
            if(danhMucBDSModVm.changeKey != danhMucBDSModVm.item.key) {
                settingService.getOnceLoaiDanhMucBDS(danhMucBDSModVm.item.key).then(function (rs) {
                    if (!!rs.data.text) {
                        appUtils.hideLoading();
                        toaster.warning("Loại Kho BĐS đã tồn tại!");
                    } else {
                        settingService.updateLoaiDanhMucBDS(danhMucBDSModVm.item.key, danhMucBDSModVm.item).then(function (res) {
                            if (res.result) {
                                if(danhMucBDSModVm.item.isDefault) {
                                    settingService.updateKhoDefault(danhMucBDSModVm.item.key);
                                }
                                settingService.removeLoaiDanhMucBDS(danhMucBDSModVm.changeKey);
                                appUtils.hideLoading();
                                toaster.success("Sửa Loại Kho BĐS thành công!");
                                $state.go('danhMucBDS-list');
                            }
                        }).catch(function () {
                            appUtils.hideLoading();
                            toaster.warning("Sửa Loại Kho BĐS không thành công!");
                        });
                    }
                });
            } else {
                settingService.updateLoaiDanhMucBDS(danhMucBDSModVm.item.key, danhMucBDSModVm.item).then(function (res) {
                    if (res.result) {
                        if(danhMucBDSModVm.changeDefault == danhMucBDSModVm.changeKey || danhMucBDSModVm.changeDefault == null) {
                            if(danhMucBDSModVm.item.isDefault)
                                settingService.updateKhoDefault(danhMucBDSModVm.item.key);
                            else   
                                settingService.updateKhoDefault(null);
                        }
                        appUtils.hideLoading();
                        toaster.success("Sửa Loại Kho BĐS thành công!");
                        $state.go('danhMucBDS-list');
                    }
                }).catch(function () {
                    appUtils.hideLoading();
                    toaster.warning("Sửa Loại Kho BĐS không thành công!");
                });
            }
        };

        danhMucBDSModVm.cancel=function(){
            $state.go('danhMucBDS-list');
        };

        danhMucBDSModVm.add = function (form) {
            appUtils.showLoading();
            settingService.getOnceLoaiDanhMucBDS(danhMucBDSModVm.item.key).then(function (rs) {
                if (!!rs.data.text) {
                    appUtils.hideLoading();
                    toaster.warning("Loại Kho BĐS đã tồn tại!");
                } else {
                    settingService.updateLoaiDanhMucBDS(danhMucBDSModVm.item.key, danhMucBDSModVm.item).then(function (res) {
                        if (res.result) {
                            if(danhMucBDSModVm.item.isDefault) {
                                settingService.updateKhoDefault(danhMucBDSModVm.item.key);
                            }
                            appUtils.hideLoading();
                            toaster.success("Thêm Loại Kho BĐS thành công!");
                            $state.go('danhMucBDS-list');
                        }
                    }).catch(function () {
                        appUtils.hideLoading();
                        toaster.warning("Thêm Loại Kho BĐS không thành công!");
                    });
                }
            });
        };

        function init(){
            //convertTextToKey();
        }
        init();
    } 
})();