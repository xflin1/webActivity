var magic = require('../../../../util/magic.js');
var util = require('component/util.js');
module.exports = function(App) {

    App.controller('userInfo', ['$scope', '$$action', '$location',
        function ($scope, $$action, $location) {
        //    document.title = '个人信息';
         //   angular.element("#nav-title").text(angular.element("#currMenuName").val());
            document.title = '个人资料';
            $("#nav-title").text('个人资料');
            $(".bar a").hide();
            var preUrl = "/";
            $scope.goBack = function () {
                return $location.path(preUrl);
            };

            $scope.selfInfo=null;
            $$action.getSelf().then(function(data){
                $scope.$apply(function(){
                    $scope.selfInfo=data.list[0];
                });
            }).catch(function (error) {
                util.handleError(error);
            });
        }]);

    App.controller('userInfoUpdate',['$scope','$http','$$action','$routeParams','$location',
        function($scope,$http,$$action,$routeParams,$location){
            $scope.template = {
                qq:'QQ',
                email:'Email',
                phone:'电话',
                nickname:'昵称',
                sex:'性别'
            };
            console.log($scope.template.hasOwnProperty($routeParams.type));
            if(!$scope.template.hasOwnProperty($routeParams.type)){
                $location.path(magic.NG_STUDENT_INFO);
            }else{
                $scope.type = $routeParams.type;
                $$action.getSelf().then(function(data){
                    $scope.$apply(function() {
                        $scope.info = (data.list[0])[$routeParams.type];
                    });
                });
                $scope.submitting = '修改';
            }

            $scope.submit = function(info){
                var data = {
                };
                data[$routeParams.type] = info;
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code == 0)
                    {
                        $location.path(magic.NG_STUDENT_INFO);
                    }
                });
                $scope.submitting = '提交中';
            };
        }]);
    App.controller('password',['$scope','$http','$location',
        function($scope,$http,$location){
            $scope.submitting = '保存';
            $scope.submitPWD = function(user){
                var data = {
                    pass:user['newPassword']
                };
                var url = magic.URL_USER_MODIFY;
                $http.post(url,data).
                success(function(data){
                    if(data.code==0)
                        $location.path(magic.NG_STUDENT_INFO);
                });
                $scope.submitting = '提交中';
            };
        }]);
};
