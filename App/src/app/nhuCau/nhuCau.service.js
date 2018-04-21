(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox, storageRef, DataUtils){
        var service={
            getNhuCau:getNhuCau,
            getOnceNhuCau:getOnceNhuCau,
            addNhuCau: addNhuCau,
            uploadMediaStorage: uploadMediaStorage,
            updateNhuCau: updateNhuCau,
            getNhuCauByKhoLoai: getNhuCauByKhoLoai,
            updateMediaData: updateMediaData,
            deleteMediaStorage: deleteMediaStorage,
            deleteMediaData: deleteMediaData,
            updateTabNhuCau: updateTabNhuCau,
            getTabNhuCau: getTabNhuCau,
            removeTabNhuCau: removeTabNhuCau,
            addNhuCauWithBDS: addNhuCauWithBDS,
            updateNhuCauWithBDS: updateNhuCauWithBDS,
            updateTabNhuCauToBDS: updateTabNhuCauToBDS,
            getTabNhuCauFromBDS: getTabNhuCauFromBDS
        };
        //Ref
        var nhuCauRef=firebaseDataRef.child('nhuCau');
        var bdsRef=firebaseDataRef.child('bds');
        
        return service;
        //function 
        function getNhuCau(){
            return $firebaseArray(nhuCauRef);
        }
        function getNhuCauByKhoLoai(khoBDSId, loaiNhuCauId){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId;
            return DataUtils.getListDataFirebaseLoadOnce(refPath);
        }
        function getOnceNhuCau(khoBDSId, loaiNhuCauId, nhuCauId){
            var refPath = "nhuCau/" + khoBDSId + "/" + loaiNhuCauId + "/" + nhuCauId;
            return DataUtils.getDataFirebaseLoadOnce(refPath);
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

        function updateTabNhuCau(nhuCauTab, nhuCauModel, nhuCauKey, isLinked){
            var refPath = "nhuCau/tabs/" + nhuCauTab + "/" + nhuCauKey;
            var ref = nhuCauRef.child("tabs/" + nhuCauTab + "/" + nhuCauKey), key;
            if(isLinked) {
                key = ref.push().key;
                ref = nhuCauRef.child("tabs/" + nhuCauTab + "/" + nhuCauKey + "/" + key);
                nhuCauModel.nhuCauKey = nhuCauKey;
            }

            return ref.update(nhuCauModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:nhuCauKey, linkedKey: key};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabNhuCauToBDS(nhuCauTab, nhuCauModel, bdsKey){
            var ref = bdsRef.child("tabs/" + nhuCauTab + "/" + bdsKey);
            nhuCauModel.timestampModified = Date.now();

            return ref.update(nhuCauModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function getTabNhuCauFromBDS(nhuCauTab, bdsKey){
            var refPath = "bds/tabs/" + nhuCauTab + "/" + bdsKey;
            return DataUtils.getDataFirebaseLoadOnce(refPath);
        }

        function removeTabNhuCau(nhuCauTab, nhuCauKey, linkedKey){
            var refPath = "nhuCau/tabs/" + nhuCauTab + "/" + nhuCauKey;
            var ref = nhuCauRef.child("tabs/" + nhuCauTab + "/" + nhuCauKey);

            return ref.child(linkedKey).remove().then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:linkedKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function getTabNhuCau(nhuCauTab, nhuCauKey) {
            var refPath = "nhuCau/tabs/" + nhuCauTab + "/" + nhuCauKey;
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