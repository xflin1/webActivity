var angular = require('angular');
require('angular-route');
var commonDirective = require('../../component/commonDirective.js');
var App = angular.module('myApp',["ngRoute"]);
commonDirective(App);
App.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{
        templateUrl:"/vendorRegister/main",
        controller:"vendorRegister"
    }).when('/success',{
        templateUrl:"/vendorRegister/success"
    }).otherwise({
        redirectTo:'/'
    });
}]);
App.controller('vendorRegister',['$scope','$http','$location',function ($scope,$http,$location) {
    $scope.stepOne = true;
    $scope.stepTwo = false;
    $scope.stepNext = function () {
        $scope.stepOne = false;
        $scope.stepTwo = true;
    };
    $scope.stepForword = function () {
        $scope.stepOne = true;
        $scope.stepTwo = false;
    };
    var req = {
        method:'POST',
        url:'/serviceType/list',
        headers:{
            'Content-Type':'application/json'
        }
    };
    $http(req).then(function(data){
        if(data.data.code==0){
            $scope.listItems=data.data.list;
        }else{
            console.log(data.data.msg);
        }
    }).catch(function(error){
        console.log('未知错误'+error);
    });
    $scope.vendorRegisterSubmit = function (data) {
        var req = {
            method:'POST',
            url:'/vendorRegister/main',
            headers:{
                'Content-Type':'application/json'
            },
            data:data
        };
        $http(req).then(function (response) {
            if(response.data.code==1){
                $location.path('/success');
            }
        },function (err) {
            console.log(err);
        });
    };
}]);
module.exports = App;