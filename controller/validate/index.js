var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceAction = require("../../service/serviceAction.js");
var user = require("../../service/user.js");
var utils = require('../../util/utils.js');
module.exports = {
    vendorGet:function(req,res,next){
        if(req.session.hasOwnProperty('role')&&req.session.role=='ROLE_VENDOR'){
            next();
        }else{
            res.redirect('/')
        }
    },
    vendorPost:function(req,res,next){
        if(req.session.hasOwnProperty('role')&&req.session.role=='ROLE_VENDOR'){
            next();
        }else{
            res.json({
                code:-2,
                msg:'请重新登录'
            })
        }
    },
    userNameCheck:function (req,res) {
        user.getByName(req.params.userName).then(function (data) {
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
            console.log('数据库查询异常!');
            console.log(err);
        });
    }

};