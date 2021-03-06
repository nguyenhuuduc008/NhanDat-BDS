(function(){
    'use strict';
    angular.module('app.quytrinhphaply')
    .controller('quyTrinhPhapLyEditCtr', quyTrinhPhapLyEditCtr);
    	/** @ngInject */
    function quyTrinhPhapLyEditCtr($rootScope, $scope, $state,$q, $stateParams, quyTrinhPhapLyService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var id = $stateParams.id;
        var quyTrinhPhapLyEditVm = this;// jshint ignore:line
        quyTrinhPhapLyEditVm.showInvalid = false;      
        quyTrinhPhapLyEditVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        quyTrinhPhapLyEditVm.cities = [];
        quyTrinhPhapLyEditVm.districts = [];
        var districts;
        quyTrinhPhapLyEditVm.model = {
            tenQuyTrinh: '',
            thanhPho: '',
            quanHuyen: '',
            noiDung: ''
        };
        _.forEach(quyTrinhPhapLyEditVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            quyTrinhPhapLyEditVm.cities.push({
                $id: key,
                text: item.text
            });
        });
        $scope.nameRegx = /^(a-z|A-Z|0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/]*$/;
        $scope.options = {
            height: 300,
            toolbar: [
                    ['edit',['undo','redo']],
                    ['headline', ['style']],
                    ['style', ['bold', 'italic', 'underline', 'superscript', 'subscript', 'strikethrough', 'clear']],
                    ['fontface', ['fontname']],
                    ['textsize', ['fontsize']],
                    ['fontclr', ['color']],
                    ['alignment', ['ul', 'ol', 'paragraph', 'lineheight']],
                    ['height', ['height']],
                    ['table', ['table']],
                    ['insert', ['link','picture','video','hr']],
                    ['view', ['codeview']]
                    
            ]
        };

        init();

        function init(){
            quyTrinhPhapLyService.getOnceQuyTrinhPhapLy(id).then(function(res){
                if(res.result){
                    quyTrinhPhapLyEditVm.model = res.data;
                    //var districts = appSettings.quanHuyen[quyTrinhPhapLyEditVm.model.thanhPho];
                    //quyTrinhPhapLyEditVm.districts = districts;
                    quyTrinhPhapLyEditVm.districts = [];
                    _.forEach(quyTrinhPhapLyEditVm.cacLoaiHanhChinh.capHuyen, function (item, key) {                     
                        if(key === quyTrinhPhapLyEditVm.model.thanhPho) {
                            districts = item;
                        }
                    });
                    _.forEach(districts, function (item, key) {
                        quyTrinhPhapLyEditVm.districts.push({
                            $id: key,
                            text: item.text
                        });
                    });
                }
            });
        }
/*
        quyTrinhPhapLyEditVm.changeCity = function () {
			var districts = appSettings.quanHuyen[quyTrinhPhapLyEditVm.model.thanhPho];
			quyTrinhPhapLyEditVm.districts = districts;
        };
*/        
        quyTrinhPhapLyEditVm.changeCity = function(){                         
            quyTrinhPhapLyEditVm.districts = [];
            _.forEach(quyTrinhPhapLyEditVm.cacLoaiHanhChinh.capHuyen, function (item, key) {                     
                if(key === quyTrinhPhapLyEditVm.model.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                quyTrinhPhapLyEditVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });                  
        };

        quyTrinhPhapLyEditVm.update=function(form){
            appUtils.showLoading();
            if(form.$invalid){
                appUtils.hideLoading();
                return;
            }

            quyTrinhPhapLyService.updateQuyTrinhPhapLy(id, quyTrinhPhapLyEditVm.model).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Chỉnh sửa quy trình thành công!");
                    $state.go('quyTrinhPhapLy-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Chỉnh sửa quy trình không thành công!");
            });
            
        };

        quyTrinhPhapLyEditVm.cancel=function(){
            $state.go('quyTrinhPhapLy-list');
        };
    } 
})();