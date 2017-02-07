var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceResult = require("../../service/serviceResult.js");
var serviceData = require("../../service/serviceData.js");
var serviceType = require("../../service/serviceType.js");
var userVendor = require("../../service/uservendor.js");
var vendor = require('../../service/vendor');
var utils = require('../../util/utils.js');
var magic = require('../../util/magic.js');
var actionIndex = require('../actions');
module.exports = {
    index:function(req,res){
        res.render('./student/childPages/loader');
    },
    addIndex:function(req,res){
        res.render('./student/childPages/add');
    },
    loader:function(req,res){
        var queue = [];
        queue.push(serviceResult.getByUidSd(req.session.uid,req.body.id));
        queue.push(serviceData.getById(req.body.id,['st']));
        Promise.all(queue).then(function(data){
            if(data[1].length!=1){
                var e = new Error('serviceData错误');
               return Promise.reject(e);
            }else{
                if(data[0].length==0){
                    var values = {
                        sd:req.body.id,
                        uid:req.session.uid
                    };
                    utils.addTimeStamp(values);
                    return serviceResult.insert(values).then(function(rows){
                        if(rows['affectedRows']==1){
                            return Promise.resolve([0,data[1][0]['st']]);
                        }else{
                            var e = new Error('serviceResult insert错误');
                            return Promise.reject(e);
                        }
                    })
                }else{
                    return Promise.resolve([data[0][0]['status'],data[1][0]['st']]); //[status,st]
                }
            }
        }).then(function(data){
            return serviceType.getById(data[1],['actions']).then(function(rows){
                if(rows.length!=1){
                    var e = new Error('serviceType get错误');
                    return Promise.reject(e);
                }else{
                    var actions = utils.parserActions(rows[0]['actions']);
                    var length = actions.length;
                    var action = actions[data[0]];
                    if(-1 == data[0]){ //完成状态为-1
                        res.json({
                            code:0,
                            loader:{
                                actions:actions,
                                action:'complete',
                                length:length,
                                status:data[0]
                            }
                        });
                    }else{
                        res.json({
                            code:0,
                            loader:{
                                action:action,
                                length:length,
                                status:data[0]
                            }
                        });
                    }

                }
            })
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    submitData:function(req,res){
        var queue = [];
        queue.push(serviceResult.getByUidSd(req.session.uid,req.body.sd));
        queue.push(serviceData.getById(req.body.sd,['st']));
        Promise.all(queue).then(function(data){
            if(data[1].length!=1){
                var e = new Error('serviceData错误');
                return Promise.reject(e);
            }else{
                if(data[0].length==0){
                    var err = new Error('serviceResult 未正常加载');
                    return Promise.reject(err);
                }else{
                    return Promise.resolve([data[0][0]['status'],data[1][0]['st']]); //[status,st]
                }
            }
        }).then(function(data){
            return serviceType.getById(data[1],['actions']).then(function(rows){
                if(rows.length!=1){
                    var e = new Error('serviceType get错误');
                    return Promise.reject(e);
                }else{
                    var actions = utils.parserActions(rows[0]['actions']);
                    var status = data[0];
                    var action = actions[status];
                    if(action == req.body.action){
                        return actionParser(req,res,actions,status).then(function(){
                            return Promise.resolve([actions,status]);
                        });
                    }else{
                        return Promise.reject(new Error('action 状态异常'));
                    }
                }
            })
        }).then(function(data){
            /**
             * 处理成功
             */
            var actions = data[0];
            var status = data[1];
            if(status+1==actions.length){
                status=-2;
            }
            var values = {
                status:status+1
            };
            return serviceResult.update({uid:req.session.uid,sd:req.body.sd},values)
                .then(function(rows){
                    utils.normalUpdate(rows,res);
                })
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
    },

    cancelData:function(req,res){
        var queue = [];
        queue.push(serviceResult.getByUidSd(req.session.uid,req.body.sd));
        queue.push(serviceData.getById(req.body.sd,['st']));
        Promise.all(queue).then(function(data){
            if(data[1].length!=1){
                var e = new Error('serviceData错误');
                return Promise.reject(e);
            }else{
                if(data[0].length==0){
                    var err = new Error('serviceResult 未正常加载');
                    return Promise.reject(err);
                }else{
                    return Promise.resolve([data[0][0]['status'],data[1][0]['st']]); //[status,st]
                }
            }
        }).then(function(data){
            return serviceType.getById(data[1],['actions']).then(function(rows){
                if(rows.length!=1){
                    var e = new Error('serviceType get错误');
                    return Promise.reject(e);
                }else{
                    var actions = utils.parserActions(rows[0]['actions']);
                    var status = data[0];
                    if(status==-1&&actions.indexOf(req.body.action)!=-1){
                        return Promise.resolve();
                    }else{
                        return Promise.reject(new Error('action 状态异常'));
                    }
                }
            })
        }).then(function(){
            /**
             * 处理成功
             */
            var values = {
                status:0
            };
            return serviceResult.update({uid:req.session.uid,sd:req.body.sd},values)
                .then(function(rows){
                    utils.normalUpdate(rows,res);
                })
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    findDataList:function(req,res){
        var condition = {
            st:req.body.st
        };
        if(req.body.hasOwnProperty('vid')){
            condition.vid = req.body.vid;
            condition.uid = req.session.uid;
        }
        serviceData.find(
            condition,magic.SIGNAL_PAGE,
                req.body.start*magic.SIGNAL_PAGE,
            ['name','description','image','id','ts'],
            'ts',false)
            .then(function(rows){
                utils.normalGet(rows,res,'list');
            }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
    findCompleteDataList:function(req,res){
        serviceData.findComplete(
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
    },
    loaderAdd:function(req,res){
        var vid = req.body.vid;
        var uid = req.session.uid;
        userVendor.getByUidVid(uid,vid,'ROLE_USER',['vid']).then(function(rows){
            if(rows.length>0){
                return vendor.getById(vid,['st']);
            }else{
                var err = new Error('无操作该vid的权限');
                return Promise.reject(err);
            }
        }).then(function (rows) {
            if(rows.length==1){
                return serviceType.getById(rows[0]['st'],['actions']);
            }else{
                var err = new Error('vendor异常');
                return Promise.reject(err);
            }
        }).then(function (rows) {
            if(rows.length==1){
                var actions = utils.parserActions(rows[0]['actions']);
                res.json({
                    code:0,
                    actions:actions
                });
            }else{
                var err = new Error('serviceType获取异常');
                return Promise.reject(err);
            }

        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });

    },
    addSubmitData:function(req,res){
        var vid = req.body.vid;
        var uid = req.session.uid;
        userVendor.getByUidVid(uid,vid,'ROLE_USER',['vid']).then(function(rows){
            if(rows.length>0){
                return vendor.getById(vid,['st']);
            }else{
                var err = new Error('无操作该vid的权限');
                return Promise.reject(err);
            }
        }).then(function (rows) {
            if(rows.length==1){
                return serviceType.getById(rows[0]['st'],['id','actions']);
            }else{
                var err = new Error('vendor异常');
                return Promise.reject(err);
            }
        }).then(function (rows) {
            if(rows.length==1){
                var actions = utils.parserActions(rows[0]['actions']);
                var msgAttrs = {};
                for(var i=0;i<actions.length;i++){
                    msgAttrs[actions[i]]=req.body.data[actions[i]];
                }
                var values = {
                    st:rows[0].id,
                    name:req.body.name,
                    description:req.body.description,
                    content:req.body.content,
                    image:req.body.image,
                    uid:req.session.uid,
                    vid:req.body.vid,
                    msgAttrs:msgAttrs
                };
                utils.addTimeStamp(values);
                return serviceData.insert(values)
            }else{
                var err = new Error('serviceType获取异常');
                return Promise.reject(err);
            }
        }).then(function (rows) {
            utils.normalInsert(rows,res);
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error)
        });
    },
    manageList:function (req, res) {
        var uid = req.session.uid;
        userVendor.getManageByUid(uid,['id','name']).then(function (rows) {
            utils.normalGet(rows,res,'list');
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });

    }

};

/**
 *
 * @param req
 * @param res
 * @param {array} actions
 * @param {int}   status
 */
var actionParser = function(req,res,actions,status){
    var action = actions[status];
    return actionIndex[action].submitData(req);
};

var cancelActionParser = function(req,res,actions,status){
    var action = actions[status];
    return actionIndex[action].submitData(req);
};

