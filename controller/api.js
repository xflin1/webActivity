var Promise = require('bluebird');
var magic = require('../util/magic.js');
var utils = require('../util/utils.js');
var User = require('../service/user.js');
var Base = require('../service/base.js');
var userVendor = require('../service/uservendor.js');
var vendorServiceType = require('../service/vendorServiceType.js');
var serviceType = require('../service/serviceType.js');
var serviceResult = require('../service/serviceResult.js');
var serviceData = require('../service/serviceData.js');
var serviceDataTarget = require('../service/serviceDataTarget.js');
var vendor = require('../service/vendor.js');
var vendorTarget = require('../service/vendorTarget.js');


module.exports=function(app){
    app.all('/api/*',function(req,res,next){
        res.header("Access-Control-Allow-Credentials","true");
        res.header("Access-Control-Allow-Origin", req.headers.origin);
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
        res.header("X-Powered-By",' 3.2.1');
        res.header("Content-Type", "application/json;charset=utf-8");
        next();
    });

    /**
     * @api {post} /api/register/vendor registerVendor
     * @apiGroup api_register
     * @apiVersion 1.0.0
     * @apiDescription 注册企业用户(限AR业务)
     *
     * @apiParam {string} userName  用户名
     * @apiParam {string} password  密码
     * @apiParam {string} name      企业名称
     * @apiParam {string} [phone]     联系座机
     * @apiParam {string} [mobile]    联系手机
     * @apiParam {string} [remark]    企业描述
     *
     * @apiSuccessExample Success
     * {
     * code:0
     * }
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api/register/vendor',function(req,res){
        var params = ['userName','password','name'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var userValues = {
            name:req.body.userName,
            nickname:req.body.userName,
            pass:req.body.password,
            role:magic.ROLE_ADMIN
        };
        var vendorValues = {
            name:req.body.name,
            phone:req.body.phone,
            mobile:req.body.mobile,
            remark:req.body.remark,
            vc:0,
            st:0
        };
        utils.addTimeStamp(vendorValues);
       Base.vendorRegisterInsert(userValues,vendorValues)
           .then(function(ids){
               res.json({
                   code:0
               });
               var vid = ids[1];
               return vendorServiceType.insert({vid:vid,st:magic.AR_ID});
           })
           .catch(function(error){
               utils.normalError(res);
               utils.handleError(error);
           });
    });
    /**
     * @api {post} /api/register/user registerUser
     * @apiGroup api_register
     * @apiVersion 1.0.0
     * @apiDescription 注册普通用户
     *
     * @apiParam {string} userName  用户名
     * @apiParam {string} password  密码
     * @apiParam {string} nickname  昵称
     *
     * @apiSuccessExample Success
     * {
     * code:0
     * }
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api/register/user',function(req,res){
        var params = ['userName','password','nickname'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var values = {
            name:req.body.userName,
            nickname:req.body.userName,
            pass:req.body.password,
            role:magic.ROLE_USER
        };
        Base.userRegisterInsert(values)
            .then(function(){
                res.json({
                    code:0
                });
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });

    });
    /**
     * @api {post} /api/login login
     * @apiGroup api_login
     * @apiVersion 1.0.0
     * @apiDescription 登录接口
     * @apiParam {string} username  用户名
     * @apiParam {string} password  密码
     *
     * @apiSuccessExample Success
     * {
     * code:0
     * }
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     *
     *
     *
     */
    app.post('/api/login',function(req,res){
        var params = ['username','password'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var name = req.body.username;
        User.getByName(name,['id','pass','role'])
            .then(function(rows){
                if(rows.length===1 && utils.checkPassword(req.body.password,rows[0].pass)){
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
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });
    /**
     * @api {post} /api/logout logout
     * @apiGroup api_login
     * @apiVersion 1.0.0
     * @apiDescription 登录接口
     *
     * @apiSuccessExample Success
     * {
     * code:0
     * }
     *
     */
    app.post('/api/logout',function(req,res){
        req.session.destroy();
        res.json({code:0});
    });

    /**
     * @api {post} /api/check/name checkName
     * @apiGroup api_check
     * @apiVersion 1.0.0
     * @apiDescription 检测用户名是否存在
     * @apiParam {string} userName 用户名
     * @apiSuccessExample Success
     * false或true //false表示存在,true表示不错在
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api/check/name',function(req,res){
        var params = ['userName'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var name = req.body.userName;
        User.getByName(name)
            .then(function(rows){
                res.json(!(rows.length===1));
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });
    /**
     * @api {post} /api/check/vendor checkVendor
     * @apiGroup api_check
     * @apiVersion 1.0.0
     * @apiDescription 检测企业名是否存在
     * @apiParam {string} name 企业名
     * @apiSuccessExample Success
     * false或true //false表示存在,true表示不错在
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api/check/vendor',function(req,res){
        var params = ['name'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var name = req.body.name;
        vendor.getByName(name,['id'])
            .then(function(rows){
                res.json(!(rows.length===1));
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });

    /**
     * @api {post} /api/user/password userPassword
     * @apiGroup api_user
     * @apiVersion 1.0.0
     * @apiDescription 更改密码
     * @apiParam {string} [name] 用户名
     * @apiParam {string} password 旧密码
     * @apiParam {string} newPassword 新密码
     *
     * @apiSuccessExample Success
     * {
     * code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     *
     */
    app.post('/api/user/password',function(req,res){
        var params = ['password','newPassword'];
        if(utils.checkParam(req,res,params)===false){
            return;
        }
        var name = req.body.name?req.body.name:req.session.name;
        var Password = req.body.password;
        var newPassword = req.body.newPassword;
        User.getByName(name,['id','pass','role'])
            .then(function(rows){
                if(rows.length===1 && utils.checkPassword(Password,rows[0].pass)){
                    return User.updateByName(name,{pass:newPassword});
                }else{
                    return Promise.reject(new Error('无用户或密码错误'));
                }
            })
            .then(function(rows){
                utils.normalUpdate(rows,res);
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });

    app.all('/api/user/*',function(req,res,next){
        if(req.session.uid===undefined){
            res.status(403).end();
        }else{
            next();
        }
    });

    /**
     * @api {post} /api/user/info userInfo
     * @apiGroup api_user
     * @apiVersion 1.0.0
     * @apiDescription 获取用户本人的详细信息或其他人的简略信息
     * @apiParam {int} [uid]    用户id,不输入代表本人
     *
     *
     *
     * @apiSuccessExample Success(本人)
     *  {
     *  code:0
     *  user:{
     *      nickname:'昵称',
     *      sex:0               //0--男,1--女
     *      weixin:123          //微信
     *      qq:123              //qq
     *      email:123@XXX.COM
     *      phone:123456
     *      photoId:'fid'       //头像文件fid
     *      extattrs:{}         //扩展字段
     *      }
     * }
     * @apiSuccessExample Success(他人)
     *  {
     *  code:0
     *  user:{
     *      nickname:'昵称',
     *      sex:0               //0--男,1--女
     *      photoId:'fid'       //头像文件fid
     *      }
     * }
     *
     *
     */
    app.post('/api/user/info',function(req,res){
        var uid = req.session.uid;
        var fields = ['nickname','sex','weixin','qq','email','phone','photoId','extattrs'];
        if(req.body.uid!==undefined){
            uid = req.body.uid;
            fields = ['nickname','sex','photoId'];
        }

        User.getById(uid,fields)
            .then(function(rows){
                utils.analyseExtra(rows);
                utils.normalGet(rows[0],res,'user');
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });

    /**
     * @api {post} /api/user/update updateUser
     * @apiGroup api_user
     * @apiVersion 1.0.0
     * @apiDescription 更新用户本人的个人信息
     * @apiParam {string}   [nickname]  昵称
     * @apiParam {int}      [sex]       性别
     * @apiParam {string}   [weixin]    微信号
     * @apiParam {string}   [qq]        qq
     * @apiParam {string}   [phone]     电话
     * @apiParam {string}   [photoId]   头像文件fid
     * @apiParam {object}   [extattrs]  扩展字段(使用jquery该参数使用json.stringfy()转换)
     *
     *
     */
    app.post('/api/user/update',function(req,res){
        var values = req.body;
        var uid = req.session.uid;
        var fields = ['nickname','sex','weixin','qq','email','phone','photoId','extattrs'];
        utils.valuesFilter(values,fields);
        User.updateById(uid,values)
            .then(function(rows){
                utils.normalInsert(rows,res);
            })
            .catch(function(error){
                utils.normalError(res);
                utils.handleError(error);
            });
    });
};
