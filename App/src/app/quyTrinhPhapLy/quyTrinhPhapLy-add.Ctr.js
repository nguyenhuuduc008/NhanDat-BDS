(function(){
    'use strict';
    angular.module('app.quytrinhphaply')
    .controller('quyTrinhPhapLyAddCtr', quyTrinhPhapLyAddCtr);
    	/** @ngInject */
    function quyTrinhPhapLyAddCtr($rootScope, $scope, $state,$q,quyTrinhPhapLyService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyTrinhPhapLyAddVm = this;// jshint ignore:line
        quyTrinhPhapLyAddVm.showInvalid = false;
        quyTrinhPhapLyAddVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;
        quyTrinhPhapLyAddVm.cities = [];
        quyTrinhPhapLyAddVm.districts = [];
        var districts;
        quyTrinhPhapLyAddVm.model = {
            tenQuyTrinh: '',
            thanhPho: '',
            quanHuyen: '',
            noiDung: ''
        };
        
        _.forEach(quyTrinhPhapLyAddVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            quyTrinhPhapLyAddVm.cities.push({
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

        quyTrinhPhapLyAddVm.changeCity = function(){                         
            quyTrinhPhapLyAddVm.districts = [];
            _.forEach(quyTrinhPhapLyAddVm.cacLoaiHanhChinh.capHuyen, function (item, key) {                     
                if(key === quyTrinhPhapLyAddVm.model.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                quyTrinhPhapLyAddVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });                  
        };
        
        quyTrinhPhapLyAddVm.create=function(form){
            appUtils.showLoading();
            quyTrinhPhapLyAddVm.showInvalid = true;
            if(form.$invalid){
                appUtils.hideLoading();
                return;
            }

            quyTrinhPhapLyService.addQuyTrinhPhapLy(quyTrinhPhapLyAddVm.model).then(function(res){
                if(res.result){
                    appUtils.hideLoading();
                    toaster.success("Thêm quy trình mới thành công!");
                    $state.go('quyTrinhPhapLy-list');
                }
            }).catch(function(){
                appUtils.hideLoading();
                toaster.warning("Thêm quy trình mới không thành công!");
            });
            
        };

        quyTrinhPhapLyAddVm.cancel=function(){
            $state.go('quyTrinhPhapLy-list');
        };
    } 
})();