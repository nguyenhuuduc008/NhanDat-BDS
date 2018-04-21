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
				pageTitle: 'Thêm Mới Bất Động Sản',
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

		states['bds.thongTin'] = {
			url: '/detail/thongTin?khoId?bdsId',
			templateUrl: './app/bds/add_edit/edit-bds.tpl.html',
			controller: 'editBdsCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.detail',
						files: [
							'./app/bds/add_edit/edit-bds.js',
							'./app/nhuCau/nhuCau.service.js'		
						]
					});
				}]
			}
		};

		states['bds.tacNghiep'] = {
			url: '/detail/tac-nghiep?khoId?bdsId',
			templateUrl: './app/bds/add_edit/edit-tac-nghiep.tpl.html',
			controller: 'editTacNghiepCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.tacNghiep',
						files: [
							'./app/bds/add_edit/edit-tac-nghiep.js',
						]
					});
				}]
			}
		};
		
		states['bds.lienKetNhuCau'] = {
			url: '/detail/lienKetNhuCau?khoId?bdsId',
			templateUrl: './app/bds/add_edit/edit-lien-ket-nhu-cau.tpl.html',
			controller: 'editLienKetNhuCauCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.viTri',
						files: [
							'./app/bds/add_edit/edit-lien-ket-nhu-cau.js',
							'./app/nhuCau/nhuCau.service.js'
						]
					});
				}]
			}
		};
		
		states['bds.lienKetUsers'] = {
			url: '/detail/lienketusers?khoId?bdsId',
			templateUrl: './app/bds/add_edit/edit-lien-ket-users.tpl.html',
			controller: 'editLienKetUsersCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.lienKetUsers',
						files: [
							'./app/bds/add_edit/edit-lien-ket-users.js',
							'./app/bds/add_edit/_popup-lien-ket-users.js',
							'./app/nhuCau/nhuCau.service.js',
							'./app/user/user.service.js',
						]
					});
				}]
			}
		};

		states['bds.yeuToTangGiamGia'] = {
			url: '/detail/yeu-to-tang-giam-gia?khoId?bdsId',
			templateUrl: './app/bds/add_edit/edit-yeu-to-tang-giam-gia.tpl.html',
			controller: 'editYeuToTangGiamGiaCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.yeuToTangGiamGia',
						files: [
							'./app/bds/add_edit/edit-yeu-to-tang-giam-gia.js',
						]
					});
				}]
			}
		};

		states['bds.thuocQuyHoach'] = {
			url: '/detail/thuoc-quy-hoach?bdsId',
			templateUrl: './app/bds/add_edit/edit-thuoc-quy-hoach.tpl.html',
			controller: 'editthuocQuyHoachCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.thuocQuyHoach',
						files: [
							'./app/bds/add_edit/edit-thuoc-quy-hoach.js',
						]
					});
				}]
			}
		};

		states['bds.lichSuChuyenQuyen'] = {
			url: '/detail/lich-su-chuyen-quyen?bdsId&id',
			templateUrl: './app/bds/add_edit/edit-ls-chuyen-quyen.tpl.html',
			controller: 'editLSChuyenQuyenCtrl as vm',
			data: {
				pageTitle: 'Chi Tiết BĐS',
				module: 'bds',
				parent: 'bds',
				hide: true
			},
			resolve: {
				deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.bds.lichSuChuyenQuyen',
						files: [
							'./app/bds/add_edit/edit-ls-chuyen-quyen.js',
							'./app/bds/lichSuChuyenQuyen.service.js'
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
