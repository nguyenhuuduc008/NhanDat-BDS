(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauListingCtr', nhuCauListingCtr);
    	/** @ngInject */
    function nhuCauListingCtr($rootScope, $scope, $state,$q, $filter,nhuCauService,appUtils,$ngBootbox,toaster, settingService, bdsService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var vm =this;// jshint ignore:line

        var huongNhaList = appSettings.cacLoaiHuong;
        var tinhThanhList = appSettings.cacLoaiHanhChinh.capTinh;
        console.log('APP SETING', appSettings);

        vm.item = {};
        vm.cacKhoBDS = appSettings.cacKhoBDS;
        vm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        vm.cacLoaiCapDo = appSettings.cacLoaiCapDo;
        vm.khoBDSList = [];
        console.log(vm.cacKhoBDS);
        vm.item.nhuCauKey ='allTrangThai';

        //Load data
        _.forEach(vm.cacKhoBDS, function(item, key) {
            if(key != 'khoDefault') {
                vm.khoBDSList.push({
                    $id: key,
                    text: item.text
                });
            } else {
                vm.item.khoBDSKey = item;
            }
        });
            // vm.khoBDSDefault = _.find(data, ['$id', 'khoDefault']);
            // vm.item.khoBDSKey = !!vm.khoBDSDefault ? vm.khoBDSDefault.$value : 'allDanhMuc';

        //page
        vm.groupedItems = [];
        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        vm.groupToPages = function () {
            vm.pagedItems = [];
            for (var i = 0; i < vm.filteredItems.length; i++) {
                if (i % vm.paging.pageSize === 0) {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
                } else {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
                }
            }
            vm.paging.totalPage = Math.ceil(vm.filteredItems.length / vm.paging.pageSize);
        };
        //end page

        function textAdress(soNha, duongPhoId, quanHuyenId, tinhThanhId ) {
            soNha = !!soNha ? soNha + ', ' : '';
            var duongPho, quanHuyen, tinhThanh;
            tinhThanh = _.find(tinhThanhList, function(o, k) {
                return k === tinhThanhId;
            });
            tinhThanh = (tinhThanh === undefined) ? '' : tinhThanh.text;
            var quanHuyenList = appSettings.cacLoaiHanhChinh.capHuyen[tinhThanhId];
            quanHuyen = _.find(quanHuyenList, function(o, k) {
                return k === quanHuyenId;
            });
            quanHuyen = (quanHuyen === undefined) ? '' : quanHuyen.text + ', ';
            var duongPhoList = appSettings.cacLoaiHanhChinh.duong[quanHuyenId];
            duongPho = _.find(duongPhoList, function(o, k) {
                return k === duongPhoId;
            });
            duongPho = (duongPho === undefined) ? '' : duongPho.text + ', ';

            return (soNha + duongPho + quanHuyen + tinhThanh);
        }

        function textGia(giaFrom, giaTo) {
            if(!!giaFrom && !!giaTo) {
                if(giaFrom == giaTo && giaFrom == 100000000)
                    return 'Dưới ' + $filter('currency')(giaFrom, "", 0); 
                if (giaFrom == giaTo && giaTo == 10000000000)
                    return 'Trên ' + $filter('currency')(giaTo, "", 0);   
                return 'Từ ' + $filter('currency')(giaFrom, "", 0) + ' Đến ' + $filter('currency')(giaTo, "", 0); 
            }
        }

        function textDienTich(dtFrom, dtTo) {
            if(!!dtFrom && !!dtTo) {
                if(dtFrom == dtTo && dtFrom == 50)
                return 'Dưới ' + $filter('number')(dtFrom, 1); 
            if (dtFrom == dtTo && dtTo == 500)
                return 'Trên ' + $filter('number')(dtTo, 1);   
            return 'Từ ' + $filter('number')(dtFrom, 1) + ' Đến ' + $filter('number')(dtTo, 1); 
            }
        }

        function textDonVi(donVi) {
            if (donVi == '1')
                return 'Triệu';
            if (donVi == '2')
                return 'Tỷ';
            if (donVi == '0')
                return 'Thoả Thuận';
        }

        vm.selectAllItem = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        vm.appDung = function (idDanhMuc, idTrangThai) {
            //check valid
            if (idTrangThai == 'allTrangThai') {
                toaster.warning("Bạn cần lựa chọn Trạng Thái!");
                return;
            }
            appUtils.showLoading();
            // get data
            nhuCauService.getNhuCauByKhoLoai(idDanhMuc, idTrangThai).then(function (data) {
                var result = [];
                _.forEach(data, function (item, key) {
                    if (_.isObject(item)) {
                        if(idTrangThai === 'ban' || idTrangThai === 'cho-thue') {
                            bdsService.getBDS(idDanhMuc, item.bdsKey).then(function(bdsRs) {
                                if(!!bdsRs) {
                                    console.log('BDS', item);
                                    item.dienTich = $filter('number')(bdsRs.dienTich, 1);
                                    item.ngang = bdsRs.ngang;
                                    item.dai = bdsRs.dai;
                                    item.soTang = bdsRs.soTang;
                                    var huong = _.find(huongNhaList, function(o, k) {
                                        return k === bdsRs.huongNha;
                                    });
                                    item.huongNha = !!huong ? huong.text : '';
                                    item.address = textAdress(bdsRs.soNha, bdsRs.duongPho, bdsRs.quanHuyen, bdsRs.thanhPho);
                                    item.donViDonGia = textDonVi(item.donViDonGia);
                                    item.donViTongGia = textDonVi(item.donViTongGia);
                                    item.donGia = $filter('currency')(item.donGia, "", 0) + ' ' + item.donViDonGia;
                                    item.tongGia = $filter('currency')(item.tongGia, "", 0) + ' ' + item.donViTongGia;
                                    appUtils.hideLoading();
                                }
                            });
                        } 
                        else {
                            var huong = _.find(huongNhaList, function(o, k) {
                                return k === item.huongNha;
                            });
                            item.huongNha = !!huong ? huong.text : '';
                            item.address = textAdress(item.soNha, item.duongPho, item.quanHuyen, item.thanhPho);
                            item.dienTich = textDienTich(item.dienTichFrom, item.dienTichTo);
                            item.tongGia = textGia(item.tongGiaFrom, item.tongGiaTo);
                            item.donGia = textGia(item.donGiaFrom, item.donGiaTo);
                            appUtils.hideLoading();
                        }
                        item.nhuCauKey = item.$id;
                        nhuCauService.getTabNhuCau('capDo', item.nhuCauKey).then(function (capDoRs) {
                            if (capDoRs !== null) {
                                var find = _.find(vm.cacLoaiCapDo, function (o) {
                                    return o.value == capDoRs.capDo;
                                });
                                item.capDoColor = { 'color': find.color };
                                $scope.$apply();
                            }
                        });
                        result.push(item);
                    }
                });
                vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
                vm.paging.totalRecord = result.length;
                vm.paging.currentPage = 0;
                //group by pages
                vm.groupToPages();
                appUtils.hideLoading();
            }).catch(function (err) {
                toaster.warning(err);
            });
        };
        //xoa nhu cau
        vm.appDungLuaChon=function(selectedCheckBox,idLuaChon){
            //xoa, disable...
            var idLuaChonValue=$('#'+idLuaChon).val();
            var idLuaChonText=$('#'+idLuaChon).text();
            if (idLuaChonValue =='0') {
                toaster.warning("Lựa Chọn chưa được chọn!");
                return;
            }
           
        };
        vm.chiTietnhuCau = function (item) {
            $state.go('nhuCauEdit', { nhuCauId: item.$id, loaiId: item.loaiNhuCauKey, khoId: item.khoBDSKey});
        };
        
    } 
})();