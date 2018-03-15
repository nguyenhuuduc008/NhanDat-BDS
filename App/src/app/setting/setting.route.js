(function(){
    'use strict';
    angular.module('app.setting').config(config);
    /** @ngInject */
    function config($stateProvider){
        $stateProvider.state(
            'settingList',{
                parent: 'root',
                url: '/setting/capDo-list',
                templateUrl: 'app/setting/capDo/capDo-list.tpl.html',
                controller: 'capDoListCtr',
                controllerAs: 'capDoListVm',
                data: {
					pageTitle: 'Cài Đặt',
					module: 'setting',
					icon: 'icon-settings',
					permission: 'Setting'
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        ).state('capDo-list',{
            parent: 'root',
                url: '/setting/capDo-list',
                templateUrl: 'app/setting/capDo/capDo-list.tpl.html',
                controller: 'capDoListCtr',
                controllerAs: 'capDoListVm',
                data: {
					pageTitle: 'Quản lý Cấp Độ',
					module: 'setting',
					icon: 'icon-settings',
                    parent: 'settingList'

				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
         ).state('capDo-add',{
            parent: 'root',
            url: '/setting/capDo-add',
            templateUrl: 'app/setting/capDo/capDo-add.tpl.html',
            controller: 'capDoAddCtr',
            controllerAs: 'capDoAddVm',
            data: {
                pageTitle: 'Thêm Loại Cấp Độ',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         })
         .state('capDo-edit',{
            parent: 'root',
            url: '/setting/capDo-edit/:id',
            templateUrl: 'app/setting/capDo/capDo-edit.tpl.html',
            controller: 'capDoEditCtr',
            controllerAs: 'capDoEditVm',
            data: {
                pageTitle: 'Sửa Loại Cấp Độ',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         })
         .state('quyHoach-list',{
            parent: 'root',
            url: '/setting/quyHoach-list',
            templateUrl: 'app/setting/quyHoach/quyHoach-list.tpl.html',
            controller: 'quyHoachListCtr',
            controllerAs: 'quyHoachListVm',
            data: {
                pageTitle: 'Quản Lý Quy Hoạch',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('quyHoach-add',{
            parent: 'root',
            url: '/setting/quyHoach-add',
            templateUrl: 'app/setting/quyHoach/quyHoach-add.tpl.html',
            controller: 'quyHoachAddCtr',
            controllerAs: 'quyHoachAddVm',
            data: {
                pageTitle: 'Thêm Loại Quy Hoạch',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('quyHoach-edit',{
            parent: 'root',
            url: '/setting/quyHoach-edit/:id',
            templateUrl: 'app/setting/quyHoach/quyHoach-edit.tpl.html',
            controller: 'quyHoachEditCtr',
            controllerAs: 'quyHoachEditVm',
            data: {
                pageTitle: 'Sửa Loại Quy Hoạch',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('loaiTacNghiep-list',{
            parent: 'root',
            url: '/setting/loaiTacNghiep-list',
            templateUrl: 'app/setting/loaiTacNghiep/loaiTacNghiep-list.tpl.html',
            controller: 'loaiTacNghiepListCtr',
            controllerAs: 'loaiTacNghiepListVm',
            data: {
                pageTitle: 'Quản Lý Loại Tác Nghiệp',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('loaiTacNghiep-add',{
            parent: 'root',
            url: '/setting/loaiTacNghiep-mod',
            templateUrl: 'app/setting/loaiTacNghiep/loaiTacNghiep-mod.tpl.html',
            controller: 'loaiTacNghiepModCtr',
            controllerAs: 'loaiTacNghiepModVm',
            data: {
                pageTitle: 'Thêm Loại Tác Nghiệp',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('loaiTacNghiep-edit',{
            parent: 'root',
            url: '/setting/loaiTacNghiep-mod/:idLoai',
            templateUrl: 'app/setting/loaiTacNghiep/loaiTacNghiep-mod.tpl.html',
            controller: 'loaiTacNghiepModCtr',
            controllerAs: 'loaiTacNghiepModVm',
            data: {
                pageTitle: 'Sửa Loại Tác Nghiệp',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
        }).state('tacNghiep-list',{
            parent: 'root',
            url: '/setting/tacNghiep-list',
            templateUrl: 'app/setting/tacNghiep/tacNghiep-list.tpl.html',
            controller: 'tacNghiepListCtr',
            controllerAs: 'tacNghiepListVm',
            data: {
                pageTitle: 'Quản Lý Tác Nghiệp',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                //  ,
                //  deps: ['$ocLazyLoad', function($ocLazyLoad){
				// 	return $ocLazyLoad.load({
				// 		cache: true,
				// 		files: [
				// 			'./app/bds/tacNghiep.service.js'
				// 		]
				// 	});
				// }]
            }
         }).state('tacNghiep-edit',{
            parent: 'root',
            url: '/setting/tacNghiep-mod/:id',
            templateUrl: 'app/setting/tacNghiep/tacNghiep-mod.tpl.html',
            controller: 'tacNghiepModCtr',
            controllerAs: 'tacNghiepModVm',
            data: {
                pageTitle: 'Sửa Tác Nghiệp',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            params: {
                id: null,
                bdsId: null,
                text: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('hanhChinh-list',{
            parent: 'root',
            url: '/setting/hanhChinh-list',
            templateUrl: 'app/setting/hanhChinh/hanhChinh-list.tpl.html',
            controller: 'hanhChinhListCtr',
            controllerAs: 'hanhChinhListVm',
            data: {
                pageTitle: 'Quản Lý Hành Chính',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                }]
                // ,
                // deps: ['$ocLazyLoad', function($ocLazyLoad){
				// 	return $ocLazyLoad.load({
				// 		cache: true,
				// 		files: [
				// 			'./app/common/utils/mark-removal.service.js'
				// 		]
				// 	});
				// }]
            }
         }).state('viTri-list',{
            parent: 'root',
            url: '/setting/viTri-list',
            templateUrl: 'app/setting/viTri/viTri-list.tpl.html',
            controller: 'viTriListCtr',
            controllerAs: 'viTriListVm',
            data: {
                pageTitle: 'Quản Lý Loại Vị Trí',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('viTri-add',{
            parent: 'root',
            url: '/setting/viTri-mod',
            templateUrl: 'app/setting/viTri/viTri-mod.tpl.html',
            controller: 'viTriModCtr',
            controllerAs: 'viTriModVm',
            data: {
                pageTitle: 'Thêm Loại Vị Trí',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('viTri-edit',{
            parent: 'root',
            url: '/setting/viTri-mod/:idLoai',
            templateUrl: 'app/setting/viTri/viTri-mod.tpl.html',
            controller: 'viTriModCtr',
            controllerAs: 'viTriModVm',
            data: {
                pageTitle: 'Sửa Loại Vị Trí',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duAn-list',{
            parent: 'root',
            url: '/setting/duAn-list',
            templateUrl: 'app/setting/duAn/duAn-list.tpl.html',
            controller: 'duAnListCtr',
            controllerAs: 'duAnListVm',
            data: {
                pageTitle: 'Quản Lý Dự Án',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duAn-add',{
            parent: 'root',
            url: '/setting/duAn-mod',
            templateUrl: 'app/setting/duAn/duAn-mod.tpl.html',
            controller: 'duAnModCtr',
            controllerAs: 'duAnModVm',
            data: {
                pageTitle: 'Thêm Loại Dự Án',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duAn-edit',{
            parent: 'root',
            url: '/setting/duAn-mod/:idLoai',
            templateUrl: 'app/setting/duAn/duAn-mod.tpl.html',
            controller: 'duAnModCtr',
            controllerAs: 'duAnModVm',
            data: {
                pageTitle: 'Sửa Loại Dự Án',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('bDS-list',{
            parent: 'root',
            url: '/setting/bDS-list',
            templateUrl: 'app/setting/bDS/bDS-list.tpl.html',
            controller: 'bDSListCtr',
            controllerAs: 'bDSListVm',
            data: {
                pageTitle: 'Quản Lý Loại BĐS',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('bDS-add',{
            parent: 'root',
            url: '/setting/bDS-mod',
            templateUrl: 'app/setting/bDS/bDS-mod.tpl.html',
            controller: 'bDSModCtr',
            controllerAs: 'bDSModVm',
            data: {
                pageTitle: 'Thêm Loại Bất Động Sản',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('bDS-edit',{
            parent: 'root',
            url: '/setting/bDS-mod/:idLoai',
            templateUrl: 'app/setting/bDS/bDS-mod.tpl.html',
            controller: 'bDSModCtr',
            controllerAs: 'bDSModVm',
            data: {
                pageTitle: 'Chi Tiết Loại Bất Động Sản',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duong-list',{
            parent: 'root',
            url: '/setting/duong-list',
            templateUrl: 'app/setting/duong/duong-list.tpl.html',
            controller: 'duongListCtr',
            controllerAs: 'duongListVm',
            data: {
                pageTitle: 'Quản Lý Loại Đường',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duong-add',{
            parent: 'root',
            url: '/setting/duong-mod',
            templateUrl: 'app/setting/duong/duong-mod.tpl.html',
            controller: 'duongModCtr',
            controllerAs: 'duongModVm',
            data: {
                pageTitle: 'Thêm Loại Đường',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('duong-edit',{
            parent: 'root',
            url: '/setting/duong-mod/:idLoai',
            templateUrl: 'app/setting/duong/duong-mod.tpl.html',
            controller: 'duongModCtr',
            controllerAs: 'duongModVm',
            data: {
                pageTitle: 'Sửa Loại Đường',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('giamGia-list',{
            parent: 'root',
            url: '/setting/giamGia-list',
            templateUrl: 'app/setting/giamGia/giamGia-list.tpl.html',
            controller: 'giamGiaListCtr',
            controllerAs: 'giamGiaListVm',
            data: {
                pageTitle: 'Quản Lý Loại Giảm Giá',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('giamGia-add',{
            parent: 'root',
            url: '/setting/giamGia-mod',
            templateUrl: 'app/setting/giamGia/giamGia-mod.tpl.html',
            controller: 'giamGiaModCtr',
            controllerAs: 'giamGiaModVm',
            data: {
                pageTitle: 'Thêm Loại Giảm Giá',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('giamGia-edit',{
            parent: 'root',
            url: '/setting/giamGia-mod/:idLoai',
            templateUrl: 'app/setting/giamGia/giamGia-mod.tpl.html',
            controller: 'giamGiaModCtr',
            controllerAs: 'giamGiaModVm',
            data: {
                pageTitle: 'Sửa Loại Giảm Giá',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('hau-list',{
            parent: 'root',
            url: '/setting/hau-list',
            templateUrl: 'app/setting/hau/hau-list.tpl.html',
            controller: 'hauListCtr',
            controllerAs: 'hauListVm',
            data: {
                pageTitle: 'Quản Lý Loại Hậu',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('hau-add',{
            parent: 'root',
            url: '/setting/hau-mod',
            templateUrl: 'app/setting/hau/hau-mod.tpl.html',
            controller: 'hauModCtr',
            controllerAs: 'hauModVm',
            data: {
                pageTitle: 'Thêm Loại Hậu',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('hau-edit',{
            parent: 'root',
            url: '/setting/hau-mod/:idLoai',
            templateUrl: 'app/setting/hau/hau-mod.tpl.html',
            controller: 'hauModCtr',
            controllerAs: 'hauModVm',
            data: {
                pageTitle: 'Sửa Loại Hậu',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('huong-list',{
            parent: 'root',
            url: '/setting/huong-list',
            templateUrl: 'app/setting/huong/huong-list.tpl.html',
            controller: 'huongListCtr',
            controllerAs: 'huongListVm',
            data: {
                pageTitle: 'Quản Lý Loại Hướng',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('huong-add',{
            parent: 'root',
            url: '/setting/huong-mod',
            templateUrl: 'app/setting/huong/huong-mod.tpl.html',
            controller: 'huongModCtr',
            controllerAs: 'huongModVm',
            data: {
                pageTitle: 'Thêm Loại Hướng',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('huong-edit',{
            parent: 'root',
            url: '/setting/huong-mod/:idLoai',
            templateUrl: 'app/setting/huong/huong-mod.tpl.html',
            controller: 'huongModCtr',
            controllerAs: 'huongModVm',
            data: {
                pageTitle: 'Sửa Loại Hướng',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('lienKetUser-list',{
            parent: 'root',
            url: '/setting/lienKetUser-list',
            templateUrl: 'app/setting/lienKetUser/lienKetUser-list.tpl.html',
            controller: 'lienKetUserListCtr',
            controllerAs: 'lienKetUserListVm',
            data: {
                pageTitle: 'Quản Lý Loại Liên Kết User',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('lienKetUser-add',{
            parent: 'root',
            url: '/setting/lienKetUser-mod',
            templateUrl: 'app/setting/lienKetUser/lienKetUser-mod.tpl.html',
            controller: 'lienKetUserModCtr',
            controllerAs: 'lienKetUserModVm',
            data: {
                pageTitle: 'Thêm Loại Liên Kết User',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('lienKetUser-edit',{
            parent: 'root',
            url: '/setting/lienKetUser-mod/:idLoai',
            templateUrl: 'app/setting/lienKetUser/lienKetUser-mod.tpl.html',
            controller: 'lienKetUserModCtr',
            controllerAs: 'lienKetUserModVm',
            data: {
                pageTitle: 'Sửa Loại Liên Kết User',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nguonBDS-list',{
            parent: 'root',
            url: '/setting/nguonBDS-list',
            templateUrl: 'app/setting/nguonBDS/nguonBDS-list.tpl.html',
            controller: 'nguonBDSListCtr',
            controllerAs: 'nguonBDSListVm',
            data: {
                pageTitle: 'Quản Lý Loại Nguồn BDS',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nguonBDS-add',{
            parent: 'root',
            url: '/setting/nguonBDS-mod',
            templateUrl: 'app/setting/nguonBDS/nguonBDS-mod.tpl.html',
            controller: 'nguonBDSModCtr',
            controllerAs: 'nguonBDSModVm',
            data: {
                pageTitle: 'Thêm Loại Nguồn BDS',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nguonBDS-edit',{
            parent: 'root',
            url: '/setting/nguonBDS-mod/:idLoai',
            templateUrl: 'app/setting/nguonBDS/nguonBDS-mod.tpl.html',
            controller: 'nguonBDSModCtr',
            controllerAs: 'nguonBDSModVm',
            data: {
                pageTitle: 'Sửa Loại Nguồn BDS',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('mucDich-list',{
            parent: 'root',
            url: '/setting/mucDich-list',
            templateUrl: 'app/setting/mucDich/mucDich-list.tpl.html',
            controller: 'mucDichListCtr',
            controllerAs: 'mucDichListVm',
            data: {
                pageTitle: 'Quản Lý Loại Mục Đích',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('mucDich-add',{
            parent: 'root',
            url: '/setting/mucDich-mod',
            templateUrl: 'app/setting/mucDich/mucDich-mod.tpl.html',
            controller: 'mucDichModCtr',
            controllerAs: 'mucDichModVm',
            data: {
                pageTitle: 'Thêm Loại Mục Đích',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('mucDich-edit',{
            parent: 'root',
            url: '/setting/mucDich-mod/:idLoai',
            templateUrl: 'app/setting/mucDich/mucDich-mod.tpl.html',
            controller: 'mucDichModCtr',
            controllerAs: 'mucDichModVm',
            data: {
                pageTitle: 'Sửa Loại Mục Đích',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('user-list',{
            parent: 'root',
            url: '/setting/user-list',
            templateUrl: 'app/setting/user/user-list.tpl.html',
            controller: 'userListCtr',
            controllerAs: 'userListVm',
            data: {
                pageTitle: 'Quản Lý Loại User',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('user-add',{
            parent: 'root',
            url: '/setting/user-mod',
            templateUrl: 'app/setting/user/user-mod.tpl.html',
            controller: 'userModCtr',
            controllerAs: 'userModVm',
            data: {
                pageTitle: 'Thêm Loại User',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('user-edit',{
            parent: 'root',
            url: '/setting/user-mod/:idLoai',
            templateUrl: 'app/setting/user/user-mod.tpl.html',
            controller: 'userModCtr',
            controllerAs: 'userModVm',
            data: {
                pageTitle: 'Sửa Loại User',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('danhMucBDS-list',{
            parent: 'root',
            url: '/setting/danhMucBDS-list',
            templateUrl: 'app/setting/danhMucBDS/danhMucBDS-list.tpl.html',
            controller: 'danhMucBDSListCtr',
            controllerAs: 'danhMucBDSListVm',
            data: {
                pageTitle: 'Quản Lý Danh Mục BĐS',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('danhMucBDS-add',{
            parent: 'root',
            url: '/setting/danhMucBDS-mod',
            templateUrl: 'app/setting/danhMucBDS/danhMucBDS-mod.tpl.html',
            controller: 'danhMucBDSModCtr',
            controllerAs: 'danhMucBDSModVm',
            data: {
                pageTitle: 'Thêm Danh Mục BĐS',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('danhMucBDS-edit',{
            parent: 'root',
            url: '/setting/danhMucBDS-mod/:idLoai',
            templateUrl: 'app/setting/danhMucBDS/danhMucBDS-mod.tpl.html',
            controller: 'danhMucBDSModCtr',
            controllerAs: 'danhMucBDSModVm',
            data: {
                pageTitle: 'Sửa Danh Mục BĐS',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nhuCau-list',{
            parent: 'root',
            url: '/setting/nhuCau-list',
            templateUrl: 'app/setting/nhuCau/nhuCau-list.tpl.html',
            controller: 'nhuCauListCtr',
            controllerAs: 'nhuCauListVm',
            data: {
                pageTitle: 'Quản Lý Loại Nhu Cầu',
                module: 'setting',
                icon: 'icon-settings',
                parent: 'settingList'
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nhuCau-add',{
            parent: 'root',
            url: '/setting/nhuCau-mod',
            templateUrl: 'app/setting/nhuCau/nhuCau-mod.tpl.html',
            controller: 'nhuCauModCtr',
            controllerAs: 'nhuCauModVm',
            data: {
                pageTitle: 'Thêm Loại Nhu Cầu',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
            }
         }).state('nhuCau-edit',{
            parent: 'root',
            url: '/setting/nhuCau-mod/:idLoai',
            templateUrl: 'app/setting/nhuCau/nhuCau-mod.tpl.html',
            controller: 'nhuCauModCtr',
            controllerAs: 'nhuCauModVm',
            data: {
                pageTitle: 'Sửa Loại Nhu Cầu',
                module: 'setting',
                parent: 'settingList',
                hide:true
            },
            params: {
                item: null,
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