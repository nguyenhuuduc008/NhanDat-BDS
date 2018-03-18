(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox){
        var service={
            addNhuCauBan:addNhuCauBan,
            getNhuCau:getNhuCau,
            updateNhuCau:updateNhuCau,
            getOnceNhuCau:getOnceNhuCau,
            addNhuCauMua: addNhuCauMua
        };
        //Ref
        var nhuCauRef=firebaseDataRef.child('nhuCau');
        var bdsRef=firebaseDataRef.child('bds');
        
        return service;
        //function 
        function getNhuCau(loaiTrangThaiId){
            return $firebaseArray(nhuCauRef.child(loaiTrangThaiId));
        }
        function getOnceNhuCau(loaiNhuCauId,id){
            return $firebaseObject(nhuCauRef.child(loaiNhuCauId).child(id));
        }

        function updateNhuCau(datModel){
            var ts = appUtils.getTimestamp();
			update.timestampModified = ts;
			console.log('update');
			console.log(update);
			return datModel.$save().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
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
        //---
    }
})();