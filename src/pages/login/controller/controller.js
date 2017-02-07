var uiToast = require('component/uiToast');
module.exports = function(App){
    uiToast(App);
    App.controller('login',
        ['$scope','$http','ToastService','$timeout',function($scope,$http,ToastService,$timeout){
            $scope.toastService = ToastService;
            $scope.user={
                name:'',
                pass:''
            };
            $scope.login=function(user){
                user.name=angular.element('#name').val();
                ToastService.showLoading('登录中');
                var url = '/login';
                $http.post(url,user)
                    .success(function(data){
                        if(data.code==0){
                            ToastService.showSuccess('登录成功');
                            $timeout(function(){
                                window.location = '/';
                            },800);
                        }else{
                            ToastService.showWarning('用户名或密码错误');
                        }
                    }).error(function(){
                        ToastService.showWarning('未知错误');
                    });
            };
}]);};



