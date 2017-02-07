var angular = require('angular');
require('angular-route');


var magic = require('../../../util/magic.js');
var App = angular.module('myApp',["ngRoute"]);
require('./controller/vendorController.js')(App);
App.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when(magic.NG_VENDOR_HOME,{
        templateUrl:magic.URL_VENDOR_HOME,
        controller:'home'
    }).when(magic.NG_VENDOR_SETTING,{
        templateUrl:magic.URL_VENDOR_SETTING,
        controller:"setting"
    }).when(magic.NG_VENDOR_SERVICEMANAGE,{
        templateUrl:magic.URL_VENDOR_SERVICEMANAGE,
        controller:"serviceManage"
    }).when(magic.NG_VENDOR_SERVICEADD,{
        templateUrl:magic.URL_VENDOR_SERVICEADD,
        controller:"serviceAdd"
    }).when(magic.NG_VENDOR_SERVICEUPDATE,{
        templateUrl:function ($routeParams) {
            return magic.URL_VENDOR_SERVICEDATA_UPDATE.replace(':id',$routeParams.id);
        },
        controller:'serviceUpdate'
    }).when(magic.NG_VENDOR_SERVICEADD_SUCCESS,{
        templateUrl:magic.URL_VENDOR_SERVICEADD_SUCCESS,
        controller:"addSuccess"
    }).when(magic.NG_VENDOR_SERVICEADD_FAIL,{
        templateUrl:magic.URL_VENDOR_SERVICEADD_FAIL,
        controller:"addFail"
    }).when(magic.NG_VENDOR_SERVICEUPDATE_SUCCESS,{
        templateUrl:magic.URL_VENDOR_SERVICEUPDATE_SUCCESS,
        controller:"updateSuccess"
    }).when(magic.NG_VENDOR_SERVICEUPDATE_FAIL,{
        templateUrl:magic.URL_VENDOR_SERVICEUPDATE_FAIL,
        controller:"updateFail"
    }).when(magic.NG_VENDOR_SERVICEDELETE_SUCCESS,{
        templateUrl:magic.URL_VENDOR_SERVICEDELETE_SUCCESS,
        controller:"deleteSuccess"
    }).when(magic.NG_VENDOR_SERVICEDELETE_FAIL,{
        templateUrl:magic.URL_VENDOR_SERVICEDELETE_FAIL,
        controller:"deleteFail"
    }).when(magic.NG_VENDOR_SERVICEVIEW,{
        templateUrl:magic.URL_VENDOR_SERVICEVIEW,
        controller:"serviceView"
    }).otherwise({
        redirectTo:magic.NG_VENDOR_HOME
    });
}]);

module.exports = App;