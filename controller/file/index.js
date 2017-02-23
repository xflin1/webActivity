/**
 * Created by jyl on 16-11-1.
 */
var log=require('../../util/log.js').logger('FileActionController');
var uploadfile = require("../../service/uploadFile.js");
var utils = require('../../util/utils.js');
var Promise=require('bluebird');

var formidable = require("formidable"),
    fs = require("fs"),
    path = require("path"),
    uuid=require("node-uuid"),
    config = require("../../config/config.js");
module.exports = {
    uFile:function(req,res){
        var form = new formidable.IncomingForm({uploadDir:"tmp"});  //避免EXDEV问题
        var newFileName='';
        var fpath=config.http.uploadDir;
        fpath=path.join(config.http.uploadDir,"square");


        form.parse(req, function(err, fields, files){
            if(err){
                log.err(err);
                res.end('{"code":-1,"msg":"failed"}');
                return;
            }
            newFileName = uuid.v4()+"."+path.extname(files.file.name).substr(1);
            new Promise(function(resolve,reject){
                fs.rename(files.file.path,path.join(fpath,newFileName),function(err){
                    if(err){
                        //log.err(err);
                        //res.end('{"code":-1,"msg":"failed"}');
                        //return;
                        reject(err);
                    }else{
                        resolve();
                    }
                });
            }).then(function(){
                var values ={

                    fid:newFileName,
                    path:fpath,
                    type:files.file.type,
                    name:files.file.name,
                    fsize:files.file.size,
                    fspace:0,
                    uid:req.session.uid,
                };
                utils.addTimeStamp(values);
                return  uploadfile.insert(values);
            }).then(function (rows) {
                if(rows['affectedRows']==1){
                    res.json({
                        code:0,
                        id:rows.insertId,
                        fid:newFileName
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
        });
    },
    extUFile:function(req,res){
        var form = new formidable.IncomingForm({uploadDir:"tmp"});  //避免EXDEV问题
        var newFileName='';
        var fpath=config.http.uploadDir;

        if(req.params.level === void 0){
            fpath=path.join(config.http.uploadDir,"square");
        }else if(req.params.level == "safe"){
            fpath=path.join(config.http.uploadDir,"private");
        }else{
            //TODO
            fpath=path.join(config.http.uploadDir,req.params.level);
        }

        form.parse(req, function(err, fields, files){
            if(err){
                log.err(err);
                res.end('{"code":-1,"msg":"failed"}');
                return;
            }
            newFileName = uuid.v4()+"."+path.extname(files.file.name).substr(1);
            new Promise(function(resolve,reject){
                fs.rename(files.file.path,path.join(fpath,newFileName),function(err){
                    if(err){
                        //log.err(err);
                        //res.end('{"code":-1,"msg":"failed"}');
                        //return;
                        reject(err);
                    }else
                        resolve();
                });
            }).then(function(){
                return  uploadfile.insert({
                    fid:newFileName,
                    path:fpath,
                    type:files.file.type,
                    name:files.file.name,
                    fsize:files.file.size,
                    fspace:0,
                    uid:req.session.uid,
                    ts:new Date().getTime()
                });
            }).then(function (rows) {
                if(rows['affectedRows']==1){
                    res.json({
                        code:0,
                        id:rows.insertId,
                        fid:newFileName
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
            });;
        });
    },
    dfFile:function(req,res){
        uploadfile.getById(req.params.fid,['path','fid'])
            .then(function(data){
                if(data[0]){
                    res.download(path.join(data[0].path,data[0].fid));
                    //res.sendFile(path.join(data[0].path,data[0].fid));
                }
            });
    },
    dFile:function(req,res){
        uploadfile.getById(req.params.id,['path','fid'])
            .then(function(data){
                if(data[0]){
                   // console.log(path.join(data[0].path,data[0].fid));
                    res.download(path.join(data[0].path,data[0].fid));
                    //res.sendFile(path.join(data[0].path,data[0].fid));
                }
            });
    },
    tFile: function (req,res) {
        res.writeHead(200,{'Content-Type':'text/html'});
        res.write('<html>'+
            '<head>'+
            '<meta http-equiv="Content-Type" content="text/html; '+
            'charset=UTF-8" />'+
            '</head>'+
            '<body>'+
            '<form action="/uFile" enctype="multipart/form-data" '+
            'method="post">'+
            '<input type="file" name="file" multiple="multiple">'+
            '<input type="submit" value="Upload file" />'+
            '</form>'+
            '</body>'+
            '<html>'
        );
        res.end();
    },
    sFile:function(req,res){
        uploadfile.getById(req.params.id,['id','fid','type','name','uid','ts']).then(function (data) {
            var reply = {};
            if(data[0]) {
                reply.code = "0";
                reply.msg = 'success';
                reply.data = data;
                res.end(JSON.stringify(reply));
            } else {
                reply.code = "0";
                reply.msg = "no record!";
                res.end(JSON.stringify(reply));
            }
        }).catch(function (err) {
            logger.error('字段名称查询错误!'+err);
        });
    },
    fsFile:function(req,res){
        uploadfile.getById(req.params.fid,['id','fid','type','name','uid','ts']).then(function (data) {
            var reply = {};
            if(data[0]) {
                reply.code = "0";
                reply.msg = 'success';
                reply.data = data;
                res.end(JSON.stringify(reply));
            } else {
                reply.code = "0";
                reply.msg = "no record!";
                res.end(JSON.stringify(reply));
            }
        }).catch(function (err) {
            logger.error('字段名称查询错误!'+err);
        });
    }
};