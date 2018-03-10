(function(){
    'use strict';
    angular.module('app.setting')
    .controller('hanhChinhListCtr', hanhChinhListCtr);
    	/** @ngInject */
    function hanhChinhListCtr($rootScope, $scope, $state,$q,settingService,appUtils,$ngBootbox,toaster){
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showBreadcrumb = false;
        $rootScope.settings.layout.guestPage = false;
        var appSettings = $rootScope.storage.appSettings;    
        var currentUser = $rootScope.storage.currentUser;
        var hanhChinhListVm =this;// jshint ignore:line

        hanhChinhListVm.input = 'Cấp Tỉnh';
        hanhChinhListVm.model = {};
        hanhChinhListVm.hanhChinhPath = "capTinh";
        hanhChinhListVm.listCapTinh = [];
        hanhChinhListVm.listCapHuyen = [];
        hanhChinhListVm.listCapXa = [];
        hanhChinhListVm.listDuong = [];
        hanhChinhListVm.capTinhActive = -1;
        hanhChinhListVm.capHuyenActive = -1;
        hanhChinhListVm.capXaActive = -1;
        hanhChinhListVm.isAddChild = false;
        hanhChinhListVm.isEditChild = false;
        hanhChinhListVm.parentKey = '';
        hanhChinhListVm.isAdd = true;
        hanhChinhListVm.buttonType = "Thêm Mới";


        function getListLoaiHanhChinh(loai, parentKey) {
            switch (loai) {
                case 'capTinh':
                    settingService.getListLoaiHanhChinh('capTinh').then(function (data) {
                        hanhChinhListVm.listCapTinh = data;
                    });
                    break;
                case 'capHuyen':
                    settingService.getListChildHanhChinh('capHuyen', parentKey).then(function (data) {
                        hanhChinhListVm.listCapHuyen = data;
                    });
                    break;
                case 'capXa':
                    settingService.getListChildHanhChinh('capXa', parentKey).then(function (data) {
                        hanhChinhListVm.listCapXa = data;
                    });
                    break;
                default:
                    settingService.getListChildHanhChinh('duong', parentKey).then(function (data) {
                        hanhChinhListVm.listDuong = data;
                    });
            }
        }

        hanhChinhListVm.addNew = function() {
            $state.go('hanhChinh-edit');
        };

        hanhChinhListVm.addInput = function(input) {
            switch(input) {
                case 'capTinh':
                    hanhChinhListVm.input = 'Cấp Tỉnh';
                    hanhChinhListVm.isAddChild = false;
                    break;
                case 'capHuyen':
                    if(hanhChinhListVm.capTinhActive < -1)
                        return;
                    hanhChinhListVm.input = 'Cấp Huyện';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capTinhKey;
                    break;
                case 'capXa':
                    if(hanhChinhListVm.capHuyenActive < -1)
                        return;
                    hanhChinhListVm.input = 'Cấp Xã';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capHuyenKey;
                    break;
                default:
                    if(hanhChinhListVm.capXaActive < -1)
                        return;
                    hanhChinhListVm.input = 'Đường';
                    hanhChinhListVm.isAddChild = true;
                    hanhChinhListVm.parentKey = hanhChinhListVm.capXaKey;
            }
            hanhChinhListVm.buttonType = "Thêm Mới";
            hanhChinhListVm.model = {};
            hanhChinhListVm.isAdd = true;
            hanhChinhListVm.hanhChinhPath = input;
        };

        function addHanhChinh(isAddChild, parentKey) {
            if(isAddChild) {
                hanhChinhListVm.model.parentKey = parentKey;
                settingService.addChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey).then(function(res) {
                    if(!res) {
                        toaster.error('Lỗi','Thêm không thành công');
                        return;
                    }
                    $scope.$apply(function() {
                        toaster.success('Thành Công','Thêm thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            } else {
                settingService.addLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath).then(function(res) {
                    if(!res) {
                        toaster.error('Lỗi','Thêm không thành công');
                        return;
                    }
                    $scope.$apply(function() {
                        toaster.success('Thành Công','Thêm thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });               
            }
        }

        function updateHanhChinh(isEditChild, parentKey, key) {
            if(isEditChild) {
                settingService.updateChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey, key).then(function(res) {
                    if(!res) {
                        toaster.error('Lỗi','Sửa không thành công');
                        return;
                    }
                    $scope.$apply(function() {
                        toaster.success('Thành Công','Sửa thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });
            } else {
                delete hanhChinhListVm.model.parentKey;
                settingService.updateLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, key).then(function(res) {
                    if(!res) {
                        toaster.error('Lỗi','Sửa không thành công');
                        return;
                    }
                    $scope.$apply(function() {
                        toaster.success('Thành Công','Sửa thành công');
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.model = {};
                    });
                });               
            }
        }

        hanhChinhListVm.actionHanhChinh = function(formInput) {
            if(formInput == '' || formInput == null || formInput == undefined)
                    return;
            if(hanhChinhListVm.isAdd) {
                addHanhChinh(hanhChinhListVm.isAddChild, hanhChinhListVm.parentKey);
            } else {
                updateHanhChinh(hanhChinhListVm.isEditChild, hanhChinhListVm.model.parentKey, hanhChinhListVm.parentKey);
            }
        };

        function deleteHanhChinhNoParent(key) {
            hanhChinhListVm.model = {
                text: null,
            };
            settingService.updateLoaiHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, key).then(function(res) {
                if(!res) {
                    toaster.error('Lỗi','Xóa không thành công');
                    return;
                }
                $scope.$apply(function() {
                    toaster.success('Thành Công','Xóa thành công');
                });
            }); 
        }

        function deleteHanhChinhWithParent(parentKey, key) {
            hanhChinhListVm.model = {
                text: null,
                parentKey: null
            };
            settingService.updateChildHanhChinh(hanhChinhListVm.model, hanhChinhListVm.hanhChinhPath, parentKey, key).then(function(res) {
                if(!res) {
                    toaster.error('Lỗi','Xóa không thành công');
                    return;
                }
                $scope.$apply(function() {
                    toaster.success('Thành Công','Xóa thành công');
                });
            }); 
        }
        
        function deleteChildHanhChinh(pathArrIndex, key) {
            if(pathArrIndex >= hanhChinhListVm.deleteArray.length){
                return;
            }
            
            settingService.getListChildHanhChinh(hanhChinhListVm.deleteArray[pathArrIndex], key).then(function(rs) {
                if(rs.length < 1)
                    return;
                else {
                    settingService.deleteLoaiHanhChinh(hanhChinhListVm.deleteArray[pathArrIndex], key);
                    _.forEach(rs, function(item, key) {
                        pathArrIndex++;
                        deleteChildHanhChinh(pathArrIndex, item.$id);
                    });
                }
            });
        }

        hanhChinhListVm.deleteHanhChinh = function(path, item) {
            $ngBootbox.confirm('Bạn có chắc chắn muốn xóa ' + item.text + ' ?').then(function() {
                switch(path) {
                    case 'capTinh':
                        deleteHanhChinhNoParent(item.$id);
                        hanhChinhListVm.capTinhActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.deleteArray = ['capHuyen', 'capXa', 'duong'];
                        deleteChildHanhChinh(0, item.$id);
                        break;
                    case 'capHuyen':
                        deleteHanhChinhWithParent(hanhChinhListVm.capTinhKey, item.$id);
                        hanhChinhListVm.capHuyenActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.deleteArray = ['capXa', 'duong'];
                        deleteChildHanhChinh(0, item.$id);
                        break;
                    case 'capXa':
                        deleteHanhChinhWithParent(hanhChinhListVm.capHuyenKey, item.$id);
                        hanhChinhListVm.capXaActive = -1;
                        hanhChinhListVm.buttonType = "Thêm Mới";
                        hanhChinhListVm.deleteArray = ['duong'];
                        deleteChildHanhChinh(0, item.$id);
                        break;
                    default:
                        deleteHanhChinhWithParent(hanhChinhListVm.capXaKey, item.$id);
                        hanhChinhListVm.buttonType = "Thêm Mới";
                }

            }, function() {
                alert('cancel');
            });
        };

        hanhChinhListVm.chooseHanhChinh = function(choice, path, activeIndex) {
            hanhChinhListVm.buttonType = "Sửa";
            hanhChinhListVm.isAdd = false;
            hanhChinhListVm.parentKey = choice.$id;
            hanhChinhListVm.model.text = choice.text;
            hanhChinhListVm.model.parentKey = choice.parentKey;
            switch(path) {
                case 'capHuyen':
                    hanhChinhListVm.hanhChinhPath = 'capTinh';
                    hanhChinhListVm.capTinhActive = activeIndex;
                    hanhChinhListVm.capTinhKey = choice.$id;
                    hanhChinhListVm.isEditChild = false;
                    hanhChinhListVm.input = 'Cấp Tỉnh';
                    hanhChinhListVm.listCapXa = [];
                    hanhChinhListVm.listDuong = [];
                    hanhChinhListVm.capHuyenActive = -1;
                    hanhChinhListVm.capXaActive = -1;
                    break;
                case 'capXa':
                    hanhChinhListVm.hanhChinhPath = 'capHuyen';
                    hanhChinhListVm.capHuyenActive = activeIndex;
                    hanhChinhListVm.capHuyenKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Cấp Huyện';
                    hanhChinhListVm.listDuong = [];
                    hanhChinhListVm.capXaActive = -1;
                    break;
                case 'duong':
                    hanhChinhListVm.hanhChinhPath = 'capXa';
                    hanhChinhListVm.capXaActive = activeIndex;
                    hanhChinhListVm.capXaKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Cấp Xã';
                    break;
                default:
                    hanhChinhListVm.hanhChinhPath = 'duong';
                    hanhChinhListVm.duongActive = activeIndex;
                    hanhChinhListVm.duongKey = choice.$id;
                    hanhChinhListVm.isEditChild = true;
                    hanhChinhListVm.input = 'Đường';
                    return;
            }
            getListLoaiHanhChinh(path, choice.$id);
        };

        function init(){
            getListLoaiHanhChinh('capTinh');
        }
        init();
    } 
})();