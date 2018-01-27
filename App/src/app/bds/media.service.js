(function() {
	'use strict';
	angular.module('app.bds').factory('bdsMediaService', bdsMediaService);
  /** @ngInject **/
  function bdsMediaService($q,authService,storageRef,$firebaseObject,$firebaseArray,firebaseDataRef,appUtils, $filter, DataUtils){
        var rootPath = 'bds-media';
        var media = firebaseDataRef.child(rootPath);
      
  		var service = {
            getMediaBDS: getMediaBDS,
            addFile: addFile,
            searchMedia : searchMedia,
            filterItems : filterItems,
            removeMedia: removeMedia,
            updateMedia:updateMedia
  		};

  		return service;

        function getMediaBDS(bdsId){
            var ref = firebaseDataRef.child(rootPath + "/" + bdsId); 
            return $firebaseArray(ref).$loaded().then(function(data){
                console.log(data);
                if(data && !data.$value){
                    return _.map(data, function(value, key){
                        value.$id = key;
                        return value;
                    });
                }
                return [];
            });
        }

        function addFile( bdsId, mediaData ) {
            var ts = appUtils.getTimestamp();
            mediaData.timestamCreated = ts;
            mediaData.timestamModified = ts;
            return media.child(bdsId).push(mediaData).then(function(result) {
                return {result: true , errorMsg: "", id: result.key};
            }).catch(function(error) {
                return {result: false , errorMsg: error};
            });
        }

        function updateMedia(bdsId, mediaId, update){
            update = DataUtils.stripDollarPrefixedKeys(update);
            var ts = appUtils.getTimestamp();
            update.timestamModified = ts;
            var ref = firebaseDataRef.child(rootPath + '/' + bdsId + '/' + mediaId);
            return ref.update(update).then(function(result) {
                return {result: true , errorMsg: "", id: mediaId};
              }).catch(function(error) {
                return {result: false , errorMsg: error};
            });
        }

        function removeMedia (bdsId, id) {
            var ref = firebaseDataRef.child(rootPath + '/' + bdsId + '/' + id);
            var mediaData;
            return $firebaseObject(ref).$loaded().then(function(data){
                mediaData = data;
                var file = storageRef.child(mediaData.fullPath);
                if ( file ) file.delete();

                if(mediaData.lowRes && mediaData.lowRes.fileName){
                    var lowRes = storageRef.child(mediaData.lowRes.fullPath);
                    if ( lowRes ) lowRes.delete();
                }

                if(mediaData.thumbnail && mediaData.thumbnail.fileNam){
                    var thumbnail = storageRef.child(mediaData.thumbnail.fullPath);
                    if (thumbnail) thumbnail.delete();
                }

                return ref.remove().then(function(){
                    return {result: true , errorMsg: ""};
                }).catch(function(error) {
                    return {result: false , errorMsg: error};
                });
            });
        }

        function filterItems(items, timestamp, type){
            var rs = [];
            _.forEach(items, function(value, key) {
            var rsType;
            if(value.fileType){
                if(type === 'image'){
                    // imgType = value.type.split("/")[0] === 'text' || value.type.split("/")[0] === 'application'; 
                    var imgRs = _.find(appUtils.imgFileIcons, function(o) { return o.type.toLowerCase() === value.fileType.toLowerCase(); });
                    if(imgRs){
                        rsType = true;
                    }
                }else if(type === 'video'){
                    var videoRs = _.find(appUtils.videoFileIcons, function(o) { return o.type.toLowerCase() === value.fileType.toLowerCase(); });
                    if(videoRs){
                        rsType = true;
                    }
                }else{
                    rsType = true;
                }
            }
            if((timestamp === 'All' || parseInt(value.timestampCreated) >= parseInt(timestamp)) && (type === 'All' || rsType)) {
            // if((timestamp === 'All' || parseInt(value.timestampCreated) >= parseInt(timestamp))) {
                rs.push(value);
            }
            });
            return rs;
        }

        function searchMedia(bdsId, keyword){
            var ref = media.child(bdsId);
            return $firebaseArray(ref).$loaded().then(function(data){
            return $filter('filter')(data, function (item) {
                for(var attr in item) {
                    if (searchMatch(item[attr] + '', keyword))
                    return true;
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
