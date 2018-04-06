(function(){
    'use strict';
    angular.module('app.setting')
    .controller('loaiTacNghiepListCtr', loaiTacNghiepListCtr);
    	/** @ngInject */
    function loaiTacNghiepListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var loaiTacNghiepListVm =this;// jshint ignore:line
        loaiTacNghiepListVm.items=[];
        loaiTacNghiepListVm.selectAction = 'Chọn';

        loaiTacNghiepListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        loaiTacNghiepListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = loaiTacNghiepListVm.selectAction.indexOf('Xóa');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn thao tác!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Vui lòng chọn dòng cần thao tác!");
                return;
            }
            $ngBootbox.confirm('Bạn có chắc muốn thao tác ' + loaiTacNghiepListVm.selectAction + ' ?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiTacNghiep(id));
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

        loaiTacNghiepListVm.checkFlag = function(flag){            
            if(typeof(flag) === 'undefined'){
               return false;
            }else{
               return flag;
            }
		};

        function getCacLoaiTacNghiep(){
            settingService.getCacLoaiTacNghiep().$loaded().then(function(res){
                loaiTacNghiepListVm.items=res;               
            });
        }        
        
        function init(){
            getCacLoaiTacNghiep();
        }
        init();
    } 
})();