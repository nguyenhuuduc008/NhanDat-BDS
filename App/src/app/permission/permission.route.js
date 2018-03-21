(function(){
	'use strict';
	angular
		.module('app.permission')
		.config(config)
		.run(appRun);
	/** @ngInject */
	function appRun(){}
	/** @ngInject */
	function config($stateProvider){
		$stateProvider.state(
			'permissionList', {
				parent: 'root',
				url: '/permissions',
				templateUrl: 'app/permission/list/permission-list.tpl.html',
				controller: 'PermissionListCtrl',
				controllerAs: 'permissionVm',
				data: {
					pageTitle: 'Phân quyền',
					module: 'permission',
					icon: 'icon-settings',
					permission: 'Permissions'
				},
				resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
			}
		).state(
			'allPermissions', {
				parent: 'root',
				url: '/all/permissions',
				templateUrl: 'app/permission/list/permission-list.tpl.html',
				controller: 'PermissionListCtrl',
				controllerAs: 'permissionVm',
				data: {
					pageTitle: 'Tất cả quyền',
					module: 'permission',
					parent: 'permissionList'
				},
				resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
			}
		).state(
			'addPermission', {
				parent: 'root',
				url: '/permission/add',
				templateUrl: 'app/permission/add_edit/add.tpl.html',
				controller: 'PermissionAddCtrl',
				controllerAs: 'permissionVm',
				data: {
					pageTitle: 'Thêm quyền',
					module: 'permission',
					parent: 'permissionList'
				},
				resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
			}
		).state(
			'editPermission', {
				parent: 'root',
				url: '/permission/edit/:id',
				templateUrl: 'app/permission/add_edit/edit.tpl.html',
				controller: 'PermissionEditCtrl',
				controllerAs: 'permissionVm',
				data: {
					pageTitle: 'Chỉnh sửa quyền',
					module: 'permission',
					hide: true,
					parent: 'permissionList'
				},
				resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
			}
		);

	}
})();
