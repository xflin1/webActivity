/**
 * Created by jyl on 16-9-27.
 */
var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('CommonController');
var user=require('../../service/user.js');

module.exports = {
    /**
     * 入口路由函数
     * @param req
     * @param res
     */
    index:function(req,res){
        if(req.session.hasOwnProperty('role')){
            if(req.session.role=='ROLE_ADMIN'){
                res.redirect('/index');
            }else if(req.session.role=='ROLE_USER'){
                res.redirect('/student');
            }else if(req.session.role=='ROLE_VENDOR'){
                res.redirect('/vendor');
            }else{
                res.redirect('/login');
            }
        }else{
            res.redirect('/login');
        }
    },
    login:function (req,res) {
        res.render("./login/index");
    },
    register:function (req,res) {
        res.render("./register/index");
    },
    uiToast:function(req,res){
        res.render("../component/uiToast/index");
    },
    uiDropMenu:function(req,res){
        res.render("../component/uiDropMenu/index");
    },
    uiUploader:function(req,res){
        res.render("../component/uiUploader/index");
    },
    wsDemo:function(req,res){
        res.render("./wsDemo/index");
    }
};

