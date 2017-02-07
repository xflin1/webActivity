var angular = require('angular');
require('angular-route');
var servAction = require('./controller/serviceActionController.js');
var App = angular.module('myApp',["ngRoute"]);
servAction(App);
App.config(function ($routeProvider,$locationProvider) {
    $routeProvider.when('/',{
        templateUrl:'/index/list'
    }).when('/list',{
        templateUrl:'/index/list'
    }).when('/add',{
        templateUrl:'/service/add'
    }).when('/serviceAction/list',{
        templateUrl:'/serviceAction/list',
        controller:'actionList',
        reloadOnSearch:true,
        resolve:{
            currMenu:function () {
                return "listAction";
            }
        }
    }).when('/serviceAction/add',{
        templateUrl:'/serviceAction/add',
        controller:'actionAdd'
    }).when('/serviceAction/addSuccess',{
        templateUrl:'/serviceAction/addSuccess',
        controller:'actionAddSuccess'
    }).when('/serviceAction/addFail',{
        templateUrl:'/serviceAction/addFail',
        controller:'actionAddFail'
    }).when('/serviceAction/list/:name',{
        templateUrl:function ($routeParams) {
            return "/serviceAction/list/"+$routeParams.name;
        },
        controller:'actionView',
    }).otherwise({
        redirectTo:'/'
    });
});

module.exports = App;