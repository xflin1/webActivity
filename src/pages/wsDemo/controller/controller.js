var uiToast = require('component/uiToast');
var ws = require('component/webSocket');

module.exports = function(App){
    uiToast(App);
    ws(App);
    App.controller('wsDemo',
        ['$scope','$http','ToastService','$timeout','ws',function($scope,$http,ToastService,$timeout,ws){
            $scope.toastService = ToastService;
            /*ToastService.showLoading('test');*/
           /* $scope.client = new webSocket(function(packet){
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
            $scope.sendMsg = function(){
                    var payload = {
                        job: 'chat'
                    };
/*                    ws.sendToUser(1,payload);
                    ws.sendToGroup(2,payload);*/
                    console.log(ws.getId());

                };
            ws.init(function(packet){
                console.log(packet);
            });

        }]);
    App.controller('test',['ws','$timeout',function(ws,$timeout){
        $timeout(function(){
            var payload = {
                job: 'chat',
                msg:'1234'
            };
            console.log('send');
            ws.sendToGroup(2,payload);
        },2000);
    }]);

};




