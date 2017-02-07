var debug = require('debug')('RestApi:server');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceData = require("../../service/serviceData.js");
var serviceResult = require('../../service/serviceResult.js');
var utils = require('../../util/utils.js');
var magic = require('../../util/magic.js');
const SERVICE_TYPE = 1;//registerSTID
module.exports = {
  /*  list:function(req,res){
        serviceData.find(
            {st:SERVICE_TYPE},magic.SIGNAL_PAGE,
                req.body.start*magic.SIGNAL_PAGE,
            ['name','description','image','id'])
            .then(function(rows){
                utils.normalGet(rows,res,'list');
            }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },*/
    register:function(req,res){
        serviceData.getById(
            req.body.id,
            ['name','description','image','msgAttrs','content'])
            .then(function(rows){
                utils.analyseExtra(rows);
                utils.normalGet(rows,res,'list');
            }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
   /* sign:function(req,res){
        var values = {
            errcode:0,
            sd:req.body.id,
            uid:req.session.uid
        };
        utils.addTimeStamp(values);
        serviceResult.getByUidSd(req.session.uid,req.body.id).then(function(rows){
            if(rows.length==0){
                return  serviceResult.insert(values).then(function(rows){
                    utils.normalInsert(rows,res);
                });
            }else{
                utils.normalGet(null,res);
            }
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
    unSign:function(req,res){
        serviceResult.deleteByUidSd(req.session.uid,req.body.id).then(function(rows){
            utils.normalDelete(rows,res);
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
    signStatus:function(req,res){
        serviceResult.getByUidSd(req.session.uid,req.body.id,['sd']).then(function(rows){
            utils.normalGet(rows.length,res,'status');
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
    signedList:function(req,res){
        serviceData.findSigned(
            req.session.uid,
            magic.SIGNAL_PAGE,
                req.body.start* magic.SIGNAL_PAGE
            )
            .then(function(rows){
                utils.normalGet(rows,res,'list');
            }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },*/
    submitData:function(req){
        var op = req.body.data.op;
        if(op=='sign'){
            return Promise.resolve();
        }else{
            var e = new Error('register参数错误!');
            return Promise.reject(e);
        }
    }
};