(function() {
	'use strict';

	angular.module('app.user')
	.factory('userService' ,userService);

	/** @ngInject **/
	function userService(firebaseDataRef, $firebaseObject, appUtils, $q, storageRef, $firebaseArray, $rootScope,$filter){
		var service = {
			getAll: getAll,
			get: get,
			getUserByEmail : getUserByEmail,
			createUser: create,
            updateUser: update,
            deleteUser: deleteUser,
            restoreUser : restoreUser,
            checkPhoneExist : checkPhoneExist,
            unAuthorizedUser: unAuthorizedUser,
            authorizedUser: authorizedUser,
            addUserToRole: addUserToRole,
            search: search,
            checkUserIsDeleted: checkUserIsDeleted,
			insertState : insertState,
			uploadAvatar: uploadAvatar,
			saveChangeAvatar: saveChangeAvatar,
			checkEmailExist: checkEmailExist,
			userChangeStateHistory:userChangeStateHistory,
			resetPasswordHistory:resetPasswordHistory,
			getExitedPhone:getExitedPhone,
			setPhone:setPhone
		};
		var currentUser = $rootScope.storage.currentUser.email;
		var userRef = firebaseDataRef.child('users');
		var exitedUserRef = firebaseDataRef.child('existed-users');
		var existedUserPhoneRef=firebaseDataRef.child('existed-phone');
		//historyRef
		var userHistoryRef=firebaseDataRef.child('history/user');

		return service;

		function getAll(){
			return $firebaseArray(userRef);
		}

		function get(id){
			var ref = userRef.child(id);
			return $firebaseObject(ref);
		}

		function getExitedPhone(phoneNumber){
			return $firebaseObject(existedUserPhoneRef.child(phoneNumber)).$loaded().then(function(res){
				return {result:true,data:res};
			})
			.catch(function(err){
				return {result:false,errorMsg:err};
			});
		}
		function setPhone(dataModel){
			console.log('dataModel');
			console.log(dataModel);
			var key=dataModel.phone;

			return existedUserPhoneRef.child(key).set(dataModel).then(function(res){
				return {result: true , data: key};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });

		}
		
		function getUserByEmail(email){
			return $firebaseArray(userRef).$loaded().then(function(data){
                userRef.onDisconnect();
				var user =  _.find(data, {email: email});
				if(user && (!user.isDeleted || user.isDeleted === '')){
					return user;
				}
				return null;
			});	
		}

		function create(user,uid){
			var ts = appUtils.getTimestamp();
			user.timestampModified = ts;
			user.timestampCreated = ts;
			userAddHistory(user);
            return userRef.child(uid).set(user).then(function(res){
				var existedUser = {
					email: user.email
				};
				exitedUserRef.child(uid).set(existedUser).then(function(res){});
				return {result: true , data: uid};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

        function update(user,dataParams){
			var ts = appUtils.getTimestamp(),
			key = user.$id;
			user.timestampModified = ts;
			if(!dataParams){
				userEditHistory(user);
			}else{
				userChangeRoleDetailHistory(dataParams);
			}
			
            return userRef.child(key).update({
				isAuthorized: user.isAuthorized, 
				userName: user.userName,
				firstName: user.firstName,
				lastName: user.lastName,
				userRoles: user.userRoles || {},
				phoneNumber: user.phoneNumber,
				address: user.address,
				city: user.city,
				district: user.district || '',
				ward: user.ward || '',
				zipCode: user.zipCode,
				timestampModified: ts,
				loaiUser:user.loaiUser||''
			}).then(function(res){
				return {result: true , data: key};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

        function deleteUser(uid){
			var ts = appUtils.getTimestamp();
            return userRef.child(uid).update({isDeleted: true, timestampModified: ts}).then(function(res){
				var existedUser = {
					email: user.email
				};
				exitedUserRef.child(uid).update({isDeleted: true, timestampModified: ts}).then(function(res){});
                return {result: true};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

        function restoreUser(uid){
			var ts = appUtils.getTimestamp();
            return userRef.child(uid).update({isDeleted: false, timestampModified: ts}).then(function(res){
                return {result: true};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

        function checkPhoneExist(phone){
			if($.trim(phone) ===''){
				return $q.when({data: []});
			}
            return $firebaseArray(userRef).$loaded().then(function(data){
                userRef.onDisconnect();
                var user = _.filter(data, function(item) { 
                    return item.phoneNumber === phone && (item.isDeleted === false || item.isDeleted === '' || item.isDeleted === undefined);
                });
			    return {data: user};
            });
		}
		
        function checkEmailExist(email){
			if($.trim(email) ===''){
				return $q.when({data: []});
			}
            return $firebaseArray(exitedUserRef).$loaded().then(function(data){
                userRef.onDisconnect();
                var user = _.filter(data, function(item) { 
                    return item.email === email && (item.isDeleted === false || item.isDeleted === '' || item.isDeleted === undefined);
                });
			    return {data: user};
            });
		}

        function unAuthorizedUser(uid){
			var ts = appUtils.getTimestamp();
            return userRef.child(uid).update({isAuthorized: false, timestampModified: ts}).then(function(res){	
                return {result: true};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

        function authorizedUser(uid){
			var ts = appUtils.getTimestamp();
            return userRef.child(uid).update({isAuthorized: true, timestampModified: ts}).then(function(res){
                return {result: true};
            }).catch(function(error) {
		        return {result: false , errorMsg: error};
		    });
		}

		function addUserToRole(userIds, roleName,roleText){
            _.forEach(userIds, function(uid){
                var ref = userRef.child(uid);
			    $firebaseObject(ref).$loaded().then(function(res){
                    ref.onDisconnect();
 					if(res){
						//history
						userChangeRoleListingHistory(res.email,roleText);


 						if(res.userRoles !== undefined && res.userRoles.length > 0){
 							var isExistRole = $.inArray(roleName,res.userRoles); 
	 						if(isExistRole === -1){
	 							res.userRoles.push(roleName);
	 							res.$save();
	 						}  	
 						}else{
 							res.userRoles = [];
 							res.userRoles.push(roleName);
	 						res.$save();
 						}	
 						
 					}
 				});
            });
		 }

		 function search(keyword, isAdmin){
			return $firebaseArray(userRef).$loaded().then(function(data){
                userRef.onDisconnect();
				var searchFields = ['email','phoneNumber'];
				return $filter('filter')(data, function (item) {
					for(var index in searchFields) {
						var attr = searchFields[index];
						if ((searchMatch(item[attr] + '', keyword) || searchMatch(item.firstName + ' ' + item.lastName, keyword)) && (!item.isDeleted || item.isDeleted === '') && (isAdmin && item.userRoles ? item.userRoles.indexOf('-KTlccaZaxPCGDaFPSc5') !== -1 : true)){
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

		 function checkUserIsDeleted(email){
			return $firebaseArray(userRef).$loaded().then(function(data){
                userRef.onDisconnect();
				var user =  _.find(data, {email: email});
				if(user && user.isDeleted){
					return user;
				}
				return null;
			});			
		 }

		function uploadAvatar(folderPath, file, metadata){
            return storageRef.child(folderPath + file.name).put(file, metadata);
		}

		function saveChangeAvatar(id, avartaUrl){
			var ts = appUtils.getTimestamp();
            return userRef.child(id).update({
				photoURL: avartaUrl,
				timestampModified: ts}).then(function(res){
				return {result: true , data: key};
            }).catch(function(error) {
				console.log(error);
		        return {result: false , errorMsg: error};
		    });
		}

		 function insertState(){
			 var lst = appUtils.getAllState();
			 var reqs = [];
			 var stateRef = firebaseDataRef.child('countries');
			var obj = {
				code: 231,
				name: 'United States',
				iso: 'US'
			};

			 reqs.push(stateRef.child('231').set(obj));

			 return $q.all(reqs);
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
		  function userAddHistory(dataInput){

			var content=JSON.stringify(dataInput).replace(/,/g, ", ");
			 var dataModel={
				 createdBy:currentUser,
				 content:content,
				 timestampCreated:Date.now(),
				 type:'Thêm Mới User',
				 userEmail:dataInput.email
			 };
			 var key=userHistoryRef.push().key;
			 return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }
		  function userEditHistory(model){
			var dataInput=getData(model);
			
			var content=JSON.stringify(dataInput).replace(/,/g, ", ");
			var dataModel={
				 createdBy:currentUser,
				 content:content,
				 timestampCreated:Date.now(),
				 type:'Sửa Thông Tin User',
				 userEmail:dataInput.email
			};
			var key=userHistoryRef.push().key;
			return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }
		  function userChangeStateHistory(userEmail,type){
			var dataModel={};
			dataModel.timestampCreated=Date.now();
			dataModel.createdBy=currentUser;
			dataModel.type=type;
			dataModel.content='';
			dataModel.userEmail=userEmail;
			var key=userHistoryRef.push().key;
			return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }
		  function userChangeRoleListingHistory(userEmail,roleText){
			var dataModel={
				timestampCreated:Date.now(),
				createdBy:currentUser,
				type:'Cấp Quyền: '+ roleText,
				content:'',
				userEmail:userEmail
			};
			var key=userHistoryRef.push().key;
			return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }
		  function userChangeRoleDetailHistory(dataParams){
			var text='';
			if(dataParams.roleArrText){
				text='Cấp Quyền: '+ dataParams.roleArrText.join();
			}else{
				text='Xóa Quyền: '+ dataParams.lstRolesDelete.join();
			}
			var dataModel={
				timestampCreated:Date.now(),
				createdBy:currentUser,
				type:text,
				content:'',
				userEmail:dataParams.userEmail
			};
			var key=userHistoryRef.push().key;
			return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }
		  function resetPasswordHistory(email){
			var dataModel={
				timestampCreated:Date.now(),
				createdBy:currentUser,
				type:'Resset Pawword',
				content:'Gửi yêu cầu reset password',
				userEmail:email
			};
			var key=userHistoryRef.push().key;
			return userHistoryRef.child(key).set(dataModel).then(function (res) {
				return { result: true, key: key };
			}).catch(function (error) {
				return { result: false, errorMsg: error };
			});
		  }

	}
})();