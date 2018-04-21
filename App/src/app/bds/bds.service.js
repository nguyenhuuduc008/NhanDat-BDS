(function () {
	'use strict';

	angular.module('app.bds')
		.factory('bdsService', bdsService);

	/** @ngInject **/
	function bdsService(firebaseDataRef, $firebaseObject, appUtils, $q, storageRef, $firebaseArray, $rootScope, $filter, DataUtils) {
		var service = {
			getAll: getAll,
			get: get,
			create: create,
			update: update,
			deleteItem: deleteItem,
			search: search,
			searchAll: searchAll,
			getLinkToCategory: getLinkToCategory,
			updateLoaiNoiThat: updateLoaiNoiThat,
			getLoaiNoiThat: getLoaiNoiThat,
			checkAddressExist: checkAddressExist,
			getBDS: getBDS,
			updateTab: updateTab,
			getTab: getTab,
			removeTab: removeTab
		};

		var bdsPath = 'bds';
		var bdsRef = firebaseDataRef.child('bds');
		var bdsTabsPath = 'bds/tabs';
		var bdsTabsRef = firebaseDataRef.child(bdsTabsPath);
		var bdsCategoryRef = firebaseDataRef.child('bds-danh-muc');
		var tacNghiepRef = firebaseDataRef.child('bds-tac-nghiep');
		var giamGiaRef = firebaseDataRef.child('bds-giam-gia');
		var yeuToTangGiamGiaRef = firebaseDataRef.child('bds-yeu-to-tang-giam-gia');
		var thuocQuyHoachRef = firebaseDataRef.child('bds-thuoc-quy-hoach');
		var capDoRef = firebaseDataRef.child('bds-cap-do');
		var existedAddressRef = firebaseDataRef.child('bds-existed-address');
		var loaiNoiThatRef = firebaseDataRef.child('bds-loai-noi-that');

		//historyRef
		var bdsHistoryRef = firebaseDataRef.child('history/bds');

		return service;

		function getAll() {
			return $firebaseArray(bdsRef);
		}

		function get(danhMucId, id) {
			var ref = bdsRef.child(danhMucId + '/' + id);
			return $firebaseObject(ref);
		}

		function getBDS(khoKey, key) {
			var refPath = bdsPath + "/" + khoKey + "/" + key;
			return DataUtils.getDataFirebaseLoadOnce(refPath);
		}

		function create(danhMucBDS, obj) {
			var key = bdsRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return bdsRef.child(danhMucBDS).child(key).set(obj).then(function (res) {

				createHistoryAdd(obj);
				createBdsLinkToCategory(key, {
					danhMucId: obj.danhMuc,
					timestampCreated: obj.timestampCreated,
					uid: obj.uid,
					createdBy: obj.createdBy
				});
				var existedAddress = {
					fullAddress: obj.soNha + ' ' + obj.tenDuong + ' ' + obj.thanhPho + ' ' + obj.quanHuyen + ' ' + obj.xaPhuong
				};
				existedAddressRef.child(key).set(existedAddress).then(function (res) {});
				return {
					result: true,
					key: key
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		function checkAddressExist(fullAddress) {
			if ($.trim(fullAddress) === '') {
				return $q.when({
					data: []
				});
			}
			return $firebaseArray(existedAddressRef).$loaded().then(function (data) {
				existedAddressRef.onDisconnect();
				var address = _.filter(data, function (item) {
					return item.fullAddress.toString() === fullAddress.toString() && (item.isDeleted === false || item.isDeleted === '' || item.isDeleted === undefined);
				});
				return {
					data: address
				};
			});
		}

		function deleteItem(bdsId) {
			return getLinkToCategory(bdsId).$loaded().then(function (bdsDanhMucRs) {
				var ts = appUtils.getTimestamp();
				return bdsRef.child(bdsDanhMucRs.danhMucId).child(bdsId).update({
					isDeleted: true,
					timestampModified: ts
				}).then(function (res) {
					deleteLinkToCategory(bdsId);
					// deleteBdsTacNghiep(bdsId);
					existedAddressRef.child(bdsId).update({
						isDeleted: true,
						timestampModified: ts
					}).then(function (res) {});
					return {
						result: true
					};
				}).catch(function (error) {
					return {
						result: false,
						errorMsg: error
					};
				});
			});
		}

		function update(khoId, bdsId, model) {
			var ref = bdsRef.child(khoId + '/' + bdsId);
			var refPath = bdsPath + '/' + khoId;
			var ts = appUtils.getTimestamp();
			model.timestampModified = ts;
			//createHistoryEditThongTin(model);
			console.log('MODEDEL UPDA TA@', model);
			return ref.update(model).then(function () {
				DataUtils.updateTimeStampModifiedNode(refPath);
				return {
					result: true,
					key: bdsId
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		function getLinkToCategory(bdsId) {
			var ref = bdsCategoryRef.child(bdsId);
			return $firebaseObject(ref);
		}

		function createBdsLinkToCategory(bdsId, obj) {
			return bdsCategoryRef.child(bdsId).set(obj).then(function (res) {
				return {
					result: true,
					key: key
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		function deleteLinkToCategory(bdsId) {
			var ts = appUtils.getTimestamp();
			return bdsCategoryRef.child(bdsId).update({
				isDeleted: true,
				timestampModified: ts
			}).then(function (res) {
				return {
					result: true
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		// function updateTab(bdsId, model, tabPath) {
		// 	var ts = appUtils.getTimestamp();
		// 	model.timestampModified = ts;
		// 	return bdsTabsRef.child(tabPath + '/' + bdsId).update(model).then(function(result) {
		// 		return { result: true, key: bdsId };
		// 	}).catch(function (error) {
		// 		return { result: false, errorMsg: error };
		// 	});
		// }

		function updateTab(bdsId, model, tabPath, isLinked) {
			var refPath = bdsTabsPath + "/" + tabPath + "/" + bdsId;
			var ref = bdsTabsRef.child(tabPath + "/" + bdsId),
				key;
			if (isLinked) {
				key = ref.push().key;
				ref = bdsTabsRef.child(tabPath + "/" + bdsId + "/" + key);
				model.bdsKey = bdsId;
			}
			var ts = appUtils.getTimestamp();
			model.timestampModified = ts;

			return ref.update(model).then(function (res) {
				DataUtils.updateTimeStampModifiedNode(refPath);
				return {
					result: true,
					key: bdsId,
					linkedKey: key
				};
			}).catch(function (err) {
				return {
					result: true,
					errMsg: err
				};
			});
		}

		function removeTab(bdsId, tabPath, linkedKey) {
			var refPath = bdsTabsPath + "/" + tabPath + "/" + bdsId;
			var ref = bdsTabsRef.child(tabPath + "/" + bdsId);

			return ref.child(linkedKey).remove().then(function (res) {
				DataUtils.updateTimeStampModifiedNode(refPath);
				return {
					result: true,
					key: linkedKey
				};
			}).catch(function (err) {
				return {
					result: true,
					errMsg: err
				};
			});
		}

		function getTab(bdsId, tabPath) {
			var refPath = bdsTabsPath + "/" + tabPath + "/" + bdsId;
			return DataUtils.getDataFirebaseLoadOnce(refPath);
		}

		function search(danhMucId, keyword) {
			var cateRef = firebaseDataRef.child('bds/' + danhMucId);
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
				deferred.resolve({
					data: result
				}); //on sucess
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
			return $q.all(reqs).then(function (arr) {
				return getDataFromArr(arr);
			});
		}

		function searchMatch(haystack, needle) {
			if (!needle) {
				return true;
			}
			return haystack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
		}

		function updateLoaiNoiThat(bdsId, obj) {
			var key = loaiNoiThatRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return loaiNoiThatRef.child(bdsId).update(obj).then(function (res) {
				return {
					result: true,
					key: key
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		function getLoaiNoiThat(bdsId) {
			//var ref = thuocQuyHoachRef.child(bdsId);
			var ref = loaiNoiThatRef.child(bdsId);
			return $firebaseObject(ref);
		}

		//history
		function getData(model) {
			var newModel = {};
			var x;
			for (x in model) {
				if (x.charAt(0) == '$') {
					continue;
				}
				if (x == 'forEach') {
					continue;
				}
				newModel[x] = model[x];
			}
			return newModel;
		}

		function createHistoryAdd(model) {
			var content = JSON.stringify(model);
			content = content.replace(/,/g, ", ");
			model.content = content;
			model.type = 'Tạo Mới';
			model.timestampCreated = Date.now();
			model.userEmail = model.email;
			var key = bdsHistoryRef.push().key;
			return bdsHistoryRef.child(key).set(model).then(function (res) {
				return {
					result: true,
					key: key
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}

		function createHistoryEditThongTin(model) {
			console.log('model');
			console.log(model);
			var dataModel = getData(model);
			var content = JSON.stringify(dataModel);
			content = content.replace(/,/g, ", ");
			dataModel.content = content;
			dataModel.type = 'Sửa Đổi Thông Tin';
			dataModel.timestampCreated = Date.now();
			dataModel.userEmail = model.email;
			console.log('data model');
			console.log(dataModel);
			var key = bdsHistoryRef.push().key;
			return bdsHistoryRef.child(key).set(dataModel).then(function (res) {
				return {
					result: true,
					key: key
				};
			}).catch(function (error) {
				return {
					result: false,
					errorMsg: error
				};
			});
		}




	}
})();