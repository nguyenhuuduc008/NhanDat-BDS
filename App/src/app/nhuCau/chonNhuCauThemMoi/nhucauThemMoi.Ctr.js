(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauThemMoiCtr', nhuCauThemMoiCtr);
    	/** @ngInject */
    function nhuCauThemMoiCtr($rootScope, $scope, $state,$q,nhuCauService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauThemMoiVm =this;// jshint ignore:line
        //
        nhuCauThemMoiVm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
        nhuCauThemMoiVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;

        nhuCauThemMoiVm.xacNhan=function(idLoaiNhuCau){
            //check valid
            var idLoaiNhuCauValue=$('#' + idLoaiNhuCau).val();
            var idLoaiNhuCauText=$('#'+idLoaiNhuCau + ' option:selected').text();
            console.log('idLoaiNhuCauText');
            console.log(idLoaiNhuCauText);
            if(idLoaiNhuCauValue=='0'){
                toaster.warning("Lựa Chọn chưa được chọn!");
                return;
            }
            //ban + cho thue
            if(idLoaiNhuCauText=='Bán'){
                console.log('Ban');
                
                $state.go('ban_choThueAdd',{
                    activeTab:'thongTin',
                    loaiNhuCauId:idLoaiNhuCauValue,
                    loaiNhuCauText:idLoaiNhuCauText
                });
            }
            if(idLoaiNhuCauText=='Cho Thuê'){
                console.log('Cho thue');
                $state.go('ban_choThueAdd',{
                    activeTab:'thongTin',
                    loaiNhuCauId:idLoaiNhuCauValue,
                    loaiNhuCauText:idLoaiNhuCauText
                });
            } 
            //mua _ thue

        };

    } 
})();