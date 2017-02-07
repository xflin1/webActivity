module.exports = function(App){
    // 用户名的异步性合法验证
    App.directive('existUserName',['$http','$q',function ($http,$q) {
        return{
            require:'ngModel',
            link:function (scope,elm,attr,ctrl) {
                ctrl.$asyncValidators.existUserName = function (modelValue, viewValue) {
                    var options = {
                        method:'GET',
                        url:'/userName/check/'+viewValue
                    };
                    return $http(options).then(function resolved(response) {

                        if(response.data.code == 1 ){
                            return  $q.reject(response);
                        }else{
                            return true;
                        }
                    }, function rejected(err) {
                        console.log(err);
                    });

                };
            }
        }
    }]);
};