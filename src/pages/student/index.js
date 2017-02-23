var angular = require('angular');
require('imports?this=>window!./mobile-angular-ui.js');
require('imports?this=>window!./mobile-angular-ui.gestures.js');
/*require('./css/mobile-angular-ui-base.css');*/
require('angular-route');
require('ng-file-upload');
require('ng-infinite-scroll');

var magic = require('../../../util/magic.js');
var App = angular.module('myApp',["ngRoute",'mobile-angular-ui','mobile-angular-ui.gestures','ngFileUpload','infinite-scroll']);
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
    }).when(magic.NG_STUDENT_LOADER_MANAGE,{
        templateUrl:magic.URL_LOADER_MANAGE_INDEX,
        controller:'loaderManage'
    }).when(magic.NG_STUDENT_MANAGE,{
        templateUrl:magic.URL_STUDENT_MANAGE,
        controller:'manageList'
    }).when(magic.NG_STUDENT_MANAGE_VENDOR,{
        templateUrl:magic.URL_STUDENT_MANAGE_VENDOR,
        controller:'manageVendor'
    }).when(magic.NG_STUDENT_ADD_LIST,{
        templateUrl:magic.URL_STUDENT_ADD_LIST,
        controller:'addList'
    }).when(magic.NG_STUDENT_INFO,{
        templateUrl:magic.URL_STUDENT_INFO,
        controller:'userInfo'
    }).when(magic.NG_USER_TYPE,{
        templateUrl:magic.URL_USER_INFO,
        controller:'userInfoUpdate'
    }).when(magic.NG_USER_PASSWORD,{
        templateUrl:magic.URL_USER_PASSWORD,
        controller:'password'
    }).when(magic.NG_STUDENT_ADMIN_LOADER,{
        templateUrl:magic.URL_LOADER_ADMIN,
        controller:'adminLoader'
    }).otherwise({
        redirectTo:magic.NG_STUDENT_HOME
    });
}]);

module.exports = App;