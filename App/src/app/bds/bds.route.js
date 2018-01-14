(function() {
	'use strict';

	angular
		.module('app.bds')
		.config(config);
		// .run(cfgmenu);

	/** @ngInject */
	function config($stateProvider) {
		var states = {};

		states.bds ={
			parent: 'root',
			url: '/bds',
			templateUrl: './app/bds/bds-layout.tpl.html',
			resolve:{
				"currentAuth": ["authService", function(authService) {
					return authService.requireSignIn();
				}],
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds',
						files: [
							'./lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
							'./lib/angular-bootstrap/ui-bootstrap.min.js',
							'./app/bds/bds.service.js'
						]
					});
				}]
			}
		};

		states['bds.list'] = {
			url: '/list',
			templateUrl: './app/bds/list/bds-list.tpl.html',
			controller: 'bdsListCtrl as vm',
			data: {
				pageTitle: 'Bất Động Sản',
				module: 'transactionHistory',
				icon: 'fa fa-clipboard',
				permission: 'Bất Động Sản'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.list',
						files: [
							'./app/bds/list/bds-list.js'
						]
					});
				}]
			}
		};

		states['bds.add'] = {
			url: '/add',
			templateUrl: './app/bds/add_edit/add-bds.tpl.html',
			controller: 'addBdsCtrl as vm',
			data: {
				pageTitle: 'Add New BDS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.add',
						files: [
							'./app/bds/add_edit/add-bds.js'					
						]
					});
				}]
			}
		};

		for(var state in states){
			$stateProvider.state(state, states[state]);
		}
	}
})();
