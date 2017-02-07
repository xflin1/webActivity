var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceTypeController');
var serviceType = require("../../service/serviceType.js");
var utils  = require('../../util/utils.js');
module.exports = {
    list:function (req,res) {
        res.render("./index/childPages/serviceType/list",{menu:"servTypeMenu",currMenu:"listAction",baseUrl:"/index/"});
    },
    add:function (req,res) {
        res.render("./index/childPages/serviceType/add");
    },
    addPost:function(req,res) {
        var values = req.body;
        utils.addTimeStamp(values);
        serviceType.insert(req.body).then(function (data) {
            utils.normalInsert(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },

    addSuccess:function (req,res) {
        res.render("./index/childPages/serviceType/addSuccess");
    },
    addFail:function (req,res) {
        res.render("./index/childPages/serviceType/addFail");
    },
    deletePost:function (req,res) {
        serviceType.deleteById(req.params.id).then(function (data) {
            utils.normalDelete(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    deleteSuccess:function (req,res) {
        res.render("./index/childPages/serviceType/deleteSuccess");
    },
    deleteFail:function (req,res) {
        res.render("./index/childPages/serviceType/deleteFail");
    },
    update:function (req,res) {
        serviceType.getById(req.params.id).then(function (data) {
            if(data){
                // data[0].actions = data[0].actions.substr(1,data[0].actions.length-2).split(',');
                res.render('./index/childPages/serviceType/update',{serviceType:data[0]});
            }
            else{
                console.log("字段数据查询异常!");
            }
        });

    },
    updateSuccess:function (req,res) {
        res.render("./index/childPages/serviceType/updateSuccess");
    },
    updateFail:function (req,res) {
        res.render("./index/childPages/serviceType/updateFail");
    },
    updatePost:function (req,res) {
        serviceType.updateById(req.params.id,req.body).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    listPost:function (req,res) {
        var fields = ['id','name','remark','actions'];
        serviceType.getAll(fields).then(function (rows) {
            utils.normalGet(rows,res,'list');
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        })
    },
    view:function (req,res) {
        serviceType.getById(req.params.id).then(function (data) {
            if(data){
                //时间格式转换
                data[0].ts = new Date(parseInt(data[0].ts) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');

                res.render("./index/childPages/serviceType/view",{serviceType:data[0]});
            }else{
                console.log("字段数据查询异常!");
            }

        });
    }

};