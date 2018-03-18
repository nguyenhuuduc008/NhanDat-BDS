(function(){
    'use strict';
    angular.module('app.baoCaoThongKe')
    .controller('bdsListCtr', bdsListCtr);
    	/** @ngInject */
    function bdsListCtr($rootScope, $scope, $state,$q,baoCaoThongKeListCtrService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
    } 
})();