var magic = require('../../../util/magic.js');
var Promise = require('bluebird');
require('./style.css');
module.exports=function(App){
    App.directive('uiAccordion',function(){
       return{
           restrict:'A',
           templateUrl:magic.COMPONENT_ACCORDION,
           scope:{
               initData:'=uiAccordion'
           },
           link:function(scope,elem){
               scope.accordionFa = scope.initData.accordionFa;
               scope.accordionName = scope.initData.accordionName;
               scope.subMenu = scope.initData.subMenu;
               scope.checkBox = true;
               scope.subStyle = {
                 "max-height":"400px"
               };
               scope.toggleAccordion = function(){
                   scope.checkBox=!scope.checkBox;
               };
               scope.$watch('subMenu',function(n){
                   if(n!==undefined){
                       var height = n['length']*43;
                       scope.subStyle["max-height"] = height+'px';
                   }
               },true)
           }
       }
    });
};
