(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauListingCtr', nhuCauListingCtr);
    	/** @ngInject */
    function nhuCauListingCtr($rootScope, $scope, $state,$q,nhuCauService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var nhuCauListingVm =this;// jshint ignore:line
        //
        nhuCauListingVm.selectAllItem = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        nhuCauListingVm.addNew=function(){
            $state.go("nhuCauthongTin",{
                activeTab:'thongTin',
                bdsId:null
            });
        };
    } 
})();