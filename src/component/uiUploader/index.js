var magic = require('../../../util/magic.js');
require('./style.css');
var md5 = require('spark-md5');
module.exports=function(App){
    App.directive('uiUploader',['Upload','$timeout',function(Upload,$timeout){
        return {
            restrict:'A',
            templateUrl:magic.COMPONENT_UPLOADER,
            scope:{
                info:'=uiUploader'
            },
            link:function(scope){
                scope.items = [
                    {
                        name:1,
                        style:{
                            "background-image":"url(./pic_160.png)"
                            }
                    }
                ];
                scope.picFile=null;
                scope.$watch('picFile',function(n){
                    console.log(n);
                   console.log('change');
                    if(n!=null){
                        var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
                        var fileManager1 = new FileReader
                        fileManager1.onload = function (e) {
                            var spark = new md5.ArrayBuffer();
                            spark.append(e.target.result);
                            console.log(spark.end());
                        };
                        fileManager1.readAsArrayBuffer(blobSlice.call(n,0, n.size));


                        Upload.base64DataUrl(n).then(function(urls){
                            var url = "url(::)";
                            var value = {
                                style:{
                                    "background-image":url.replace('::',urls)
                                }
                            };
                            scope.items.push(value);
                        });
                        /*Upload.upload({
                            url:'/upload',
                            data:{file:n,test:"test"}
                           /!* resumeChunkSize:'1000KB'*!/
                        }).then(function (resp) {
                            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                        }, function (resp) {
                            console.log('Error status: ' + resp.status);
                        }, function (evt) {
                            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                        })*/
                    }

                });
            }
        }
    }]);
};