(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauThemMoiCtr', nhuCauThemMoiCtr);
    	/** @ngInject */
    function nhuCauThemMoiCtr($rootScope, $scope, $state, $stateParams, $q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;

        var nhuCauThemMoiVm =this;// jshint ignore:line
        //

        //Function
            function loadFormTitle() {
                switch (nhuCauThemMoiVm.loaiNhuCauKey) {
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
                    giamGia: {
                        title: 'Giảm Giá',
                        url: './app/nhuCau/nhuCau-form/giamGia-tab.tpl.html'
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


        nhuCauThemMoiVm.loadTab = function(tab) {
            nhuCauThemMoiVm.item.activeTab = tab;
            console.log('BDS ID ID', nhuCauThemMoiVm.item);
            $state.go(tab + 'NhuCau', {item: nhuCauThemMoiVm.item, bdsId: nhuCauThemMoiVm.item.bdsKey || ''});
        };

        nhuCauThemMoiVm.changeForm = function (key) {
            $rootScope.isSelectedLoaiNhuCau = true;
            nhuCauThemMoiVm.item.loaiNhuCauKey = key;
            console.log('ssdsadsad', nhuCauThemMoiVm.item.loaiNhuCauKey );
            switch (key) {
                case 'ban':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab);
                    loadFormTitle();
                    break;
                case 'mua':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab);
                    loadFormTitle();
                    break;
                case 'thue':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab);
                    loadFormTitle();
                    break;
                case 'cho-thue':
                    nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.activeTab);
                    loadFormTitle();
                    break;
            }
        };

        nhuCauThemMoiVm.cancel = function() {
            $state.go('nhuCauListing');
        };

        nhuCauThemMoiVm.item = {
            //loaiNhuCauKey: 'default',
            activeTab: 'thongTin'
        };

        $rootScope.isSelectedLoaiNhuCau = false;
        if($stateParams.item) {
            nhuCauThemMoiVm.item = $stateParams.item;
            nhuCauThemMoiVm.isEdit = nhuCauThemMoiVm.item.isEdit || false;
            $rootScope.isSelectedLoaiNhuCau = true;
        }
        if($stateParams.editItem) {
            nhuCauThemMoiVm.item = $stateParams.editItem;
            nhuCauThemMoiVm.item.activeTab = 'thongTin';
            nhuCauThemMoiVm.item.isEdit = true;
            nhuCauThemMoiVm.isEdit = true;
            nhuCauThemMoiVm.loadTab(nhuCauThemMoiVm.item.activeTab);
        }

        nhuCauThemMoiVm.isSelectedLoaiNhuCau = $rootScope.isSelectedLoaiNhuCau;
        nhuCauThemMoiVm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        nhuCauThemMoiVm.loaiNhuCauKey = nhuCauThemMoiVm.item.loaiNhuCauKey;
        nhuCauThemMoiVm.activeTab = nhuCauThemMoiVm.item.activeTab;

        function pageInit() {
            loadFormTitle();
            tabInit();
        }

        pageInit();
        

    } 
})();