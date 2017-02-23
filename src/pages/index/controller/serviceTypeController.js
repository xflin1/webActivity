var magic = require('../../../../util/magic.js');
var Promise = require('bluebird');
var util = require('component/util.js');
module.exports = function(App){
    App.controller('typeList', ['$scope','currMenu','$$action','$location',
        function($scope,currMenu,$$action,$location){
            document.title = '服务列表';
            angular.element("#nav-title").text(angular.element("#currMenuName").val());
            var preUrl = "/";
            $scope.goBack = function () {
                return $location.path(preUrl);
            };
            $scope.listItems = null;
            $$action.getTypeList().then(function(data){
                if(data.code==0){
                    $scope.$apply(function(){
                        $scope.listItems=data.list;
                        console.log($scope.listItems);
                    });
                }else{
                    console.log(data.msg);
                }
            }).catch(function(error){
                console.log('未知错误'+error);
            })
        }]);
    App.controller('typeAdd',['$scope','$location','$http','$$action',function ($scope,$location,$http,$$action) {
        document.title = '服务添加';
        $("#nav-title").text('服务添加');
        $(".bar a").hide();
        var preUrl = "/serviceType/list";
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
                console.log(data.msg);
            }
        }).catch(function(error){
            console.log('未知错误'+error);
        });
        $scope.typeAdd = function (service) {
            //参数解析-----------------------
           var $postData = {};
            $postData.name = service.name;
            delete service.name;
            if(service.remark){
                $postData.remark = service.remark;
                delete service.remark;
            }
            if(!$.isEmptyObject(service)){
                $postData.actions = "[";
                for(var name in service)
                    $postData.actions += name+",";
                $postData.actions = $postData.actions.substr(0,$postData.actions.length-1);
                $postData.actions += "]";
            }
            $postData = JSON.stringify($postData);
            //表单提交-----------------------
            var req = {
                method:'POST',
                url:'/serviceType/add',
                headers:{
                    'Content-Type':'application/json'
                },
                data:$postData
            };

            $http(req).then(function (response) {
              var  succUrl = '/serviceType/addSuccess';
                $location.path(succUrl);
            },function () {
              var  failUrl = '/serviceType/addFail';
                $location.path(failUrl);
            });
        }
    }]);
    App.controller('typeAddSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('typeAddFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('serviceTypeDeleteSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('serviceTypeDeleteFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('serviceTypeView',['$scope','$location','$http','$$action',function ($scope,$location,$http,$$action) {
        document.title = '服务预览';
        $("#nav-title").text('服务预览');
        $(".bar a").hide();
        var preUrl = "/serviceType/list";
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
        $scope.serviceTypeDelete = function (serviceTypeId) {
            $$action.serviceTypeDelete(serviceTypeId).then(function(data){
                if(data.code==0){
                    $$action.location(magic.NG_TYPE_DELETE_SUCCESS);
                }else{
                    $$action.location(magic.NG_TYPE_DELETE_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_TYPE_DELETE_FAIL);
            });
        };
        $scope.serviceTypeUpdate = function (serviceTypeId) {
            $$action.location(magic.NG_TYPE_UPDATE.replace(':id',serviceTypeId));
        };
    }]);
    App.controller('serviceTypeUpdate',['$scope','$location','$http','$$action',function ($scope,$location,$http,$$action) {
        document.title = '服务更新';
        $("#nav-title").text('服务更新');
        $(".bar a").hide();
        var preUrl = magic.NG_TYPE_LIST;
        $scope.goBack = function () {
            return $location.path(preUrl);
        };
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
        });
        $scope.ifSelected = function (name,actions) {
            actions = actions.substr(1,actions.length-2).split(',');
            if($.inArray(name,actions) != -1){
                return 'true';
            }else{
                return 'false';
            }

        };
        $scope.cancelUpdate = function (serviceTypeId) {
            $$action.location(magic.NG_TYPE_VIEW.replace(':id',serviceTypeId));
        };
        $scope.serviceTypeUpdate = function (serviceTypeId,serviceType) {
            //参数解析-----------------------
            $postData = {};
            $postData.name = serviceType.name;
            delete serviceType.name;
            if(serviceType.remark){
                $postData.remark = serviceType.remark;
                delete serviceType.remark;
            }
            if(!$.isEmptyObject(serviceType)){
                $postData.actions = "[";
                for(var name in serviceType)
                    if(serviceType[name] == true){
                        $postData.actions += name+",";
                    }
                $postData.actions = $postData.actions.substr(0,$postData.actions.length-1);
                $postData.actions += "]";
            }
            $postData = JSON.stringify($postData);
            $$action.serviceTypeUpdate(serviceTypeId,$postData).then(function(data){
                if(data.code==0){
                    $$action.location(magic.NG_TYPE_UPDATE_SUCCESS);
                }else{
                    $$action.location(magic.NG_TYPE_UPDATE_FAIL);
                }
            }).catch(function(error){
                util.handleError(error);
                $$action.location(magic.NG_TYPE_UPDATE_FAIL);
            });
        }
    }]);
    App.controller('serviceTypeUpdateSuccess',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
    App.controller('serviceTypeUpdateFail',['$scope','$location',function ($scope,$location) {
        $scope.redirectTo = function (url) {
            return $location.path(url);
        }
    }]);
};