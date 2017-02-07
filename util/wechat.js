/**
*   Author: Junyang Li
*   Date: 2016-08-22
*
*   所有方法皆是promise对象
**/
var https = require('https');
var qs = require('qs');
var rq = require('request');
var Q = require('q');

/**
*   企业号管理组信息(隐私)
**/
var data = {
    corpid : "wx3348d8d51353fb39",
    corpsecret : "74wx3s8E6LHBYYbxS6mj_QMlzlBncTM-fej0R8YqeHK5PerhCaRYks7_6V28Q5Hw",
};


var wechat={
    wechatAccessToken : '',
    parse_string:/^{"access_token":"([^"]+)/,
    res:{},
};
var token_check = /access_token/;
/**
*   字段传字节统计函数(针对utf-8编码的 中文直接占3个字符)
**/
var len = function(s){
    var l = 0;
    var a = s.split("");
    for (var i=0;i<a.length;i++) {
        if (a[i].charCodeAt(0)<299) {
            l++;
        } else {
            l+=3;
        }
    }
        return l;
};
/*
*   使用corpis和corpsecret获取微信token
* */
wechat.getToken = function () {
    var deferred =Q.defer();
    var options = {
        uri:'https://qyapi.weixin.qq.com/cgi-bin/gettoken',
        qs:data,
    };
    rq(options,function (error,response,body) {
        if (!error){
            var result = wechat.parse_string.exec(body);
            wechat.wechatAccessToken = result[1];
            deferred.resolve(wechat.wechatAccessToken);
        }else{
            deferred.reject(error);
        }
    });
    return deferred.promise;
};

/*
*                                                       消息发送参数说明
*   参数为JSON对象(msgtype ,agentid 为必须),若为text消息,content必须,若为image/voice/video/file消息,media_id必须,若为news消息,articles 必须,若为mpnews消息,articles&&title &&thumb_media_id &&content 必须
*   msgtype :消息类型，此时固定为：text （支持消息型应用跟主页型应用） 
*   agentid :企业应用的id，整型。可在应用的设置页面查看 
*   content :消息内容，最长不超过2048个字节，注意：主页型应用推送的文本消息在微信端最多只显示20个字（包含中英文） 
*   touser :成员ID列表（消息接收者，多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为@all，则向关注该企业应用的全部成员发送 
*   toparty :部门ID列表，多个接收者用‘|’分隔，最多支持100个。当touser为@all时忽略本参数
*   totag :标签ID列表，多个接收者用‘|’分隔。当touser为@all时忽略本参数 
*   safe :  表示是否是保密消息，0表示否，1表示是，默认0
*
*   返回说明:(code,msg)
*   {code:0,msg:'消息发送成功!'}{code:1,msg:'消息发送失败!'}{code:2,msg:'微信Token获取失败!'}
*   {code:3,msg:''}
*/
wechat.sendMessage = function(jsonData){
    var deferred = Q.defer();
    var ss = JSON.stringify(jsonData);
    var slength =len(ss);
    var sendMesRes = {

    };
    wechat.getToken().then(function (token) {
        var message_option = {
            hostname: 'qyapi.weixin.qq.com',
            path: '/cgi-bin/message/send?access_token=' + token,
            method: 'POST',
            headers: {
                // 'Content-Type':'application/x-www-form-urlencoded',
                'Content-Type':'application/json',
                'Content-Length': slength  //这个是必须的 不然会报错
            }
        };
        var message_req = https.request(message_option,function(message_res) {
            message_res.setEncoding('utf8');
            message_res.on('data',function(a) {
                var message_result = JSON.parse(a);
                if (message_result.errcode != 0) {
                    console.log("信息发送失败!");
                    console.log(a);
                    sendMesRes.code = 1;
                    sendMesRes.msg = "信息发送失败!";
                    deferred.resolve(sendMesRes);
                }else{
                    console.log("信息发送成功!");
                    sendMesRes.code = 0;
                    sendMesRes.msg = "信息发送成功!";
                    deferred.resolve(sendMesRes);
                }
            });

        });
        message_req.write(ss);
        message_req.end();
        message_req.on('error', function(e) {
            console.error(e);
            sendMesRes.code = 3;
            sendMesRes.msg = e;
            deferred.resolve(sendMesRes);
        });

    },function (error) {
        console.log(error);
        console.log("微信Token获取失败!");
        sendMesRes.code = 2;
        sendMesRes.msg = "微信Token获取失败!";
        deferred.reject(sendMesRes);
    });
    return deferred.promise;

};
/**
*                                                       创建成员
*   参数为JSON****对象****(userid  ,name ,department  为必须)
*   userid :成员UserID,对应管理端的帐号，企业内必须唯一,不区分大小写,长度为1~64个字节
*   name :成员名称。长度为1~64个字节 
*   department : 成员所属部门id列表,不超过20个 
*   position :职位信息。长度为0~64个字节 
*   mobile :手机号码。企业内必须唯一，mobile/weixinid/email三者不能同时为空 
*   gender :性别。1表示男性，2表示女性 
*   email : 邮箱。长度为0~64个字节。企业内必须唯一 
*   weixinid :微信号。企业内必须唯一。（注意：是微信号，不是微信的名字）
*   avatar_mediaid :成员头像的mediaid，通过多媒体接口上传图片获得的mediaid 
*   extattr :扩展属性。扩展属性需要在WEB管理端创建后才生效，否则忽略未知属性的赋值 
*
*   返回说明:(code,msg)
*   {code:0,msg:'成员添加成功!'}{code:1,msg:'成员添加失败!'}{code:2,msg:'微信Token获取失败!'}
*   {code:3,msg:''}
*
**/
wechat.createUser = function (user) {
    var deferred = Q.defer();
    var ss = JSON.stringify(user);
    var slength =len(ss);
    var createUserRes = {

    };
    wechat.getToken().then(function (token) {
        var ss = JSON.stringify(user);
        var message_option = {
            hostname: 'qyapi.weixin.qq.com',
            path: '/cgi-bin/user/create?access_token=' + token,
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Content-Length': slength,  //这个是必须的 不然会报错
            }
        };
        var message_req = https.request(message_option,function(message_res) {
            message_res.setEncoding('utf8');
            message_res.on('data',function(a) {
                var message_result = JSON.parse(a);
                if (message_result.errcode != 0) {
                    console.log("成员添加失败!");
                    console.log(a);
                    createUserRes.code = 1;
                    createUserRes.msg = "成员添加失败!";
                    deferred.resolve(createUserRes);
                }else{
                    console.log("成员添加成功!");
                    createUserRes.code = 0;
                    createUserRes.msg = "成员添加成功!";
                    deferred.resolve(createUserRes);
                }
            });

        });
        message_req.write(ss);
        message_req.end();
        message_req.on('error', function(e) {
            console.error(e);
            createUserRes.code = 3;
            createUserRes.msg = e;
            deferred.resolve(createUserRes);
        });

    },function (error) {
        console.log(error);
        console.log("微信Token获取失败!");
        createUserRes.code = 2;
        createUserRes.msg = "微信Token获取失败!";
        deferred.reject(createUserRes);
    });
    return deferred.promise;

};

module.exports = wechat;

/**
*   发送消息调用示例
*   wechat = require("wechat.js");//(替换成相应路径)
*   var data={"touser":"xxx","msgtype":"text","agentid":'x',"text":{"content":"xxx"},"safe":0};
*   wechat.createUser(data).then(function (response) {
*
*   });
*   (其它方法同上)
**/