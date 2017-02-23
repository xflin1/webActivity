var magic = require('../../../../util/magic.js');
var util = require('component/util.js');
var uiToast = require('component/uiToast');
var vendorActionsParse = require('../../../../util/vendorActionsParse.js');
module.exports = function(App){
    uiToast(App);
    App.controller('home', ['$scope','$http','ToastService','$timeout',function($scope,$http,ToastService,$timeout){
    }]);
    App.controller('setting',['$scope','$location','$$action','ToastService',function ($scope,$location,$$action,ToastService) {
        document.title = '企业设置';
        angular.element("#nav-title").text(angular.element("#currMenuName").val());
        var preUrl = "/";
        $scope.toastService = ToastService;
        $scope.goBack = function () {
            return $location.path(preUrl);
        };

        $$action.getVendorByUid().then(function (data) {
            $scope.$apply(function () {
                $scope.vendor = data.data;
            });
        });
        $scope.vendorUpdate = function () {
            $$action.vendorUpdate($scope.vendor.id,$scope.vendor).then(function (data) {
                if(data.code==0){
                    $scope.$apply(function () {
                        ToastService.showSuccess('设置成功');
                    });
                }else{
                    $scope.$apply(function () {
                        ToastService.showWarning('设置失败');
                    });
                }
            });
        };
    }]);
    App.controller('serviceManage',['$scope','$location','$http',function ($scope,$location,$http) {
        document.title = '服务管理';
        angular.element("#nav-title").text("已发布活动");
        var preUrl = "/";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        var options = {
            method:'GET',
            url:'/vendor/serviceData'
        };
        $http(options).then(function resolved(response) {
            $scope.listItems=response.data.list;
        }, function rejected(err) {
            console.log(err);
        });

    }]);
    App.controller('serviceView',['$scope','$$action','$routeParams','$location',function ($scope,$$action,$routeParams,$location) {
        document.title = '服务预览';
        angular.element("#nav-title").text("服务预览");
        $(".bar a").hide();
        var preUrl = "/vendor/serviceManage";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        $$action.serviceUpdate($routeParams.id).then(function (data) {
            $scope.$apply(function () {
                $scope.service = data.data[0];
                $scope.service.limitedNum = JSON.parse(data.data[0]['msgAttrs']).Register.limitedNum;

            });

        });
        $scope.serviceDelete = function (id) {
            $$action.serviceDelete(id).then(function(data){
                if(data.code==0){
                    $$action.location(magic.NG_VENDOR_SERVICEDELETE_SUCCESS);
                }else{
                    $$action.location(magic.NG_VENDOR_SERVICEDELETE_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_VENDOR_SERVICEDELETE_FAIL);
            });
        };
        $scope.serviceUpdate = function (id) {
            $$action.location(magic.NG_VENDOR_SERVICEUPDATE.replace(':id',id));
        };
    }]);
    App.controller('serviceAdd',['$scope','$location','$http','$$action',function ($scope,$location,$http,$$action) {
        document.title = '添加服务';
        $("#nav-title").text('添加服务');
        $(".bar a").hide();
        var preUrl = magic.NG_VENDOR_SERVICEMANAGE;
        $scope.goBack = function () {
            return $location.path(preUrl);
        };

        var options = {
            method:'GET',
            url:'/vendor/1/actions'
        };
        $http(options).then(function resolved(response) {
            $scope.actions = response.data.data.substr(1,response.data.data.length-2).split(',');
            var html = vendorActionsParse.actionsParse($scope.actions);
            angular.element("#actions").html(html);
        }, function rejected(err) {
            console.log(err);
        });

        $scope.serviceAdd = function (service) {
            /*测试数据*/
            // service.vid = 1;
            // service.st = 2;

            var msgAttrs = {};
            msgAttrs.Register = {};
            msgAttrs.Register.limitedNum = $('[name="limitedNum"]').val();

            service.msgAttrs = JSON.stringify(msgAttrs);
            $$action.serviceAdd(service).then(function (data) {
                if(data.code==0){
                    $$action.location(magic.NG_VENDOR_SERVICEADD_SUCCESS);
                }else{
                    $$action.location(magic.NG_VENDOR_SERVICEADD_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_VENDOR_SERVICEADD_FAIL);
            });

        }

    }]);
    App.controller('serviceUpdate',['$scope','$location','$routeParams','$$action','$http',function ($scope,$location,$routeParams,$$action,$http) {
        document.title = '更新服务';
        $("#nav-title").text('更新服务');
        $(".bar a").hide();
        var preUrl = magic.NG_VENDOR_SERVICEMANAGE;
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        var options = {
            method:'GET',
            url:'/vendor/1/actions'
        };
        $http(options).then(function resolved(response) {
            $scope.actions = response.data.data.substr(1,response.data.data.length-2).split(',');
            var html = vendorActionsParse.actionsParse($scope.actions);
            angular.element("#actions").html(html);
        }, function rejected(err) {
            console.log(err);
        });
        $$action.serviceUpdate($routeParams.id).then(function (data) {
            $scope.$apply(function () {
                $scope.service = data.data[0];
                var limitedNum = JSON.parse(data.data[0]['msgAttrs']).Register.limitedNum;
                $('[name="limitedNum"]').val(limitedNum);
            });

        });

        $scope.serviceUpdate = function (serviceData) {
            var msgAttrs = {};
            msgAttrs.Register = {};
            msgAttrs.Register.limitedNum = $('[name="limitedNum"]').val();
            serviceData.msgAttrs = JSON.stringify(msgAttrs);
            $$action.serviceUpdatePost(serviceData.id,serviceData).then(function(data){
                if(data.code==0){
                    $$action.location(magic.NG_VENDOR_SERVICEUPDATE_SUCCESS);
                }else{
                    $$action.location(magic.NG_VENDOR_SERVICEUPDATE_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_VENDOR_SERVICEUPDATE_FAIL);
            });

        };

        $scope.cancelUpdate = function (id) {
            $$action.location(magic.NG_VENDOR_SERVICEVIEW.replace(':id',id));
        };


    }]);
    App.controller('addSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('addFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('updateSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('updateFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('deleteSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('deleteFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);


    App.controller('userInfo', ['$scope', '$$action', '$location',
        function ($scope, $$action, $location) {
            //    document.title = '个人信息';
            //   angular.element("#nav-title").text(angular.element("#currMenuName").val());
            document.title = '个人资料';
            $("#nav-title").text('个人资料');
            $(".bar a").hide();
            var preUrl = "/";
            $scope.goBack = function () {
                return $location.path(preUrl);
            };

            $scope.selfInfo=null;
            $$action.getSelf().then(function(data){
                $scope.$apply(function(){
                    $scope.selfInfo=data.list[0];
                });
            }).catch(function (error) {
                util.handleError(error);
            });
        }]);

    App.controller('userInfoUpdate',['$scope','$http','$$action','$routeParams','$location',
        function($scope,$http,$$action,$routeParams,$location){
            $scope.template = {
                qq:'QQ',
                email:'Email',
                phone:'电话',
                nickname:'昵称',
                sex:'性别'
            };
            console.log($scope.template.hasOwnProperty($routeParams.type));
            if(!$scope.template.hasOwnProperty($routeParams.type)){
                $location.path(magic.NG_STUDENT_INFO);
            }else{
                $scope.type = $routeParams.type;
                $$action.getSelf().then(function(data){
                    $scope.$apply(function() {
                        $scope.info = (data.list[0])[$routeParams.type];
                    });
                });
                $scope.submitting = '修改';
            }

            $scope.submit = function(info){
                var data = {
                };
                data[$routeParams.type] = info;
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code == 0)
                    {
                        $location.path(magic.NG_STUDENT_INFO);
                    }
                });
                $scope.submitting = '提交中';
            };
        }]);
    App.controller('password',['$scope','$http','$location',
        function($scope,$http,$location){
            $scope.submitting = '保存';
            $scope.submitPWD = function(user){
                var data = {
                    pass:user['newPassword']
                };
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code==0)
                        $location.path(magic.NG_STUDENT_INFO);
                });
                $scope.submitting = '提交中';
            };
        }]);

    App.service('$$action',['$rootScope','$http','$location',
        function($rootScope,$http,$location){
            /**
             * 根据url和body 获取http post结果
             * @param url
             * @param [body]
             * @returns {bluebird|exports|module.exports}
             * @private
             */
            var _getBase = function(url,body){
                body==undefined?body={}:body;
                return new Promise(function(resolve,reject){
                    $http.post(url,body).success(function(data){
                        util.handleRes(data);
                        resolve(data);
                    }).error(function(error){
                        reject(error);
                    })
                });
            };
            return {
                vendorUpdate:function (id,vendor) {
                    return _getBase(magic.URL_VENDOR_UPDATE.replace(':id',id),vendor);
                },
                getSelf:function(){
                    return _getBase(magic.URL_USER_SELF);
                },
                serviceAdd:function (service) {
                    return _getBase(magic.URL_VENDOR_SERVICEADD,service);
                },
                serviceUpdate:function (id) {
                    return _getBase(magic.URL_VENDOR_SERVICEDATA_UPDATE.replace(':id',id));
                },
                serviceUpdatePost:function (id,body) {
                    return _getBase(magic.URL_VENDOR_SERVICE_UPDATE.replace(':id',id),body);
                },
                serviceDelete:function (id) {
                    return _getBase(magic.URL_VENDOR_SERVICEDELETE.replace(':id',id));
                },
                getVendorByUid:function () {
                    return _getBase(magic.URL_VENDOR_SETTING);
                },
                location:function(url){
                    if($rootScope.$$phase){
                        $location.path(url);
                    }else{
                        $rootScope.$apply(function(){
                            $location.path(url);
                        });
                    }
                }
            }

        }]);

};