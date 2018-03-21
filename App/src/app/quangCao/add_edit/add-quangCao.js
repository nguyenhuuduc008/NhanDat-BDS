(function() {
    'use strict';
    angular.module("app.quangCao").controller("addQuangCaoCtrl", qcVM);

    function getParameterByName(name, url) {
	    if (!url) url = window.location.href;
	    name = name.replace(/[\[\]]/g, "\\$&");
	    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),  results = regex.exec(url);
	    if (!results) return null;
	    if (!results[2]) return '';
	    return decodeURIComponent(results[2].replace(/\+/g, " "));
	}

	function guid() {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                    .toString(16)
                    .substring(1);
            }
            return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    /** @ngInject **/
    function qcVM($rootScope, $scope, $timeout, $state,$stateParams, $ngBootbox, quangCaoService, authService, currentAuth, appUtils, toaster) {
        $rootScope.settings.layout.showSmartphone = false;
        $rootScope.settings.layout.showPageHead = true;
        $rootScope.settings.layout.guestPage = false;

        if ($rootScope.reProcessSideBar) {
            $rootScope.reProcessSideBar = false;
        }

        var qcVM = this; // jshint ignore:line
        //$scope.emailRegx = /^[^!'"\/ ]+$/;
        $scope.emailRegx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        $scope.phoneRegx = /^(0-9)*[^!#$%^&*()'"\/\\;:@=+,?\[\]\/.A-Za-z ]*$/;

        qcVM.showInvalid = false;

        qcVM.quangCao = {
        	id:'',
            viTri: {name: "top", value:"Banner Top"},
            duongDan: '',
            photoURL: '',
            email: '',
            phoneNumber: '',
            timeShow: '',
            status:true,
            isDeleted:false,
            timestampCreated:'',
            timestampModified: ''
        };

       
        qcVM.dataViTri = [{name: "top", value:"Banner Top"},
                            {name: "left1", value:"Banner Left 1"},
                            {name: "left2", value:"Banner Left 2"},
                            {name: "right1", value:"Banner Right 1"},
                            {name: "right2", value:"Banner Right 2"},
                            {name: "right3", value:"Banner Right 3"}
                        ];
        
        qcVM.control = {
        	isEdit: false
        };
        // Load Data

		function loadDetail() {
       
			appUtils.showLoading();
           
			qcVM.quangCao.id =  getParameterByName("id",window.location.href);
            if(!qcVM.quangCao.id) qcVM.quangCao.id = $stateParams.id;

			if(qcVM.quangCao.id) {
				quangCaoService.get(qcVM.quangCao.id).$loaded().then(function (result) {
					if (result) {
						qcVM.control.isEdit = true;	
						qcVM.quangCao = result;
					}
					appUtils.hideLoading();
				});	
	            
			} else {
				qcVM.quangCao.id = guid();
				appUtils.hideLoading();
			}
			
		}

		loadDetail();

        //Functions
        qcVM.create = function(form) {
            
            appUtils.showLoading();
            qcVM.showInvalid = true;
            if (form.$invalid) {
                return;
            }
            if(qcVM.control.isEdit) {
            	qcVM.editQC();
            } else {
            	qcVM.createQC();
            }
        };

        qcVM.editQC = function() {
        	var req = quangCaoService.update(qcVM.quangCao);
			req.then(function (res) {
				if (!res.result) {
					appUtils.hideLoading();
					$ngBootbox.alert(res.errorMsg.message);
					return;
				}
				 
				appUtils.hideLoading();
				$scope.$apply(function () {
					toaster.pop('success', 'Success', "Quảng Cáo Updated.");
				});
				
                $state.go('quangCao.list');  
			},function(res) {
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            })  ;
        	
        };

        qcVM.createQC = function () {

        	quangCaoService.create(qcVM.quangCao).then(function(res) {

                if (res && !res.result) {
                    $ngBootbox.alert(res.errorMsg.message);
                    return;
                }
               
                toaster.pop('success', 'Success', "Quảng Cáo đã được tạo.");
                appUtils.hideLoading();
    
                
                $state.go('quangCao.list');
            }, function(res) {
                $ngBootbox.alert(res.errorMsg.message);
                appUtils.hideLoading();
                return;
            });
             
        };

        qcVM.cancel = function(form) {
            $state.go('quangCao.list');
        };

        angular.element(document).ready(function () {
            $("#avatar-file").change(function () {
                appUtils.showLoading();
                var file = $(this)[0].files[0];

                if (file) {
                    var metadata = {
                        contentType: file.type
                    };
                    
                    // Generate lowres and hires
                    var _URL = window.URL || window.webkitURL;
                    var img = new Image();
                    img.src = _URL.createObjectURL(file);
                    img.onload = function () {
                        
                        // Generate avatar img
                        var maxWidth = 150;
                        var quality = 1;
                        var avatar = appUtils.getAvatar(img, maxWidth, quality, file.type);
                        avatar.name = file.name;

                        var uid = qcVM.quangCao.id ? qcVM.quangCao.id : qcVM.quangCao.$id;
                        var path = 'quangCao/Avatar/' + uid;
                        
                        //Call service to Upload
                        var uploadTask = quangCaoService.uploadAvatar(path, avatar.data, metadata);
                        uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                        }, function (error) {}, function (data) {
                            appUtils.hideLoading();
                            // Upload completed successfully, now we can get the download URL
                            var downloadURL = uploadTask.snapshot.downloadURL;
                            
                            qcVM.quangCao.photoURL = downloadURL;
                            
                            var uid = qcVM.quangCao.id? qcVM.quangCao.id : qcVM.quangCao.$id;
                            quangCaoService.saveChangeAvatar(uid, downloadURL);
                            $('#avatar-file').val('');
                            $('.fileinput').removeClass('fileinput-exists');
                            $('.fileinput').addClass('fileinput-new');
                     
                            $timeout(angular.noop);
                            
                        });
                    };
                }
            });
        });
    }
})();