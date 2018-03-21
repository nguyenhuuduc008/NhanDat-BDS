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
					icon: 'fa fa-bar-chart',
					permission: 'Quy Trình Pháp Lý'// sua sau
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        ).state(
           '/baoCaoThongKe/bds', {
               parent: 'root',
               url: '/baoCaoThongKe/bds',
               templateUrl: 'app/baoCaoThongKe/bds/bds-list.tpl.html',
               controller: 'bdsListCtr',
               controllerAs: 'bdsListCtrVm',
               data: {
                   pageTitle: 'Trang báo cáo BĐS',
                   module: 'baoCaoThongKe',
                   permission: 'Quy Trình Pháp Lý',// sua sau
                   parent: 'baoCaoThongKe',
               },
               resolve: {
                   "currentAuth": ["authService", function (authService) {
                       return authService.requireSignIn();
                   }]
               }
           }
        ).state(
            '/baoCaoThongKe/user', {
                parent: 'root',
                url: '/baoCaoThongKe/user',
                templateUrl: 'app/baoCaoThongKe/users/user-list.tpl.html',
                controller: 'userListCtr',
                controllerAs: 'userListCtrVm',
                data: {
                    pageTitle: 'Trang Báo Cáo User',
                    module: 'baoCaoThongKe',
                    permission: 'Quy Trình Pháp Lý',// sua sau
                    parent: 'baoCaoThongKe',
                },
                resolve:{
                    "currentAuth": ["authService", function(authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state(
            '/baoCaoThongKe/nhuCau', {
                parent: 'root',
                url: '/baoCaoThongKe/nhuCau',
                templateUrl: 'app/baoCaoThongKe/nhuCau/nhuCau-list.tpl.html',
                controller: 'nhuCauListCtr',
                controllerAs: 'nhuCauListCtrVm',
                data: {
                    pageTitle: 'Trang Báo Cáo Nhu Cầu',
                    module: 'baoCaoThongKe',
                    permission: 'Quy Trình Pháp Lý',// sua sau
                    parent: 'baoCaoThongKe',
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state(
            '/baoCaoThongKe/tacNghiep', {
                parent: 'root',
                url: '/baoCaoThongKe/tacNghiep',
                templateUrl: 'app/baoCaoThongKe/tacNghiep/tacNghiep-list.tpl.html',
                controller: 'tacNghiepListCtr',
                controllerAs: 'tacNghiepListCtrVm',
                data: {
                    pageTitle: 'Trang Báo Cáo Tác Nghiệp',
                    module: 'baoCaoThongKe',
                    permission: 'Quy Trình Pháp Lý',// sua sau
                    parent: 'baoCaoThongKe',
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state(
            '/baoCaoThongKe/raoVat', {
                parent: 'root',
                url: '/baoCaoThongKe/raoVat',
                templateUrl: 'app/baoCaoThongKe/raoVat/raoVat-list.tpl.html',
                controller: 'raoVatListCtr',
                controllerAs: 'raoVatListCtrVm',
                data: {
                    pageTitle: 'Trang Báo Cáo Rao Vặt',
                    module: 'baoCaoThongKe',
                    permission: 'Quy Trình Pháp Lý',// sua sau
                    parent: 'baoCaoThongKe',
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state(
            '/baoCaoThongKe/heThong', {
                parent: 'root',
                url: '/baoCaoThongKe/heThong',
                templateUrl: 'app/baoCaoThongKe/heThong/heThong-list.tpl.html',
                controller: 'heThongListCtr',
                controllerAs: 'heThongListCtrVm',
                data: {
                    pageTitle: 'Trang Báo Cáo Hệ Thống',
                    module: 'baoCaoThongKe',
                    permission: 'Quy Trình Pháp Lý',// sua sau
                    parent: 'baoCaoThongKe',
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        )
         ;

         //----
    }
})();