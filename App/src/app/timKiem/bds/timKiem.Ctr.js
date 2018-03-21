(function () {
    'use strict';
    angular.module('app.timKiem')
    .controller('timKiemCtr', bdsListCtr);
    /** @ngInject */
    function bdsListCtr($rootScope, $scope, $state, $q, appUtils, $ngBootbox, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
    }

    
})();