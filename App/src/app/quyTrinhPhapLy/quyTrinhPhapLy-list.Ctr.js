(function(){
    'use strict';
    angular.module('app.quytrinhphaply')
    .controller('quyTrinhPhapLyListCtr', quyTrinhPhapLyListCtr);
    	/** @ngInject */
    function quyTrinhPhapLyListCtr($rootScope, $scope, $state,$q,quyTrinhPhapLyService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var quyTrinhPhapLyListVm =this;// jshint ignore:line
        quyTrinhPhapLyListVm.items=[];
        quyTrinhPhapLyListVm.selectAction = 'Chọn';
        quyTrinhPhapLyListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        
        quyTrinhPhapLyListVm.cities = appSettings.thanhPho;

        quyTrinhPhapLyListVm.cri = {
            keyword : '',
            thanhPho: 'all',
            quanHuyen: 'all'
        };

        quyTrinhPhapLyListVm.groupedItems = [];
        quyTrinhPhapLyListVm.filteredItems = [];
        quyTrinhPhapLyListVm.pagedItems = [];
        quyTrinhPhapLyListVm.paging = {
            pageSize: 25,
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
                console.log(' quyTrinhPhapLyListVm.items');
                console.log( quyTrinhPhapLyListVm.items);
            });
        }

        quyTrinhPhapLyListVm.getThanhPhoName = function(key){
            var thanhpho =_.find(appSettings.thanhPho, function(tp){
                return tp.value === key;
            });
            return thanhpho !== undefined ? thanhpho.text : '';
        };
        
        quyTrinhPhapLyListVm.getQuanHuyenName = function(thanhPhoKey, quanHuyenKey){
            var qhs = appSettings.quanHuyen[thanhPhoKey];
            var quanhuyen =_.find(qhs, function(qh){
                return qh.value === quanHuyenKey;
            });
            return quanhuyen !== undefined ? quanhuyen.text : '';
        };

        quyTrinhPhapLyListVm.groupToPages = function () {
            quyTrinhPhapLyListVm.pagedItems = [];
            for (var i = 0; i < quyTrinhPhapLyListVm.filteredItems.length; i++) {
                if (i % quyTrinhPhapLyListVm.paging.pageSize === 0) {
                    quyTrinhPhapLyListVm.pagedItems[Math.floor(i / quyTrinhPhapLyListVm.paging.pageSize)] = [quyTrinhPhapLyListVm.filteredItems[i]];
                } else {
                    quyTrinhPhapLyListVm.pagedItems[Math.floor(i / quyTrinhPhapLyListVm.paging.pageSize)].push(quyTrinhPhapLyListVm.filteredItems[i]);
                }
            }
            if(quyTrinhPhapLyListVm.filteredItems.length % quyTrinhPhapLyListVm.paging.pageSize === 0){
                quyTrinhPhapLyListVm.paging.totalPage = quyTrinhPhapLyListVm.filteredItems.length / quyTrinhPhapLyListVm.paging.pageSize;
            }else{
                quyTrinhPhapLyListVm.paging.totalPage = Math.floor(quyTrinhPhapLyListVm.filteredItems.length / quyTrinhPhapLyListVm.paging.pageSize) + 1;
            }
            
        };

        $scope.changePage = function () {
            quyTrinhPhapLyListVm.groupToPages();
        };

        quyTrinhPhapLyListVm.search = function (cri) {
            appUtils.showLoading();
            quyTrinhPhapLyService.search(cri).then(function (result) {
                appUtils.hideLoading();
                quyTrinhPhapLyListVm.filteredItems = appUtils.sortArray(result,'timestampCreated');
                quyTrinhPhapLyListVm.paging.totalRecord = result.length; 
                quyTrinhPhapLyListVm.paging.currentPage = 0;
                //group by pages
                quyTrinhPhapLyListVm.groupToPages();
            });
        };

        quyTrinhPhapLyListVm.search(quyTrinhPhapLyListVm.cri);

        quyTrinhPhapLyListVm.changeCity = function () {
			var districts = appSettings.quanHuyen[quyTrinhPhapLyListVm.cri.thanhPho];
            quyTrinhPhapLyListVm.districts = districts;
            quyTrinhPhapLyListVm.cri.quanHuyen = 'all';
		};
    } 
})();