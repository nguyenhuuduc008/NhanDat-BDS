(function(){
    'use strict';
    angular.module('app.quytrinhphaply').config(config);
    function config($stateProvider){
        $stateProvider.state(
            'quyTrinhPhapLy',{
                parent: 'root',
                url: '/quyTrinhPhapLy/quyTrinhPhapLy-list',
                templateUrl: 'app/quyTrinhPhapLy/quyTrinhPhapLy-list.tpl.html',
                controller: 'quyTrinhPhapLyListCtr',
                controllerAs: 'quyTrinhPhapLyListVm',
                data: {
					pageTitle: 'Quy Trình Pháp Lý',
					module: 'quytrinhphaply',
					icon: 'fa fa-file-word-o',
					permission: 'Quy Trình Pháp Lý'
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        ).state('quyTrinhPhapLy-list',{
            parent: 'root',
                url: '/quyTrinhPhapLy/quyTrinhPhapLy-list',
                templateUrl: 'app/quyTrinhPhapLy/quyTrinhPhapLy-list.tpl.html',
                controller: 'quyTrinhPhapLyListCtr',
                controllerAs: 'quyTrinhPhapLyListVm',
                data: {
					pageTitle: 'Quy Trình Pháp Lý',
					module: 'quytrinhphaply',
                    parent: 'quyTrinhPhapLy',
                    hide: true
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
         ).state('quyTrinhPhapLy-add',{
            parent: 'root',
            url: '/quyTrinhPhapLy/quyTrinhPhapLy-add',
            templateUrl: 'app/quyTrinhPhapLy/quyTrinhPhapLy-add.tpl.html',
            controller: 'quyTrinhPhapLyAddCtr',
            controllerAs: 'quyTrinhPhapLyAddVm',
            data: {
                pageTitle: 'Thêm Quy Trình Pháp Lý',
                module: 'quytrinhphaply',
                parent: 'quyTrinhPhapLy',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         })
         .state('quyTrinhPhapLy-edit',{
            parent: 'root',
            url: '/quyTrinhPhapLy/quyTrinhPhapLy-edit/:id',
            templateUrl: 'app/quyTrinhPhapLy/quyTrinhPhapLy-edit.tpl.html',
            controller: 'quyTrinhPhapLyEditCtr',
            controllerAs: 'quyTrinhPhapLyEditVm',
            data: {
                pageTitle: 'Sửa Quy Trình Pháp Lý',
                module: 'quytrinhphaply',
                parent: 'quyTrinhPhapLy',
                hide: true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         })
         ;

         //----
    }
})();