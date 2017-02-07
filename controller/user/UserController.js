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
    }
};
