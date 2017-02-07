var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceData = require("../../service/serviceData.js");
var serviceType = require("../../service/serviceType");
var vendor = require("../../service/vendor.js");
var utils = require('../../util/utils.js');
var wechat = require('../../util/wechat.js');
var user = require('../../service/user.js');
var vendorCheck = require("../../service/vendorCheck.js");
var uservendor = require("../../service/uservendor.js");
module.exports = {
    index:function (req,res) {
        res.render("./vendor/index");
    },
    registerIndex:function (req,res) {
        res.render("./vendorRegister/index");
    },
    register:function (req,res) {
        res.render("./vendorRegister/vendorRegister");
    },
    registerPost:function (req,resp) {
        user.insertV(req.body.userName,req.body.userName,req.body.userPassword,'ROLE_VENDOR').then(function (response) {
            //generate vendorCheck id
            var date = new Date();
            var timestamp = Date.parse(date);
            var vc =date.getYear().toString()+(date.getMonth()+1).toString()+date.getDate().toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString()+(Math.floor(Math.random()*10)).toString();
            var vendorData={};
            vendorData.name = req.body.name;
            vendorData.st = req.body.st;
            vendorData.vc = vc;
            if(req.body.mobile){
                vendorData.mobile = req.body.mobile;
            }
            if(req.body.phone){
                vendorData.phone = req.body.phone;
            }
            if(req.body.address){
                vendorData.address = req.body.address;
            }
            if(req.body.remark){
                vendorData.remark = req.body.remark;
            }
            vendorData.ts = timestamp;
            user.getByName(req.body.userName).then(function (response) {
                vendorData.uid = response[0].id;
                vendor.insert(vendorData).then(function (respon) {
                    var vendorCheckData = {};
                    vendorCheckData.id = vc;
                    vendor.getByUid(response[0].id).then(function (res) {
                        vendorCheckData.vid = res[0].id;
                        if(req.body.bl){
                            vendorCheckData.bl = req.body.bl;
                        }
                        if(req.body.extattrs){
                            vendorCheckData.extattrs = req.body.extattrs;
                        }
                        vendorCheckData.result = "checking";
                        vendorCheckData.updatetime = timestamp;
                        vendorCheckData.ts = timestamp;
                        vendorCheck.insert(vendorCheckData).then(function (re) {
                            var userVendorData = {};
                            userVendorData.vid = res[0].id;
                            userVendorData.uid = response[0].id;
                            userVendorData.role = "ROLE_ADMIN";
                            uservendor.insert(userVendorData).then(function (r) {
                                var reply = {};
                                reply.code = "1";
                                reply.msg = 'success';
                                reply.data = r;
                                resp.end(JSON.stringify(reply));
                            },function (e) {
                                console.log("uservendor insert failed!");
                                console.log(e);
                            })
                        });

                    },function (err) {
                        console.log("Get vendor data failed!");
                        console.log(err);
                    });
                },function (erro) {
                    console.log("Vendor insert failed!");
                    console.log(erro);
                });
            });

        },function (err) {
            console.log("User add failed!");
            console.log(err);
        });
    },
    registerSuccess:function (req,res) {
        res.render("./vendorRegister/success");
    },
    home:function(req,res){
        res.render("./vendor/childPages/index",{menu:'funcMenu'});
    },
    setting:function (req,res) {
        res.render("./vendor/childPages/setting",{menu:'funcMenu',currMenu:"vendorManage"});
    },
    settingPost:function (req,res) {

        vendor.getByUid(req.session.uid).then(function (data) {
            var reply = {};
            if(data[0]) {
                reply.code = "1";
                reply.msg = 'success';
                reply.data = data[0];
                res.end(JSON.stringify(reply));
            } else {
                reply.code = "0";
                reply.msg = "no record!";
                res.end(JSON.stringify(reply));
            }
        });
    },
    serviceManage:function (req,res) {
        res.render("./vendor/childPages/serviceManage",{menu:'serviceManage',currMenu:"serviceAdd"});
    },
    serviceAdd:function (req,res) {
        //根据用户id获取用户所在公司的企业服务类型
        vendor.getByUid(req.session.uid).then(function (response) {
            serviceType.getById(response[0].st).then(function (data) {
                res.render("./vendor/childPages/serviceAdd",{actions:data[0].actions});
            }).catch(function (error) {

            });
        },function (err) {
            console.log(err);
        });
    },
    serviceAddPost:function (req,res) {
        vendor.getByUid(req.session.uid).then(function (response) {
            req.body.vid = response[0].id;
            req.body.st = response[0].st;
            req.body.uid = req.session.uid;
            var date = new Date();
            var timestamp = Date.parse(date);
            req.body.ts = timestamp;
            serviceData.insert(req.body).then(function (data) {
                var message={"touser":"@all","msgtype":"text","agentid":'4',"text":{"content":"嘻嘻,有新活动发布了!"},"safe":0};
                message.text.content = req.body.name;
                wechat.sendMessage(message).then(function (data) {
                    console.log(data);
                });
                utils.normalUpdate(data,res);
            }).catch(function (error) {
                console.log(error);
                utils.normalError(res);
                utils.handleError(error);
            });
        });
    },
    actions:function (req,res) {
        serviceType.getById(req.params.id).then(function (data) {
            var reply = {};
            if(data[0]) {
                reply.code = "1";
                reply.msg = 'success';
                reply.data = data[0].actions;
                res.end(JSON.stringify(reply));
            } else {
                reply.code = "0";
                reply.msg = "no record!";
                res.end(JSON.stringify(reply));
            }
        });
    },
    serviceData:function (req,res) {
        vendor.getByUid(req.session.uid).then(function (response) {
            serviceData.getByVid(response[0].id).then(function (data) {
                utils.normalGet(data,res,'list');
            }).catch(function (error) {
                utils.normalError(res);
                console.log(error);
            });
        });
    },
    serviceDataUpdate:function (req,res) {
        res.render('./vendor/childPages/serviceUpdate');
    },
    serviceDataUpdatePost:function (req,res) {
        serviceData.getById(req.params.id).then(function (data) {
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
        });
    },
    serviceUpdatePost:function (req,res) {
        serviceData.updateById(req.params.id,req.body).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    serviceAddSuccess:function (req,res) {
        res.render("./vendor/childPages/addSuccess");
    },
    serviceAddFail:function (req,res) {
        res.render("./vendor/childPages/addFail");
    },
    serviceUpdateSuccess:function (req,res) {
        res.render("./vendor/childPages/updateSuccess");
    },
    serviceUpdateFail:function (req,res) {
        res.render("./vendor/childPages/updateFail");
    },
    serviceDeleteSuccess:function (req,res) {
        res.render("./vendor/childPages/deleteSuccess");
    },
    serviceDeleteFail:function (req,res) {
        res.render("./vendor/childPages/deleteFail");
    },
    serviceView: function (req,res) {
        res.render("./vendor/childPages/serviceView");
    },
    serviceDelete:function (req,res) {
        serviceData.deleteById(req.params.id).then(function (rows) {
            utils.normalDelete(rows,res);
        }).catch(function (error) {
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    update:function (req,res) {
        //注:数据中应移除营业执照和服务类型
        vendor.updateById(req.params.id,req.body).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            console.log(error);
            utils.normalError(res);
            utils.handleError(error);
        });
    }
};