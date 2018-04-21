(function () {
    'use strict';
    angular.module('app.raoVat').config(config);
    /** @ngInject **/
    function config($stateProvider) {
        $stateProvider.state(
            'raoVat', {
                parent: 'root',
                url: '/raoVat',
                templateUrl: 'app/raoVat/list/raoVat-list.tpl.html',
                controller: 'raoVatCtrl',
                controllerAs: 'raoVatCtrlVm',
                data: {
                    pageTitle: 'Tin rao vặt',
                    module: 'raoVat',
                    icon: 'fa fa-rss-square',
                    permission: 'raoVat'
                },
                resolve: {
                    "currentAuth": ["authService", function (authService) {
                        return authService.requireSignIn();
                    }]
                }
            }
        ).state('raoVat.chiTiet', {
            parent: 'root',
            url: '/raoVat/chiTiet/:id',
            templateUrl: 'app/raoVat/add_edit/add.tpl.html',
            controller: 'addCtr',
            controllerAs: 'addCtrVm',
            data: {
                pageTitle: '',
                module: 'raoVat',
                permission: 'raoVat'
            },
            resolve: {
                "currentAuth": ["authService", function (authService) {
                    return authService.requireSignIn();
                }], deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        cache: true,
                        name: 'app.raoVat',
                        files: [
                            './lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
                            './lib/angular-bootstrap/ui-bootstrap.min.js',
                            './app/user/user.service.js',
                            './app/raoVat/raoVat.service.js'
                        ]
                    });
                }]
            }
        });
    }
})();