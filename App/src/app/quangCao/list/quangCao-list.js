  (function () {
    'use strict';
 
    
    angular.module('app.quangCao').controller('quangCaoListCtrl', quangCaoListCtrl);

    /** @ngInject */
    function quangCaoListCtrl($rootScope,$q, $scope, $state,$timeout,$ngBootbox,appUtils,toaster, currentAuth, authService, quangCaoService, roleService,permissionService, $http) {
            
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var currentQuangCao = $rootScope.storage.currentQuangCao;
      
        var vm = this; // jshint ignore:line

        vm.keyword = '';
        vm.isAdmin = false;
        vm.groupedItems = [];
        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };
        
        //Load Data
       
        
        vm.allQuangCaos = {};
      

        /*=============================================================*/
        function initPage(){
            vm.search(vm.keyword);
        }

        vm.edit= function(key){
            $state.go('quangCao.details', {id: key});
        };
        

        vm.search = function (keyword) {
           
            appUtils.showLoading();
            quangCaoService.search(keyword).then(function (result) {
                appUtils.hideLoading();
               
                vm.filteredItems = appUtils.sortArray(result,'timestampCreated');
                vm.paging.totalRecord = result.length; 
                vm.paging.currentPage = 0;
                //group by pages
                vm.groupToPages();
            });
        };

        //Functions
        vm.selectAllQuangCao = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };

        vm.groupToPages = function () {
            vm.pagedItems = [];
            for (var i = 0; i < vm.filteredItems.length; i++) {
                if (i % vm.paging.pageSize === 0) {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)] = [vm.filteredItems[i]];
                } else {
                    vm.pagedItems[Math.floor(i / vm.paging.pageSize)].push(vm.filteredItems[i]);
                }
            }
            vm.paging.totalPage = Math.ceil(vm.filteredItems.length / vm.paging.pageSize);
        };

        vm.applyAction = function(chkName,actionControl){
            var lstQuangCaoIds = [];
             $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstQuangCaoIds.push($(this).val() + '');
                }
            });

            var action = $('#' + actionControl).val();
            var actionTxt = $('#' + actionControl +' option:selected').text();

            if(action === 0 || parseInt(action) === 0){
                toaster.warning("Hãy chọn hành động cần thực hiện!");
                return;
            }

            if(lstQuangCaoIds.length === 0){
                toaster.warning("Hãy chọn quảng Cáo để thực hiện!");
                return;
            }
            
            $ngBootbox.confirm('Are you sure want to apply ' + actionTxt + ' action as selected?').then(function(){
                appUtils.showLoading();
              
                var reqs = [];var lstEmail=[];

                if(action === 'delete'){

                    _.forEach(lstQuangCaoIds, function(uid) {
                        
                        quangCaoService.get(uid).$loaded().then(function (rs) {
                            var req = quangCaoService.deleteqc(rs);
                            req.then(function (res) {
                                if (!res.result) {
                                    appUtils.hideLoading();
                                    $ngBootbox.alert(res.errorMsg.message);
                                    return;
                                }
                                reqs.push(res);
                            },function(res) {
                                $ngBootbox.alert(res.errorMsg.message);
                                appUtils.hideLoading();
                                return;
                            })  ;
                        });
                    });
                    
                    setTimeout(function() {

                        $q.all(reqs).then(function(res){
                            
                            appUtils.hideLoading();
                            var err = _.find(res, function(item){
                                 return item.result === false;
                            });

                            if(err === undefined){
                                delete $rootScope.storage.quangCaosList;
                                toaster.pop('success','Success', "Delete Successful!");    
                            }else{
                                 toaster.pop('error','Error', "Delete Error!"); 
                            }

                            initPage();     
                        }); 

                    },2000); 

                    

                } else{
                    appUtils.hideLoading();
                }
            });
        };

        initPage();
    }
})();
