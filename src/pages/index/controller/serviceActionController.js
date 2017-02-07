var magic = require('../../../../util/magic.js');
var Promise = require('bluebird');
var util = require('component/util.js');
module.exports = function(App){

    App.controller('actionList', ['$scope','currMenu','$$action','$location',
        function($scope,currMenu,$$action,$location){
            document.title = '字段列表';
            angular.element("#nav-title").text(angular.element("#currMenuName").val());
            var preUrl = "/";
            $scope.goBack = function () {
                return $location.path(preUrl);
            };
            $scope.listItems = null;
            $$action.getActionList().then(function(data){
                if(data.code==0){
                    $scope.$apply(function(){
                        $scope.listItems=data.list;
                    });
                }else{

                }
            }).catch(function(error){
                util.handleError(error);
            })
    }]);
    App.controller('actionView',['$scope','$location','$http','$$action',
        function ($scope,$location,$http,$$action) {
            document.title = '字段预览';
            $("#nav-title").text('字段预览');
            $(".bar a").hide();
            var preUrl = "/serviceAction/list";
            $scope.goBack = function () {
                return $location.path(preUrl);
            };
            $scope.actionDelete = function (actionName) {
                $$action.actionDelete(actionName).then(function(data){
                    if(data.code==0){
                        $$action.location(magic.NG_ACTION_DELETE_SUCCESS);
                    }else{
                        $$action.location(magic.NG_ACTION_DELETE_FAIL);
                    }
                }).catch(function(error){
                    util.handleError(error);
                    $$action.location(magic.NG_ACTION_DELETE_FAIL);
                });
            };
            $scope.actionUpdate = function (actionName) {
                $$action.location(magic.NG_ACTION_UPDATE.replace(':name',actionName));
            };
    }]);
    App.controller('actionUpdate',['$scope','$location','$http','$$action'
        ,function ($scope,$location,$http,$$action) {
            document.title = '字段更新';
            $("#nav-title").text('字段更新');
            $(".bar a").hide();
            var preUrl = magic.NG_ACTION_LIST;
            $scope.goBack = function () {
                return $location.path(preUrl);
            };
            $scope.cancelUpdate = function (actionName) {
                $$action.location(magic.NG_ACTION_VIEW.replace(':name',actionName));
            };
            $scope.actionUpdate = function (actionName,action) {
                $$action.actionUpdate(actionName,action).then(function(data){
                    if(data.code==0){
                        $$action.location(magic.NG_ACTION_UPDATE_SUCCESS);
                    }else{
                        $$action.location(magic.NG_ACTION_UPDATE_FAIL);
                    }
                }).catch(function(error){
                    util.handleError(error);
                    $$action.location(magic.NG_ACTION_UPDATE_FAIL);
                });
            }
    }]);
    App.controller('actionUpdateSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('actionUpdateFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('actionAdd',['$scope','$location','$$action',
        function ($scope,$location,$$action) {
        document.title = '字段添加';
        $("#nav-title").text('字段添加');
        $(".bar a").hide();
        var preUrl = "/serviceAction/list";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        $scope.actionAdd = function (action) {
            $$action.actionAdd(action).then(function(data){
                if(data.code==0){
                    $$action.location(magic.NG_ACTION_ADD_SUCCESS);
                }else{
                    $$action.location(magic.NG_ACTION_ADD_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_ACTION_ADD_FAIL);
            });
        }
    }]);
    App.controller('actionAddSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('actionAddFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('actionDeleteSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('actionDeleteFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    // 用户名的异步性合法验证
    App.directive('existUserName',['$http','$q',function ($http,$q) {
        return{
            require:'ngModel',
            link:function (scope,elm,attr,ctrl) {
                ctrl.$asyncValidators.existUserName = function (modelValue, viewValue) {
                    var options = {
                        method:'GET',
                        url:'/serviceAction/check/'+viewValue
                    };
                    return $http(options).then(function resolved(response) {
                        if(response.data.code == 1 ){
                            return  $q.reject(response);
                        }else{
                            return false;
                        }
                    }, function rejected(err) {
                        console.log(err);
                    });

                };
            }
        }
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
                /**
                 * 返回actionList;
                 * @returns {bluebird|exports|module.exports}
                 */
                getActionList:function(){
                    return _getBase(magic.URL_ACTION_LIST);
                },
                getTypeList:function () {
                    return _getBase(magic.URL_TYPE_LIST);
                },
                actionAdd:function(body){
                    return _getBase(magic.URL_ACTION_ADD,body);
                },
                actionUpdate:function(actionName,body){
                    return _getBase(magic.URL_ACTION_UPDATE.replace(':name',actionName),body);
                },
                actionDelete:function(actionName){
                   return _getBase(magic.URL_ACTION_DELETE.replace(':name',actionName));
                },
                serviceTypeDelete:function (serviceTypeId) {
                    return _getBase(magic.URL_TYPE_DELETE.replace(':id',serviceTypeId));
                },
                serviceTypeUpdate:function(serviceTypeId,body){
                    return _getBase(magic.URL_TYPE_UPDATE.replace(':id',serviceTypeId),body);
                },
                getVendorServiceType:function (serviceTypeId) {
                    return _getBase(magic.URL_VENDOR_ACTIONS.replace(':id',serviceTypeId));
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