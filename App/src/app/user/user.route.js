(function() {
	'use strict';

	angular
		.module('app.user')
		.config(config);
		// .run(cfgmenu);

	/** @ngInject */
	function config($stateProvider) {
		var states = {};

		states.user ={
			parent: 'root',
			url: '/user',
			templateUrl: './app/user/user-layout.tpl.html',
			resolve:{
				"currentAuth": ["authService", function(authService) {
					return authService.requireSignIn();
				}],
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.user',
						files: [
							'./lib/angular-bootstrap/ui-bootstrap-tpls.min.js',
							'./lib/angular-bootstrap/ui-bootstrap.min.js',
							'./app/user/user.service.js'
						]
					});
				}]
			}
		};

		states['user.editInfo'] = {
			url: '/editInfo?id',
			templateUrl: './app/user/user-info/edit-user-info.tpl.html',
			controller: 'editUserInfoCtrl as infoEditVm',
			data: {
				pageTitle: 'Thông Tin Người Dùng',
				module: 'user',
				parent: 'user',
				hide: true
			},
			resolve:{
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.userInfo',
						files: [
							'./app/user/user-info/edit-user-info.js',
							'./app/user/user.service.js'
						]
					});
				}]
			}
		};

		states['user.infoList'] = {
			url: '/listInfo',
			templateUrl: './app/user/user-info/user-info-list.tpl.html',
			controller: 'userInfoListCrtl as infoVm',
			data: {
				pageTitle: 'Người Dùng',
				module: 'user',
				icon: 'fa fa-user',
				permission: 'UserInfo'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.userInfo.list',
						files: [
							'./app/user/user-info/user-info-list.js',
						]
					});
				}]
			}
		};

		states['user.list'] = {
			url: '/list',
			templateUrl: './app/user/list/user-list.tpl.html',
			controller: 'userListCtrl as userVm',
			data: {
				pageTitle: 'Tài Khoản',
				module: 'user',
				icon: 'fa fa-users',
				permission: 'User'
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.user.list',
						files: [
							'./app/user/list/user-list.js'
						]
					});
				}]
			}
		};

		states['user.add'] = {
			url: '/add?linkedId?khoId?loaiId',
			templateUrl: './app/user/add_edit/add-user.tpl.html',
			controller: 'addUserCtrl as userAddVm',
			data: {
				pageTitle: 'Thêm người dùng',
				module: 'user',
				parent: 'user',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.user.add',
						files: [
							'./app/user/add_edit/add-user.js',
							'./app/bds/bds.service.js',
							'./app/nhuCau/nhuCau.service.js'
						]
					});
				}]
			}
		};

		states['user.addInfo'] = {
			url: '/addInfo?linkedId?khoId?loaiId',
			templateUrl: './app/user/user-info/add-user-info.tpl.html',
			controller: 'addUserInfoCtrl as infoAddVm',
			data: {
				pageTitle: 'Thêm thông tin người dùng',
				module: 'user',
				parent: 'user',
				hide: true
			},
			params: {
				phone: '',
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.userInfo.add',
						files: [
							'./app/user/user-info/add-user-info.js',
							'./app/bds/bds.service.js',
							'./app/nhuCau/nhuCau.service.js'
						]
					});
				}]
			}
		};

		states['user.details'] = {
			url: '/details?id',
			templateUrl: './app/user/add_edit/edit-user.tpl.html',
			controller: 'editUserCtrl as userDetailVm',
			data: {
				pageTitle: 'Thông tin người',
				module: 'user',
				parent: 'user',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.user.details',
						files: [
							'./app/user/add_edit/edit-user.js',
							'./app/user/user_role/add-user-role.js'				
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
