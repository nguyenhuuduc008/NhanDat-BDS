(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauListingCtr', nhuCauListingCtr);
    	/** @ngInject */
    function nhuCauListingCtr($rootScope, $scope, $state,$q,nhuCauService,appUtils,$ngBootbox,toaster, settingService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var vm =this;// jshint ignore:line
        //
        vm.item = {};
        vm.cacKhoBDS = appSettings.cacKhoBDS;
        vm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        vm.khoBDSList = [];
        console.log(vm.cacKhoBDS);
        vm.item.nhuCauKey ='allTrangThai';

        //Load data
        vm.item.khoBDSKey = "allDanhMuc";
        _.forEach(vm.cacKhoBDS, function(item, key) {
            if(key != 'khoDefault') {
                vm.khoBDSList.push({
                    $id: key,
                    text: item.text
                });
            } 
        });
            // vm.khoBDSDefault = _.find(data, ['$id', 'khoDefault']);
            // vm.item.khoBDSKey = !!vm.khoBDSDefault ? vm.khoBDSDefault.$value : 'allDanhMuc';

        //page
        vm.groupedItems = [];
        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 25,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
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
        //end page


        vm.selectAllItem = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        vm.appDung=function(idDanhMuc,idTrangThai){
            //check valid
            if(idTrangThai=='allTrangThai'){
                toaster.warning("Bạn cần lựa chọn Trạng Thái!");
                return;
            }
            if(idDanhMuc =='allDanhMuc'){
                toaster.warning("Bạn cần lựa chọn Danh Mục!");
                return;
            }
            // get data
            if(idTrangThai == 'ban' || idTrangThai == 'cho-thue' ) {
                nhuCauService.getNhuCauBanById(idDanhMuc).$loaded().then(function(data){
                    var res = _.find(data, function(o) {
                        return o.$id == idTrangThai;
                    });
                    var result = [];
                    _.forEach(res, function(item, key) {
                        if(_.isObject(item)) {
                            item.bdsKey = key;
                            result.push(item);
                        }
                    });
                    console.log('NOTRIGHTHERA', result);
                    vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
                    console.log('vm.filteredItems');
                    console.log(vm.filteredItems);
                    vm.paging.totalRecord = result.length;
                    vm.paging.currentPage = 0;
                    //group by pages
                    vm.groupToPages();
                }).catch(function(err){
                    toaster.warning(err);
                });
            } else {
                nhuCauService.getNhuCauMuaById(idDanhMuc).$loaded().then(function(data){
                    var res = _.find(data, function(o) {
                        return o.$id == idTrangThai;
                    });
                    var result = [];
                    _.forEach(res, function(item, key) {
                        if(_.isObject(item)) {
                            item.bdsKey = key;
                            result.push(item);
                        }
                    });
                    console.log('NOTRIGHTHERA', result);
                    vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
                    console.log('vm.filteredItems');
                    console.log(vm.filteredItems);
                    vm.paging.totalRecord = result.length;
                    vm.paging.currentPage = 0;
                    //group by pages
                    vm.groupToPages();
                }).catch(function(err){
                    toaster.warning(err);
                });
            }
        };
        //xoa nhu cau
        vm.appDungLuaChon=function(selectedCheckBox,idLuaChon){
            //xoa, disable...
            var idLuaChonValue=$('#'+idLuaChon).val();
            var idLuaChonText=$('#'+idLuaChon).text();
            if (idLuaChonValue =='0') {
                toaster.warning("Lựa Chọn chưa được chọn!");
                return;
            }
           
        };
        vm.chiTietnhuCau = function (item) {
            console.log('ITENSSSS', item);
            $state.go('nhuCauEdit', { item: item, isEdit: true });
        };
        
    } 
})();