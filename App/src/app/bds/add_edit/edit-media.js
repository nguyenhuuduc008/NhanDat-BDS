(function () {
    'use strict';

    angular.module('app.bds')
        .controller('MediaCtrl', MediaCtrl)
        .controller("ViewFileCtrl", ViewFileCtrl);

    /** @ngInject */
    function MediaCtrl($rootScope, $q, $scope, $stateParams, $state, $filter, $ngBootbox, $window, $uibModal, authService, currentAuth, bdsMediaService, appUtils, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;
        var vm = this; // jshint ignore:line
        var currentUser = $rootScope.storage.currentUser;
        var bdsId = $stateParams.bdsId;
        vm.bdsId = bdsId;
        vm.activeTab = 'media';
        vm.tabs = {
            thongTin: {
                title: 'Thông Tin'
            },
            tacNghiep: {
                title: 'Tác Nghiệp'
            },
            viTri: {
                title: 'Vị Trí'
            },
            lienKetUsers: {
                title: 'Liên Kết Users'
            },
            giamGia: {
                title: 'Giảm Giá'
            },
            yeuToTangGiamGia: {
                title: 'Yếu Tố Tăng Giảm Giá'
            },
            thuocQuyHoach: {
                title: 'Thuộc Quy Hoạch'
            },
            lichSuChuyenQuyen: {
                title: 'Lịch Sử Chuyển Quyền'
            },
            lichSuGiaoDich: {
                title: 'Lịch Sử Giao Dịch'
            },
            capDo: {
                title: 'Cấp Độ'
            },
            lichSuGia: {
                title: 'Lịch Sử Giá',
            },
            media: {
                title: "Media",
                url: './app/bds/add_edit/_tab-media.tpl.html'
            }
        };

        vm.keyword = '';
        vm.filter = 'All';
        vm.groupedItems = [];
        vm.filteredItems = [];
        vm.pagedItems = [];
        vm.paging = {
            pageSize: 15,
            currentPage: 0,
            totalPage: 0,
            totalRecord: 0
        };

        vm.orderByDesc = true;

        //Load Data
        vm.filterDates = appUtils.postFilterDates;
        vm.mediaIcons = appUtils.mediaIcons;
        vm.imgFileIcons = appUtils.imgFileIcons;
        vm.videoFileIcons = appUtils.videoFileIcons;

        vm.dzOptions = {
            url: 'bds_media/' + bdsId,
            firebaseStorage: true,
            parallelUploads: 10
        };

        vm.dzCallbacks = {
            'addedfile': function (file) {

            },
            'success': function (file, response) {
                var snapshot = {};
                _.each(response, function (task, key) {
                    snapshot[key] = task.snapshot;
                });
                var metadata = snapshot.ori.metadata;
                var imagemedia = {
                    "alternativeText": "",
                    "author": currentUser.email,
                    "bucket": metadata.bucket,
                    "caption": "",
                    "description": "",
                    "displayName": metadata.name,
                    "downloadUrl": snapshot.ori.downloadURL,
                    "fileName": metadata.name,
                    "fileSize": metadata.size,
                    "fileType": metadata.contentType,
                    "fullPath": metadata.fullPath,
                    "lowRes": {
                        "downloadUrl": snapshot.lowres ? snapshot.lowres.downloadURL : '',
                        "fileName": snapshot.lowres ? snapshot.lowres.metadata.name : '',
                        "fullPath": snapshot.lowres ? snapshot.lowres.metadata.fullPath : ''
                    },
                    "storageLocation": 'gs://' + metadata.bucket + '/' + metadata.fullPath,
                    "thumbnail": {
                        "downloadUrl": snapshot.thumb ? snapshot.thumb.downloadURL : '',
                        "fileName": snapshot.thumb ? snapshot.thumb.metadata.name : '',
                        "fullPath": snapshot.thumb ? snapshot.thumb.metadata.fullPath : ''
                    },
                    "type": 'image',
                    "originalName": file.name || '',
                    "bdsId": bdsId
                };

                bdsMediaService.addFile(bdsId, imagemedia).then(function (res) {
                    if (!res.result) {
                        toaster.error(res.errorMsg);
                        return;
                    }
                    vm.search('');
                });
            },
            'error': function (file, err) {
                console.log('upload img error');
                console.log(file);
                console.log(err);
            }
        };

        //Functions
        vm.loadTab = function (key) {
            vm.activeTab = key;
            $state.go('bds.' + key, { bdsId: vm.bdsId });
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
            if (vm.filteredItems.length % vm.paging.pageSize === 0) {
                vm.paging.totalPage = vm.filteredItems.length / vm.paging.pageSize;
            } else {
                vm.paging.totalPage = Math.floor(vm.filteredItems.length / vm.paging.pageSize) + 1;
            }
        };

        vm.search = function (keyword) {
            bdsMediaService.searchMedia(bdsId, keyword).then(function (result) {
                vm.filteredItems = appUtils.sortArray(result, 'timestampCreated');
                vm.paging.totalRecord = result.length;
                vm.paging.currentPage = 0;
                //group by pages
                vm.groupToPages();
            });
        };

        vm.search('');

        //$scope Functions
        $scope.changePage = function () {
            vm.groupToPages();
        };

        vm.sortBy = function (sortBy) {
            vm.orderByDesc = !vm.orderByDesc;
            vm.filteredItems = _.orderBy(vm.filteredItems, ['timestampCreated'], [sortBy]);
            vm.paging.totalRecord = vm.filteredItems.length;
            vm.paging.currentPage = 0;
            //group by pages
            vm.groupToPages();
        };

        vm.filterItems = function () {
            vm.keyword = '';
            bdsMediaService.getMediaBDS(bdsId).then(function (data) {
                var lst = bdsMediaService.filterItems(data, 'All', vm.filter);
                vm.filteredItems = appUtils.sortArray(lst, 'timestampCreated');
                vm.paging.totalRecord = lst.length;
                vm.paging.currentPage = 0;
                //Group by pages
                vm.groupToPages();
            });
        };

        vm.delete = function (item) {
            var self = this;
            $ngBootbox.confirm('Are you sure want to delete ' + item.displayName + '?')
                .then(function () {
                    bdsMediaService.removeMedia(bdsId, item.$id).then(function (res) {
                        if (res.result) {
                            toaster.pop('success', 'Success', "Delete Successful!");
                            vm.search('');
                        } else {
                            toaster.pop('error', 'Error', "Delete  Error! " + res.errorMsg);
                        }
                    });
                }, function () {
                });
        };
        vm.save = function (item) {
            appUtils.showLoading();
            bdsMediaService.updateMedia(bdsId, item.$id, item).then(function (res) {
                appUtils.hideLoading();
                if (res.result) {
                    $scope.$apply(function () {
                        toaster.pop('success', 'Success', "Save Change Successful!");
                    });
                } else {
                    $scope.$apply(function () {
                        toaster.pop('error', 'Error', "Change Error! " + res.errorMsg);
                    });
                }
            });
        };
        vm.fileSrc = function (item) {
            return appUtils.mediaImgSrc(item, '100px');
        };

        vm.cutString = function (text) {
            if (text.length > 40) {
                return text.substring(0, 40) + ' ...';
            }
            return text;
        };

        vm.cutTypeString = function (text) {
            if (text.length > 20) {
                return text.substring(0, 20) + ' ...';
            }
            return text;
        };
        // vm.selectAll = function(controlId, name){
        //     appUtils.checkAllCheckBox(controlId,name);
        // };

        // vm.apply = function(chkName,actionControl){
        //     var lstfiles = [];
        //      $('input[name=' + chkName + ']').each(function () {
        //         if (this.checked === true) {
        //             var item = {
        //                 id: $(this).val() + '',
        //                 fullPath: $(this).attr('full-path')
        //             };
        //             lstfiles.push(item);
        //         }
        //     });

        //     var action = $('#' + actionControl).val();
        //     var actionTxt = $('#' + actionControl +' option:selected').text();

        //     if(action === '0'){
        //         toaster.warning("Please choose action to execute!");
        //         return;
        //     }

        //     if(lstfiles.length === 0){
        //         toaster.warning("Please choose some items to execute action!");
        //         return;
        //     }

        //     $ngBootbox.confirm('Are you sure want to apply ' + actionTxt + ' action as selected?').then(function(){
        //         if(action === 'delete'){
        //             appUtils.showLoading();
        //             var reqs = [];
        //             _.forEach(lstfiles, function(obj, key) {
        //                 var req = bdsMediaService.deleteFile(obj.id).then(function(res){
        //                     if(res.result){
        //                         bdsMediaService.deleteFileInStorage(obj.fullPath);
        //                     }
        //                 });
        //                 reqs.push(req);  
        //             });
        //             $q.all(reqs).then(function(res){
        //                 appUtils.hideLoading();
        //                 toaster.pop('success','Success', "Delete Successful!");  
        //                 vm.search(''); 
        //             });    
        //         }             
        //     });
        // };

        // vm.view = function(item){
        //     var type = item.type.split('/')[0];
        //     if(type !== "image" && type !== "video"){
        //         $window.open(item.downloadUrl, '_blank');
        //         return;
        //     }
        //     var modalInstance = $uibModal.open({
        //         templateUrl: 'app/media/library/view_file.tpl.html',
        //         controller: 'ViewFileCtrl',
        //         size: 'md',
        //         windowClass : 'model-z-index',
        //         resolve:{
        //             item :  function () {
        //                return item;
        //             }
        //         }
        //     });
        // };




    }

    /** @ngInject */
    function ViewFileCtrl($rootScope, $scope, $state, $sce, $uibModalInstance, item) {
        $scope.item = item;
        $scope.type = $scope.item.type.split('/')[0];
        if ($scope.type == "video") {
            $scope.videoLink = $sce.trustAsResourceUrl($scope.item.downloadUrl);
        }

        $scope.close = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }

})();
