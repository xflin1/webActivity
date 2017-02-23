var magic = require('../../../util/magic.js');
var Promise = require('bluebird');
require('./style.css');
module.exports=function(App){
    App.directive('uiCarousel',['$touch',function($touch){
        return{
            restrict:'A',
            templateUrl:magic.COMPONENT_CAROUSEL,
            scope:{
                items:'=uiCarousel'
            },
            link:function(scope,elem){
                scope.galleryStyle=null;
                scope.gallery=false;
                scope.style = {
                    width:'100%',
                    transform: 'translate3d(0px, 0px, 0px)',
                    transition: '-webkit-transform 0.5s ease'
                };
                scope.$watch('items',function(newValue){
                    if(newValue['image']){
                        scope._width = elem.width();
                        scope._page = 0;
                        scope._length = newValue['image'].length;
                        scope._recent = -1*scope._page*scope._width;
                        var width = scope._length*100;
                        scope.style.width = width+'%';
                        scope.style.transform = 'translate3d(0px, 0px, 0px)';
                        scope.style.transition = '-webkit-transform 0.5s ease';
                    }
                },true);
                $touch.bind(elem.children()[0],{
                    start:function(touch){
                        scope._width = elem.width();
                        scope.style.transition = '-webkit-transform 0s ease';
                        scope.$apply();
                    },
                    move:function(touch){
                        var shift = touch.x-touch.startX;
                        var recent = scope._recent + shift;
                        scope.style.transform='translate3d(:xpx, 0px, 0px)'.replace(':x', recent.toString());
                        scope.$apply();
                    },
                    end:function(touch){
                        var shift = touch.x-touch.startX;
                        var standard = scope._width*5/11;
                        var velocity = touch.velocity;
                        if((shift>0&&shift>standard)||(shift>0&&velocity>=100)){
                            if(scope._page!==0){
                                scope._page--;
                            }
                        }else if((shift<0&&shift>-standard)||(shift<0&&velocity>=100)){
                            if(scope._page!==scope._length-1){
                                scope._page++;
                            }
                        }
                        scope._recent = -1*scope._page*scope._width;
                        scope.style.transform = 'translate3d(:xpx, 0px, 0px)'.replace(':x', scope._recent.toString());
                        scope.style.transition = '-webkit-transform 0.5s ease';
                        if(velocity===0&&shift===0){
                            /*_showGallery();*/
                            console.log(touch);
                        }
                        scope.$apply();
                    }
                });
                var _showGallery = function(){
                    var fid = scope.items['image'][scope._page];
                    scope.gallery=true;
                    scope.galleryStyle={
                        'background-image':'url(/images/:fid)'.replace(':fid',fid)
                    };
                };
            }
        };
    }]);
};