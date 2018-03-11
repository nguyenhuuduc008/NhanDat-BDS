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
        quyTrinhPhapLyAddVm.cities = appSettings.thanhPho;
        quyTrinhPhapLyAddVm.model = {
            tenQuyTrinh: '',
            thanhPho: '',
            quanHuyen: '',
            noiDung: ''
        };

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

        quyTrinhPhapLyAddVm.changeCity = function () {
			var districts = appSettings.quanHuyen[quyTrinhPhapLyAddVm.model.thanhPho];
			quyTrinhPhapLyAddVm.districts = districts;
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