(function(){
    'use strict';
    angular.module('app.setting').factory('settingService', settingService);
    /** @ngInject **/
    function settingService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils){
        var service={
            getCacLoaiQuyHoach:getCacLoaiQuyHoach,
            getOnceLoaiQuyHoach:getOnceLoaiQuyHoach,
            addLoaiQuyHoach:addLoaiQuyHoach,
            removeLoaiQuyHoach:removeLoaiQuyHoach,
            updateLoaiQuyHoach:updateLoaiQuyHoach,

            getCacLoaiCapDo:getCacLoaiCapDo,
            getOnceLoaiCapDo:getOnceLoaiCapDo,
            addLoaiCapDo:addLoaiCapDo,
            removeLoaiCapDo:removeLoaiCapDo,
            updateLoaiCapDo:updateLoaiCapDo,

            getCacLoaiTacNghiep:getCacLoaiTacNghiep,
            getOnceLoaiTacNghiep:getOnceLoaiTacNghiep,
            addLoaiTacNghiep:addLoaiTacNghiep,
            removeLoaiTacNghiep:removeLoaiTacNghiep,
            updateLoaiTacNghiep:updateLoaiTacNghiep,

            getCacLoaiViTri:getCacLoaiViTri,
            getOnceLoaiViTri:getOnceLoaiViTri,
            addLoaiViTri:addLoaiViTri,
            removeLoaiViTri:removeLoaiViTri,
            updateLoaiViTri:updateLoaiViTri,

            getCacLoaiDuAn:getCacLoaiDuAn,
            getOnceLoaiDuAn:getOnceLoaiDuAn,
            addLoaiDuAn:addLoaiDuAn,
            removeLoaiDuAn:removeLoaiDuAn,
            updateLoaiDuAn:updateLoaiDuAn,

            getCacLoaiBDS:getCacLoaiBDS,
            getOnceLoaiBDS:getOnceLoaiBDS,
            addLoaiBDS:addLoaiBDS,
            removeLoaiBDS:removeLoaiBDS,
            updateLoaiBDS:updateLoaiBDS,

            getCacLoaiDuong:getCacLoaiDuong,
            getOnceLoaiDuong:getOnceLoaiDuong,
            addLoaiDuong:addLoaiDuong,
            removeLoaiDuong:removeLoaiDuong,
            updateLoaiDuong:updateLoaiDuong,

            getCacLoaiGiamGia:getCacLoaiGiamGia,
            getOnceLoaiGiamGia:getOnceLoaiGiamGia,
            addLoaiGiamGia:addLoaiGiamGia,
            removeLoaiGiamGia:removeLoaiGiamGia,
            updateLoaiGiamGia:updateLoaiGiamGia,

            getCacLoaiHau:getCacLoaiHau,
            getOnceLoaiHau:getOnceLoaiHau,
            addLoaiHau:addLoaiHau,
            removeLoaiHau:removeLoaiHau,
            updateLoaiHau:updateLoaiHau,

            getCacLoaiHuong:getCacLoaiHuong,
            getOnceLoaiHuong:getOnceLoaiHuong,
            addLoaiHuong:addLoaiHuong,
            removeLoaiHuong:removeLoaiHuong,
            updateLoaiHuong:updateLoaiHuong,

            getCacLoaiLienKetUser:getCacLoaiLienKetUser,
            getOnceLoaiLienKetUser:getOnceLoaiLienKetUser,
            addLoaiLienKetUser:addLoaiLienKetUser,
            removeLoaiLienKetUser:removeLoaiLienKetUser,
            updateLoaiLienKetUser:updateLoaiLienKetUser,

            getCacLoaiNguonBDS:getCacLoaiNguonBDS,
            getOnceLoaiNguonBDS:getOnceLoaiNguonBDS,
            addLoaiNguonBDS:addLoaiNguonBDS,
            removeLoaiNguonBDS:removeLoaiNguonBDS,
            updateLoaiNguonBDS:updateLoaiNguonBDS,

            getCacLoaiMucDich:getCacLoaiMucDich,
            getOnceLoaiMucDich:getOnceLoaiMucDich,
            addLoaiMucDich:addLoaiMucDich,
            removeLoaiMucDich:removeLoaiMucDich,
            updateLoaiMucDich:updateLoaiMucDich,

            getCacLoaiUser:getCacLoaiUser,
            getOnceLoaiUser:getOnceLoaiUser,
            addLoaiUser:addLoaiUser,
            removeLoaiUser:removeLoaiUser,
            updateLoaiUser:updateLoaiUser
        };
        //Ref
        var cacLoaiQuyHoachRef=firebaseDataRef.child('app-options/cacLoaiQuyHoach');
        var cacLoaiCapDoRef=firebaseDataRef.child('app-options/cacLoaiCapDo');
        var cacLoaiTacNghiepRef=firebaseDataRef.child('app-options/cacLoaiTacNghiep');
        var cacLoaiViTriRef=firebaseDataRef.child('app-options/cacLoaiViTri');
        var cacLoaiDuAnRef=firebaseDataRef.child('app-options/cacDuAn');
        var cacLoaiBDSRef=firebaseDataRef.child('app-options/cacLoaiBDS');
        var cacLoaiDuongRef=firebaseDataRef.child('app-options/cacLoaiDuong');
        var cacLoaiGiamGiaRef=firebaseDataRef.child('app-options/cacLoaiGiamGia');
        var cacLoaiHauRef=firebaseDataRef.child('app-options/cacLoaiHau');
        var cacLoaiHuongRef=firebaseDataRef.child('app-options/cacLoaiHuong');
        var cacLoaiLienKetUserRef=firebaseDataRef.child('app-options/cacLoaiLienKetUser');
        var cacLoaiNguonBDSRef=firebaseDataRef.child('app-options/cacNguonBDS');
        var cacLoaiMucDichRef=firebaseDataRef.child('app-options/cacLoaiMucDich');
        var cacLoaiUserRef=firebaseDataRef.child('app-options/cacLoaiUser');
        
        return service;
        //function cacLoaiQUyHoach
        function getCacLoaiQuyHoach(){
            return $firebaseArray(cacLoaiQuyHoachRef);
        }
        function getOnceLoaiQuyHoach(id){
            return $firebaseObject(cacLoaiQuyHoachRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiQuyHoach(dataModel){
            var key=cacLoaiQuyHoachRef.push().key;
            return cacLoaiQuyHoachRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiQuyHoach(idLoai){
            return cacLoaiQuyHoachRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiQuyHoach(idLoai,dataModel){
            return cacLoaiQuyHoachRef.child(idLoai).update({
                text:dataModel.text,
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //function cac loai cap do
        function getCacLoaiCapDo(){
            return $firebaseArray(cacLoaiCapDoRef);
        }
        function getOnceLoaiCapDo(id){
            return $firebaseObject(cacLoaiCapDoRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiCapDo(dataModel){
            var key=cacLoaiCapDoRef.push().key;
            return cacLoaiCapDoRef.child(key).update({
                text:dataModel.text,
                color:dataModel.color,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiCapDo(idLoai){
            return cacLoaiCapDoRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiCapDo(idLoai,dataModel){
            return cacLoaiCapDoRef.child(idLoai).update({
                text:dataModel.text,
                color:dataModel.color
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai tac nghiep
        function getCacLoaiTacNghiep(){
            return $firebaseArray(cacLoaiTacNghiepRef);
        }
        function getOnceLoaiTacNghiep(id){
            return $firebaseObject(cacLoaiTacNghiepRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiTacNghiep(dataModel){
            var key=cacLoaiTacNghiepRef.push().key;
            return cacLoaiTacNghiepRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiTacNghiep(idLoai){
            return cacLoaiTacNghiepRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiTacNghiep(idLoai,dataModel){
            return cacLoaiTacNghiepRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai vi tri
        function getCacLoaiViTri(){
            return $firebaseArray(cacLoaiViTriRef);
        }
        function getOnceLoaiViTri(id){
            return $firebaseObject(cacLoaiViTriRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiViTri(dataModel){
            var key=cacLoaiViTriRef.push().key;
            return cacLoaiViTriRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiViTri(idLoai){
            return cacLoaiViTriRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiViTri(idLoai,dataModel){
            return cacLoaiViTriRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac du an
        function getCacLoaiDuAn(){
            return $firebaseArray(cacLoaiDuAnRef);
        }
        function getOnceLoaiDuAn(id){
            return $firebaseObject(cacLoaiDuAnRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiDuAn(dataModel){
            var key=cacLoaiDuAnRef.push().key;
            return cacLoaiDuAnRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiDuAn(idLoai){
            return cacLoaiDuAnRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiDuAn(idLoai,dataModel){
            return cacLoaiDuAnRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        // cac loai BDS
        function getCacLoaiBDS(){
            return $firebaseArray(cacLoaiBDSRef);
        }
        function getOnceLoaiBDS(id){
            return $firebaseObject(cacLoaiBDSRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiBDS(dataModel){
            var key=cacLoaiBDSRef.push().key;
            return cacLoaiBDSRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiBDS(idLoai){
            return cacLoaiBDSRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiBDS(idLoai,dataModel){
            return cacLoaiBDSRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai duong
        function getCacLoaiDuong(){
            return $firebaseArray(cacLoaiDuongRef);
        }
        function getOnceLoaiDuong(id){
            return $firebaseObject(cacLoaiDuongRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiDuong(dataModel){
            var key=cacLoaiDuongRef.push().key;
            return cacLoaiDuongRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiDuong(idLoai){
            return cacLoaiDuongRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiDuong(idLoai,dataModel){
            return cacLoaiDuongRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai giam gia
        function getCacLoaiGiamGia(){
            return $firebaseArray(cacLoaiGiamGiaRef);
        }
        function getOnceLoaiGiamGia(id){
            return $firebaseObject(cacLoaiGiamGiaRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiGiamGia(dataModel){
            var key=cacLoaiGiamGiaRef.push().key;
            return cacLoaiGiamGiaRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiGiamGia(idLoai){
            return cacLoaiGiamGiaRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiGiamGia(idLoai,dataModel){
            return cacLoaiGiamGiaRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //các loại hậu
        function getCacLoaiHau(){
            return $firebaseArray(cacLoaiHauRef);
        }
        function getOnceLoaiHau(id){
            return $firebaseObject(cacLoaiHauRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiHau(dataModel){
            var key=cacLoaiHauRef.push().key;
            return cacLoaiHauRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiHau(idLoai){
            return cacLoaiHauRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiHau(idLoai,dataModel){
            return cacLoaiHauRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //các loại hướng
        function getCacLoaiHuong(){
            return $firebaseArray(cacLoaiHuongRef);
        }
        function getOnceLoaiHuong(id){
            return $firebaseObject(cacLoaiHuongRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiHuong(dataModel){
            var key=cacLoaiHuongRef.push().key;
            return cacLoaiHuongRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiHuong(idLoai){
            return cacLoaiHuongRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiHuong(idLoai,dataModel){
            return cacLoaiHuongRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loại liên kết user
        function getCacLoaiLienKetUser(){
            return $firebaseArray(cacLoaiLienKetUserRef);
        }
        function getOnceLoaiLienKetUser(id){
            return $firebaseObject(cacLoaiLienKetUserRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiLienKetUser(dataModel){
            var key=cacLoaiLienKetUserRef.push().key;
            return cacLoaiLienKetUserRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiLienKetUser(idLoai){
            return cacLoaiLienKetUserRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiLienKetUser(idLoai,dataModel){
            return cacLoaiLienKetUserRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac nguon BDS
        function getCacLoaiNguonBDS(){
            return $firebaseArray(cacLoaiNguonBDSRef);
        }
        function getOnceLoaiNguonBDS(id){
            return $firebaseObject(cacLoaiNguonBDSRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiNguonBDS(dataModel){
            var key=cacLoaiNguonBDSRef.push().key;
            return cacLoaiNguonBDSRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiNguonBDS(idLoai){
            return cacLoaiNguonBDSRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiNguonBDS(idLoai,dataModel){
            return cacLoaiNguonBDSRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai muc dich
        function getCacLoaiMucDich(){
            return $firebaseArray(cacLoaiMucDichRef);
        }
        function getOnceLoaiMucDich(id){
            return $firebaseObject(cacLoaiMucDichRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiMucDich(dataModel){
            var key=cacLoaiMucDichRef.push().key;
            return cacLoaiMucDichRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiMucDich(idLoai){
            return cacLoaiMucDichRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiMucDich(idLoai,dataModel){
            return cacLoaiMucDichRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //cac loai user
        function getCacLoaiUser(){
            return $firebaseArray(cacLoaiUserRef);
        }
        function getOnceLoaiUser(id){
            return $firebaseObject(cacLoaiUserRef.child(id)).$loaded().then(function(res){
                return {result:true,data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function addLoaiUser(dataModel){
            var key=cacLoaiUserRef.push().key;
            return cacLoaiUserRef.child(key).update({
                text:dataModel.text,
                value:key
            }).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        function removeLoaiUser(idLoai){
            return cacLoaiUserRef.child(idLoai).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }
        function updateLoaiUser(idLoai,dataModel){
            return cacLoaiUserRef.child(idLoai).update({
                text:dataModel.text
            }).then(function(res){
                return {result:true,data:idLoai};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }
        //---
    }
})();