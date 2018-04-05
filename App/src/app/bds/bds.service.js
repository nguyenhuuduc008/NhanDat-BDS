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
			updateGiamGia: updateGiamGia,
			getGiamGia: getGiamGia,
			getYeuToTangGiamGia: getYeuToTangGiamGia,
			updateYeuToTangGiamGia: updateYeuToTangGiamGia,
			updateThuocQuyHoach: updateThuocQuyHoach,
			getThuocQuyHoach: getThuocQuyHoach,
			updateCapDo: updateCapDo,
			getCapDo: getCapDo,
			checkAddressExist: checkAddressExist,
			getBDS: getBDS
		};

		var bdsPath = 'bds';
		var bdsRef = firebaseDataRef.child('bds');
		var bdsCategoryRef = firebaseDataRef.child('bds-danh-muc');
		var tacNghiepRef = firebaseDataRef.child('bds-tac-nghiep');
		var giamGiaRef = firebaseDataRef.child('bds-giam-gia');
		var yeuToTangGiamGiaRef = firebaseDataRef.child('bds-yeu-to-tang-giam-gia');
		var thuocQuyHoachRef = firebaseDataRef.child('bds-thuoc-quy-hoach');
		var capDoRef = firebaseDataRef.child('bds-cap-do');
		var existedAddressRef = firebaseDataRef.child('bds-existed-address');

		//historyRef
		var bdsHistoryRef=firebaseDataRef.child('history/bds');

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
				existedAddressRef.child(key).set(existedAddress).then(function(res){});
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}
		
        function checkAddressExist(fullAddress){
			if($.trim(fullAddress) ===''){
				return $q.when({data: []});
			}
            return $firebaseArray(existedAddressRef).$loaded().then(function(data){
				existedAddressRef.onDisconnect();
                var address = _.filter(data, function(item) { 
                    return item.fullAddress.toString() === fullAddress.toString() && (item.isDeleted === false || item.isDeleted === '' || item.isDeleted === undefined);
                });
			    return {data: address};
            });
		}

		function deleteItem(bdsId) {
			return getLinkToCategory(bdsId).$loaded().then(function(bdsDanhMucRs){
				var ts = appUtils.getTimestamp();
				return bdsRef.child(bdsDanhMucRs.danhMucId).child(bdsId).update({ isDeleted: true, timestampModified: ts }).then(function (res) {
					deleteLinkToCategory(bdsId);
					// deleteBdsTacNghiep(bdsId);
					existedAddressRef.child(bdsId).update({isDeleted: true, timestampModified: ts}).then(function(res){});
					return { result: true };
				}).catch(function (error) {
					return { result: false, errorMsg: error };
				});
			});
		}
		
		function update(update) {
			var ts = appUtils.getTimestamp();
			update.timestampModified = ts;
			console.log('update');
			console.log(update);
			createHistoryEditThongTin(update);
			return update.$save().then(function () {
				return { result: true, errorMsg: "" };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function getLinkToCategory(bdsId) {
			var ref = bdsCategoryRef.child(bdsId);
			return $firebaseObject(ref);
		}

		function createBdsLinkToCategory(bdsId, obj){
			return bdsCategoryRef.child(bdsId).set(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}
		
		function deleteLinkToCategory(bdsId) {
			var ts = appUtils.getTimestamp();
			return bdsCategoryRef.child(bdsId).update({ isDeleted: true, timestampModified: ts }).then(function (res) {
				return { result: true };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function deleteBdsTacNghiep(bdsId) {
			var ts = appUtils.getTimestamp();
			return tacNghiepRef.child(bdsId).update({ isDeleted: true, timestampModified: ts }).then(function (res) {
				return { result: true };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
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
		
		function updateGiamGia(bdsId, obj) {
			var key = giamGiaRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return giamGiaRef.child(bdsId).update(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function getGiamGia(bdsId) {
			var ref = giamGiaRef.child(bdsId);
			return $firebaseObject(ref);
		}
		
		function updateYeuToTangGiamGia(bdsId, obj) {
			var key = yeuToTangGiamGiaRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return yeuToTangGiamGiaRef.child(bdsId).update(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function getYeuToTangGiamGia(bdsId) {
			var ref = yeuToTangGiamGiaRef.child(bdsId);
			return $firebaseObject(ref);
		}
		
		function updateThuocQuyHoach(bdsId, obj) {
			var key = thuocQuyHoachRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return thuocQuyHoachRef.child(bdsId).update(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function getThuocQuyHoach(bdsId) {
			var ref = thuocQuyHoachRef.child(bdsId);
			return $firebaseObject(ref);
		}
		
		function updateCapDo(bdsId, obj) {
			var key = capDoRef.push().key;
			var ts = appUtils.getTimestamp();
			obj.timestampModified = ts;
			obj.timestampCreated = ts;
			return capDoRef.child(bdsId).update(obj).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}

		function getCapDo(bdsId) {
			var ref = capDoRef.child(bdsId);
			return $firebaseObject(ref);
		}
		//history
		function getData(model){
			var newModel={};
			var x;
			for(x in model){
				if(x.charAt(0)=='$'){
					continue;
				}
				if(x=='forEach'){
					continue;
				}
				newModel[x]=model[x];
			}
			return newModel;
		}
		function createHistoryAdd(model){
			var content=JSON.stringify(model);
			content=content.replace(/,/g, ", ");
			model.content=content;
			model.type='Tạo Mới';
			model.timestampCreated=Date.now();
			model.userEmail=model.email;
			var key=bdsHistoryRef.push().key;
			return bdsHistoryRef.child(key).set(model).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}
		
		function createHistoryEditThongTin(model){
			console.log('model');
			console.log(model);
			var dataModel=getData(model);
			var content=JSON.stringify(dataModel);
			content=content.replace(/,/g, ", ");
			dataModel.content=content;
			dataModel.type='Sửa Đổi Thông Tin';
			dataModel.timestampCreated=Date.now();
			dataModel.userEmail=model.email;
			console.log('data model');
			console.log(dataModel);
			var key=bdsHistoryRef.push().key;
			return bdsHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		}




	}
})();