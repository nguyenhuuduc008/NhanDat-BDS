(function(){
    'use strict';
    angular.module('app.quytrinhphaply').factory('quyTrinhPhapLyService', quyTrinhPhapLyService);
    /** @ngInject **/
    function quyTrinhPhapLyService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils, DataUtils){
        var quyTrinhPhapLyRef = firebaseDataRef.child('quy-trinh-phap-ly');
        var service={
            getQuyTrinhPhapLy: getQuyTrinhPhapLy,
            getOnceQuyTrinhPhapLy:getOnceQuyTrinhPhapLy,
            addQuyTrinhPhapLy: addQuyTrinhPhapLy,
            updateQuyTrinhPhapLy: updateQuyTrinhPhapLy,
            removeQuyTrinhPhapLy: removeQuyTrinhPhapLy,
            search: search
        };
        //Ref
        
        return service;
        
        //function Quy Trình Pháp Lý
        function getQuyTrinhPhapLy(){
            return $firebaseArray(quyTrinhPhapLyRef);
        }

        function getOnceQuyTrinhPhapLy(id){
            return $firebaseObject(quyTrinhPhapLyRef.child(id)).$loaded().then(function(res){
                return {result:true, data:res};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }

        function addQuyTrinhPhapLy(dataModel){
            var key= quyTrinhPhapLyRef.push().key,
            ts = appUtils.getTimestamp();
            dataModel.timestampCreated = dataModel.timestampModified = ts;
            return quyTrinhPhapLyRef.child(key).update(dataModel).then(function(res){
                return {result:true,data:key};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }

        function removeQuyTrinhPhapLy(id){
            return quyTrinhPhapLyRef.child(id).remove().then(function(){
                return {result: true , errorMsg: ""};
            }).catch(function(error){
                return {result: false , errorMsg: error};
            });
        }

        function updateQuyTrinhPhapLy(id,dataModel){
            var ts = appUtils.getTimestamp();
            dataModel.timestampModified = ts;
            dataModel = DataUtils.stripDollarPrefixedKeys(dataModel);
            return quyTrinhPhapLyRef.child(id).update(dataModel).then(function(res){
                return {result:true,data:id};
            }).catch(function(error){
                return {result:false,errMsg:error};
            });
        }

        function search(cri){
            return $firebaseArray(quyTrinhPhapLyRef).$loaded().then(function(data){
                if(cri.thanhPho !== 'all'){
                    data = _.filter(data, function(item){
                        return item.thanhPho === cri.thanhPho;
                    });
                    if(cri.quanHuyen !== 'all'){
                        data = _.filter(data, function(item){
                            return item.quanHuyen === cri.quanHuyen;
                        });    
                    }
                }
                return $filter('filter')(data, function (item) {
                    for(var attr in item) {
                    if (searchMatch(item[attr] + '', cri.keyword))
                    {
                        return true;
                    }
                    }
                    return false;
                });
            });
        }
    
        function searchMatch(haystack, needle) {
            if (!needle) {
            return true;
            }
            return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
        }
    }
})();