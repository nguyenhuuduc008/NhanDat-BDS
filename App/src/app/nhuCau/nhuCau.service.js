(function(){
    'use strict';
    angular.module('app.nhuCau').factory('nhuCauService', nhuCauService);
    /** @ngInject **/
    function nhuCauService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils,toaster,$ngBootbox){
        var service={
            themMoiNhuCau:themMoiNhuCau,
            getNhuCau:getNhuCau,
            updateNhuCau:updateNhuCau,
            getOnceNhuCau:getOnceNhuCau 
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

        function themMoiNhuCau(loaiNhuCauId,loaiNhuCauText,bdsId,danhMucId,noiDung){
            console.log('loaiNhuCauId');
            console.log(loaiNhuCauId);
            var ref=nhuCauRef.child(loaiNhuCauId);
         
            var bdsRefLink='bds/'+danhMucId+'/' + bdsId;
            console.log('bdsRef');
            console.log(bdsRef);
            var key=ref.push().key;
            var objData={
                loaiNhuCauId:loaiNhuCauId,
                bdsId:bdsId,
                bdsRefLink:bdsRefLink,
                loaiNhuCauText:loaiNhuCauText,
                danhMucId:danhMucId,
                noiDung:noiDung,
                timestampCreated:Date.now()
            };
            return ref.child(key).set(objData).then(function(res){
                return {result:true,key:key};
            }).catch(function(err){
                return {result:true,errMsg:err};
            });
            
        }
        //---
    }
})();