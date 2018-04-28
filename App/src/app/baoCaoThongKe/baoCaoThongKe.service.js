(function(){
    'use strict';
    angular.module('app.baoCaoThongKe').factory('baoCaoThongKeService', baoCaoThongKeService);
    /** @ngInject **/
    function baoCaoThongKeService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils){       
        var service = {
            getThongKeBDSTheoLoai : getThongKeBDSTheoLoai,
            getThongKeBDSTheoPhanKhucGia : getThongKeBDSTheoPhanKhucGia,
            getThongKeBDSTheoThoiGian : getThongKeBDSTheoThoiGian,
            getThongKeBDSTheoTruyCap : getThongKeBDSTheoTruyCap,
            getThongKeBDSTheoLinhVuc : getThongKeBDSTheoLinhVuc
        };
        //Ref
        var thongkeRef = firebaseDataRef.child('thongke');
        var thongkeBDSTheoLoaiRef = firebaseDataRef.child('thongke/BDSTheoLoai');
        var thongkeBDSTheoPhanKhucGiaRef = firebaseDataRef.child('thongke/BDSTheoPhanKhucGia');
        var thongkeBDSTheoThoiGianRef = firebaseDataRef.child('thongke/BDSTheoThoiGian');
        var thongkeBDSTheoTruyCapRef = firebaseDataRef.child('thongke/BDSTheoTruyCap');
        var thongkeBDSTheoLinhVucRef = firebaseDataRef.child('thongke/BDSTheoLinhVuc');

        return service;

        //Functions
        function getThongKeBDSTheoLoai () {
            return $firebaseArray(thongkeBDSTheoLoaiRef);
        }

        function getThongKeBDSTheoPhanKhucGia () {
            return $firebaseArray(thongkeBDSTheoPhanKhucGiaRef.orderByChild('lineColor'));
        }
        
        function getThongKeBDSTheoThoiGian () {
            return $firebaseArray(thongkeBDSTheoThoiGianRef.orderByChild('lineColor'));
        }

        function getThongKeBDSTheoTruyCap () {
            return $firebaseArray(thongkeBDSTheoTruyCapRef.orderByChild('lineColor'));
        }

        function getThongKeBDSTheoLinhVuc () {
            return $firebaseArray(thongkeBDSTheoLinhVucRef);
        }
    }
})();