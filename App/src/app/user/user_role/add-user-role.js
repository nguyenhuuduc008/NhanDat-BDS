(function () {
    'use strict';

    angular.module('app.user')
	.controller('userRoleCtrl', userRoleCtrl);

    /** @ngInject */
    function userRoleCtrl($rootScope, $scope, $state,$ngBootbox, $uibModalInstance,appUtils,permissionService,userService,roleService, user,toaster) {
        var currentUser = $rootScope.storage.currentUser;
        var userRoleVm = this; // jshint ignore:line
        userRoleVm.user = user;
        userRoleVm.userRoles  = user.userRoles;

        //Load Data
        function loadData(){
            appUtils.showLoading();
            roleService.items().$loaded(function(data){
                appUtils.hideLoading();
                userRoleVm.roles = data;
                console.log('roleservice');
                console.log(data);
                _.forEach(userRoleVm.roles, function(obj, key) {
                    if(userRoleVm.userRoles !== undefined && userRoleVm.userRoles.length > 0){
                        var isExisted = $.inArray(obj.$id, userRoleVm.userRoles); 
                        if(isExisted === -1){
                            obj.checked = false;
                        }else{
                            obj.checked = true;
                        }
                    }else{
                        obj.checked = false;
                    }
                    permissionService.getPermissionByRole(obj.$id).then(function(res){
                        obj.permissions = [];
                        if(res.length > 0){
                             _.forEach(res, function(val, key) {
                                obj.permissions.push(val.name);                 
                            });
                            obj.permissionstxt = angular.fromJson(obj.permissions).join(', ');
                        }
                    });                   
                });
            });
        }

        loadData();

        //Functions
        userRoleVm.close = function () {
		    $uibModalInstance.dismiss('cancel');
		};

        userRoleVm.addUserToRole = function(){
            appUtils.showLoading();
            var userRoles = [];
            $('input[name=chk-user-role]').each(function () {
                if (this.checked === true) {
                    userRoles.push(this.value);
                }
            });

            console.log('-----------userRoles');
            console.log(userRoles);
            var roleArrText=[];
            _.forEach(userRoles,function(objRoles,key){
                _.forEach(userRoleVm.roles,function(objRoleVM,key){
                    if(objRoles==objRoleVM.$id){
                        roleArrText.push(objRoleVM.name);
                    }
                });
            });

            userRoleVm.user.userRoles = userRoles;
            console.log('userRoleVm.user inside');
            console.log(userRoleVm.user);
            var req = userService.updateUser(userRoleVm.user,{
                userEmail:userRoleVm.user.email,
                roleArrText:roleArrText
            });
            req.then(function(res){
                if(!res.result){
                    appUtils.hideLoading();
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
                appUtils.hideLoading();
                $uibModalInstance.dismiss('cancel');
                
                //Delete Side Bar Menus List storage
				if(currentUser.$id == userRoleVm.user.$id){
                   delete $rootScope.storage.sidebarMenus;
              	}
                toaster.pop('success','Thành công', "Thêm vai trò người dùng thành công!");
                $scope.$parent.userDetailVm.loadUserDetails();
                
            });
            
        };
    }

})();
