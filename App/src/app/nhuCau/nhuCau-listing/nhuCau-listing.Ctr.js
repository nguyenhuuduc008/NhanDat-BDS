(function(){
    'use strict';
    angular.module('app.nhuCau')
    .controller('nhuCauListingCtr', nhuCauListingCtr);
    	/** @ngInject */
    function nhuCauListingCtr($rootScope, $scope, $state,$q,nhuCauService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var vm =this;// jshint ignore:line
        //
        vm.cacDanhMucBDS = appSettings.cacDanhMucBDS;
        vm.cacLoaiNhuCau = appSettings.cacLoaiNhuCau;
        console.log('vm.cacDanhMucBDS');
        console.log(vm.cacDanhMucBDS);
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
            var idDanhMucValue=$('#' + idDanhMuc).val();
            var idDanhMucText=$('#'+idDanhMuc +' option:selected').text();
            var idTrangThaiValue=$('#' + idTrangThai).val();
            var idTrangThaiText=$('#'+idTrangThai +' option:selected').text();
            if(idTrangThaiValue=='allTrangThai'){
                toaster.warning("Bạn cần lựa chọn Trạng Thái!");
                return;
            }
            if(idDanhMucValue=='allDanhMuc'){
                toaster.warning("Bạn cần lựa chọn Danh Mục!");
                return;
            }
            //get data
            nhuCauService.getNhuCau(idTrangThaiValue).$loaded().then(function(res){
                console.log('res');
                console.log(res);
                var result = res;
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
        vm.chiTietnhuCau=function(item){
            console.log('item');
            console.log(item);
            console.log(item.noiDung);
            if(item.loaiNhuCauText=='Bán'){
                $state.go('ban_choThueEdit',{
                    id:item.$id,
                    bdsId:item.bdsId,
                    activeTab:'thongTin',
                    loaiNhuCauId:item.loaiNhuCauId
                });
            }
            if(item.loaiNhuCauText=='Cho Thuê'){
                $state.go('ban_choThueEdit',{
                    id:item.$id,
                    bdsId:item.bdsId,
                    activeTab:'thongTin',
                    loaiNhuCauId:item.loaiNhuCauId
                });
            }
        };
        


    } 
})();