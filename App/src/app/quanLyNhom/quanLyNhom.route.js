(function () {
    'use strict';
    angular.module('app.quanLyNhom').config(config);
    /** @ngInject **/
    function config($stateProvider) {
        $stateProvider.state(
            'quanLyNhom', {
                parent: 'root',
                url: '/quanLyNhom',
                templateUrl: 'app/quanLyNhom/list/quanLyNhom-list.tpl.html',
                controller: 'quanLyNhomCtrl',
                controllerAs: 'quanLyNhomCtrlVm',
                data: {
                    pageTitle: 'Quản lý nhóm',
                    module: 'quanLyNhom',
                    icon: 'fa fa-search-minus',
                    permission: 'quanLyNhom'
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state(
            'quanLyNhom.detail', {
                parent: 'root',
                url: '/quanLyNhom/detail/:id',
                templateUrl: 'app/quanLyNhom/add_edit/add.tpl.html',
                controller: 'addCtr',
                controllerAs: 'addCtrVm',
                data: {
                    pageTitle: '',
                    module: 'quanLyNhom',
                    permission: 'quanLyNhom'
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }], deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load({
                            cache: true,
                            name: 'app.quanLyNhom',
                            files: [
                                './lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                                './lib/angular-bootstrap/ui-bootstrap.min.js',
                                './app/user/user.service.js'
                            ]
                        });
                    }]
    }
}
        );
}
})();