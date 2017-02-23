/**
 * Created by jyl on 16-10-11.
 */
var User = require('../../service/user.js');
var Utils = require('../../util/utils.js');
var UserGroup = require('../../service/usergroup.js');
var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('CommonController');
var utils = require('../../util/utils.js');

module.exports = {
    login:function(req,res){
        var name = req.body.name;
        User.getByName(name,['id','pass','role'])
            .then(function(rows){
                if(rows.length==1 && Utils.checkPassword(req.body.pass,rows[0].pass)){
                    req.session.name = name;
                    req.session.uid = rows[0].id;
                    req.session.role = rows[0].role;
                    res.json({
                        msg:'success',
                        code:0
                    });
                }else{
                    res.json({
                        msg:'error',
                        code:-1
                    });
                }
            }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    logout:function(req,res){
        req.session.destroy();
        res.redirect('/login');
    },
    register:function(req,res){

    },
    registerSuccess:function(req,res){
        res.render("./register/success");
    },
    registerMain:function(req,res){
        res.render("./register/register");
    },
    userInfo:function(req,res){
        var id=req.session.uid;
        if(!id){
            return;
        }
        User.getById(id,
            ['name','nickname','sex','qq','email','phone','photoId'])
            .then(function(rows){
                //res.json(rows);
                utils.normalGet(rows,res,'list');
            }).catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    },
    userInfoUpdate:function(req,res){
        res.render("./user/updateUserInfo");
    },
    passwordUpdate:function(req,res){
        res.render("./user/password");
    },
    userInfoModify:function(req,res){
        var user = req.body;

        var reply = {};
        if(!user) {
            reply.code = CODE_ERR;
            reply.msg = "parameter is null";
            res.end(JSON.stringify(reply));
            return;
        }

        var suid=req.session.uid;
        if(!suid){
            reply.code = CODE_ERR;
            reply.msg = "id is null";
            res.end(JSON.stringify(reply));
            return;
        }

        User.updateById(suid,user)
        .then(function(rows){
            //res.json(rows);
            utils.normalUpdate(rows,res,'list');
        }).catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    adminInfo:function(req,res){
        res.render("./index/childPages/userInfo");
    },
    vendorInfo:function(req,res){
        res.render("./vendor/childPages/userInfo");
    }
};
