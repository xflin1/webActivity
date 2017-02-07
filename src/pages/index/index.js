var angular = require('angular');
require('angular-route');
var servAction = require('./controller/serviceActionController.js');
var servType = require('./controller/serviceTypeController.js');
var magic = require('../../../util/magic.js');
var App = angular.module('myApp',["ngRoute"]);
servAction(App);
servType(App);
App.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when('/',{
        templateUrl:'/index/list'
    }).when('/list',{
        templateUrl:'/index/list'
    }).when('/add',{
        templateUrl:'/service/add'
    }).when(magic.NG_ACTION_LIST,{
        templateUrl:magic.URL_ACTION_LIST,
        controller:'actionList',
        resolve:{
            currMenu:function () {
                return "listAction";
            }
        }
    }).when(magic.NG_ACTION_ADD,{
        templateUrl:magic.URL_ACTION_ADD,
        controller:'actionAdd'
    }).when(magic.NG_ACTION_ADD_SUCCESS,{
        templateUrl:magic.URL_ACTION_ADD_SUCCESS,
        controller:'actionAddSuccess'
    }).when(magic.NG_ACTION_ADD_FAIL,{
        templateUrl:magic.URL_ACTION_ADD_FAIL,
        controller:'actionAddFail'
    }).when(magic.NG_ACTION_DELETE_SUCCESS,{
        templateUrl: magic.URL_ACTION_DELETE_SUCCESS,
        controller:'actionDeleteSuccess'
    }).when(magic.NG_ACTION_DELETE_FAIL,{
        templateUrl:magic.URL_ACTION_DELETE_FAIL,
        controller:'actionDeleteFail'
    }).when(magic.NG_ACTION_UPDATE,{
        templateUrl:function ($routeParams) {
            return magic.URL_ACTION_UPDATE.replace(':name',$routeParams.name);
        },
        controller:'actionUpdate'
    }).when(magic.NG_ACTION_UPDATE_SUCCESS,{
        templateUrl:magic.URL_ACTION_UPDATE_SUCCESS,
        controller:'actionUpdateSuccess'
    }).when(magic.NG_ACTION_UPDATE_FAIL,{
        templateUrl:magic.URL_ACTION_UPDATE_FAIL,
        controller:'actionUpdateFail'
    }).when(magic.NG_ACTION_VIEW,{
        templateUrl:function ($routeParams) {
            return magic.URL_ACTION_VIEW.replace(':name',$routeParams.name);
        },
        controller:'actionView'
    }).when(magic.NG_TYPE_LIST,{
        templateUrl:magic.URL_TYPE_LIST,
        controller:'typeList',
        reloadOnSearch:true,
        resolve:{
            currMenu:function () {
                return "listAction";
            }
        }
    }).when(magic.NG_TYPE_ADD,{
        templateUrl:magic.URL_TYPE_ADD,
        controller:'typeAdd'
    }).when(magic.NG_TYPE_ADD_FAIL,{
        templateUrl:magic.URL_TYPE_ADD_FAIL,
        controller:'typeAddFail'
    }).when(magic.NG_TYPE_ADD_SUCCESS,{
        templateUrl:magic.URL_TYPE_ADD_SUCCESS,
        controller:'typeAddSuccess'
    }).when(magic.NG_TYPE_VIEW,{
        templateUrl:function ($routeParams) {
            return magic.URL_TYPE_VIEW.replace(':id',$routeParams.id);
        },
        controller:'serviceTypeView'
    }).when(magic.NG_TYPE_DELETE_SUCCESS,{
        templateUrl: magic.URL_TYPE_DELETE_SUCCESS,
        controller:'serviceTypeDeleteSuccess'
    }).when(magic.NG_TYPE_DELETE_FAIL,{
        templateUrl:magic.URL_TYPE_DELETE_FAIL,
        controller:'serviceTypeDeleteFail'
    }).when(magic.NG_TYPE_UPDATE,{
        templateUrl:function ($routeParams) {
            return magic.URL_TYPE_UPDATE.replace(':id',$routeParams.id);
        },
        controller:'serviceTypeUpdate'
    }).when(magic.NG_TYPE_UPDATE_SUCCESS,{
        templateUrl:magic.URL_TYPE_UPDATE_SUCCESS,
        controller:'serviceTypeUpdateSuccess'
    }).when(magic.NG_TYPE_UPDATE_FAIL,{
        templateUrl:magic.URL_TYPE_UPDATE_FAIL,
        controller:'serviceTypeUpdateFail'
    }).otherwise({
        redirectTo:'/'
    });
}]);

module.exports = App;