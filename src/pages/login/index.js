var angular = require('angular');
var controller = require('./controller/controller.js');
var App = angular.module('myApp',[]);
controller(App);


module.exports = App;