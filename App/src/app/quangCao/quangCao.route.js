(function() {
	'use strict';
 
	angular.module('app.quangCao').config(config);
		// .run(cfgmenu);


	/** @ngInject */
	function config($stateProvider) {
		 
		var states = {};

		states.quangCao ={
			parent: 'root',
			url: '/quangCao',
			templateUrl: './app/quangCao/quangCao-layout.tpl.html',
			resolve:{
				"currentAuth": ["authService", function(authService) {
					return authService.requireSignIn();
				}],
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.quangCao',
						files: [
							'./lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
							'./lib/angular-bootstrap/ui-bootstrap.min.js',
							'./app/quangCao/quangCao.service.js'
						]
					});
				}]
			}
		};

		states['quangCao.list'] = {
			url: '/list',
			templateUrl: './app/quangCao/list/quangCao-list.tpl.html',
			controller: 'quangCaoListCtrl as vm',
			data: {
				pageTitle: 'Quảng Cáo',
				module: 'quangCao',
				icon: 'icon-diamond',
				permission: 'QuangCao'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.quangCao.list',
						files: [
							'./app/quangCao/list/quangCao-list.js'
						]
					});
				}]
			}
		};

		 
		states['quangCao.details'] = {
			url: '/details?id',
			templateUrl: './app/quangCao/add_edit/add-quangCao.tpl.html',
			controller: 'addQuangCaoCtrl as qcVM',
			data: {
				pageTitle: 'Thông tin Quảng Cáo',
				module: 'quangCao',
				parent: 'quangCao',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.quangCao.details',
						files: [
							'./app/quangCao/add_edit/add-quangCao.js' 
							 		
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
