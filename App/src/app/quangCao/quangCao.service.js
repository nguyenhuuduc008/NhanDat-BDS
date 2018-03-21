(function() {
	'use strict';

	angular.module('app.quangCao').factory('quangCaoService' ,quangCaoService);
	

	/** @ngInject **/
	function quangCaoService(firebaseDataRef, $firebaseObject, appUtils, $q, storageRef, $firebaseArray, $rootScope,$filter){
		var service = {
			getAll: getAll,
			get: get,
		    create: create,
		    update:update,
		    search:search,
		    deleteqc:deleteqc,
		    uploadAvatar:uploadAvatar,
		    saveChangeAvatar:saveChangeAvatar
		};
	
		var quangCaoRef = firebaseDataRef.child('quangCao');
		

		return service;

		function getAll(){
			return $firebaseArray(quangCaoRef);
		}

		function get(id){
			var ref = quangCaoRef.child(id);
			return $firebaseObject(ref);
		}

		function create(quangCao){
			var ts = appUtils.getTimestamp();
			quangCao.timestampCreated = ts;
			quangCao.timestampModified = ts;

		    return quangCaoRef.child(quangCao.id).set(quangCao).then(function(res){
				return {result: true , data: quangCao.id};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

		function update(quangCao){
			var ts = appUtils.getTimestamp();
			quangCao.timestampModified = ts;
			var mId= quangCao.$id;
			var o = cloneWithSpecialKey(quangCao) ;
		    return quangCaoRef.child(mId).update(o).then(function(res){
				return {result: true , data: res};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

		function search(keyword){
			return $firebaseArray(quangCaoRef).$loaded().then(function(data){
                quangCaoRef.onDisconnect();
				var searchFields = ['email','phoneNumber'];
			 

				return $filter('filter')(data, function (item) {
					 
					for(var index in searchFields) {

						var attr = searchFields[index];
						if ((searchMatch(item[attr] + '', keyword) || searchMatch(item.viTri, keyword) || searchMatch(item.duongDan, keyword)) && (!item.isDeleted || item.isDeleted === '')   ){
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

		function deleteqc(obj) {
			var ts = appUtils.getTimestamp();
			var o = cloneWithSpecialKey(obj) ;
			o.isDeleted = true;
			return quangCaoRef.child(obj.$id).update(o).then(function(res){
				return {result: true , data: res};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

		function uploadAvatar(folderPath, file, metadata){
            return storageRef.child(folderPath).put(file, metadata);
		}

		function saveChangeAvatar(id, avartaUrl){
			var ts = appUtils.getTimestamp();
            return quangCaoRef.child(id).update({
				photoURL: avartaUrl,
				timestampModified: ts}).then(function(res){
				return {result: true , data: id};
            }).catch(function(error) {
				console.log(error);
		        return {result: false , errorMsg: error};
		    });
		}
	}

	function ilog(msg) {
		console.log(msg);
	}

	function cloneWithSpecialKey(obj) {
		var string1 = '';
		var newObj = {};
		for (var property1 in obj) {
			if(property1.indexOf('$') < 0 && property1 != 'forEach' && property1 != 'id') {
				newObj[property1] = obj[property1];
			}
		  
		}
		return newObj;

	}
})();