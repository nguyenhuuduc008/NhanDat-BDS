(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox, storageRef, DataUtils){
        var service={
            getNhuCauBan:getNhuCauBan,
            getNhuCau:getNhuCau,
            getOnceNhuCau:getOnceNhuCau,
            addNhuCau: addNhuCau,
            uploadMediaStorage: uploadMediaStorage,
            updateNhuCau: updateNhuCau,
            getNhuCauBanById: getNhuCauBanById,
            getNhuCauByKhoLoai: getNhuCauByKhoLoai,
            updateMediaData: updateMediaData,
            deleteMediaStorage: deleteMediaStorage,
            deleteMediaData: deleteMediaData,
            updateTabNhuCau: updateTabNhuCau,
            getTabNhuCau: getTabNhuCau,
            updateTabLienKetNhuCau: updateTabLienKetNhuCau,
            updateTabLienKetNhuCauBan: updateTabLienKetNhuCauBan,
            removeTabLienKetNhuCau: removeTabLienKetNhuCau,
            addNhuCauWithBDS: addNhuCauWithBDS,
            updateNhuCauWithBDS: updateNhuCauWithBDS
        };
        //Ref
        var nhuCauRef=firebaseDataRef.child('nhuCau');
        var bdsRef=firebaseDataRef.child('bds');
        
        return service;
        //function 
        function getNhuCauBan(){
            return $firebaseArray(bdsRef);
        }
        function getNhuCau(){
            return $firebaseArray(nhuCauRef);
        }
        function getNhuCauBanById(loaiKhoId){
            var ref = bdsRef.child(loaiKhoId);
            return $firebaseArray(ref);
        }
        function getNhuCauByKhoLoai(khoBDSId, loaiNhuCauId){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            return DataUtils.getListDataFirebaseLoadOnce(refPath);
        }
        function getOnceNhuCau(loaiNhuCauId,id){
            return $firebaseObject(nhuCauRef.child(loaiNhuCauId).child(id));
        }

        function updateMediaData(khoBDSId, bdsKey, bdsModel, mediaKey) {
            var ref = bdsRef.child(khoBDSId + "/" + bdsKey + "/media");

            return ref.child(mediaKey).update(bdsModel).then(function(res){
                return {result:true,key:mediaKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        } 

        function deleteMediaData(khoBDSId, bdsKey, mediaKey) {
            var ref = bdsRef.child(khoBDSId + "/" + bdsKey + "/media");

            return ref.child(mediaKey).remove().then(function(res){
                return {result:true,key:mediaKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        } 

        function updateNhuCau(khoBDSId, loaiNhuCauId, nhuCauModel, nhuCauKey){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            nhuCauModel.timestampModified= Date.now();

            delete nhuCauModel.$$hashKey;
            delete nhuCauModel.bdsKey;

            return ref.child(nhuCauKey).update(nhuCauModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabNhuCau(khoBDSId, bdsTab, bdsModel, bdsKey){
            var ref = nhuCauRef.child("tabs/" + bdsTab + "/" + bdsKey);
            var refPath = "nhuCau/" + "tabs/" + bdsTab + "/" + bdsKey;
            delete bdsModel.bdsKey;
            bdsModel.timestampModified = Date.now();

            return ref.update(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabLienKetNhuCau(bdsTab, bdsModel, bdsKey){
            var ref = nhuCauRef.child("tabs/" + bdsTab + "/" + bdsKey);
            var key = ref.push().key;
            var refPath = "nhuCau/" + "tabs/" + bdsTab + "/" + bdsKey;
            bdsModel.lienKetKey = key;
            delete bdsModel.bdsKey;

            return ref.child(key).update(bdsModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:key};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabLienKetNhuCauBan(bdsTab, bdsModel, bdsKey){
            var ref = bdsRef.child("tabs/" + bdsTab + "/" + bdsKey);
            var key = ref.push().key;
            var refPath = "bds/" + "tabs/" + bdsTab + "/" + bdsKey;
            delete bdsModel.bdsKey;
            bdsModel.lienKetKey = key;

            return ref.child(key).update(bdsModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:key};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function removeTabLienKetNhuCau(khoBDSId, bdsTab, bdsKey, key){
            var ref = nhuCauRef.child(khoBDSId + "/" + bdsTab + "/" + bdsKey);
            var refPath = "nhuCau/" + khoBDSId + "/" + bdsTab + "/" + bdsKey;

            return ref.child(key).remove().then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function getTabNhuCau(bdsTab, bdsKey) {
            var refPath = "nhuCau/tabs/" + bdsTab + "/" + bdsKey;
            return DataUtils.getDataFirebaseLoadOnce(refPath);
        }

        function addNhuCau(khoBDSId, loaiNhuCauId, nhuCauModel){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            console.log('NHU CAU OPATH', refPath);
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            var nhuCauKey = ref.push().key;
            nhuCauModel.timestampModified = Date.now();
            return ref.child(nhuCauKey).set(nhuCauModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:nhuCauKey};
            }).catch(function(err){
                return {result:false,errMsg:err};
            });
        }

        function addNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel) {
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            var nhuCauKey = ref.push().key;
            var bdsKey = bdsRef.child(khoBDSId).push().key;
            nhuCauModel.bdsKey = bdsKey;
            nhuCauModel.timestampModified = Date.now();
            bdsModel.listNhuCauKey = [];
            bdsModel.listNhuCauKey.push(nhuCauKey);
            bdsModel.timestampModified = Date.now();

            return ref.child(nhuCauKey).set(nhuCauModel).then(function() {
                DataUtils.updateTimeStampModifiedNode(refPath);
                return bdsRef.child(khoBDSId).child(bdsKey).set(bdsModel).then(function() {
                    return {result:true, nhuCaukey:nhuCauKey, bdsKey: bdsKey};
                });
            }).catch(function(err){
                return {result:false,errMsg:err};
            });
        }

        function updateNhuCauWithBDS(khoBDSId, loaiNhuCauId, nhuCauModel, bdsModel, nhuCauKey){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            nhuCauModel.timestampModified = Date.now();
            bdsModel.listNhuCauKey = [];
            bdsModel.listNhuCauKey.push(nhuCauKey);
            bdsModel.timestampModified = Date.now();

            return ref.child(nhuCauKey).update(nhuCauModel).then(function() {
                DataUtils.updateTimeStampModifiedNode(refPath);
                return bdsRef.child(khoBDSId).child(nhuCauModel.bdsKey).update(bdsModel).then(function() {
                    return {result:true, nhuCaukey:nhuCauKey, bdsKey: nhuCauModel.bdsKey};
                });
            }).catch(function(err){
                return {result:false,errMsg:err};
            });
        }

		function uploadMediaStorage(folderPath, file, metadata){
            return storageRef.child(folderPath + file.name).put(file, metadata);
        }
        
        function deleteMediaStorage(folderPath) {
            return storageRef.child(folderPath).delete().then(function(res) {
                return {result:true};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }
        //---
    }
})();