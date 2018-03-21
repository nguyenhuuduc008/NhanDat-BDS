(function(){
    'use strict';
    angular.module('app.nhuCau').config(config);
    /** @ngInject */
    function config($stateProvider){
        $stateProvider.state('nhuCauListing',{
                parent: 'root',
                url: '/nhuCau/nhuCau-listing',
                templateUrl: 'app/nhuCau/nhuCau-listing/nhuCau-listing.tpl.html',
                controller: 'nhuCauListingCtr',
                controllerAs: 'vm',
                data: {
					pageTitle: 'Quản Lý Nhu Cầu',
					module: 'nhuCau',
					icon: 'icon-settings',
					permission: 'NhuCau'
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        ).state('chonNhuCauThemMoi',{
            parent: 'root',
            url: '/nhuCau/chonNhuCauThemMoi',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauThemMoiCtr',
            controllerAs: 'nhuCauThemMoiVm',
            data: {
                pageTitle: 'Lựa Chọn Nhu Sẽ Thêm Mới',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('nhuCauEdit',{
            parent: 'root',
            url: '/nhuCau/nhuCauEdit',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauThemMoiCtr',
            controllerAs: 'nhuCauThemMoiVm',
            data: {
                pageTitle: 'Sửa Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        });
         //----
    }
})();