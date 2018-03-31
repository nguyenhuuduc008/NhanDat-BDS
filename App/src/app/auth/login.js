(function() {
	'use strict';

	angular
		.module('app.auth')
		.controller("LoginCtrl", LoginCtrl)
		.controller("ForgotPasswordCtrl", ForgotPasswordCtrl);

	/** @ngInject */
	function LoginCtrl($rootScope, $scope, $state,$firebaseObject,$uibModal,$timeout,firebaseDataRef,$firebaseArray, authService, currentAuth, toaster ,appUtils, APP_CONFIG, md5, $http, appSettingService){
		$rootScope.settings.layout.showSmartphone = false;
		
		var loginVm = this;
		if(!loginVm.currentAuth){
			$state.go('login');
		}

		$scope.sidebarMenus = [];
		$scope.errMessage = '';
        $scope.loading = false;
		loginVm.emailRegx = /^[^!'"\/ ]+$/;
		loginVm.showInvalid = false;
		loginVm.userName = '';
		loginVm.password = '';
		$rootScope.settings.layout.showPageHead = false;
		$rootScope.settings.layout.showSideBar = false;
		$rootScope.settings.layout.showHeader = false;
		$rootScope.settings.layout.showSmartphone = false;
		$rootScope.settings.layout.showFooter = false;

		loginVm.login = function (form) {
		    $scope.showError = false;
		    loginVm.showInvalid = true;
		 	if(form.$invalid){
				return;
		 	}
            
            $scope.loading = true;
            firebaseAuth(loginVm);
		};

        loginVm.googleLogin = function(){
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
            provider.setCustomParameters({
                'login_hint': 'user@example.com'
            });

            return authService.signUpWithPopup(provider).then(function(data){
                if(data.result){
                    CheckNSetStorageData(data.uid);
                }else{
                    appUtils.hideLoading();
                    $scope.showError = true;
                    $scope.errMessage = data.errorMessage;
                    authService.logout();
                }
            });
           
        };

        loginVm.facebookLogin = function(){
            var provider = new firebase.auth.FacebookAuthProvider();
            provider.addScope('user_birthday');
            provider.setCustomParameters({
                'display': 'popup'
            });
            return authService.signUpWithPopup(provider).then(function(data){
                if(data.result){
                    CheckNSetStorageData(data.uid);
                }else{
                    appUtils.hideLoading();
                    $scope.showError = true;
                    $scope.errMessage = data.errorMessage;
                    authService.logout();
                }
            });
        };

        loginVm.phoneLogin = function(){
            window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                'size': 'normal',
                'callback': function(response) {
                var phoneNumber = getPhoneNumberFromUserInput();
                var appVerifier = window.recaptchaVerifier;
                firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier)
                .then(function (confirmationResult) {
                // SMS sent. Prompt user to type the code from the message, then sign the
                // user in with confirmationResult.confirm(code).
                window.confirmationResult = confirmationResult;
                }).catch(function (error) {
                // Error; SMS not sent
                // ...
                });
                },
                'expired-callback': function() {
                    // Response expired. Ask user to solve reCAPTCHA again.
                    // ...
                }
            });
        };

        function firebaseAuth ( loginVm ) {
            //Delete cache of current user
            delete $rootScope.storage.currentUser;
            appUtils.showLoading();
            authService.login(loginVm).then(function(result) {
                if (result) {
                    CheckNSetStorageData(result.uid);
                }
                $scope.loading = false;
            }).catch(function(error) {
                $scope.loading = false;
                appUtils.hideLoading();
                $scope.showError = true;
                // $scope.errMessage = error.message;
                $scope.errMessage = "Mật khẩu bạn nhập chưa chính xác!";
            });
        }

        function CheckNSetStorageData(uid){
            authService.getUserInfo(uid).then(function(user){
                var roles = firebaseDataRef.child('roles');
                var appOptions = firebaseDataRef.child('app-options');
                var permissions = firebaseDataRef.child('permissions');
                var lstRoles = [];
                var lstPermissions = [];
                if(user && user.isDeleted){
                    $scope.$apply(function(){
                        $scope.showError = true;
                        $scope.errMessage = "Người dùng này có thể đã bị xóa.";
                    });
                    appUtils.hideLoading();
                    authService.deleteAuthUser(uid);
                }else if(user && (user.isAuthorized && user.isAuthorized === true)){
                    if(!user.userRoles || user.userRoles.length <= 0){
                        $scope.$apply(function(){
                            appUtils.hideLoading();
                            $scope.showError = true;
                            $scope.errMessage = "Không có quyền truy cập!";
                            authService.logout();
                        });
                    }else{
                        var userRoleIds = user.userRoles;
                        //Get all states
                        var allState = $state.get();
                        // $firebaseArray(roles).$loaded().then(function(data){
                        //     lstRoles = data;
                        //     var backendAccessVal = 'Backend Access';
                        //     var backendAccessRole =  _.find(lstRoles, {name: backendAccessVal});
                        //     // console.log(backendAccessRole);
                        //     if(backendAccessRole){
                        user.$id = uid;
                        $rootScope.storage.currentUser = user;
                        appSettingService.getSettings().then(function(optionRs){
                            $rootScope.storage.appSettings = optionRs;
                        });
                        // old code will be removed
                        // $firebaseObject(appOptions).$loaded().then(function(optionRs){
                        //     $rootScope.storage.appSettings = optionRs;
                        // });

                        // $state.go('index');
                        var dashboardUrl = '/#/bds/list';
                        // if(window.location.href.indexOf('admin') !== -1){
                        //     dashboardUrl = '/admin/#/home';
                        // }
                        window.location.href = dashboardUrl;
                        $rootScope.settings.layout.showPageHead = false;
                        $rootScope.settings.layout.showSideBar = true;
                        $rootScope.settings.layout.showHeader = true;
                        $rootScope.settings.layout.showSmartphone = true;
                            // }
                        // });
                    }
                }else{
                    $scope.$apply(function(){
                        appUtils.hideLoading();
                        $scope.showError = true;
                        $scope.errMessage = "Tên đăng nhập hoặc mật khẩu chưa chính xác!";
                        authService.logout();
                    });
                }   
            }).catch(function(error) {
                appUtils.hideLoading();
                $scope.showError = true;
                console.log(error.code);
                //$scope.errMessage = error.message;
                authService.logout();
            });
        }

		loginVm.openResetPassPopup = function(){
			 var modalInstance = $uibModal.open({
				templateUrl: 'app/auth/forgotpasword.tpl.html',
				controller: 'ForgotPasswordCtrl',
                size: 'md',
                windowClass : 'model-z-index',
				resolve:{
					"currentAuth": ["authService", function(authService) {
				        return authService.waitForSignIn();
				     }]
				}
			});
		};

        function setUserSidebarMenu(permissionVal, allState, userRole){
            _.find(permissionVal.roles, function(o) { 
                if(o == userRole.$id){
                    _.find(allState, function(o) { 
                        if(o.data){
                            var menuRs = o.data.pageTitle == permissionVal.name; 
                            if(menuRs){
                                var subMenus = [];
                                var subCurrentStateTmp = false;
                                //Set sub menus
                                _.find(allState, function(sub) { 
                                    if(sub.data){
                                        var subRs = sub.data.parent  == o.name;
                                        if(subRs){
                                            var subCurrentState = $state.is(sub.name);
                                            if(subCurrentState){
                                                subCurrentStateTmp = true;
                                            }
                                            var itemMenu = {
                                                                name: sub.data.pageTitle,
                                                                state: sub.name,
                                                                url: sub.url,
                                                                index: sub.data.index,
                                                                currentState: subCurrentState
                                                            };
                                            subMenus.push(itemMenu);
                                        }
                                    }
                                });
                                subMenus = _.sortBy(subMenus, [function(o) { return o.index; }]);
                                var currentState = $state.is(o.name) || subCurrentStateTmp;
                                var menu = {
                                    name: o.data.pageTitle,
                                    icon: o.data.icon,
                                    state: o.name,
                                    url: o.url,
                                    subs: subMenus,
                                    index: o.data.index,
                                    currentState: currentState
                                };
                                $scope.sidebarMenus.push(menu);
                                return true;
                            }
                            return false;
                        }
                    });
                    return true;
                }
            });
        }
	}
    /** @ngInject */
	function ForgotPasswordCtrl($rootScope, $scope, $state, $uibModalInstance,authService,toaster) {
		$scope.email = '';
		$scope.showInvalid = false;
		$scope.errMessage = '';
		$scope.emailRegx = /^[^!'"\/ ]+$/;
        $scope.close = function () {
		    $uibModalInstance.dismiss('cancel');
		};

		$scope.resetPassword = function(form){
			$scope.showInvalid = true;
			$scope.showError = false;
			if(form.$invalid){
				return;
			}
			authService.resetPasswordAuth($scope.email).then(function(){
				$uibModalInstance.dismiss('cancel');
				toaster.success("Yêu cầu lấy lại mật khẩu thành công!");
			}, function(error) {
                $scope.showError = true;
               //handle error message to vietnamese language
                $scope.errMessage = handleError(error);
			});
        };
        
        function handleError(error){  
            console.log(error.message);          
            if(typeof($scope.errors[error.code]) !== 'undefined'){
                return $scope.errors[error.code];
            }
            else {
                return error.message;
            }
        }
    }
})();
