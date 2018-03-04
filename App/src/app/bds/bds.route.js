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
			url: '/detail/thongTin?bdsId',
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
							'./app/bds/add_edit/edit-bds.js'		
						]
					});
				}]
			}
		};

		states['bds.tacNghiep'] = {
			url: '/detail/tac-nghiep?bdsId&id',
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
							'./app/bds/tacNghiep.service.js'
						]
					});
				}]
			}
		};
		
		states['bds.viTri'] = {
			url: '/detail/vitri?bdsId',
			templateUrl: './app/bds/add_edit/edit-vi-tri.tpl.html',
			controller: 'editViTriCtrl as vm',
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
							'./app/bds/add_edit/edit-vi-tri.js',
							'./app/bds/viTri.service.js'
						]
					});
				}]
			}
		};
		
		states['bds.lienKetUsers'] = {
			url: '/detail/lienketusers?bdsId',
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
							'./app/bds/lientKetUsers.service.js',
							'./app/user/user.service.js',
						]
					});
				}]
			}
		};

		states['bds.giamGia'] = {
			url: '/detail/giam-gia?bdsId',
			templateUrl: './app/bds/add_edit/edit-giam-gia.tpl.html',
			controller: 'editGiamGiaCtrl as vm',
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
						name: 'app.bds.giaGia',
						files: [
							'./app/bds/add_edit/edit-giam-gia.js',
						]
					});
				}]
			}
		};
		
		states['bds.yeuToTangGiamGia'] = {
			url: '/detail/yeu-to-tang-giam-gia?bdsId',
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

		states['bds.lichSuGiaoDich'] = {
			url: '/detail/lich-su-giao-dich?bdsId&id',
			templateUrl: './app/bds/add_edit/edit-ls-giao-dich.tpl.html',
			controller: 'editLSGiaoDichCtrl as vm',
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
						name: 'app.bds.lichSuGiaoDich',
						files: [
							'./app/bds/add_edit/edit-ls-giao-dich.js',
							'./app/bds/lichSuGiaoDich.service.js'
						]
					});
				}]
			}
		};
		
		states['bds.capDo'] = {
			url: '/detail/cap-do?bdsId',
			templateUrl: './app/bds/add_edit/edit-ls-giao-dich.tpl.html',
			controller: 'editCapDoCtrl as vm',
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
						name: 'app.bds.capDo',
						files: [
							'./app/bds/add_edit/edit-cap-do.js',
						]
					});
				}]
			}
		};

		states['bds.lichSuGia'] = {
			url: '/detail/lich-su-gia?bdsId&id',
			templateUrl: './app/bds/add_edit/edit-ls-gia.tpl.html',
			controller: 'editLSGiaCtrl as vm',
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
						name: 'app.bds.lichSuGia',
						files: [
							'./app/bds/add_edit/edit-ls-gia.js',
							'./app/bds/lichSuGia.service.js',
							'./app/user/user.service.js'
						]
					});
				}]
			}
		};

		states['bds.media'] = {
			url: '/detail/media?bdsId&id',
			templateUrl: './app/bds/add_edit/edit-media.tpl.html',
			controller: 'MediaCtrl as vm',
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
						name: 'app.bds.media',
						files: [
							'./app/bds/add_edit/edit-media.js',
							'./app/bds/media.service.js'
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
