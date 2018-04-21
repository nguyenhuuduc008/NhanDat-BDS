(function () {
    'use strict';
    angular.module('app.raoVat').factory('raoVatService', raoVatService);
    /** @ngInject **/
    function raoVatService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils) {

        var ref = firebaseDataRef.child('raoVat');
        var service = {
            create: create,
            update: update,
            del: del,
            getAll: getAll,
            getById: getById,
        };
        return service;

        // da kiem tra
        function create(dataModel) {
            var key = ref.push().key;
            return ref.child(key).update({
                tieuDe: dataModel.tieuDe,
                moTa: dataModel.moTa,
                tuNgay: dataModel.tuNgay,
                denNgay: dataModel.denNgay,
                lienKet: dataModel.lienKet,
                anTin: dataModel.anTin,
                file: dataModel.file,
                nguoiTao: dataModel.nguoiTao,
                nguoiSua: dataModel.nguoiSua,
                timestampCreated: Date.now(),
                timestampModified: Date.now()
            }).then(function (res) {
                return { result: true, data: key };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function del(id) {
            return ref.child(id).remove().then(function (res) {
                return { result: true };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function update(dataModel) {
            return ref.child(dataModel.$id).update({
                tieuDe: dataModel.tieuDe,
                moTa: dataModel.moTa,
                tuNgay: dataModel.tuNgay,
                denNgay: dataModel.denNgay,
                lienKet: dataModel.lienKet,
                anTin: dataModel.anTin,
                file: dataModel.file,
                nguoiSua: dataModel.nguoiSua,
                timestampModified: Date.now()
            }).then(function (res) {
                return { result: true };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function getAll() {
            return $firebaseArray(ref).$loaded().then(function (res) {
                return { result: true, data: res };
            });
        }

        // da kiem tra
        function getById(id) {

            return $firebaseObject(ref.child(id)).$loaded().then(function (res) {
                return { result: true, data: res };
            })
        	.catch(function (err) {
        	    return { result: false, errorMsg: err };
        	});
        }
    }
})();