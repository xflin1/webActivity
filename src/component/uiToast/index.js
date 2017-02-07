require('./style.css');
/**
 *
 * @param App
 *
 * 使用方法:
 *      html定义:
 *          <div ui-toast='toastService.message',type='toastService.type'>
 *
 *      在controller中初始化:
 *          app.controller('example',['ToastService',function(ToastService){
 *              $scope.toastService = ToastService;
 *              ToastService.showLoading('test');//调用相应函数显示
 *          })
 *
 */
module.exports=function(App){
    App.directive('uiToast',[function(){
        return{
            restrict:'A',
            templateUrl:'/login/uiToast',
            scope:{
                message:'=uiToast',
                type:'='
            },
            link:function(scope){
                scope.hideAlert = function(){
                    scope.message=null;
                }
            }
        }
    }]);
    App.factory('ToastService',['$rootScope','$timeout',function($rootScope,$timeout){
        /**
         *
         * @param {function} fuc
         * @private
         */
        var _apply = function(fuc){
            if($rootScope.$$phase){
                fuc();
            }else{
                $rootScope.$apply(function(){
                    fuc();
                });
            }
        };
        return {
            message:null,
            type:null,
            showLoading : function(msg){
                var _this =this;
                _apply(function(){
                    _this.message = msg;
                    _this.type = 1;
                });
            },
            showWarning :function(msg,func){
                var _this =this;
                _apply(function(){
                    _this.message = msg;
                    _this.type = 2;
                    $timeout(function(){
                        _this.clear();
                        if(func!=undefined){
                            func();
                        }
                    },1500)
                });

            },
            showSuccess :function(msg,func){
                var _this =this;
                _apply(function(){
                    _this.message = msg;
                    _this.type = 0;
                    $timeout(function(){
                        _this.clear();
                        if(func!=undefined){
                            func();
                        }
                    },1500)
                });

            },
            clear : function () {
                var _this = this;
                _apply(function(){
                    _this.message = null;
                    _this.type = null;
                });
            }
        }
    }]);
};
