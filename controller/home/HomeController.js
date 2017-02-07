var debug = require('debug')('RestApi:server');
var uOfflineMsg = require('../../service/uOfflineMsg.js');
var log=require('../../util/log.js').logger('HomeController');
module.exports = {
    /**
     * 入口路由函数
     * @param req
     * @param res
     */
    index:function(req,res){
        res.render("./index/index",{baseUrl:"/index/"});
    },
    list:function (req,res) {
        res.render("./index/childPages/list",{menu:"funcMenu"});
    },
    add:function (req,res) {
        res.render("./index/childPages/add");
    }
}
