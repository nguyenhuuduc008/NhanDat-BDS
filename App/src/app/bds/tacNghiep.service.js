(function () {
	'use strict';

	angular.module("app.bds").factory("tacNghiepService", tacNghiepService);
	/** @ngInject **/
	function tacNghiepService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils) {
		var rootPath = 'tac-nghiep', items = firebaseDataRef.child(rootPath);
		var tacNghiepService = {
			get: get,
			items: getAll,
			create: create,
			update: update,
			remove: remove,
			search: search
		};

		return tacNghiepService;

		function getAll() {
			return $firebaseArray(items);
		}

		function get(bdsId, id) {
			var ref = items.child(bdsId + '/' + id);
			return $firebaseObject(ref);
		}

		function create(bdsId, add) {
			var ts = appUtils.getTimestamp(), key = items.push().key;
			add.timestampModified = ts;
			add.timestampCreated = ts;
			return items.child(bdsId).child(key).update(add).then(function (result) {
				return { result: true, errorMsg: "", key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function update(update) {
			var ts = appUtils.getTimestamp();
			update.timestampModified = ts;
			return update.$save().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function remove(bdsId, id) {
			var searchRef = items.child(bdsId);
			return searchRef.child(id).remove().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function search(bdsId, keyword) {
			var searchRef = items.child(bdsId);
			return $firebaseArray(searchRef).$loaded().then(function (data) {
				return $filter('filter')(data, function (item) {
					for (var attr in item) {
						if (searchMatch(item[attr] + '', keyword)) {
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
