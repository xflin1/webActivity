var magic =require('../../../util/magic.js');
require('./style.css');

/**
 *
 * @param App
 *
 * 使用方法:
 *      html定义:
 *          <div ui-drop-menu='menus'>
 *
 *      在controller中初始化:
 *          app.controller('example',['ToastService',function(ToastService){
 *              $scope.menus = {
 *                  menu1:{
 *                      name:"字段添加",
                        url:"#/serviceAction/add",
                        icon:"plus"
 *                  }
 *              }
 *          })
 *
 */
module.exports=function(App){
    App.directive('uiDropMenu',[function(){
        return{
            restrict:'A',
            replace:true,
            templateUrl:magic.COMPONENT_DROP_MENU,
            scope:{
                menu:'=uiDropMenu'
            }
        }
    }]);
    App.directive('uiA',['$location',function($location){
        return{
            restrict:'A',
            link:function(scope, element,attr){
                if(('#'+$location.path())==attr['ngHref']){
                    element.addClass('ui-a-active');
                }
            }
        }
    }]);
};
