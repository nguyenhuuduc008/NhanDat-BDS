(function () {
	'use strict';

	angular.module("app.bds").factory("lienKetUsersService", lienKetUsersService);
	/** @ngInject **/
	function lienKetUsersService($q, $filter, $firebaseObject, $firebaseArray, firebaseDataRef, appUtils) {
		var rootPath = 'bds-lien-ket-users', items = firebaseDataRef.child(rootPath);
		var lienKetUsersService = {
			get: get,
			items: getAll,
			create: create,
			update: update,
			remove: remove
		};

		return lienKetUsersService;

		function getAll() {
			return $firebaseArray(items);
		}

		function get(bdsId) {
			var ref = items.child(bdsId);
			return $firebaseObject(ref);
		}

		function create(bdsId, add) {
			var ts = appUtils.getTimestamp();
			add.timestampModified = ts;
			add.timestampCreated = ts;
			return items.child(bdsId).update(add).then(function (result) {
				return { result: true, errorMsg: "", key: bdsId };
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

		function remove(id) {
			return items.child(id).remove().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}
	}
})();
