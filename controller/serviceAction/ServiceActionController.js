var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceAction = require("../../service/serviceAction.js");
var utils = require('../../util/utils.js');
module.exports = {
    list:function (req,res) {
        res.render("./index/childPages/serviceAction/list",{menu:"servActionMenu",currMenu:"listAction",baseUrl:"/index/"});
    },
    view:function (req,res) {
        serviceAction.getByName(req.params.name).then(function (data) {
            if(data){
                //时间格式转换
                data[0].ts = new Date(parseInt(data[0].ts) * 1000).toLocaleString().replace(/:\d{1,2}$/,' ');

                res.render("./index/childPages/serviceAction/view",{action:data[0]});
            }else{
                console.log("字段数据查询异常!");
            }

        });
    },
    add:function (req,res) {
        res.render("./index/childPages/serviceAction/add");
    },
    addPost:function (req,res) {
        var values = req.body;
        utils.addTimeStamp(values);
        serviceAction.insert(values).then(function (rows) {
            utils.normalInsert(rows,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    addSuccess:function (req,res) {
        res.render("./index/childPages/serv" +
            "iceAction/addSuccess");
    },
    addFail:function (req,res) {
        res.render("./index/childPages/serviceAction/addFail");
    },
    nameCheck:function (req,res) {
        serviceAction.getByName(req.params.name).then(function (data) {
            var reply = {};
            if(data[0]) {
                reply.code = "1";
                reply.msg = 'success';
                reply.data = data;
                res.end(JSON.stringify(reply));
            } else {
                reply.code = "0";
                reply.msg = "no record!";
                res.end(JSON.stringify(reply));
            }
        }).catch(function (err) {
            console.log('字段名称查询错误!');
            console.log(err);
        });

    },
    actionList:function(req,res) {
        serviceAction.getAll().then(function (rows) {
            utils.normalGet(rows,res,'list');
        }).catch(function (error) {
            utils.normalError(res);
            console.log(error);
        })
    },
    delete:function (req,res) {
        serviceAction.deleteByName(req.params.name).then(function (rows) {
            utils.normalDelete(rows,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    deleteSuccess:function (req,res) {
        res.render("./index/childPages/serviceAction/deleteSuccess");
    },
    deleteFail:function (req,res) {
        res.render("./index/childPages/serviceAction/deleteFail");
    },
    update:function (req,res) {
        serviceAction.getByName(req.params.name).then(function (data) {
            if(data){
                res.render('./index/childPages/serviceAction/update',{action:data[0]});
            }
            else{
                console.log("字段数据查询异常!");
            }
        });

    },
    updatePost:function (req,res) {
        serviceAction.updateByName(req.params.name,req.body).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    updateSuccess:function (req,res) {
        res.render("./index/childPages/serviceAction/updateSuccess");
    },
    updateFail:function (req,res) {
        res.render("./index/childPages/serviceAction/updateFail");
    }
};