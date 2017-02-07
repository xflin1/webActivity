var magic = require('component/magic.js');
var Promise = require('bluebird');
var util = require('component/util.js');
module.exports = function(App){

    App.controller('actionList', ['$scope','currMenu','$$action',
        function($scope,currMenu,$$action){
            document.title = '字段列表';
            angular.element("#nav-title").text(angular.element("#currMenuName").val());
            $scope.listItems = null;
            $$action.getActionList().then(function(data){
                if(data.code==0){
                    $scope.$apply(function(){
                        $scope.listItems=data.list;
                    });
                }else{
                    console.log(data.msg);
                }
            }).catch(function(error){
                console.log('未知错误'+error);
            })
    }]);
    App.controller('actionView',['$scope','$location',function ($scope,$location) {
        document.title = '字段预览';
        $("#nav-title").text('字段预览');
        $(".bar a").hide();
        var preUrl = "/serviceAction/list";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
    }]);
    App.controller('actionAdd',function ($scope,$location,$http) {
        document.title = '字段添加';
        $("#nav-title").text('字段添加');
        $(".bar a").hide();
        var preUrl = "/serviceAction/list";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        $scope.actionAdd = function (action) {
            $postData = JSON.stringify(action);
            var req = {
                method:'POST',
                url:'/serviceAction/add',
                headers:{
                    'Content-Type':'application/json',
                },
                data:$postData
            };
            $http(req).then(function (response) {
                succUrl = '/serviceAction/addSuccess';
                $location.path(succUrl);
            },function () {
                failUrl = '/serviceAction/addFail';
                $location.path(failUrl);
            });
        }
    });
    App.controller('actionAddSuccess',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    });
    App.controller('actionAddFail',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    });
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

    App.service('$$action',['$http',function($http){
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
            }
        }

    }]);
};