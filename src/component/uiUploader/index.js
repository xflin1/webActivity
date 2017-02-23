var magic = require('../../../util/magic.js');
var Promise = require('bluebird');
require('./style.css');
var md5Spark = require('spark-md5');
module.exports=function(App){
    App.directive('uiUploader',['Upload','$upload','$$action',function(Upload,$upload,$$action){
        return {
            restrict:'A',
            templateUrl:magic.COMPONENT_UPLOADER,
            scope:{
                info:'=uiUploader'
            },
            link:function(scope){
                scope.image = [];
                scope.info.data.image = scope.image;
                scope.gallery=false;
                scope.items = [
                ];
                scope.$watch('image',function(newValue){
                    if(newValue['length']!==0){
                        scope.info.image=newValue[0];
                    }else{
                        scope.info.image=0;
                    }
                    console.log(scope.info);
                },true);
                scope.picFile=null;
                scope.hideGallery=function(){
                    scope.gallery=false;
                };
                scope.showGallery=function(style,$index){
                    scope.galleryIndex=$index;
                    scope.galleryStyle = style;
                    scope.gallery=true;
                };
                scope.deleteImage = function(){
                    if(scope.items[scope.galleryIndex].fid!=undefined){
                        var i =scope.image.indexOf(scope.items[scope.galleryIndex].fid);
                        if(i!=-1){
                            scope.image.splice(i,1);
                        }
                        $$action.cancelUpload(scope.items[scope.galleryIndex].fid)
                            .catch(function(error){
                                console.log(error);
                                util.handleError(error);
                            });
                    }
                    scope.items.splice(scope.galleryIndex,1);
                    scope.gallery=false;
                };
                scope.$watch('picFile',function(nfile){
                    var file = nfile;
                    if(file!=null&&file['type'].indexOf('image/')===0){
                        Upload.imageDimensions(file).
                            then(function(dimensions){
                            var newWidth = dimensions.width;
                            var newHeight =dimensions.height;
                            if(dimensions.width > magic.IMAGE_WIDTH){
                                newHeight = dimensions.height*magic.IMAGE_WIDTH/dimensions.width;
                                newWidth = magic.IMAGE_WIDTH;
                            }
                            var config ={
                                width:newWidth,
                                height:newHeight,
                                quality:magic.IMAGE_QUALITY
                            };
                            return Upload.resize(file,config);
                        }).then(function(resizeFile){
                            file = resizeFile;
                            return Upload.base64DataUrl(file).then(function(urls){
                                var url = "url(::)";
                                var value = {
                                    style:{
                                        "background-image":url.replace('::',urls)
                                    },
                                    percent:'0%',
                                    warn:false,
                                    complete:false
                                };
                                scope.items.push(value);
                                return Promise.resolve(value);
                            })
                        }).then(function(value){
                            return  $upload.getmd5(file).then(function(md5){
                                $upload.upload(file,md5)
                                    .then(function (resp) {
                                        if(resp.data.code==0){
                                            value.complete=true;
                                            value['fid']=resp.data.fid;
                                            scope.image.push(resp.data.fid);
                                        }else{
                                            value.warn = true;
                                            value.percent = '';
                                        }
                                    }, function (resp) {
                                        value.warn = true;
                                        console.log('Error status: ' + resp.status);
                                    }, function (evt) {
                                        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                                        if(progressPercentage>100){
                                            progressPercentage=100
                                        }
                                        value.percent=progressPercentage+'%';
                                    });
                            });
                        }).catch(function(error){
                            console.log(error);
                            util.handleError(error);
                        });
                    }

                });

                var _getmd5 =function(file){
                   return new Promise(function(resolve,reject){
                       var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                       var end = file.size<=magic.CHUNK_SIZE?file.size:magic.CHUNK_SIZE;
                       var fileManager = new FileReader;
                       fileManager.onload = function (e) {
                           var spark = new md5Spark.ArrayBuffer();
                           spark.append(e.target.result);
                           resolve(spark.end());
                       };
                       fileManager.readAsArrayBuffer(blobSlice.call(file,0,end));
                   });
                };

            }
        }
    }]);

    App.service('$upload',['Upload',function(Upload){
        /**
         * 根据file获取md5
         * @param file
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getmd5 =function(file){
            return new Promise(function(resolve,reject){
                var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                var end = file.size<=magic.CHUNK_SIZE?file.size:magic.CHUNK_SIZE;
                var fileManager = new FileReader;
                fileManager.onload = function (e) {
                    var spark = new md5Spark.ArrayBuffer();
                    spark.append(e.target.result);
                    resolve(spark.end());
                };
                fileManager.readAsArrayBuffer(blobSlice.call(file,0,end));
            });

        };
        return {
            getmd5:function(file){
                return _getmd5(file);
            },
            upload:function(file,md5){
                return Upload.upload({
                    url:'/upload',
                    data:{
                        file:file,
                        md5:md5,
                        type: file['type']
                    },
                    resumeSizeUrl:'/upload/status?file='+md5,
                    resumeSizeResponseReader: function(data) {
                        return data.size<= file['size']?data.size: file['size'];
                    },
                    resumeChunkSize:magic.CHUNK_SIZE
                })
            }
        };
    }]);
};