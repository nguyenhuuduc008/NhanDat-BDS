(function () {
    'use strict';
    angular.module('app.setting')
        .controller('duLieuThoCtr', duLieuThoCtr);
    /** @ngInject */
    function duLieuThoCtr($rootScope, $scope, $state, $stateParams, $q, settingService, appUtils,
        $ngBootbox, toaster, nhuCauService, firebaseDataRef, $firebaseObject, bdsService, userService) {
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

        function getDuongKeyByText(thanhPhoKey, quanHuyenKey, duongPhoText) { //Đường Phố
            var duongPhoKey = '';
            try {
                _.forEach(danhMucHanhChinh.duong[thanhPhoKey][quanHuyenKey], function (item, key) {
                    if (item.text == duongPhoText) {
                        duongPhoKey = key;
                    }
                });
            } catch (error) {
                console.log(error);
            }

            //console.log('duongPhoKey', duongPhoKey);
            //console.log('duongPhoText', duongPhoText);
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

            var khoBDSKey = duLieuTho_Bds.Loaitin == 'MG' ? 'Kho-Moi-Gioi' : 'Kho-So-Cap';
            var thanhPhoKey = getThanhPhoKeyByText(duLieuTho_Bds.thanhpho);
            var quanHuyenKey = getQuanHuyenKeyByText(thanhPhoKey, duLieuTho_Bds.quan);
            var duongPhoKey = getDuongKeyByText(thanhPhoKey, quanHuyenKey, duLieuTho_Bds.tenduong);
            var phuongXaKey = '';
            var soNha = '';
            var nhuCauModel = {
                tieuDe: duLieuTho_Bds.tieude,

                donGia: duLieuTho_Bds.Dongia.trim(),
                dienThoai: duLieuTho_Bds.SDT,
                tongGia: duLieuTho_Bds.giatien.trim(),
                nguon: duLieuTho_Bds.nguon,
                loaiNguon: '',

                thongTinMoTa: duLieuTho_Bds.noidung,
                tenLienHe: duLieuTho_Bds.ten,

                khoBDSKey: khoBDSKey,
                loaiNhuCauKey: loaiNhuCauKey
            };
            var bdsModel = {
                thanhPho: thanhPhoKey,
                quanHuyen: quanHuyenKey,
                phuongXa: '',
                duongPho: duongPhoKey,
                soNha: '',
                loaiBDS: '',
                dienTich: duLieuTho_Bds.Dientich,
                nguon: duLieuTho_Bds.nguon,
                loaiNguon: '',
                thongTinMoTa: duLieuTho_Bds.noidung,
                khoBDSKey: khoBDSKey,
                address: thanhPhoKey + quanHuyenKey + phuongXaKey + soNha
            };
            var linkCreateUser = {
                phone: duLieuTho_Bds.SDT,
                name: duLieuTho_Bds.ten,
                loaiLienKetUser: duLieuTho_Bds.Loaitin == 'MG' ? 0 : 1,
                timeCreated: Date.now(),
                khoBDSKey: khoBDSKey,
                loaiNhuCauKey: loaiNhuCauKey
            };
            //add user to existPhone
            var exist = userService.checkExistPhone(duLieuTho_Bds.SDT);
            //console.log('phone exist', exist);
            if (exist == null) {
                var existUserPhone = {
                    userName: duLieuTho_Bds.ten,
                    phone: duLieuTho_Bds.SDT
                };
                userService.setPhone(existUserPhone);
            }

            xuLyNhuCauCauTrung(duLieuTho_Bds, loaiNhuCauKey);
            nhuCauService.addNhuCauWithBDS(khoBDSKey, loaiNhuCauKey, nhuCauModel, bdsModel).then(function (res) {
                nhuCauService.updateTabNhuCau('lienKetUser', linkCreateUser, res.nhuCaukey, true);
                bdsService.updateTab(res.bdsKey, linkCreateUser, 'lienKetUser', true);
                //settingService.deleteDuLieuTho(dltLoai, key);
            });
        }
        /* var duLieuThoModel = {
            thanhpho: 'TP Hồ Chí Minh',
            quan: "Tân Phú",
            tenduong: "Lê Liễu",
            Dongia: 0,
            SDT: "0909978219",
            giatien: 5000,
            nguon: "bds.com",
            tieude: "Ban nha",
            noidung: "nha mat tien",
            ten: "hung",
            Dientich: 200,
            loaitin: 'MG'
        }; */
        //Event
        duLieuThoVm.xuLyDuLieu = function () {
            //settingService.addDuLieuTho(duLieuThoModel);
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
        duLieuThoVm.inputData = "";
        duLieuThoVm.checkInputData = function () {
            var exist = userService.checkExistPhone(duLieuThoVm.inputData);
            console.log(exist);
        };
    }
})();