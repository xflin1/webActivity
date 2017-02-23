angular.module('back',["ngRoute"]).
    controller('mainCtrl',['$scope','$rootScope','$route','$http',function($scope,$rootScope,$route,$http){
        $http({method:'POST',url:'/api/user/info'}).then(function resolved(response) {
            if(response.data.code==0)
                $scope.user=response.data.user;

        }, function rejected(err) {
            console.log(err);
        });

        $rootScope.currentVendor={};
        $scope.submit=function(currentVendor){
            var const_status_default=1;
            var const_errorMsg_default="system error";
            $http({
                method:'POST',
                url:'/audit/update',
                data:{
                    'vid':currentVendor.id,
                    'status':currentVendor.vc?0:const_status_default,
                    'remark':currentVendor.remark
                }
            }).then(function resolved(response) {
                if(response.data.code==0){
                    $scope.errorMsg="";
                    $rootScope.currentVendor={};
                    $('#modal-audit').modal('hide');
                }else{
                    $scope.errorMsg=const_errorMsg_default;
                    $('#modal-audit').modal('hide');
                }
                $route.reload();
            }, function rejected(err) {
                console.log(err);
            });
        };
    }]).
    controller('vendorCtrl',['$scope','$rootScope','$location','$http',function($scope,$rootScope,$location,$http){
        $http({
            method:'POST',
            url:'/audit/vendor/list'
        }).then(function resolved(response) {
          //  console.log(response);
            if(response.data.code==0)
                $scope.vendors=response.data.list;

        }, function rejected(err) {
            console.log(err);
        });

        $scope.auditCancel=function(audit){
            $http({
                method:'POST',
                url:'/audit/update',
                data:audit
            }).then(function resolved(response) {
             //   console.log(response);
                if(response.data.code==0)
                    $scope.vendors=response.data.list;

            }, function rejected(err) {
                console.log(err);
            });
        };
        $scope.pdfVendor=function(vid){
           // console.log('pdfVendor:'+vid);
            $http({
                method:'POST',
                url:'/audit/vendor',
                data:{'vid':vid}
            }).then(function resolved(response) {
               // console.log(response);
                if(response.data.code==0){
                    $rootScope.currentVendor=response.data.vendor;
                    $http({
                        method:'POST',
                        url:'/audit/check',
                        data:{'vid':vid}
                    }).then(function resolved(response) {
                        if(response.data.code==0){
                            $rootScope.currentVendor= $.extend({},$rootScope.currentVendor,response.data.check);
                            $scope.errorMsg="";
                            $('#modal-audit').modal('show');
                        }
                    }, function rejected(err) {
                        console.log(err);
                    });
                }
            }, function rejected(err) {
                console.log(err);
            });
        }
    }]).
controller('userCtrl',['$scope','$route','$http',function($scope,$route,$http){
    $scope.submit = function(info){
        var data = {

        };

        var url = '/api/user/update';
        if(info.password){
            url='/api/user/password';
            data={
                'password':info['password'],
                'newPassword':info['newPassword']
            };
        }else{
            data={
                'nickname':info['nickname'],
                'sex':info['sex'],
                'qq':info['qq'],
                'phone':info['phone'],
                'email':info['email']
            };
        }
        $http.post(url,data).
        success(function(data){
            if(data.code == 0)
            {
              if(info.password){
                  //TODO 更改user内容
              }
                alert('update success');
                $route.reload();
            }
        });
        //$scope.submitting = '提交中';
    };
}]).
    controller('serviceCtrl',['$scope',function($scope){

}]).
    controller('actionCtrl',['$scope',function($scope){

}]).
directive('modal', function () {
        return {
            template: '<div class="modal fade" id="modal-audit">' +
            '<div class="modal-dialog">' +
            '<div class="modal-content">' +
            '<div class="modal-header">' +
            '<span class="close" data-dismiss="modal" aria-hidden="true">&times;</span>' +
            '<h3 class="modal-title">{{ title }}</h3>' +
            '</div>' +
            '<div class="modal-body" ng-transclude></div>' +
            '</div>' +
            '</div>' +
            '</div>',
            restrict: 'E',
            transclude: true,
            replace:true,
            scope:true,
            link: function postLink(scope, element, attrs) {
                scope.title = attrs.title;

                scope.$watch(attrs.visible, function(value){
                    if(value == true)
                        $(element).modal('show');
                    else
                        $(element).modal('hide');
                });

                $(element).on('shown.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = true;
                    });
                });

                $(element).on('hidden.bs.modal', function(){
                    scope.$apply(function(){
                        scope.$parent[attrs.visible] = false;
                    });
                });
            }
        };
    }).
   config(['$routeProvider',function ($routeProvider) {
        $routeProvider.
        when('/vendor',{
            templateUrl:'tpl/vendor.html',
            controller:'vendorCtrl'
        }).
        when('/user',{
            templateUrl:'tpl/user.html',
            controller:'userCtrl'
        }).
        when('/action',{
            templateUrl:'tpl/action.html',
            controller:'actionCtrl'
        }).
        when('/service',{
            templateUrl:'tpl/service.html',
            controller:'serviceCtrl'
        }).otherwise({
            redirectTo:'/vendor'
        })
   }]);

