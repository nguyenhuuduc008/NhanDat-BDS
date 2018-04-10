//import { debug } from "util";

(function(){
    'use strict';
    angular.module('app.quytrinhphaply')
    .controller('quyTrinhPhapLyListCtr', quyTrinhPhapLyListCtr);
    	/** @ngInject */
    function quyTrinhPhapLyListCtr($rootScope, $scope, $state,$q, $timeout, quyTrinhPhapLyService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyTrinhPhapLyListVm =this;// jshint ignore:line
        quyTrinhPhapLyListVm.items=[];
        quyTrinhPhapLyListVm.models = [];
        quyTrinhPhapLyListVm.selectAction = 'Chọn';
        quyTrinhPhapLyListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        
        quyTrinhPhapLyListVm.cacLoaiHanhChinh = appSettings.cacLoaiHanhChinh;        
        quyTrinhPhapLyListVm.cities = [];
        quyTrinhPhapLyListVm.districts = [];
        var districts;
        
        quyTrinhPhapLyListVm.cri = {
            keyword : '' ,
            thanhPho: 'all',
            quanHuyen: 'all',
            from: 0,
            size: 15           
        };

        _.forEach(quyTrinhPhapLyListVm.cacLoaiHanhChinh.capTinh, function (item, key) {
            quyTrinhPhapLyListVm.cities.push({
                $id: key,
                text: item.text
            });
        });

        // quyTrinhPhapLyListVm.groupedItems = [];
        // quyTrinhPhapLyListVm.filteredItems = [];
        // quyTrinhPhapLyListVm.pagedItems = [];

        quyTrinhPhapLyListVm.paging = {
            pageSize: 15,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

        quyTrinhPhapLyListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];           
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }                
            });
            var removeIndex = quyTrinhPhapLyListVm.selectAction.indexOf('Xóa');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Chọn hành động để thực thi!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn quy trình bạn muốn xóa!");
                return;
            }
            $ngBootbox.confirm('Bạn có chắc muốn ' + quyTrinhPhapLyListVm.selectAction + ' quy trình này?')
            .then(function() {
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(quyTrinhPhapLyService.removeQuyTrinhPhapLy(id));
                });
                $q.all(removePromise).then(function(rs){
                    appUtils.hideLoading();
                    toaster.success("Xóa thành công!");
                    init();
                });
            }, function() {
                appUtils.hideLoading();
            });

        };

        function getAllQuyTrinhPhapLy(){
            quyTrinhPhapLyService.getQuyTrinhPhapLy().$loaded().then(function(res){
                quyTrinhPhapLyListVm.items = res;                
            });
        }
     
        quyTrinhPhapLyListVm.getThanhPhoName = function(key) {           
            var cityName;
            if(quyTrinhPhapLyListVm.cacLoaiHanhChinh.capTinh.hasOwnProperty(key))
            {
                cityName = quyTrinhPhapLyListVm.cacLoaiHanhChinh.capTinh[key].text;                
            }
            return cityName;
        };
  
        quyTrinhPhapLyListVm.getQuanHuyenName = function(cityKey, districtKey){
            var districtName;  
            if(quyTrinhPhapLyListVm.cacLoaiHanhChinh.capHuyen.hasOwnProperty(cityKey))
            {
                var cityDistrict = quyTrinhPhapLyListVm.cacLoaiHanhChinh.capHuyen[cityKey];
                if(cityDistrict.hasOwnProperty(districtKey))
                {
                    districtName = cityDistrict[districtKey].text;
                }
            }            
            return districtName;
        };

        // quyTrinhPhapLyListVm.groupToPages = function () {
        //     quyTrinhPhapLyListVm.pagedItems = [];
        //     for (var i = 0; i < quyTrinhPhapLyListVm.filteredItems.length; i++) {
        //         if (i % quyTrinhPhapLyListVm.paging.pageSize === 0) {
        //             quyTrinhPhapLyListVm.pagedItems[Math.floor(i / quyTrinhPhapLyListVm.paging.pageSize)] = [quyTrinhPhapLyListVm.filteredItems[i]];
        //         } else {
        //             quyTrinhPhapLyListVm.pagedItems[Math.floor(i / quyTrinhPhapLyListVm.paging.pageSize)].push(quyTrinhPhapLyListVm.filteredItems[i]);
        //         }
        //     }
        //     if(quyTrinhPhapLyListVm.filteredItems.length % quyTrinhPhapLyListVm.paging.pageSize === 0){
        //         quyTrinhPhapLyListVm.paging.totalPage = quyTrinhPhapLyListVm.filteredItems.length / quyTrinhPhapLyListVm.paging.pageSize;
        //     }else{
        //         quyTrinhPhapLyListVm.paging.totalPage = Math.floor(quyTrinhPhapLyListVm.filteredItems.length / quyTrinhPhapLyListVm.paging.pageSize) + 1;
        //     }
        // };

        $scope.changePage = function () {
            //quyTrinhPhapLyListVm.groupToPages();
            quyTrinhPhapLyListVm.cri.from = quyTrinhPhapLyListVm.paging.currentPage * quyTrinhPhapLyListVm.cri.size;
			search();
        };

        quyTrinhPhapLyListVm.search = function (init) {
            if(init){
                quyTrinhPhapLyListVm.paging.currentPage = 0;
                quyTrinhPhapLyListVm.cri.from = 0;
            }
            appUtils.showLoading();                        
            // if(typeof(quyTrinhPhapLyListVm.cri.thanhPho) !== 'undefined' && 
            //     (typeof(quyTrinhPhapLyListVm.cri.quanHuyen) === 'undefined' || quyTrinhPhapLyListVm.cri.quanHuyen === null)){               
            //     appUtils.hideLoading();
            //     toaster.warning("Vui lòng chọn Quận / Huyện!");
            //     return;
            // }    
            quyTrinhPhapLyService.search2(quyTrinhPhapLyListVm.cri).then(function (result) {                
                appUtils.hideLoading();
                quyTrinhPhapLyListVm.models = result.items;
                //quyTrinhPhapLyListVm.totalAllProducts = result.totalRecords;
                angular.extend(quyTrinhPhapLyListVm.paging, {
					totalRecord: result.totalRecords,
					totalPage: result.pages
                });

                $timeout(angular.noop,500);
                // quyTrinhPhapLyListVm.filteredItems = appUtils.sortArray(result,'timestampCreated');
                // quyTrinhPhapLyListVm.paging.totalRecord = result.length; 
                // quyTrinhPhapLyListVm.paging.currentPage = 0;
                // //group by pages
                // quyTrinhPhapLyListVm.groupToPages();
            });
        };

        quyTrinhPhapLyListVm.search(true);
        
        quyTrinhPhapLyListVm.changeCity = function(){                         
            quyTrinhPhapLyListVm.districts = [];
            _.forEach(quyTrinhPhapLyListVm.cacLoaiHanhChinh.capHuyen, function (item, key) {                     
                if(key === quyTrinhPhapLyListVm.cri.thanhPho) {
                    districts = item;
                }
            });
            _.forEach(districts, function (item, key) {
                quyTrinhPhapLyListVm.districts.push({
                    $id: key,
                    text: item.text
                });
            });                  
        };     
    } 
})();