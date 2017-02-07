var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('ServiceActionController');
var serviceAction = require("../../service/serviceAction.js");
var utils = require('../../util/utils.js');
var user = require("../../service/user.js");
module.exports = {
    userRegister:function (req,res) {
        user.insert(req.body.userName,req.body.userName,req.body.userPassword).then(function (data) {
            utils.normalUpdate(data,res);
        }).catch(function (error) {
            console.log(error);
            utils.normalError(res);
            utils.handleError(error);
        });
    },
    index:function (req,res) {
        if(req.session.hasOwnProperty('role')&&req.session.role=='ROLE_USER'){
            res.render("./student/index");
        }else{
            res.redirect('/');
        }

    },
    home:function(req,res){
        res.render("./student/childPages/index");
    },
    register:function(req,res){
        res.render("./student/childPages/register");
    },
    signedList:function(req,res){
        res.render("./student/childPages/signedList");
    },
    normalAdd:function (req,res) {
        res.render("./student/childPages/normalAdd");
    },
    registerAdd:function (req,res) {
        res.render("./student/childPages/registerAdd");
    },
    manage:function (req, res) {
        res.render("./student/childPages/manage");
    },
    manageVendor:function (req, res) {
        res.render("./student/childPages/manageVendor");
    },
    addList:function(req,res){
        res.render("./student/childPages/addList");
    }

};