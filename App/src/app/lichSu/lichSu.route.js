(function () {
    'use strict';
    angular
		.module('app.lichSu')
		.config(config)
		.run(appRun);
	/** @ngInject */
    function appRun() { }
	/** @ngInject */
    function config($stateProvider) {
        $stateProvider.state(
			'LichSu', {
				parent: 'root',
			    url: '/lichSu',
			    data: {
			        pageTitle: 'Lịch Sử',
					module: 'lichSu',
					icon: 'fa fa-bars',
					permission: 'LichSu'
			    },
			    resolve: {
			        "currentAuth": ["authService", function (authService) {
			            return authService.requireSignIn();
			        }]
			    }
			}
		).state(
			'lichSuBDS', {
				parent: 'root',
			    url: '/lichSu/bds',
			    templateUrl: 'app/lichSu/bds/bdsHistory.tpl.html',
			    controller: 'bdsHistoryCtr',
			    controllerAs: 'vm',
			    data: {
			        pageTitle: 'Lịch Sử BĐS',
					module: 'lichSu',
					icon: 'fa fa-bars',
					permission: 'LichSu',
					parent: 'LichSu'
			    },
			    resolve: {
			        "currentAuth": ["authService", function (authService) {
			            return authService.requireSignIn();
			        }]
			    }
			}
		).state(
			'userHistory', {
				parent: 'root',
			    url: '/lichSu/userHistory',
			    templateUrl: 'app/lichSu/user/userHistory.tpl.html',
			    controller: 'userHistoryCtr',
			    controllerAs: 'vm',
			    data: {
			        pageTitle: 'Quản Lý Lịch Sử User',
					module: 'lichSu',
					icon: 'fa fa-bars',
					permission: 'LichSu',
					parent: 'LichSu'
			    },
			    resolve: {
			        "currentAuth": ["authService", function (authService) {
			            return authService.requireSignIn();
			        }]
			    }
			}
		)
		;

    }
})();
