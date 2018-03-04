(function(){
    'use strict';
    angular.module('app.nhuCau').config(config);
    function config($stateProvider){
        $stateProvider.state('nhuCauListing',{
                parent: 'root',
                url: '/nhuCau/nhuCau-listing',
                templateUrl: 'app/nhuCau/nhuCau-listing/nhuCau-listing.tpl.html',
                controller: 'nhuCauListingCtr',
                controllerAs: 'nhuCauListingVm',
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
        ).state('nhuCauthongTin',{
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
        });
         //----
    }
})();