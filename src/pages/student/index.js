var angular = require('angular');
require('angular-route');
require('imports?this=>window!./mobile-angular-ui.js');
require('ng-file-upload');

var magic = require('../../../util/magic.js');
var App = angular.module('myApp',["ngRoute",'mobile-angular-ui','ngFileUpload']);
require('./controller/controller.js')(App);
App.config(['$routeProvider',function ($routeProvider) {
    $routeProvider.when(magic.NG_STUDENT_HOME,{
        templateUrl:magic.URL_STUDENT_HOME,
        controller:'home'
    }).when(magic.NG_STUDENT_SIGNED,{
        templateUrl:magic.URL_STUDENT_SIGNED,
        controller:'signed'
    }).when(magic.NG_STUDENT_LOADER,{
        templateUrl:magic.URL_LOADER_INDEX,
        controller:'loader'
    }).when(magic.NG_STUDENT_LOADER_COMPLETE,{
        templateUrl:magic.URL_LOADER_INDEX,
        controller:'loader'
    }).when(magic.NG_STUDENT_LOADER_ADD,{
        templateUrl:magic.URL_LOADER_ADD_INDEX,
        controller:'loaderAdd'
    }).when(magic.NG_STUDENT_MANAGE,{
        templateUrl:magic.URL_STUDENT_MANAGE,
        controller:'manageList'
    }).when(magic.NG_STUDENT_MANAGE_VENDOR,{
        templateUrl:magic.URL_STUDENT_MANAGE_VENDOR,
        controller:'manageVendor'
    }).when(magic.NG_STUDENT_ADD_LIST,{
        templateUrl:magic.URL_STUDENT_ADD_LIST,
        controller:'addList'
    }).otherwise({
        redirectTo:magic.NG_STUDENT_HOME
    });
}]);

module.exports = App;