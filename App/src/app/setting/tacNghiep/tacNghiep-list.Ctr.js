(function(){
    'use strict';
    angular.module('app.setting')
    .controller('tacNghiepListCtr', tacNghiepListCtr);
    	/** @ngInject */
    function tacNghiepListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster, tacNghiepService){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var tacNghiepListVm =this;// jshint ignore:line

        tacNghiepListVm.listLoaiTacNghiep = appSettings.cacLoaiTacNghiep;
        tacNghiepListVm.listTacNghiep = [];
        tacNghiepListVm.listFilter = [];

        tacNghiepListVm.loaiTacNghiep = 'Chọn loại';
        tacNghiepListVm.user = '';
        tacNghiepListVm.userPhone = '';
        tacNghiepListVm.thoigian = '';

        tacNghiepListVm.selectAll = function(controlId, name){
            appUtils.checkAllCheckBox(controlId,name);
        };
        tacNghiepListVm.apply = function(chkName){
            appUtils.showLoading();
            var self = this;
            var lstIds = [];
            $('input[name=' + chkName + ']').each(function () {
                if (this.checked === true) {
                    lstIds.push($(this).val() + '');
                }
            });
            var removeIndex = tacNghiepListVm.selectAction.indexOf('Delete');
            if(removeIndex === -1){
                appUtils.hideLoading();
                toaster.warning("Please choose action to execute!");
                return;
            } 
            if(lstIds.length <= 0){
                appUtils.hideLoading();
                toaster.warning("Please choose some items to execute action!");
                return;
            }
            $ngBootbox.confirm('Are you sure want to apply ' + tacNghiepListVm.selectAction + ' action as selected?')
            .then(function() {
                console.log('lstIds');
                console.log(lstIds);
                var removePromise=[];
                _.forEach(lstIds, function(id){
                    removePromise.push(settingService.removeLoaiTacNghiep(id));
                });
                $q.all(removePromise).then(function(rs){
                    appUtils.hideLoading();
                    toaster.success("Delete success!");
                    init();
                });
            }, function() {
                appUtils.hideLoading();
            });

        };

        function getListTacNghiep() {
            settingService.getCacLoaiTacNghiep().$loaded().then(function (loai) {
                tacNghiepService.getAll().$loaded().then(function (res) {
                    _.forEach(res, function (item, key) {
                        _.forEach(item, function (item2, key2) {
                            if (_.isObject(item2)) {
                                var tenLoai = _.find(loai, function(o) {
                                    return o.$id == item2.loaiTacNghiep;
                                });
                                item2.loaiTacNghiep = tenLoai.text;
                                item2.id = key2;
                                item2.bdsId = item.$id;
                                tacNghiepListVm.listTacNghiep.push(item2);
                            }
                        });
                    });
                    tacNghiepListVm.listFilter = _.cloneDeep(tacNghiepListVm.listTacNghiep);
                });
            });
        }

        tacNghiepListVm.edit = function(id, bdsId, text) {
            $state.go('tacNghiep-edit', {id: id, bdsId: bdsId, text: text});
        };

        function getListUserByPhone() {
			tacNghiepService.getListUserByPhone().then(function(data) {
				tacNghiepListVm.listUser = data;
			});
		}

		tacNghiepListVm.textUser = function (phone) {
			var rs = _.find(tacNghiepListVm.listUser, function (o) {
				return o.phone + '' == phone + '';
			});
			if (rs) {
				return rs.userName;
			}
			return 'Unknown';
        };

        tacNghiepListVm.getUserByPhone = function(phone) {
			tacNghiepService.getUserByPhone(phone).then(function(res) {
				if(!res.phone) {
                    toaster.warning("User không tồn tại!");
                    tacNghiepListVm.user = '';
                    tacNghiepListVm.userPhone = '';
					return;
				}
				tacNghiepListVm.userPhone = res.phone;
				tacNghiepListVm.user = res.userName;
			});
		};

        tacNghiepListVm.fullList = function() {
            tacNghiepListVm.listTacNghiep = tacNghiepListVm.listFilter;
            tacNghiepListVm.loaiTacNghiep = 'Chọn loại';
            tacNghiepListVm.user = '';
            tacNghiepListVm.userPhone = '';
            tacNghiepListVm.thoigian = '';
        };
        
        tacNghiepListVm.filter = function() {
            console.log('TIMEEEEEEEEEEEEE', tacNghiepListVm.thoigian);
            var filterByLoai = _.filter(tacNghiepListVm.listFilter, function(o) {
                return o.loaiTacNghiep == tacNghiepListVm.loaiTacNghiep;
            });
            if(tacNghiepListVm.loaiTacNghiep === 'Chọn loại') {
                filterByLoai = tacNghiepListVm.listFilter;
            }
            var filterByUserPhone = _.filter(filterByLoai, function(o) {
                return o.userPhone + '' == tacNghiepListVm.userPhone + '';
            });
            if(_.isEmpty(filterByUserPhone)) {
                filterByUserPhone = tacNghiepListVm.listFilter;
            }
            var filterByDate = _.filter(filterByUserPhone, function(o) {
                var filterDate = Date.parse(tacNghiepListVm.thoigian);
                var listDate = Date.parse(o.ngayTacNghiep);
                return filterDate  == listDate;
            });
            tacNghiepListVm.listTacNghiep = filterByDate;
            console.log('TEST BIG FILTER', tacNghiepListVm.listTacNghiep);
        };

        function init(){
            getListUserByPhone();
            getListTacNghiep();
        }
        init();
    } 
})();