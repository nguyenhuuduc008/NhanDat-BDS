(function(){
    'use strict';
    angular.module('app.setting')
    .controller('duLieuThoCtr', duLieuThoCtr);
    	/** @ngInject */
    function duLieuThoCtr($rootScope, $scope, $state,$stateParams,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var duLieuThoVm =this;// jshint ignore:line
        
        var duLieuTho = {};
        var danhMucHanhChinh = {};

        //-----default function-----
        function getDuLieuTho(){
            settingService.getDuLieuTho().then(function(rs){
                if(rs) duLieuTho = rs.val();
                console.log('duLieuTho',duLieuTho);
            });
        }
        
        function getAllHanhChinh(){
            settingService.getAllHanhChinh().then(function(rs){
                if(rs) danhMucHanhChinh = rs.val();
                console.log('danhMucHanhChinh',danhMucHanhChinh);
                appUtils.hideLoading();
            });
        }
        
        function init(){
            appUtils.showLoading();
            getDuLieuTho();
            getAllHanhChinh();
        }
        init();

        //-----function-----

        function xuLyDuLieu_NhaBan(){
            _.each(duLieuTho.NhaBan, function(bds){
                xuLyDuLieu_AddBDS(bds,'ban');
            });
        }

        function xuLyDuLieu_NhaThue(){
            _.each(duLieuTho.NhaThue, function(bds){
                xuLyDuLieu_AddBDS(bds,'cho-thue');
            });
        }

        function getThanhPhoKeyByText(thanhPhoText){
            var thanhPho = '';
            _.forEach(danhMucHanhChinh.capTinh, function(tp, key){
                if(tp.text == thanhPhoText) {
                    thanhPho = key;
                }
            });
            console.log('thanhPho',thanhPho);
            return thanhPho;
        }

        function xuLyDuLieu_AddBDS(duLieuTho_Bds, loaiNhuCauKey){
            var khoBDSKey = 'Kho-So-Cap';
            var thanhPhoKey = getThanhPhoKeyByText(duLieuTho_Bds.thanhpho);
            var bdsModel = {
                dienTich : duLieuTho_Bds.Dientich,
                donGia : duLieuTho_Bds.Dongia,
                dienThoai : duLieuTho_Bds.SDT,
                gia : duLieuTho_Bds.giatien,
                nguon : duLieuTho_Bds.nguon,
                loaiNguon : '',
                tieuDe : duLieuTho_Bds.tieude,
                thongTinMoTa : duLieuTho_Bds.noidung,
                quanHuyenText : duLieuTho_Bds.quan,
                quanHuyen : '',
                thanhPhoText : duLieuTho_Bds.thanhpho,
                thanhPho : '',
                tenLienHe : duLieuTho_Bds.ten,
                duongPhoText : duLieuTho_Bds.tenduong,
                duongPho : '',

                khoBDSKey : khoBDSKey,
                loaiNhuCauKey : loaiNhuCauKey,
            };
            // nhuCauService.addNhuCauBan(khoBDSKey, loaiNhuCauKey, bdsModel).then(function(res) {
            //     //add Nhu Cau
            // });
        }

        //Event
        duLieuThoVm.xuLyDuLieu = function(){
            if(!duLieuTho || duLieuTho == {}) return;
            //appUtils.showLoading();

            xuLyDuLieu_NhaBan();
            xuLyDuLieu_NhaThue();
        };
    } 
})();