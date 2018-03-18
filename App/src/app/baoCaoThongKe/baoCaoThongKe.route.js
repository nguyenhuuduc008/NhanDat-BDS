(function(){
    'use strict';
    angular.module('app.baoCaoThongKe').config(config);
     /** @ngInject **/
    function config($stateProvider){
        $stateProvider.state(
            'baoCaoThongKe',{
                parent: 'root',
                url: '/baoCaoThongKe',
                templateUrl: 'app/baoCaoThongKe/bds/bds-list.tpl.html',
                controller: 'bdsListCtr',
                controllerAs: 'bdsListCtrVm',
                data: {
					pageTitle: 'Báo cáo & thống kê',
					module: 'baoCaoThongKe',
					icon: 'fal fa-chart-bar',
					permission: 'Quy Trình Pháp Lý'// sua sau
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        )
         ;

         //----
    }
})();