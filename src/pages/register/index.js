
var angular = require('angular');
require('angular-route');
var commonDirective = require('../../component/commonDirective.js');
var App = angular.module('myApp',["ngRoute"]);
commonDirective(App);
App.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{
        templateUrl:"/register/main",
        controller:"register"
    }).when('/success',{
        templateUrl:"/vendorRegister/success",
        controller:"registerSuccess"
    }).otherwise({
        redirectTo:'/'
    });
}]);
App.controller('registerSuccess',['$scope','$interval',function ($scope,$interval) {
    $scope.clock = 3;
    var timer = $interval(
        function() {
            if($scope.clock !=0){
                $scope.clock--;
            }else{
                $interval.cancel(timer);
                window.location.href="/login";
            }
        },
        1000
    );
}]);
App.controller('register',['$scope','$http','$location',function ($scope,$http,$location) {
    $scope.registerSubmit = function (data) {

        if(data.name){
            data.remark='测试数据描述';
            data.st=1;
            data.mobile='13313313322';
            data.phone='02012121212';
            data.address='广州';
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
        }else{
            var request = {
                method:'POST',
                url:'/student/register',
                headers:{
                    'Content-Type':'application/json'
                },
                data:data
            };
            $http(request).then(function (response) {
                if(response.data.code==0){
                    $location.path('/success');
                }
            },function (err) {
                console.log(err);
            });
        }

    };
}]);
module.exports = App;