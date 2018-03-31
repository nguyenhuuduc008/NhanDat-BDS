(function () {
    'use strict';
    angular.module('app.quanLyNhom').factory('quanLyNhomService', quanLyNhomService);
    /** @ngInject **/
    function quanLyNhomService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils) {

        var ref = firebaseDataRef.child('quanLyNhom');
        var service = {
            create: create,
            update:update,
            getById: getById,
            getAll: getAll
        };
        return service;

        function create(dataModel) {
            var key = ref.push().key;
            dataModel.timestampCreated = dataModel.timestampModified = appUtils.getTimestamp();
            return ref.child(key).update(dataModel).then(function (res) {
                return { result: true, data: key };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        function update(id, dataModel) {
            var ts = appUtils.getTimestamp();
            dataModel.timestampModified = ts;
            dataModel = DataUtils.stripDollarPrefixedKeys(dataModel);

            return ref.child(id).update(dataModel).then(function (res) {
                return { result: true, data: id };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        function getAll() {
            return $firebaseArray(ref);
        }

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