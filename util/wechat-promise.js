var Promise = require('bluebird');
var API = require('wechat-enterprise-api');
var config = require('../config/config.js');
var fs = require('fs');
var path = require('path');
var dir = path.join(__dirname,'../config/access_token.txt');
var _getToken = function(callback){
    fs.readFile(dir, 'utf8', function (err, txt) {
        if (err) {return callback(err);}
        var token = null;
        if(txt!==''){
            token = JSON.parse(txt);
        }
        callback(null, token);
    });
};
var _saveToken = function(token, callback) {
    fs.writeFile(dir, JSON.stringify(token), callback);
};
var api = Promise.promisifyAll(new API(config.wechat.corpid,config.wechat.corpsecret,config.wechat.agentid));

module.exports = {
    getDepartments:function(){
        return api.getDepartmentsAsync();
    },
    send:function(to,message){
        return api.sendAsync(to,message);
    },
    createUser:function(user){
        var name = user.userid;
        return api.createUserAsync(user)
            .then(function(res){
                return Promise.resolve([res,name]);
            })
    }

};

