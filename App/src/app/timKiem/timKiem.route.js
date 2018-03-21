(function(){
    'use strict';
    angular.module('app.timKiem').config(config);
     /** @ngInject **/
    function config($stateProvider){
        $stateProvider.state(
            'timKiem',{
                parent: 'root',
                url: '/bds',
                templateUrl: 'app/timKiem/bds/timKiem.tpl.html',
                controller: 'timKiemCtr',
                controllerAs: 'timKiemCtrVm',
                data: {
					pageTitle: 'Tìm kiếm BĐS',
					module: 'timKiem',
					icon: 'fa fa-search-minus',
					permission: 'timKiem'// sua sau
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        );

         //----
    }
})();