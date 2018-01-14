(function () {
	'use strict';

	angular.module('app.bds')
		.factory('bdsService', bdsService);

	/** @ngInject **/
	function bdsService(firebaseDataRef, $firebaseObject, appUtils, $q, storageRef, $firebaseArray, $rootScope, $filter) {
		var service = {
			getAll: getAll,
			get: get,
			create: create,
			deleteItem: deleteItem,
			search: search,
			searchAll: searchAll
		};

		var bdsRef = firebaseDataRef.child('bds');

		return service;

		function getAll() {
			return $firebaseArray(bdsRef);
		}

		function get(id) {
			var ref = bdsRef.child(id);
			return $firebaseObject(ref);
		}

		function create(danhMucBDS, obj) {
			var key = bdsRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return bdsRef.child(danhMucBDS).child(key).set(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function deleteItem(userKey, transKey) {
			var ts = appUtils.getTimestamp();
			return bdsRef.child(userKey).child(transKey).update({ isDeleted: true, timestampModified: ts }).then(function (res) {
				return { result: true };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function search(cateKey, keyword) {
			var cateRef = firebaseDataRef.child('bds/' + cateKey);
			return $firebaseArray(cateRef).$loaded().then(function (data) {
				cateRef.onDisconnect();
				return $filter('filter')(data, function (item) {
					for (var attr in item) {
						if (searchMatch(item[attr] + '', keyword) && (!item.isDeleted || item.isDeleted === '')) {
							return true;
						}
					}
					return false;
				});
			});
		}
		
        function getDataFromArr(arr) {
            var deferred = $q.defer();
            try {
                var result = [];
                _.forEach(arr, function (rs) {
                    _.forEach(rs, function (item) {
                        result.push(item);
                    });
                });
                // asynchronous function, which calls
                deferred.resolve({ data: result }); //on sucess
            } catch (e) {
                deferred.reject(e);
            }

            return deferred.promise;
        }

		function searchAll(allCates, keyword) {
			var reqs = [];
			_.forEach(allCates, function (cate) {
				var itemReq = search(cate.value, keyword);
				reqs.push(itemReq);
			});
			// Array of Promises
			return $q.all(reqs).then(function(arr){
				return getDataFromArr(arr);
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