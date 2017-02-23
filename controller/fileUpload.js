var multiparty = require('connect-multiparty');
var path = require('path');
var magic = require('../util/magic.js');
var utils = require('../util/utils.js');
var fs = require('fs-promise');
var config = require('../config/config.js');
var multipartMiddleware = multiparty({uploadDir:config.upload.tmp});
var md5 = require('md5');
var md5file = require('md5-file');
var Promise = require('bluebird');
var uploadFile = require('../service/uploadFile.js');
var uniqueId = require('uniqid');
var multiStream = require('multistream');
var readStream = require('read-all-stream');
var images = require('images');
var bufferstreams = require('bufferstreams');

module.exports=function(app){
   /* app.use(cacheResponseDirective());*/
    /**
     *
     * @api {post} /upload upload
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 分片上传文件接口
     * @apiParam    {string}    type            文件类型,例:"image/jpeg"
     * @apiParam    {string}    _chunkNumber    上传的分块的序列
     * @apiParam    {string}    _chunkSize      上传的分块的大小固定为2048000
     * @apiParam    {string}     _currentChunkSize   当前上传的块的大小
     * @apiParam    {string}    _totalSize      文件的总大小
     * @apiParam    {string}    md5             文件第一块分块的md5 可以使用sprk-md5生成,分块大于文件大小,则为整个文件的md5
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  fid:'fid'
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post(magic.URL_UPLOAD,multipartMiddleware,function(req,res){
        _handleUpload(req,res,config.upload.save);
    });

    app.all('/api'+magic.URL_UPLOAD,function(req,res,next){
        if(req.method === 'OPTIONS'){
            res.status(200).end();
        }else{
            next();
        }
    });
    /**
     *
     * @api {post} /api/upload upload
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 分片上传文件接口
     * @apiParam    {string}    type            文件类型,例:"image/jpeg"
     * @apiParam    {string}    _chunkNumber    上传的分块的序列
     * @apiParam    {string}    _chunkSize      上传的分块的大小固定为2048000
     * @apiParam    {string}     _currentChunkSize   当前上传的块的大小
     * @apiParam    {string}    _totalSize      文件的总大小
     * @apiParam    {string}    md5             文件第一块分块的md5 可以使用sprk-md5生成,分块大于文件大小,则为整个文件的md5
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  fid:'fid'
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post('/api'+magic.URL_UPLOAD,multipartMiddleware,function(req,res){
        _handleUpload(req,res,config.upload.save);
    });

    /**
     * @api {get} /upload/status uploadStatus
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 上传进度获取
     *
     * @apiParam {string}  file 文件第一块分片md5
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0
     *  size:size   //在服务器上已经上传文件大小
     * }
     */
    app.get(magic.URL_UPLOAD_STATUS,function(req,res){
        _uploadStatus(req,res,config.upload.save);
    });
    /**
     * @api {get} /api/upload/status uploadStatus
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 上传进度获取
     *
     * @apiParam {string}  file 文件第一块分片md5
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0
     *  size:size   //在服务器上已经上传文件大小
     * }
     */
    app.get('/api'+magic.URL_UPLOAD_STATUS,function(req,res){
        _uploadStatus(req,res,config.upload.save);
    });

    /**
     * @api {get} /upload/file/:fid getFile
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取文件
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get(magic.URL_UPLOAD_GET,function(req,res){
        _sendFileStatic(req,res,config.upload.save);
    });

    /**
     * @api {get} /api/upload/file/:fid getFile
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取文件
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get('/api' + magic.URL_UPLOAD_GET,function(req,res){
        _sendFile(req,res,config.upload.save);
    });
    /**
     * @api {get} /images/:fid getImage
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取图片
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get(magic.URL_UPLOAD_GET_IMG_STATIC,function(req,res){
        _sendFileStatic(req,res,config.upload.save);
    });
    /**
     * @api {get} /api/upload/images/:fid getImage
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取图片
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get('/api/upload'+magic.URL_UPLOAD_GET_IMG_STATIC,function(req,res){
        _sendFileStatic(req,res,config.upload.save);
    });

    /**
     * @api {get} /thumbnail/:fid getThumbnail
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取图片缩略图
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get(magic.URL_UPLOAD_GET_IMG_THUMBNAIL,function(req,res){
        _sendThumbnail(req,res,config.upload.save,config.upload.thumbnails);
    });
    /**
     * @api {get} /api/upload/thumbnail/:fid getThumbnail
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid获取图片缩略图
     *
     * @apiParam {string}  fid 文件fid
     *
     */
    app.get('/api/upload'+magic.URL_UPLOAD_GET_IMG_THUMBNAIL,function(req,res){
        _sendThumbnail(req,res,config.upload.save,config.upload.thumbnails);
    });

    /**
     * @api {post} /upload/cancel cancelUpload
     * @apiGroup fileUpload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid取消上传的文件
     *
     * @apiParam {string} fid 文件id
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample error
     * {
     *  code:-1或1
     * }
     *
     */
    app.post(magic.URL_UPLOAD_CANCEL,function(req,res){
        var fid = req.body.fid;
        var uid = req.session.uid;
        uploadFile.deleteByFidUid(fid,uid).then(function(rows){
            utils.normalDelete(rows,res);
        }).catch(function(error){
            utils.normalError(error);
            utils.handleError(error);
        });
    });
    /**
     * @api {post} /api/upload/cancel cancelUpload
     * @apiGroup api_upload
     * @apiVersion 1.0.0
     * @apiDescription 根据fid取消上传的文件
     *
     * @apiParam {string} fid 文件id
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample error
     * {
     *  code:-1或1
     * }
     *
     */
    app.post(magic.URL_UPLOAD_CANCEL,function(req,res){
        var fid = req.body.fid;
        var uid = req.session.uid;
        uploadFile.deleteByFidUid(fid,uid).then(function(rows){
            utils.normalDelete(rows,res);
        }).catch(function(error){
            utils.normalError(error);
            utils.handleError(error);
        });
    });
};
var _uploadComplete = function(req,res){
    var fid = uniqueId();
    var values ={
        fid:fid,
        path:req.body.md5,
        type:req.body.type,
        name:req.files.file.name,
        fsize:req.body['_totalSize'],
        fspace:0,
        uid:req.session.uid
    };
    utils.addTimeStamp(values);
    uploadFile.insert(values)
        .then(function (rows) {
            if(rows['affectedRows']==1){
                res.json({
                    code:0,
                    fid:fid
                });
            }else{
                res.json({
                    code:-1,
                    msg:'failed'
                });
            }
        }).catch(function (error) {
        utils.normalError(res);
        utils.handleError(error);
    });
};

var _handleUpload = function(req,res,saveDir){
    var chunkLength = Math.ceil(req.body['_totalSize']/magic.CHUNK_SIZE);
    if(req.files.file.size==req.body['_currentChunkSize']&&
        req.body['_chunkSize']==magic.CHUNK_SIZE&&
        req.body['_currentChunkSize']<=magic.CHUNK_SIZE){
        var savePath = path.join(saveDir,req.body.md5,req.body['_chunkNumber'].toString());
        if(req.body['_currentChunkSize']==0){
            _uploadComplete(req,res);
        }else if(req.body['_chunkNumber'] == 0){
            if(req.body.md5==md5file.sync(req.files.file.path)){
                utils.mkdir(path.join(saveDir,req.body.md5));
                fs.rename(req.files.file.path,savePath).then(function(){
                    if(chunkLength-1 == req.body['_chunkNumber']){
                        _uploadComplete(req,res);
                    }else{
                        res.json({code:0});
                    }
                }).catch(function(error){
                    res.status(500).send();
                    utils.handleError(error);
                })
            }else{
                res.status(500).send({code:'-1',msg:'md5验证失败'});
            }
        }else{
            fs.exists(path.join(saveDir,req.body.md5))
                .then(function(exists){
                    if(exists){
                        return fs.rename(req.files.file.path,savePath)
                    }else{
                        return Promise.reject();
                    }
                }).then(function(){
                if(chunkLength-1 == req.body['_chunkNumber']){
                    _uploadComplete(req,res);
                }else{
                    res.json({code:0});
                }
            }).catch(function(error){
                res.status(500).send();
                utils.handleError(error);
            });
        }
    }else if(req.body['_currentChunkSize']==0&&
        req.body['_chunkSize']==magic.CHUNK_SIZE){
        _uploadComplete(req,res);
    }else{
        res.status(500).send();
    }
};

var _uploadStatus = function(req,res,saveDir){
    var p = path.join(saveDir,req.query.file);
    fs.exists(p)
        .then(function(exists){
            if(exists){
                return fs.readdir(p);
            }else{
                return Promise.resolve([]);
            }
        }).then(function(files){
        var status = files.length;
        res.json({code:0,size:magic.CHUNK_SIZE*status});
    }).catch(function(error){
        res.json({size:0});
        utils.handleError(error);
    })
};

var _sendFile = function(req,res,saveDir){
    uploadFile.getByFid(req.params.fid,['path','fsize'])
        .then(function(rows){
            if(rows.length==1){
                var dirPath = path.join(saveDir,rows[0]['path']);
                var dirNum = Math.ceil(rows[0]['fsize']/magic.CHUNK_SIZE);
                return fs.exists(dirPath).then(function(exists){
                    if(exists){
                        return Promise.resolve([dirPath,dirNum]);
                    }else{
                        var error = new Error('上传文件丢失');
                        return Promise.reject(error);
                    }
                })
            }else{
                var error = new Error('fid获取失败');
                return Promise.reject(error);
            }
        }).then(function(data){
        fs.readdir(data[0]).then(function(files){
            var streamPath;
            var stream=[];
            var i;
            if(files.length == data[1]){
                for(i= 0;i<files.length;i++){
                    streamPath = path.join(data[0], i.toString());
                    stream.push(fs.createReadStream(streamPath));
                }
                multiStream(stream).pipe(res);
            }else{
                var error = new Error('上传文件丢失,不完整');
                return Promise.reject(error);
            }
        })
    }).catch(function(error){
        utils.normalError(res);
        utils.handleError(error);
    })
};

var _sendFileStatic = function(req,res,saveDir){
    if(req.headers['if-none-match']==req.params.fid){
        res.status(304).end();
    }else{
        uploadFile.getByFid(req.params.fid,['path','fsize'])
            .then(function(rows){
                if(rows.length==1){
                    var dirPath = path.join(saveDir,rows[0]['path']);
                    var dirNum = Math.ceil(rows[0]['fsize']/magic.CHUNK_SIZE);
                    return fs.exists(dirPath).then(function(exists){
                        if(exists){
                            return Promise.resolve([dirPath,dirNum]);
                        }else{
                            var error = new Error('上传文件丢失');
                            return Promise.reject(error);
                        }
                    })
                }else{
                    var error = new Error('fid获取失败');
                    return Promise.reject(error);
                }
            }).then(function(data){
            fs.readdir(data[0]).then(function(files){
                var streamPath;
                var stream=[];
                var i;
                if(files.length == data[1]){
                    for(i= 0;i<files.length;i++){
                        streamPath = path.join(data[0], i.toString());
                        stream.push(fs.createReadStream(streamPath));
                    }
                    /*res.append('Cache-control','max-age=2592000');*/
                    res.append('ETag',req.params.fid);
                    multiStream(stream).pipe(res);
                }else{
                    var error = new Error('上传文件丢失,不完整');
                    return Promise.reject(error);
                }
            })
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        })
    }
};

var _sendThumbnail = function(req,res,saveDir,thumbnailDir){
    if(req.headers['if-none-match']==req.params.fid){
        res.status(304).end();
    }else{
        uploadFile.getByFid(req.params.fid,['path','fsize'])
            .then(function(rows){
                if(rows.length==1){
                    var thumbDirPath = path.join(thumbnailDir,rows[0]['path']);
                    var dirPath = path.join(saveDir,rows[0]['path']);
                    var dirNum = Math.ceil(rows[0]['fsize']/magic.CHUNK_SIZE);
                    return fs.exists(thumbDirPath).then(function(exists){
                        if(exists){
                            return Promise.resolve(thumbDirPath);
                        }else{
                            return _createThumbnail(dirPath,thumbDirPath,dirNum);
                        }
                    })
                }else{
                    var error = new Error('fid获取失败');
                    return Promise.reject(error);
                }
            }).then(function(filePath){
                var stream = fs.createReadStream(filePath);
                res.append('ETag',req.params.fid);
                stream.pipe(res);
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        })
    }
};
/**
 * 生成缩略图
 * @param {string} dirPath      待转换文件地址
 * @param {string} thumbDirPath 缩略图存储地址
 * @param {number} dirNum       分片文件长度
 * @returns {*}
 * @private
 */
var _createThumbnail = function(dirPath,thumbDirPath,dirNum){
    return fs.exists(dirPath).then(function(exists){
        if(exists){/**生成缩略图*/
            return fs.readdir(dirPath).then(function(files){
                var streamPath;
                var stream=[];
                var i;
                if(files.length == dirNum){
                    for(i= 0;i<files.length;i++){
                        streamPath = path.join(dirPath, i.toString());
                        stream.push(fs.createReadStream(streamPath));
                    }
                    return readStream(multiStream(stream),null)
                        .then(function(data){
                            var buf = new Buffer(data);
                            /*images(streamPath)
                                .size(200)
                                .save(thumbDirPath,'jpg',{
                                    quality : 100
                                });*/
                            var img = images(streamPath)
                                .size(200);
                            var imgSize = img.size();
                            var y = 0;
                            if(imgSize.height<=200){
                                img.save(thumbDirPath,'jpg',{
                                        quality : 100
                                    });
                            }else{
                                 y = (imgSize - 200)/2;
                                images(img,0,y,200,200)
                                    .save(thumbDirPath,'jpg',{
                                        quality : 100
                                    });
                            }
                            return Promise.resolve(thumbDirPath);
                        })
                }else{
                    var error = new Error('上传文件丢失,不完整');
                    return Promise.reject(error);
                }
            })
        }else{
            var error = new Error('上传文件丢失');
            return Promise.reject(error);
        }
    })
};



