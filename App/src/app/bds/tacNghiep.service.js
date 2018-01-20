(function () {
	'use strict';

	angular.module("app.bds").factory("tacNghiepService", tacNghiepService);
	/** @ngInject **/
	function tacNghiepService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils) {
		var rootPath = 'bds-tac-nghiep', tacNghiepRef = firebaseDataRef.child(rootPath);
		var tacNghiepService = {
			get: get,
			getAll: getAll,
			create: create,
			update: update,
			deleteItem: deleteItem,
			search: search
		};

		return tacNghiepService;

		function getAll() {
			return $firebaseArray(tacNghiepRef);
		}

		function get(bdsId, id) {
			var ref = tacNghiepRef.child(bdsId + '/' + id);
			return $firebaseObject(ref);
		}

		function create(bdsId, add) {
			var key = tacNghiepRef.push().key;
			var ts = appUtils.getTimestamp();
			add.timestampModified = ts;
			add.timestampCreated = ts;
			return tacNghiepRef.child(bdsId).child(key).update(add).then(function (result) {
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
		
		function deleteItem(id) {
			var ts = appUtils.getTimestamp();
			return tacNghiepRef.child(id).update({ isDeleted: true, timestampModified: ts }).then(function (res) {
				return { result: true };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function remove(id) {
			var searchRef = tacNghiepRef.child(bdsId);
			return searchRef.child(id).remove().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function search(bdsId, keyword) {
			var searchRef = tacNghiepRef.child(bdsId);
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
