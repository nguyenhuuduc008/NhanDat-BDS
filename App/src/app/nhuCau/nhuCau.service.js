(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox, storageRef, DataUtils){
        var service={
            addNhuCauBan:addNhuCauBan,
            getNhuCauBan:getNhuCauBan,
            getNhuCauMua:getNhuCauMua,
            getOnceNhuCau:getOnceNhuCau,
            addNhuCauMua: addNhuCauMua,
            uploadMediaStorage: uploadMediaStorage,
            updateNhuCauMua: updateNhuCauMua,
            updateNhuCauBan: updateNhuCauBan,
            getNhuCauBanById: getNhuCauBanById,
            getNhuCauMuaById: getNhuCauMuaById,
            updateMediaData: updateMediaData,
            deleteMediaStorage: deleteMediaStorage,
            deleteMediaData: deleteMediaData,
            updateTabNhuCauMua: updateTabNhuCauMua,
            updateTabNhuCauBan: updateTabNhuCauBan,
            getTabNhuCauMua: getTabNhuCauMua,
            getTabNhuCauBan: getTabNhuCauBan,
            updateTabLienKetNhuCauMua: updateTabLienKetNhuCauMua,
            updateTabLienKetNhuCauBan: updateTabLienKetNhuCauBan,
            removeTabLienKetNhuCau: removeTabLienKetNhuCau,
        };
        //Ref
        var nhuCauRef=firebaseDataRef.child('nhuCau');
        var bdsRef=firebaseDataRef.child('bds');
        
        return service;
        //function 
        function getNhuCauBan(){
            return $firebaseArray(bdsRef);
        }
        function getNhuCauMua(){
            return $firebaseArray(nhuCauRef);
        }
        function getNhuCauBanById(loaiKhoId){
            var ref = bdsRef.child(loaiKhoId);
            return $firebaseArray(ref);
        }
        function getNhuCauMuaById(loaiKhoId){
            return $firebaseArray(nhuCauRef.child(loaiKhoId));
        }
        function getOnceNhuCau(loaiNhuCauId,id){
            return $firebaseObject(nhuCauRef.child(loaiNhuCauId).child(id));
        }

        function updateMediaData(khoBDSId, loaiNhuCauId, bdsKey, bdsModel, mediaKey) {
            var ref = bdsRef.child(khoBDSId + "/" + loaiNhuCauId + "/" + bdsKey + "/media");

            return ref.child(mediaKey).update(bdsModel).then(function(res){
                return {result:true,key:mediaKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        } 

        function deleteMediaData(khoBDSId, loaiNhuCauId, bdsKey, mediaKey) {
            var ref = bdsRef.child(khoBDSId + "/" + loaiNhuCauId + "/" + bdsKey + "/media");

            return ref.child(mediaKey).remove().then(function(res){
                return {result:true,key:mediaKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        } 

        function updateNhuCauMua(khoBDSId, loaiNhuCauId, bdsModel, bdsKey){
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            bdsModel.timestampModified= Date.now();

            delete bdsModel.$$hashKey;
            delete bdsModel.bdsKey;

            return ref.child(bdsKey).update(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateNhuCauBan(khoBDSId, loaiNhuCauId, bdsModel, bdsKey) {
            var ref = bdsRef.child(khoBDSId + "/" + loaiNhuCauId);
            bdsModel.timestampModified= Date.now();
            
            delete bdsModel.$$hashKey;
            delete bdsModel.bdsKey;

            _.forEach(bdsModel.media, function(item, key) {
                delete item.$$hashKey;
            });
  
            return ref.child(bdsKey).update(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabNhuCauMua(khoBDSId, bdsTab, bdsModel, bdsKey){
            var ref = nhuCauRef.child(khoBDSId + "/" + bdsTab + "/" + bdsKey);
            var refPath = "nhuCau/" + khoBDSId + "/" + bdsTab + "/" + bdsKey;
            delete bdsModel.bdsKey;

            return ref.update(bdsModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabNhuCauBan(khoBDSId, bdsTab, bdsModel, bdsKey){
            var ref = bdsRef.child(khoBDSId + "/" + bdsTab + "/" + bdsKey);
            var refPath = "bds/" + khoBDSId + "/" + bdsTab + "/" + bdsKey;
            delete bdsModel.bdsKey;

            return ref.update(bdsModel).then(function(res){
                DataUtils.updateTimeStampModifiedNode(refPath);
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function updateTabLienKetNhuCauMua(bdsTab, bdsModel, bdsKey){
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

        function updateTabLienKetNhuCauBan(khoBDSId, bdsTab, bdsModel, bdsKey){
            var ref = bdsRef.child(khoBDSId + "/" + bdsTab + "/" + bdsKey);
            var key = ref.push().key;
            var refPath = "bds/" + khoBDSId + "/" + bdsTab + "/" + bdsKey;
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

        function getTabNhuCauMua(bdsTab, bdsKey) {
            var refPath = "nhuCau/tabs/" + bdsTab + "/" + bdsKey;
            return DataUtils.getDataFirebaseLoadOnce(refPath);
        }

        function getTabNhuCauBan(khoBDSId, bdsTab, bdsKey) {
            var refPath = "bds/" + khoBDSId + "/" + bdsTab + "/" + bdsKey;
            return DataUtils.getDataFirebaseLoadOnce(refPath);
        }

        function addNhuCauBan(khoBDSId, bdsModel, bdsKey){
            var ref = bdsRef.child(khoBDSId);
            bdsModel.timestampCreated = Date.now();

            return ref.child(bdsKey).set(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
            
        }

        function addNhuCauMua(khoBDSId, loaiNhuCauId, bdsModel){
            var ref = nhuCauRef.child(khoBDSId + "/" + loaiNhuCauId);
            var bdsKey = ref.push().key;
            bdsModel.timestampCreated = Date.now();
  
            return ref.child(bdsKey).set(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
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