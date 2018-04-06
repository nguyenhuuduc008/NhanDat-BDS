(function(){
    'use strict';
    angular.module('app.nhuCau').config(config);
    /** @ngInject */
    function config($stateProvider){
        $stateProvider.state('nhuCauListing',{
                parent: 'root',
                url: '/nhuCau/nhuCau-listing',
                templateUrl: 'app/nhuCau/nhuCau-listing/nhuCau-listing.tpl.html',
                controller: 'nhuCauListingCtr',
                controllerAs: 'vm',
                data: {
					pageTitle: 'Quản Lý Nhu Cầu',
					module: 'nhuCau',
					icon: 'icon-settings',
					permission: 'NhuCau'
				},
                resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.requireSignIn();
				     }]
				}
            }
        ).state('chonNhuCauThemMoi',{
            parent: 'root',
            url: '/nhuCau/chonNhuCauThemMoi',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            data: {
                pageTitle: 'Lựa Chọn Nhu Cầu Sẽ Thêm Mới',
                module: 'nhuCau',
                parent: 'nhuCauListing',
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
        }).state('nhuCauEdit',{
            parent: 'root',
            url: '/nhuCau/nhuCauEdit',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            // controller: 'nhuCauThemMoiCtr',
            // controllerAs: 'nhuCauThemMoiVm',
            data: {
                pageTitle: 'Sửa Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
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
        }).state('thongTinNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauThongTin?khoId?loaiId?nhuCauId',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauThongTinCtr',
            controllerAs: 'nhuCauThongTinVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
            },
            resolve:{
                "currentAuth": ["authService", function (authService) {
                    return authService.requireSignIn();
                }],
                deps: ['$ocLazyLoad', function ($ocLazyLoad) {
                    return $ocLazyLoad.load({
                        cache: true,
                        files: [
                            './app/bds/bds.service.js'
                        ]
                    });
                }]
                 
            }
        }).state('tacNghiepNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauTacNghiep?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauTacNghiepCtr',
            controllerAs: 'nhuCauTacNghiepVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                loaiNhuCauKey: null,
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lienKetUsersNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauLienKetUsers?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauLienKetUsersCtr',
            controllerAs: 'nhuCauLienKetUsersVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }],
                 deps: ['$ocLazyLoad', function($ocLazyLoad){
					return $ocLazyLoad.load({
						cache: true,
						name: 'app.user',
						files: [
							'./app/user/user.service.js'
						]
					});
				}]
            }
        }).state('yeuToTangGiamGiaNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauYeuToTangGiamGia?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauYeuToTangGiamGiaCtr',
            controllerAs: 'nhuCauYeuToGiaVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('thuocQuyHoachNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauThuocQuyHoach?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauThuocQuyHoachCtr',
            controllerAs: 'nhuCauThuocQuyHoachVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lichSuChuyenQuyenNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauLichSuChuyenQuyen?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauLichSuChuyenQuyenCtr',
            controllerAs: 'nhuCauLichSuChuyenQuyenVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lichSuGiaoDichNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauLichSuGiaoDich?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauLichSuGiaoDichCtr',
            controllerAs: 'nhuCauLichSuGiaoDichVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('capDoNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauCapDo?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauCapDoCtr',
            controllerAs: 'nhuCauCapDoVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lichSuGiaNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCauLichSuGia?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCauLichSuGiaCtr',
            controllerAs: 'nhuCauLichSuGiaVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lienKetBDSNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCaulienKetBDS?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCaulienKetBDSCtr',
            controllerAs: 'nhuCaulienKetBDSVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        }).state('lienKetNhuCau',{
            parent: 'root',
            url: '/nhuCau/nhuCaulienKet?bdsKho&khoId?loaiNC&nhuCauId?bdsId&id',
            templateUrl: 'app/nhuCau/chonNhuCauThemMoi/nhuCauThemMoi.tpl.html',
            controller: 'nhuCaulienKetCtr',
            controllerAs: 'nhuCaulienKetVm',
            data: {
                pageTitle: 'Chi Tiết Nhu Cầu',
                module: 'nhuCau',
                parent: 'nhuCauListing',
                hide:true
            },
            params: {
                item: null,
                isEdit: null
            },
            resolve:{
                "currentAuth": ["authService", function(authService) {
                    return authService.requireSignIn();
                 }]
                 
            }
        });
         //----
    }
})();