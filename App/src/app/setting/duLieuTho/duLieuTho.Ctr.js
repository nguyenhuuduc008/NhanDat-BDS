(function () {
    'use strict';
    angular.module('app.setting')
        .controller('duLieuThoCtr', duLieuThoCtr);
    /** @ngInject */
    function duLieuThoCtr($rootScope, $scope, $state, $stateParams, $q, settingService, appUtils, $ngBootbox, toaster, nhuCauService, bdsService) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;
        var currentUser = $rootScope.storage.currentUser;
        var duLieuThoVm = this; // jshint ignore:line

        var khoMacDinhKey = '';
        var duLieuTho = {};
        var danhMucHanhChinh = {};
        var nhuCauBan = {};
        var nhuCauChoThue = {};

        console.log("$rootScope.storage.roles", $rootScope.storage.roles);
        console.log("$rootScope.storage.permissions", $rootScope.storage.permissions);
        console.log("currentUser", currentUser);
        //-----default function-----
        function getDuLieuTho() {
            settingService.getDuLieuTho().then(function (rs) {
                //if (rs) duLieuTho = rs.val();
                if (rs) duLieuTho = rs;
                console.log('duLieuTho', duLieuTho);
            });
        }

        function getAllHanhChinh() {
            settingService.getAllHanhChinh().then(function (rs) {
                if (rs) danhMucHanhChinh = rs.val();
                console.log('danhMucHanhChinh', danhMucHanhChinh);
                appUtils.hideLoading();
            });
        }

        function getAllNhuCau() {
            //Get Kho Mặc Định
            khoMacDinhKey = 'Kho-So-Cap';

            // Nhu Cầu Bán
            settingService.getAllNhuCauTheoLoai(khoMacDinhKey + '/ban').then(function (rs) {
                if (rs) nhuCauBan = rs.val();
                console.log('nhuCauBan', nhuCauBan);
            });

            // Nhu Cầu Cho Thuê
            settingService.getAllNhuCauTheoLoai(khoMacDinhKey + '/cho-thue').then(function (rs) {
                if (rs) nhuCauChoThue = rs.val();
                console.log('nhuCauChoThue', nhuCauChoThue);
            });
        }


        function init() {
            appUtils.showLoading();
            getDuLieuTho();
            getAllHanhChinh();
            getAllNhuCau();
        }
        init();

        //-----function-----

        function xuLyDuLieu_NhaBan() {
            _.each(duLieuTho.NhaBan, function (bds, key) {
                xuLyDuLieu_AddBDS(key, bds, 'ban', 'NhaBan');
            });
        }

        function xuLyDuLieu_NhaThue() {
            _.each(duLieuTho.NhaThue, function (bds, key) {
                xuLyDuLieu_AddBDS(key, bds, 'cho-thue', 'NhaThue');
            });
        }

        function getThanhPhoKeyByText(thanhPhoText) { // Tỉnh Thành
            var thanhPhoKey = '';
            _.forEach(danhMucHanhChinh.capTinh, function (tp, key) {
                if (tp.text == thanhPhoText) {
                    thanhPhoKey = key;
                }
            });
            console.log('thanhPhoKey', thanhPhoKey);
            return thanhPhoKey;
        }

        function getQuanHuyenKeyByText(thanhPhoKey, quanHuyenText) { //Quận Huyện
            var quanHuyenKey = '';
            _.forEach(danhMucHanhChinh.capHuyen[thanhPhoKey], function (item, key) {
                if (item.text == quanHuyenText) {
                    quanHuyenKey = key;
                }
            });
            console.log('quanHuyenKey', quanHuyenKey);
            return quanHuyenKey;
        }

        function getDuongKeyByText(thanhPhoKey, duongPhoText) { //Đường Phố
            var duongPhoKey = '';
            _.forEach(danhMucHanhChinh.duong[thanhPhoKey], function (item, key) {
                if (item.text == duongPhoText) {
                    duongPhoKey = key;
                }
            });
            console.log('duongPhoKey', duongPhoKey);
            console.log('duongPhoText', duongPhoText);
            return duongPhoKey;
        }

        function xuLyNhuCauCauTrung(duLieuTho_Bds, loaiNhuCauKey) { //Xử Lý Nhu Cầu Trùng - Đã tồn tại trong Kho Sơ Cấp
            if (loaiNhuCauKey == 'ban') {
                _.forEach(nhuCauBan, function (item, key) {
                    if (item.tieuDe == duLieuTho_Bds.tieude) {
                        console.log("removeNhuCau", duLieuTho_Bds);
                        //Xoa Nhu Cầu Cũ trong Kho
                        var ref = khoMacDinhKey + '/ban/' + key;
                        settingService.removeNhuCau(ref);
                    }
                });
            } else {
                _.forEach(nhuCauChoThue, function (item, key) {
                    if (item.tieuDe == duLieuTho_Bds.tieude) {
                        console.log("removeNhuCau", duLieuTho_Bds);
                        //Xoa Nhu Cầu Cũ trong Kho
                        var ref = khoMacDinhKey + '/cho-thue/' + key;
                        settingService.removeNhuCau(ref);
                    }
                });
            }
        }

        function xuLyDuLieu_AddBDS(key, duLieuTho_Bds, loaiNhuCauKey, dltLoai) {
            console.log('duLieuTho_Bds', duLieuTho_Bds);

            var khoBDSKey = 'Kho-So-Cap';
            var thanhPhoKey = getThanhPhoKeyByText(duLieuTho_Bds.thanhpho);
            var quanHuyenKey = getQuanHuyenKeyByText(thanhPhoKey, duLieuTho_Bds.quan);
            var duongPhoKey = getDuongKeyByText(thanhPhoKey, duLieuTho_Bds.tenduong);
            var phuongXaKey = '';
            var soNha = '';
            var nhuCauModel = {
                donGia: duLieuTho_Bds.Dongia,
                dienThoai: duLieuTho_Bds.SDT,
                gia: duLieuTho_Bds.giatien,
                nguon: duLieuTho_Bds.nguon,
                loaiNguon: '',
                tieuDe: duLieuTho_Bds.tieude,
                thongTinMoTa: duLieuTho_Bds.noidung,
                tenLienHe: duLieuTho_Bds.ten,

                //khoBDSKey: khoBDSKey,
                //loaiNhuCauKey: loaiNhuCauKey,
            };
            var bdsModel = {
                thanhPho: thanhPhoKey,
                quanHuyen: quanHuyenKey,
                duongPho: duongPhoKey,
                soNha: '',
                dienTich: duLieuTho_Bds.Dientich,
                nguon: duLieuTho_Bds.nguon,
                loaiNguon: '',
                //quanHuyenText: duLieuTho_Bds.quan,

                //thanhPhoText: duLieuTho_Bds.thanhpho,

                //duongPhoText: duLieuTho_Bds.tenduong,

                thongTinMoTa: duLieuTho_Bds.noidung,
                khoBDSKey: khoBDSKey,
                address: thanhPhoKey + quanHuyenKey + phuongXaKey + soNha
            };
            xuLyNhuCauCauTrung(duLieuTho_Bds, loaiNhuCauKey);
            nhuCauService.addNhuCauWithBDS(khoBDSKey, loaiNhuCauKey, nhuCauModel, bdsModel).then(function (res) {
                settingService.deleteDuLieuTho(dltLoai, key);
            });
            //console.log('write', key);
            /* bdsService.create(khoBDSKey, bdsModel).then(function (res) {
                nhuCauService.addNhuCau(khoBDSKey, loaiNhuCauKey, nhuCauModel).then(function (res) {
                    settingService.deleteDuLieuTho(dltLoai, key);
                });

            }); */
            /* nhuCauService.addNhuCauMua(khoBDSKey, loaiNhuCauKey, nhuCauModel).then(function (res) {
                nhuCauService.addNhuCauBan(khoBDSKey, bdsModel, res.key).then(function (nhuCauRes) {

                });
            }); */
        }

        //Event
        duLieuThoVm.xuLyDuLieu = function () {
            if (!duLieuTho || duLieuTho == {}) return;
            appUtils.showLoading();

            xuLyDuLieu_NhaBan();
            xuLyDuLieu_NhaThue();

            setTimeout(function () {
                getDuLieuTho();
                getAllNhuCau();
                appUtils.hideLoading();
            }, 20000);
        };
    }
})();