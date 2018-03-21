(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox, storageRef){
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
            getNhuCauMuaById: getNhuCauMuaById
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
  
            return ref.child(bdsKey).update(bdsModel).then(function(res){
                return {result:true,key:bdsKey};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
        }

        function addNhuCauBan(khoBDSId, loaiNhuCauId, bdsModel){
            var ref = bdsRef.child(khoBDSId + "/" + loaiNhuCauId);
            var bdsKey = ref.push().key;
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
        //---
    }
})();