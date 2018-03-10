(function () {
	'use strict';

	angular
		.module('app.auth').factory("authService", authService);
		/** @ngInject */
		function authService($rootScope, $firebaseAuth, $q, firebaseDataRef, $http, APP_CONFIG, appUtils) {
			var auth = $firebaseAuth();

			var service = {
				auth: auth,
				login: login,
				signUpWithPopup: signUpWithPopup,
				logout: logout,
				sendWelcomeEmail: sendWelcomeEmail,
				waitForSignIn: waitForSignIn,
				requireSignIn: requireSignIn,
				createUserWithEmail: createUserWithEmail,
				deleteAuthUser: deleteAuthUser,
				changePasswordAuth: changePasswordAuth,
				resetPasswordAuth: resetPasswordAuth,
				getCurrentUser: getCurrentUser,
				checkUserIsExisted: checkUserIsExisted,
				createFBUser: createFBUser,
				createMemShipEmployee: createMemShipEmployee,
				getUserInfo : getUserInfo
			};

			return service;

			function login(user) {
				return auth.$signInWithEmailAndPassword(user.userName, user.password);
			}

			function logout() {
				return auth.$signOut();
			}

			function getCurrentUser() {
				var currentUser = $rootScope.storage.currentUser;
				if(currentUser === undefined || currentUser === null){
					currentUser = auth.$getAuth();
					if(currentUser !== undefined && currentUser !== null){
						currentUser.$id = currentUser.uid;
						currentUser.userRoles = currentUser.userRoles || [];		
					}
				}
				return currentUser;
			}

			function sendWelcomeEmail(email) {
				auth.emails.push({
					emailAddress: email
				});
			}

			function waitForSignIn() {
				return auth.$waitForSignIn();
			}

			function requireSignIn() {
				return auth.$requireSignIn();
			}

			function createUserWithEmail(user) {
				return auth.$createUserWithEmailAndPassword(user.email, user.password).then(function (result) {
					return $q.when({ result: true, errorMsg: '', errorCode: '', uid: result.uid });
				}).catch(function (error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					return $q.when({ result: false, errorMsg: errorMessage, errorCode: errorCode, uid: '' });
				});
			}

			function signUpWithPopup(provider){
				return firebase.auth().signInWithPopup(provider).then(function(result) {
					var user = result.user;
					return createFBUser(user.uid, user).then(function(rs){
						return {result : rs, uid: user.uid};
					});
				}).catch(function(error) {
					var errorMessage = error.message;
					return {result : false, errorMessage: errorMessage};	
				});	
			}

			function deleteAuthUser(uid) {
				var reqs = [];
				reqs.push(firebaseDataRef.child('users/' + uid).remove());
				return $q.all(reqs).then(function(res){
					return auth.$deleteUser();
				});
			}

			function changePasswordAuth(newPass) {
				return auth.$updatePassword(newPass);
			}

			function resetPasswordAuth(email) {
				return auth.$sendPasswordResetEmail(email);
			}

			function checkUserIsExisted(employeeId) {
				return firebaseDataRef.child('membership-employee/' + employeeId).once("value");
			}

			function createMemShipEmployee(employeeId, email) {
				var memShipRef = firebaseDataRef.child('membership-employee');
				memShipRef.child(employeeId).child('email').set(email);
			}

			function getUserInfo(uid){
				return firebaseDataRef.child('users/' + uid).once( "value" ).then(function(res){
					return res.val();
				}).catch(function (error) {
					var errorCode = error.code;
					var errorMessage = error.message;
					return errorMessage;
				});
			}

			function createFBUser(authId, user) {
				return getUserInfo(authId).then(function(rs){
					console.log('getUserInfo');
					console.log(rs);
					if(rs === null){
						var fbUser = {
							address: '',
							city: '',
							email: user.email,
							displayName: user.displayName || '',
							firstName: '',
							isAuthorized: true,
							isDeleted: false,
							lastName: '',
							primaryPhone: '',
							photoURL: user.photoURL || '',
							state: '',
							zipCode: '',
							userRoles: ['-L1RFG7CNHThFmm5jHk2'],
						};

						if(fbUser.displayName && _.trim(fbUser.displayName) !== ''){
							var regx = new RegExp(' ');
							var arr = fbUser.displayName.split(regx);
							console.log(arr);
							if(arr && arr.length > 0){
								fbUser.firstName = arr[0] || '',
								fbUser.lastName = arr[1] || ''
							}
						}
						console.log('getUserInfo');
						console.log(fbUser);
						return create(fbUser, authId);
					}else{
						return true;
					}
				});

			}

			function create(user,uid){
				var ts = appUtils.getTimestamp();
				user.timestampModified = ts;
				user.timestampCreated = ts;
				userAddHistory(user);
				return firebaseDataRef.child('users').child(uid).set(user).then(function(res){
					var existedUser = {
						email: user.email
					};
					firebaseDataRef.child('existed-users').child(uid).set(existedUser).then(function(res){});
					return {result: true , data: uid};
				}).catch(function(error) {
					return {result: false , errorMsg: error};
				});
			}

			function userAddHistory(dataInput){
				var content=JSON.stringify(dataInput).replace(/,/g, ", ");
				var dataModel={
						createdBy: dataInput.email,
						content:content,
						timestampCreated:Date.now(),
						type:'Thêm Mới User',
						userEmail:dataInput.email
					};
					var key = firebaseDataRef.child('history/user').push().key;
					return firebaseDataRef.child('history/user').child(key).set(dataModel).then(function (res) {
					return { result: true, key: key };
				}).catch(function (error) {
					return { result: false, errorMsg: error };
				});
			}
			
		}
})();
