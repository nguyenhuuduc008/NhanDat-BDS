(function(){
	'use strict';
  
	angular.module("app.bds").factory("bdsViTriService", bdsViTriService);
	/** @ngInject **/
	  function bdsViTriService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils){
		var rootPath = 'bds-vi-tri' , items = firebaseDataRef.child(rootPath);
		var bdsViTriService = {
		  get: get,
		  items: getAll,
		  create : create,
		  update : update,
		  remove : remove
		};
  
		return bdsViTriService;
  
		function getAll(){
		  return $firebaseArray(items);
		}
  
		function get(id){
		  var ref = items.child(id);
		  return $firebaseObject(ref);
		}
  
		function create(bdsId, add){
		  var ts = appUtils.getTimestamp();
		  add.timestampModified = ts;
		  add.timestampCreated = ts;
		  return items.child(bdsId).update(add).then(function(result) {
				return {result: true , errorMsg: "", key: key};
			  }).catch(function(error) {
				return {result: false , errorMsg: error};
			});
		}
  
		function update(update){
		  var ts = appUtils.getTimestamp();
		  update.timestampModified = ts;
		  return update.$save().then(function(){
			return {result: true , errorMsg: ""};
		  }).catch(function(error) {
			return {result: false , errorMsg: error};
		  });
		}
  
		function remove(id){
		  return items.child(id).remove().then(function(){
			return {result: true , errorMsg: ""};
		  }).catch(function(error) {
			return {result: false , errorMsg: error};
		  });
		}
	}
  })();
  