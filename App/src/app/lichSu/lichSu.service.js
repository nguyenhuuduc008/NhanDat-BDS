(function () {
	'use strict';

	angular.module('app.lichSu')
		.factory('lichSuService', lichSuService);

	/** @ngInject **/
	function lichSuService(firebaseDataRef, $firebaseObject, appUtils, $q, storageRef, $firebaseArray, $rootScope, $filter) {
		var service = {
			getBDSHistory:getBDSHistory,
			getUserHistory:getUserHistory
		};

		//ref
		var bdsHistoryRef=firebaseDataRef.child('history/bds');
		var userHistoryRef=firebaseDataRef.child('history/user');
		return service;
		function getBDSHistory(){
			return $firebaseArray(bdsHistoryRef);
		}
		function getUserHistory(){
			return $firebaseArray(userHistoryRef);
		}
	}
})();