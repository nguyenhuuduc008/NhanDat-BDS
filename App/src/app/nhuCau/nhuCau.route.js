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
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('ban_choThueAdd',{
            parent: 'root',
            url: '/nhuCau/ban_choThueAdd?activeTab&loaiNhuCauId&loaiNhuCauText',
            templateUrl: 'app/nhuCau/ban_choThue-mod/ban_choThue-mod.tpl.html',
            controller: 'ban_choThueAddCtr',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Quản Lý Thông Tin',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
        }).state('ban_choThueEdit',{
            parent: 'root',
            url: '/nhuCau/ban_choThueEdit?id&bdsId&activeTab&loaiNhuCauId',
            templateUrl: 'app/nhuCau/ban_choThue-mod/ban_choThue-mod.tpl.html',
            controller: 'ban_choThueEditCtr',
            controllerAs: 'vm',
            data: {
                pageTitle: 'Quản Lý Thông Tin',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
        })
        /*
        .state('nhuCauthongTin',{
            parent: 'root',
            url: '/nhuCau/ban_choThue-modAdd?bdsId&activeTab',
            templateUrl: 'app/nhuCau/ban_choThue-mod/ban_choThue-mod.tpl.html',
            controller: 'ban_choThueModCtr',
            controllerAs: 'ban_choThueModVm',
            data: {
                pageTitle: 'Quản Lý Thông Tin',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
        })
         */
        ;
         //----
    }
})();