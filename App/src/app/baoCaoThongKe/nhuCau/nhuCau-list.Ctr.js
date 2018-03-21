(function () {
    'use strict';
    angular.module('app.baoCaoThongKe')
    .controller('nhuCauListCtr', nhuCauListCtr);
    /** @ngInject */
    function nhuCauListCtr($rootScope, $scope, $state, $q, appUtils, $ngBootbox, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
    }
})();