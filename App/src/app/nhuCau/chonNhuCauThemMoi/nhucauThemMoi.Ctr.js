(function () {
    'use strict';
    angular.module('app.nhuCau')
        .controller('nhuCauThemMoiCtr', nhuCauThemMoiCtr);
    /** @ngInject */
    function nhuCauThemMoiCtr($rootScope, $scope, $state, $stateParams, $location, $q, nhuCauService, appUtils, $ngBootbox, toaster, settingService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;

        var nhuCauThemMoiVm = this;// jshint ignore:line

        console.log('NEW PARAM S', $stateParams);

        //Function
        function loadFormTitle() {
            switch ($stateParams.loaiId) {
                case 'ban':
                    nhuCauThemMoiVm.formTitle = nhuCauThemMoiVm.isEdit ? 'Sửa Nhu Cầu Bán Bất Động Sản' : 'Thêm Nhu Cầu Bán Bất Động Sản';
                    break;
                case 'mua':
                    nhuCauThemMoiVm.formTitle = nhuCauThemMoiVm.isEdit ? 'Sửa Nhu Cầu Mua Bất Động Sản' : 'Thêm Nhu Cầu Mua Bất Động Sản';
                    break;
                case 'thue':
                    nhuCauThemMoiVm.formTitle = nhuCauThemMoiVm.isEdit ? 'Sửa Nhu Cầu Thuê Bất Động Sản' : 'Thêm Nhu Cầu Thuê Bất Động Sản';
                    break;
                case 'cho-thue':
                    nhuCauThemMoiVm.formTitle = nhuCauThemMoiVm.isEdit ? 'Sửa Nhu Cầu Cho Thuê Bất Động Sản' : 'Thêm Nhu Cầu Cho Thuê Bất Động Sản';
                    break;
            }
        }

        function tabInit() {
            if ($stateParams.nhuCauId === undefined || $stateParams.nhuCauId === null) {
                nhuCauThemMoiVm.tab = {
                    tabs: {
                        thongTin: {
                            title: 'Thông Tin',
                            url: './app/nhuCau/nhuCau-form/thongTin-tab.tpl.html'
                        }
                    }
                };
            }
            else {
                nhuCauThemMoiVm.tab = {
                    tabs: {
                        thongTin: {
                            title: 'Thông Tin',
                            url: './app/nhuCau/nhuCau-form/thongTin-tab.tpl.html'
                        },
                        tacNghiep: {
                            title: 'Tác Nghiệp',
                            url: './app/nhuCau/nhuCau-form/tacNghiep-tab.tpl.html'
                        },
                        lienKetUsers: {
                            title: 'Liên Kết Users',
                            url: './app/nhuCau/nhuCau-form/lienKetUsers-tab.tpl.html'
                        },
                        lienKetBDS: {
                            title: 'Liên Kết BDS',
                            url: './app/nhuCau/nhuCau-form/lienKetBDS-tab.tpl.html'
                        },
                        lienKet: {
                            title: 'Liên Kết Nhu Cầu',
                            url: './app/nhuCau/nhuCau-form/lienKet-tab.tpl.html'
                        },
                        yeuToTangGiamGia: {
                            title: 'Yếu Tố Tăng Giảm Giá',
                            url: './app/nhuCau/nhuCau-form/yeuToTangGiamGia-tab.tpl.html'
                        },
                        thuocQuyHoach: {
                            title: 'Thuộc Quy Hoạch',
                            url: './app/nhuCau/nhuCau-form/thuocQuyHoach-tab.tpl.html'
                        },
                        lichSuChuyenQuyen: {
                            title: 'Lịch Sử Chuyển Quyền',
                            url: './app/nhuCau/nhuCau-form/lichSuChuyenQuyen-tab.tpl.html'
                        },
                        lichSuGiaoDich: {
                            title: 'Lịch Sử Giao Dịch',
                            url: './app/nhuCau/nhuCau-form/lichSuGiaoDich-tab.tpl.html'
                        },
                        capDo: {
                            title: 'Cấp Độ',
                            url: './app/nhuCau/nhuCau-form/capDo-tab.tpl.html'
                        },
                        lichSuGia: {
                            title: 'Lịch Sử Giá',
                            url: './app/nhuCau/nhuCau-form/lichSuGia-tab.tpl.html'
                        },
                    }
                };
            }
        }

        nhuCauThemMoiVm.historyBack = function () {
            $state.go('nhuCauListing', { khoId: $stateParams.khoId || '', loaiId: $stateParams.loaiId || '' });
        };

        nhuCauThemMoiVm.loadTab = function (tab, loaiId) {
            nhuCauThemMoiVm.item.activeTab = tab;
            $state.go(tab + 'NhuCau', { khoId: $stateParams.khoId || '', loaiId: loaiId || $stateParams.loaiId, nhuCauId: $stateParams.nhuCauId || '', item: nhuCauThemMoiVm.item });
        };

        nhuCauThemMoiVm.changeForm = function (key) {
            $rootScope.isSelectedLoaiNhuCau = true;
            nhuCauThemMoiVm.item.loaiNhuCauKey = key;
            switch (key) {
                case 'ban':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab, key);
                    loadFormTitle();
                    break;
                case 'mua':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab, key);
                    loadFormTitle();
                    break;
                case 'thue':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab, key);
                    loadFormTitle();
                    break;
                case 'cho-thue':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab, key);
                    loadFormTitle();
                    break;
            }
        };

        nhuCauThemMoiVm.cancel = function () {
            $state.go('nhuCauListing');
        };

        nhuCauThemMoiVm.item = {};

        // if($stateParams.item === null) {
        //     nhuCauThemMoiVm.isEdit = false;
        //     $rootScope.isSelectedLoaiNhuCau = false;
        //     nhuCauThemMoiVm.item.activeTab = 'thongTin';
        // } 
        // else {
        //     if(!!$stateParams.item.$id) {
        //         nhuCauThemMoiVm.item = $stateParams.item;
        //         nhuCauThemMoiVm.isEdit = true;
        //         if(nhuCauThemMoiVm.item.activeTab == undefined)
        //             nhuCauThemMoiVm.loadTab('thongTin');
        //         $rootScope.isSelectedLoaiNhuCau = true;
        //     }
        //     else {
        //         nhuCauThemMoiVm.item.activeTab = 'thongTin';
        //         $rootScope.isSelectedLoaiNhuCau = true;
        //     }
        // }

        if (!!$stateParams.nhuCauId && !!$stateParams.loaiId && !!$stateParams.khoId) {
            if ($stateParams.item != null)
                nhuCauThemMoiVm.item = $stateParams.item;
            nhuCauThemMoiVm.isEdit = true;
            if (nhuCauThemMoiVm.item.activeTab == undefined)
                nhuCauThemMoiVm.loadTab('thongTin');
            $rootScope.isSelectedLoaiNhuCau = true;
        }
        else {
            if (!!$stateParams.loaiId) {
                nhuCauThemMoiVm.item.activeTab = 'thongTin';
                $rootScope.isSelectedLoaiNhuCau = true;
            }
            else {
                nhuCauThemMoiVm.isEdit = false;
                $rootScope.isSelectedLoaiNhuCau = false;
                nhuCauThemMoiVm.item.activeTab = 'thongTin';
            }
        }

        nhuCauThemMoiVm.loaiNhuCauKey = $stateParams.loaiId;
        nhuCauThemMoiVm.activeTab = nhuCauThemMoiVm.item.activeTab;
        nhuCauThemMoiVm.isSelectedLoaiNhuCau = $rootScope.isSelectedLoaiNhuCau;
        nhuCauThemMoiVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;

        function pageInit() {
            loadFormTitle();
            tabInit();
        }

        pageInit();


    }
})();