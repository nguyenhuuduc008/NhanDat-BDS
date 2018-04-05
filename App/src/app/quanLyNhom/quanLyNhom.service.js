(function () {
    'use strict';
    angular.module('app.quanLyNhom').factory('quanLyNhomService', quanLyNhomService);
    /** @ngInject **/
    function quanLyNhomService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils) {

        var ref = firebaseDataRef.child('quanLyNhom');
        var service = {
            create: create,
            update: update,
            del: del,
            getAll: getAll,
            getById: getById,
            getByUserId: getByUserId,
            addMembers: addMembers,
            addMember: addMember,
            removeMember: removeMember,
        };
        return service;

        // da kiem tra
        function GroupInfo(dataModel) {
            return {
                tenNhom: dataModel.tenNhom,
                author: dataModel.Author,
                nMembers: dataModel.Members.length,
                timestampCreateds: dataModel.timestampCreated
            };
        }

        // da kiem tra
        function create(dataModel) {
            var key = ref.child('groups').push().key;
            dataModel.timestampCreated = dataModel.timestampModified = appUtils.getTimestamp();
            return ref.child('groups').child(key).update(dataModel).then(function (res) {
                addMembers(dataModel, key);
                return { result: true, data: key };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function addMembers(dataModel, groupId) {
            groupId = DataUtils.stripDollarPrefixedKeys(groupId);
            $.each(dataModel.Members, function () {
                return ref.child('users').child(this.phoneNumber).child(groupId).update(GroupInfo(dataModel)).then(function (res) {
                    return { result: true };
                });
            });
        }

        // da kiem tra
        function addMember(userId, dataModel, groupId) {
            return ref.child('users').child(userId).child(groupId).update(GroupInfo(dataModel)).then(function (res) {
                return { result: true };
            });
        }

        // da kiem tra
        function removeMember(userId, groupId) {
            console.log(groupId);
            return ref.child('users').child(userId).child(groupId).remove().then(function (res) {
                return { result: true };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function del(groupId) {
            getById(groupId).then(function (res) {
                $.each(res.data.Members, function () {
                    removeMember(this.phoneNumber, groupId);
                });
            });

            return ref.child('groups').child(groupId).remove().then(function (res) {
                return { result: true };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function update(dataModel) {
            dataModel.timestampModified = appUtils.getTimestamp();
            dataModel = DataUtils.stripDollarPrefixedKeys(dataModel);
            return ref.child('groups').child(dataModel.id).update(dataModel).then(function (res) {
                return { result: true };
            }).catch(function (error) {
                return { result: false, errMsg: error };
            });
        }

        // da kiem tra
        function getAll() {
            return $firebaseArray(ref.child('groups'));
        }

        // da kiem tra
        function getById(id) {
            return $firebaseObject(ref.child('groups').child(id)).$loaded().then(function (res) {
                return { result: true, data: res };
            })
			.catch(function (err) {
			    return { result: false, errorMsg: err };
			});
        }

        // da kiem tra
        function getByUserId(id) {
            return $firebaseArray(ref.child('users').child(id)).$loaded().then(function (res) {
                return { result: true, data: res };
            }).catch(function (err) {
                return { result: false, errorMsg: err };
            });
        }
    }
})();