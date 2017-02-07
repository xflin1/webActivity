var App = require('../../index.js');
var webSocket = require('../../websocket.js');
require('./test.css');
App.controller('test',['$scope',function($scope){
/*    $scope.test1 = 'hello world';
    $scope.client = new webSocket(function(packet){
        console.log(packet);
    });
    $scope.client.connect({token:'test'});
    $scope.sendMsg = function(){
        var data = {};
        data._group = 1;
        data._packType = 1;
        data._to = 2;
        data._payload = {
            job: 'chat'
        };
        $scope.client.send(data);
    }*/
}]);

App.service('ws',function(){
    var _this = this;
    this.client=new webSocket(function(packet){
        console.log(packet);
    });
});
