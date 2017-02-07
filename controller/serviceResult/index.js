var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('serviceResultController');
var serviceResult = require("../../service/serviceResult.js");
var utils  = require('../../util/utils.js');
module.exports = {
    addPost:function(req,res) {
        var values = req.body;
        utils.addTimeStamp(values);
        serviceResult.insert(req.body).then(function (data) {
            utils.normalInsert(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    deletePost:function (req,res) {
        serviceResult.deleteByName(req.params.id).then(function (data) {
            utils.normalDelete(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    updatePost:function (req,res) {
        serviceResult.updateByName(req.params.id,req.body).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    listPost:function (req,res) {
        var uid  = req.body.uid;
        serviceResult.getByUid(uid).then(function (rows) {
            utils.normalGet(rows,res,'list');
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        })
    }
};
