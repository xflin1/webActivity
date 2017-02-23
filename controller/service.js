var path = require('path');
var magic = require('../util/magic.js');
var utils = require('../util/utils.js');
var fs = require('fs-promise');
var userVendor = require('../service/uservendor.js');
var vendorServiceType = require('../service/vendorServiceType.js');
var serviceType = require('../service/serviceType.js');
var serviceResult = require('../service/serviceResult.js');
var serviceData = require('../service/serviceData.js');
var serviceDataTarget = require('../service/serviceDataTarget.js');
var vendor = require('../service/vendor.js');
var vendorTarget = require('../service/vendorTarget.js');
var User = require('../service/user.js');
var vendorCheck = require('../service/vendorCheck.js');
var Base = require('../service/base.js');
var weChat = require('../util/wechat-promise.js');
var config = require('../config/config.js');
module.exports=function(app){

    app.all('/api/service/*',function(req,res,next){
        if(req.session.uid===undefined){
            res.status(403).end();
        }else{
            next();
        }
    });
    /*-----------------------------------------------------**/
    /*-----------------------GET---------------------------**/
    /*-----------------------------------------------------**/

    /*--------------------**/
    /*----service_user----**/
    /*--------------------**/
    /**
     * @api {get} /service/user/action/:action userAction
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 获取action相应id的user端html
     * @apiParam {string}   :action
     * @apiParam {int}      [id]    可以给一个action对应多个html
     *
     */
    app.get(magic.URL_SERVICE_USER_ACTION,function(req,res){
        var action = req.params.action;
        if(action==='Register'){
            res.render("./student/childPages/register");
        }else{
            res.status(404).end();
        }
    });

    /*--------------------**/
    /*----service_admin---**/
    /*--------------------**/
    /**
     * @api {get} /service/admin/action/:action adminAction
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 获取action相应id的admin端html
     * @apiParam {string}   :action
     * @apiParam {int}      [id]    可以给一个action对应多个html
     *
     */
    app.get(magic.URL_SERVICE_ADMIN_ACTION,function(req,res){
        var action = req.params.action;
        if(action==='Register'){
             res.render("./student/childPages/registerAdmin");
        }else{
            res.status(404).end();
        }
    });
    /*--------------------**/
    /*----service_publish-**/
    /*--------------------**/
    /**
     * @api {get} /service/publish/action/:action publishAction
     * @apiGroup service_publish
     * @apiVersion 1.0.0
     * @apiDescription 获取action相应id的publish端html
     * @apiParam {string}   :action
     * @apiParam {int}      [id]    可以给一个action对应多个html
     *
     */
    app.get(magic.URL_SERVICE_PUBLISH_ACTION,function(req,res){
        var action = req.params.action;
        if(action==='Register'){
            res.render("./student/childPages/registerAdd");
        }else{
            res.status(404).end();
        }
    });

    /*-----------------------------------------------------**/
    /*-----------------------POST--------------------------**/
    /*-----------------------------------------------------**/

    /*--------------------**/
    /*----service_publish-**/
    /*--------------------**/
    /**
     *
     * @api {post} /service/publish/loader publishLoader
     * @apiGroup service_publish
     * @apiVersion 1.0.0
     * @apiDescription 根据st获取action
     *
     * @apiParam {int} st   服务id
     * @apiParam {int} vid  企业id
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  action:'register'
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post(magic.URL_SERVICE_PUBLISH_LOADER,_publishLoader);

    /**
     *
     * @api {post} /service/publish/submit publishSubmit
     * @apiGroup service_publish
     * @apiVersion 1.0.0
     * @apiDescription 提交添加新服务信息
     *
     * @apiParam {int}      st          服务类型id
     * @apiParam {int}      vid         企业id
     * @apiParam {string}   name        服务名
     * @apiParam {string}   description 描述
     * @apiParam {text}     content     内容
     * @apiParam {string}   image       缩略图
     * @apiParam {object}   msgAttrs    额外字段
     * @apiParam {string}   action      服务对应action
     * @apiParam {string}    target      发布目标企业id,如1,2,3 用逗号隔开
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post(magic.URL_SERVICE_PUBLISH_SUBMIT,_publishSubmit);

    /**
     *
     * @api {post} /api/service/publish/submit publishSubmit
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 提交添加新服务信息
     *
     * @apiParam {int}      st          服务类型id
     * @apiParam {int}      vid         企业id
     * @apiParam {string}   name        服务名
     * @apiParam {string}   description 描述
     * @apiParam {text}     content     内容
     * @apiParam {string}   image       缩略图
     * @apiParam {object}   msgAttrs    额外字段(使用jquery该参数使用json.stringfy()转换)
     * @apiParam {string}   action      服务对应action
     * @apiParam {string}    target      发布目标企业id用','隔开,例:'1,2,3'
     *
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post('/api'+magic.URL_SERVICE_PUBLISH_SUBMIT,_publishSubmit);


    /**
     * @api {post} /service/publish/target publishTarget
     * @apiGroup service_publish
     * @apiVersion 1.0.0
     * @apiDescription 获取可发布目标
     * @apiParam {int}  vid     企业id
     *
     * @apiSuccessExample success
     * {
     *   code:0,
     *   target[
     *      {id:1,
     *       name:'xx',
     *       parentId:0
     *       },...
     *   ]
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_PUBLISH_TARGET,_publishTarget);

    /*--------------------**/
    /*----service_admin---**/
    /*--------------------**/
    /**
     *
     * @api {post} /service/admin/loader adminLoader
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 根据sd获取action
     *
     * @apiParam {int} sd   serviceData id
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  action:'register'
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    app.post(magic.URL_SERVICE_ADMIN_LOADER,_adminLoader);


    /**
     * @api {post} /service/admin/delete adminDelete
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 根据serviceData id删除数据
     *
     * @apiParam sd {int} serviceData id
     *
     * @apiSuccessExample success
     * {
     * code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_DELETE,_adminDelete);

    /**
     * @api {post} /api/service/admin/delete adminDelete
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 根据serviceData id删除数据
     *
     * @apiParam sd {int} serviceData id
     *
     * @apiSuccessExample success
     * {
     * code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_ADMIN_DELETE,_adminDelete);

    /**
     * @api {post} /service/admin/list/data adminDataList
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 根据vid,st获取vid发布的服务
     * @apiParam {int} vid  企业id
     * @apiParam {int} [st] serviceType的Id,不指定代表所有类型.
     * @apiParam {int} page  数据页码(从0开始)
     * @apiParam {int} limit 数据最多条数
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *      id:1,
     *      name:'',
     *      description:'',
     *      content:'',
     *      image:'',
     *      msgAttrs:'',
     *      ts:''
     *      },...]
     * }
     *
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_LIST_DATA,_adminDataList);

    /**
     * @api {post} /api/service/admin/list/data adminDataList
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 根据vid,st获取vid发布的服务
     * @apiParam {int} vid  企业id
     * @apiParam {int} [st] serviceType的Id,不指定代表所有类型.
     * @apiParam {int} page  数据页码(从0开始)
     * @apiParam {int} limit 数据最多条数
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *      id:1,
     *      name:'',
     *      description:'',
     *      content:'',
     *      image:'',
     *      msgAttrs:'',
     *      ts:''
     *      },...]
     * }
     *
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_ADMIN_LIST_DATA,_adminDataList);

    /**
     * @api {post} /service/admin/data adminData
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 根据sd获取服务的详细信息
     *
     * @apiParam {int} sd serviceData的id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * data:{
     *    id:1,
     *    name:'xx',
     *    description:'xx',
     *    content:'',
     *    image:'',
     *    msgAttrs:{},  //扩展字段
     *    vid:1,        //发布公司id
     *    uid:1,        //发布用户id
     *    ts:1111       //发布时间戳
     *   }
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_DATA,_adminData);
    /**
     * @api {post} /api/service/admin/data adminData
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 根据sd获取服务的详细信息
     *
     * @apiParam {int} sd serviceData的id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * data:{
     *    id:1,
     *    name:'xx',
     *    description:'xx',
     *    content:'',
     *    image:'',
     *    msgAttrs:{},  //扩展字段
     *    vid:1,        //发布公司id
     *    uid:1,        //发布用户id
     *    ts:1111       //发布时间戳
     *   }
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_ADMIN_DATA,_adminData);


    /**
     * @api {post} /service/admin/list/vendor adminVendorList
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 获取本用户有操作权限的企业列表
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *         id:1,
     *         name:'xx'
     *       },...]
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_LIST_VENDOR,_adminVendorList);

    /**
     * @api {post} /service/admin/list/vendor adminVendorList
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 获取本用户有操作权限的企业列表
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *         id:1,
     *         name:'xx'
     *       },...]
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_LIST_VENDOR,_adminVendorList);
    /**
     * @api {post} /api/service/admin/list/vendor adminVendorList
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 获取本用户有操作权限的企业列表
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *         id:1,
     *         name:'xx'
     *       },...]
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_ADMIN_LIST_VENDOR,_adminVendorList);


    /**
     * @api {post} /service/admin/list/type adminTypeList
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiParam {int} vid
     *
     * @apiSuccessExample Success
     * {
     * code:0,
     * list:[{
     *       id:,
     *       name:,
     *       remark:, //服务描述
     *       },...]
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_LIST_TYPE,_adminTypeList);

    /**
     * @api {post} /service/admin/update adminUpdate
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 更新指定sd的数据
     *
     * @apiParam {int}      sd          服务数据的id
     * @apiParam {string}   name        服务名
     * @apiParam {string}   description 描述
     * @apiParam {text}     content     内容
     * @apiParam {string}   image       缩略图
     * @apiParam {object}   msgAttrs    额外字段
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_UPDATE,_adminUpdate);
    /**
     * @api {post} /api/service/admin/update adminUpdate
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 更新指定sd的数据
     *
     * @apiParam {int}      sd          服务数据的id
     * @apiParam {string}   name        服务名
     * @apiParam {string}   description 描述
     * @apiParam {text}     content     内容
     * @apiParam {string}   image       缩略图
     * @apiParam {object}   msgAttrs    额外字段(使用jquery该参数使用json.stringfy()转换)
     *
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_ADMIN_UPDATE,_adminUpdate);

    /**
     * @api {post} /service/admin/register/user adminRegisterUser
     * @apiGroup service_admin
     * @apiVersion 1.0.0
     * @apiDescription 获取sd报名的用户列表
     * @apiParam {int} sd 服务id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * list:[
     *      {
     *      id:'123',
     *      nickname:'123'
     *      phone:
     *  ]
     * }
     *
     */
    app.post(magic.URL_SERVICE_ADMIN_REGISTER_USER,_adminRegisterUser);

    /*--------------------**/
    /*----service_user----**/
    /*--------------------**/
    /**
     * @api {post} /service/user/loader userLoader
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 根据serviceData id获取action
     *
     * @apiParam sd {int} serviceData id
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  action:'register'
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_USER_LOADER,_userLoader);

    /**
     * @api {post} /service/user/submit userSubmit
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 修改用户对应该sd服务的个人数据
     *
     * @apiParam  {int}    sd          serviceData Id
     * @apiParam  {int}    status      状态符
     * @apiParam  {object} msgAttrs    额外字段
     *
     * @apiSuccessExample success
     * {
     * code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     */
    app.post(magic.URL_SERVICE_USER_SUBMIT,_userSubmit);

    /**
     * @api {post} /api/service/user/submit userSubmit
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 修改用户对应该sd服务的个人数据
     *
     * @apiParam  {int}    sd          serviceData Id
     * @apiParam  {int}    status      状态符
     * @apiParam  {object} msgAttrs    额外字段 (使用jquery该参数使用json.stringfy()转换)
     *
     * @apiSuccessExample success
     * {
     * code:0
     * }
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     */
    app.post('/api'+magic.URL_SERVICE_USER_SUBMIT,_userSubmit);

    /**
     *
     * @api {post} /service/user/list/data userListData
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 根据st获取当前用户可见的所有serviceData
     * @apiParam {int} [st] serviceType的Id,不指定代表所有类型.
     * @apiParam {int} page  数据页码(从0开始)
     * @apiParam {int} limit 数据最多条数
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *      id:1,
     *      name:'',
     *      description:'',
     *      content:'',
     *      image:'',
     *      msgAttrs:'',
     *      ts:''
     *      },...]
     * }
     *
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     */
    app.post(magic.URL_SERVICE_USER_LIST_DATA,_userListData);

    /**
     *
     * @api {post} /api/service/user/list/data userListData
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiDescription 根据st获取当前用户可见的所有serviceData
     * @apiParam {int} [st] serviceType的Id,不指定代表所有类型.
     * @apiParam {int} page  数据页码(从0开始)
     * @apiParam {int} limit 数据最多条数
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *      id:1,
     *      name:'',
     *      description:'',
     *      content:'',
     *      image:'',
     *      msgAttrs:'',
     *      ts:''
     *      },...]
     * }
     *
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     */
    app.post('/api'+magic.URL_SERVICE_USER_LIST_DATA,_userListData);

    /**
     * @api {post} /service/user/data  userData
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiParam {int} sd 数据id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * data:{
     *    id:1,
     *    name:'xx',
     *    description:'xx',
     *    content:'',
     *    image:'',
     *    msgAttrs:{},  //扩展字段
     *    vid:1,        //发布公司id
     *    uid:1,        //发布用户id
     *    ts:1111       //发布时间戳
     *   }
     * }
     *
     */
    app.post(magic.URL_SERVICE_USER_DATA,_userData);

    /**
     * @api {post} /api/service/user/data  userData
     * @apiGroup api_service
     * @apiVersion 1.0.0
     * @apiParam {int} sd 数据id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * data:{
     *    id:1,
     *    name:'xx',
     *    description:'xx',
     *    content:'',
     *    image:'',
     *    msgAttrs:{},  //扩展字段
     *    vid:1,        //发布公司id
     *    uid:1,        //发布用户id
     *    ts:1111       //发布时间戳
     *   }
     * }
     *
     */
    app.post('/api'+magic.URL_SERVICE_USER_DATA,_userData);

    /**
     * @api {post} /service/user/personal userPersonal
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 根据sd获取对于该服务的个人数据
     * @apiParam {int} sd serviceData的id
     *
     * @apiSuccessExample Success
     * {
     * code:0,
     * data:[{              //数据最多为一条,没有说明没有添加
     *        id:1,
     *        sd:1,
     *        uid:1,
     *        errcode:0,
     *        status:0,
     *        msgAttrs:{},
     *        ts:1234
     *       }]
     * }
     *
     * @apiSuccessExample Error
     * {
     * code:-1
     * }
     */
    app.post(magic.URL_SERVICE_USER_PERSONAL,_userPersonal);

    /**
     * @api {post} /service/user/action/:action
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 具体action的特殊操作
     *
     * @apiParam {string} :action
     * @apiParam {object} data
     *
     */
    app.post(magic.URL_SERVICE_USER_ACTION,function(req,res){
        var action = req.params.action;
        if(action==='Register'){

        }
    });

    /**
     * @api {post} /service/user/list/personal userPersonalList
     * @apiGroup service_user
     * @apiVersion 1.0.0
     * @apiDescription 获取个人数据中status为指定值的服务列表
     * @apiParam status
     * @apiParam st
     * @apiParam limit
     * @apiParam page
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *      id:1,
     *      name:'',
     *      description:'',
     *      image:'',
     *      msgAttrs:'',
     *      ts:''
     *      },...]
     * }
     *
     * @apiSuccessExample error
     * {
     * code:-1
     * }
     *
     */
    app.post(magic.URL_SERVICE_USER_LIST_PERSONAL,_userPersonalList);

    /**
     * @api {post} /role/target roleTarget
     * @apiGroup role
     * @apiVersion 1.0.0
     * @apiDescription 获取用户可以管理的所有机构列表
     * @apiSuccessExample success
     * {
     *   code:0,
     *   target[
     *      {id:1,
     *       name:'xx',
     *       parentId:0
     *       },...
     *   ]
     * }
     *
     */
    app.post(magic.URL_ROLE_TARGET,_roleTarget);
    /**
     * @api {post} /role/set roleSet
     * @apiGroup role
     * @apiVersion 1.0.0
     * @apiDescription 管理员设置权限
     * @apiParam {string} username  添加用户名
     * @apiParam {string} vid       设置机构名
     * @apiParam {int}    role      设置权限:0为普通管理员,其他为普通用户
     *
     */
    app.post(magic.URL_ROLE_SET,_roleSet);

    /*--------------------**/
    /*----service_audit---**/
    /*--------------------**/

    app.post('/audit/*',function(req,res,next){
        if(req.session.name!='admin'){
            res.status(403).end();
        }else{
            next();
        }
    });
    /**
     * @api {post} /audit/vendor/list auditVendorList
     * @apiGroup service_audit
     * @apiVersion 1.0.0
     * @apiDescription ADMIN管理员获取企业列表
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *         id:1,
     *         name:'xx',
     *         vc:0,
     *         logo:'',
     *         ts:'',
     *       },...]
     * }
     * @apiSuccessExample error
     * {
     * code:-1,
     * }
     */
    app.post(magic.URL_AUDIT_VENDOR_LIST,_auditVendorList);

    /**
     * @api {post} /audit/vendor auditVendor
     * @apiGroup service_audit
     * @apiVersion 1.0.0
     * @apiDescription ADMIN管理员获取企业详细信息
     * @apiParam {int} vid 企业id
     *
     * @apiSuccessExample success
     * {
     *  code:0,
     *  vendor:{
     *         id:1,
     *         name:'xx',
     *         vc:0,
     *         logo:'',
     *         mobile:'',
     *         phone:'',
     *         address:'',
     *         remark:'',
     *         uid:'',
     *         ts:'',
     *         }
     * }
     * @apiSuccessExample error
     * {
     * code:-1,
     * }
     */
    app.post(magic.URL_AUDIT_VENDOR,_auditVendor);

    /**
     * @api {post} /audit/check auditCheck
     * @apiGroup service_audit
     * @apiVersion 1.0.0
     * @apiDescription ADMIN管理员获取企业审核的详细信息
     * @apiParam {int} vid 企业id
     *
     * @apiSuccessExample success
     * {
     * code:0,
     * check:{
     *      bl:'fid',
     *      extattrs:{},
     *      uid:''//审核者
     *      result:'checking',
     *      updatetime:'',
     *      ts:''
     *  }
     * }
     */
    app.post(magic.URL_AUDIT_CHECK,_auditCheck);

    /**
     * @api {post} /audit/update auditUpdate
     * @apiGroup service_audit
     * @apiVersion 1.0.0
     * @apiDescription ADMIN管理员修改企业审核的状态
     * @apiParam {int} vid      企业id
     * @apiParam {int} status 0通过,非0拒绝
     * @apiParam {string} result 拒绝注释
     *
     * @apiSuccessExample success
     * {
     * code:0
     * }
     *
     */
    app.post(magic.URL_AUDIT_UPDATE,_auditUpdate);
};

var _auditUpdate = function(req,res){
    var status = req.body.status;
    var result = req.body.result;
    var vid = req.body.vid;
    if(status == 0){
        result = 'passed';
    }
    var values = {
        uid:req.session.uid,
        result:result,
        updatetime:Math.ceil((new Date()).getTime()/1000)
    };
    Base.auditUpdate(values,vid)
        .then(function(){
            res.json({
                code:0
            });
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _auditCheck = function(req,res){
    var vid = req.body.vid;
    var fields = ['vid','bl','extattrs','uid','result','updatetime','ts'];
    vendorCheck.getByVid(vid,fields)
        .then(function(rows){
            if(rows.length==0){
                res.json({
                    code:-1,
                    msg:'无该vid记录'
                });
            }else{
                utils.analyseExtra(rows);
                utils.normalGet(rows[0],res,'check');
            }
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _auditVendor = function(req,res){
    var vid = req.body.vid;
    var fields = ['id','name','vc','logo','mobile','phone','address','remark','uid','ts'];
    vendor.getById(vid,fields)
        .then(function(rows){
            if(rows.length==1){
                utils.normalGet(rows[0],res,'vendor');
            }else{
                return Promise.reject(new Error('vid异常'));
            }
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _auditVendorList = function(req,res){
        var fields = ['id','name','vc','logo','ts'];
        vendor.getByPid(0,fields)
            .then(function(rows){
                utils.normalGet(rows,res,'list');
            })
            .catch(function(error){
                utils.handleError(error);
                utils.normalError(res);
            });
};

var _roleSet = function(req,res){
    var username = req.body.username;
    var uid = req.session.uid;
    var vid = req.body.vid;
    var role = req.body.role===0?magic.ROLE_VENDOR:magic.ROLE_USER;
    var insertUid;
    _roleVendorPermission(uid,vid)
        .then(function(permission){
            if(permission===true){
                return User.getByName(username,['id']);
            }else{
                var err = new Error('无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            if(rows.length===1){
                insertUid = rows[0].id;
                return userVendor.getByUidVid(insertUid,vid,undefined,['id']);
            }else{
                var err = new Error('无该用户名用户');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            var values;
            if(rows.length==0){
                values = {
                    vid:vid,
                    uid:insertUid,
                    role:role
                };
                return userVendor.insert(values);
            }else{
                values = {
                    role:role
                };
                return userVendor.update({uid:insertUid,vid:vid},values);
            }
        })
        .then(function(rows){
            utils.normalUpdate(rows,res);
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        })
};

var _roleTarget = function(req,res){
    var uid = req.session.uid;
    userVendor.getAdmin(uid,['vid'])
        .then(function(rows){
            var length = rows.length;
            var fields = ['id','name','parentId'];
            var queue = [];
            for(var i=0;i<length;i++){
                queue.push(vendor.getChildren(rows[i]['vid'],fields));
            }
            return Promise.all(queue);
        })
        .then(function(data){
            var vData = utils.mergeVendor(data);
            utils.normalGet(vData,res,'target');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _userPersonalList = function(req,res){
    var status = req.body.status;
    var st = req.body.st;
    var page = req.body.page;
    var limit = req.body.limit;
    var uid = req.session.uid;
    var fields = ['id','name','description','uid','ts','image','msgAttrs'];
    serviceData.findDataByStatusSt(uid,status,st,limit,limit*page,fields,'ts',false)
        .then(function(rows){
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _userPersonal = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    serviceResult.getByUidSd(uid,sd)
        .then(function(rows){
            utils.analyseExtra(rows);
            utils.normalGet(rows,res,'data');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _userData = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    userVendor.getUserVendor(uid)
        .then(function(rows){
            if(rows.length===1&&rows[0]['vidG']!=undefined){
                return vendor.getFather(rows[0]['vidG']);
            }else{
                return Promise.reject(new Error('uid异常'));
            }
        })
        .then(function(rows){
            if(rows.length===1&&rows[0]['vidG']!=undefined){
                return serviceData.getDataBySd(rows[0]['vidG'],sd)
            }else{
                return Promise.reject(new Error('uid异常'));
            }
        })
        .then(function(rows){
            if(rows.length===1){
                utils.analyseExtra(rows);
                utils.normalGet(rows[0],res,'data');
            }else{
                return Promise.reject(new Error('无权限或无数据'));
            }
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _userListData = function(req,res){
    var st = req.body.st;
    var uid = req.session.uid;
    var page = req.body.page;
    var limit = req.body.limit;
    userVendor.getUserVendor(uid)
        .then(function(rows){
            if(rows.length===1&&rows[0]['vidG']!=undefined){
                return vendor.getFather(rows[0]['vidG']);
            }else{
                return Promise.reject(new Error('uid异常'));
            }
        })
        .then(function(rows){
            if(rows.length===1&&rows[0]['vidG']!=undefined){
                var fields = ['id','name','description','ts','uid','image','msgAttrs'];
                return serviceData.findData(rows[0]['vidG'],limit,page*limit,fields,'ts',false,st);
            }else{
                return Promise.reject(new Error('uid异常'));
            }
        })
        .then(function(rows){
            utils.analyseExtra(rows);
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _userSubmit = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    var insertValues = {
        sd:sd,
        uid:uid,
        errcode:0,
        status:req.body.status,
        msgAttrs:req.body.msgAttrs
    };
    var updateValues = {
        status:req.body.status,
        msgAttrs:req.body.msgAttrs
    };
    utils.addTimeStamp(insertValues);
    serviceResult.getByUidSd(uid,sd,['id'])
        .then(function(rows){
            if(rows.length===0){
                return serviceResult.insert(insertValues);
            }else{
                var condition = {
                    sd:sd,
                    uid:uid
                };
                return serviceResult.update(condition,updateValues);
            }
        })
        .then(function(rows){
            utils.normalInsert(rows,res);
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};


var _userLoader = function(req,res){
    var sd = req.body.sd;
    var st;
    serviceData.getById(sd,['st'])
        .then(function(rows){
            if(rows.length===1){
                st = rows[0]['st'];
                return serviceType.getById(st,["actions"]);
            } else{
                return Promise.reject(new Error(sd+'无该记录'));
            }
        })
        .then(function(rows){
            if(rows.length===1){
                var actions = utils.parserActions(rows[0]['actions']);
                utils.normalGet(actions[0],res,'action');
            }else{
                var err = new Error('无改st的serviceType'+st);
                return Promise.reject(err);
            }
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};


var _adminRegisterUser = function(req,res){
    var sd =req.body.sd;
    var uid = req.session.uid;
    var vid;
    var fields = ['id','nickname','phone'];
    serviceData.getById(sd,['vid','st'])
        .then(function(rows){
            if(rows.length===1){
                vid = rows[0]['vid'];
                return _vendorPermission(uid,vid);
            } else{
                return Promise.reject(new Error(sd+'无该记录'));
            }
        })
        .then(function(permission){
            if(permission===true){
                return serviceResult.getRegisterUser(sd,-1,fields);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _adminData = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    serviceData.getAdminData(sd,uid)
        .then(function(rows){
            if(rows.length===1){
                utils.analyseExtra(rows);
                utils.normalGet(rows[0],res,'data');
            }else{
                return Promise.reject(new Error('无法获取'));
            }
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _adminTypeList = function(req,res){
    var vid = req.body.vid;
    var fields = ['id','name','remark'];
    vendorServiceType.getServiceType(vid,fields)
        .then(function(rows){
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _adminVendorList = function(req,res){
    var uid = req.session.uid;
    var fields=['id','name'];
    userVendor.getVendorList(uid,fields)
        .then(function(rows){
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });
};

var _adminDataList = function(req,res){
    var vid = req.body.vid;
    var st = req.body.st;
    var page = req.body.page;
    var limit = req.body.limit;
    var uid = req.session.uid;
    _vendorPermission(uid,vid)
        .then(function(permission){
            if(permission===true){
                var condition;
                if(st===undefined){
                    condition = {vid:vid};
                }else{
                    condition = {vid:vid,st:st};
                }
                return serviceData.find(condition,limit,limit*page,undefined,'ts',false);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            utils.analyseExtra(rows);
            utils.normalGet(rows,res,'list');
        })
        .catch(function(error){
            utils.handleError(error);
            utils.normalError(res);
        });

};

var _adminDelete = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    var vid;
    serviceData.getById(sd,['vid','st'])
        .then(function(rows){
            if(rows.length===1){
                vid = rows[0]['vid'];
                return _vendorPermission(uid,vid);
            } else{
                return Promise.reject(new Error(sd+'无该记录'));
            }
        })
        .then(function(permission){
            if(permission===true){
                return serviceData.deleteById(sd);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            utils.normalDelete(rows,res);
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};

var _adminUpdate = function(req,res){
    var params = ['sd','name','description','content','image','msgAttrs'];
    if(utils.checkParam(req,res,params)===false){
        return;
    }
    var sd = req.body.sd;
    var uid = req.session.uid;
    var vid;
    var values = {
        name:req.body.name,
        description:req.body.description,
        content:req.body.content,
        image:req.body.image,
        msgAttrs:req.body.msgAttrs
    };
    serviceData.getById(sd,['vid','st'])
        .then(function(rows){
            if(rows.length===1){
                vid = rows[0]['vid'];
                return _vendorPermission(uid,vid);
            } else{
                return Promise.reject(new Error(sd+'无该记录'));
            }
        })
        .then(function(permission){
            if(permission===true){
                return serviceData.updateById(sd,values);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            utils.normalUpdate(rows,res);
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};

var _adminLoader = function(req,res){
    var sd = req.body.sd;
    var uid = req.session.uid;
    var vid;
    var st;
    serviceData.getById(sd,['vid','st'])
        .then(function(rows){
            if(rows.length===1){
                vid = rows[0]['vid'];
                st = rows[0]['st'];
                return _vendorPermission(uid,vid);
            } else{
                return Promise.reject(new Error(sd+'无该记录'));
            }
        })
        .then(function(permission){
            if(permission===true){
                return serviceType.getById(st,["actions"]);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            if(rows.length===1){
                var actions = utils.parserActions(rows[0]['actions']);
                utils.normalGet(actions[0],res,'action');
            }else{
                var err = new Error('无改st的serviceType'+st);
                return Promise.reject(err);
            }
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};
var _publishTarget = function(req,res){
    var vid = req.body.vid;
    var uid = req.session.uid;
    _vendorPermission(uid,vid)
        .then(function(permission){
            if(permission===true){
                return vendorTarget.getByVid(vid,['target','type']);
            }else{
                var err = new Error(uid+','+vid+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            var length = rows.length;
            var queue = [];
            var fields = ['id','name','parentId'];
            for(var i=0;i<length;i++){
                if(rows[i]['type']==0){
                    queue.push(vendor.getChildren(rows[i]['target'],fields));
                }else{
                    queue.push(vendor.getById(rows[i]['target'],fields));
                }
            }
            queue.push(vendor.getChildren(vid,fields));
            return Promise.all(queue);
        })
        .then(function(data){
            var vData = utils.mergeVendor(data);
            utils.normalGet(vData,res,'target');
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};


var _weChatMessage = function(target,tittle){
    var length = target.length;
    var queue = [];
    for(var i=0;i<length;i++){
        queue.push(vendor.getChildren(target[i],['id']));
    }
    Promise.all(queue)
        .then(function(data){
            var vidArray = [];
            for(var i =0;i<data.length;i++){
                for(var j=0;j<data[i].length;j++){
                    vidArray.push(data[i][j]['id']);
                }
            }
            var vidG = vidArray.join(',');
            return User.getWeChatTarget(vidG,['id','name','weStatus']);
        })
        .then(function(rows){
            var toUserArray = [];
            var toUser;
            for(var i=0;i<rows.length;i++){
                if(rows[i]['name']&&rows[i]['weStatus']==1){
                    toUserArray.push(rows[i]['name']);
                }
            }
            toUser = toUserArray.join('|');
            var to = {
                "touser":toUser
            };
            var message = {
                "msgtype": "text",
                "text": {
                    "content": tittle
                },
                "safe":"0"
            };

            return weChat.send(to,message);
        })
        .then(function(res){
            console.log(res);
        })
        .catch(function(error){
           console.log(error);
        });
};

/*_weChatMessage([1,3,18],'123');*/
var _publishSubmit = function(req,res){
    var st = req.body.st;
    var vid = req.body.vid;
    var uid = req.session.uid;
    var target = req.body.target.split(',');
    var targetLength = target.length;
    _vendorPermission(uid,vid)
        .then(function(permission){
            if(permission===true){
                return _servicePermission(vid,st);
            }else{
                var err = new Error(uid+','+vid+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(permission){
            if(permission===true){
                return serviceType.getById(st,["actions"]);
            }else{
                var err = new Error(vid+','+st+'无操作权限');
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            if(rows.length===1){
                var actions = utils.parserActions(rows[0]['actions']);
                if(actions[0] === req.body.action){
                    if(targetLength>0){
                        return Promise.resolve();
                    }else{
                        return Promise.reject(new Error('无发布目标'));
                    }
                }else{
                    var e = new Error('action与服务对应action不同'+st);
                    return Promise.reject(e);
                }
            }else{
                var err = new Error('无改st的serviceType'+st);
                return Promise.reject(err);
            }
        })
        .then(function(){
            var values = {
                st:st,
                name:req.body.name,
                description:req.body.description,
                content:req.body.content,
                image:req.body.image,
                uid:req.session.uid,
                vid:req.body.vid,
                msgAttrs:req.body.msgAttrs
            };
            utils.addTimeStamp(values);
            return serviceData.insert(values)
        })
        .then(function(rows){
            if(rows['affectedRows']===1){
                var sd = rows['insertId'];
                var queue = [];
                for(var i=0;i<targetLength;i++){
                    queue.push(serviceDataTarget.insert({sd:sd,vid:target[i]}));
                }
                return Promise.all(queue);
            }else{
                var err = new Error('数据插入失败'+st);
                return Promise.reject(err);
            }
        })
        .then(function(rows){
            for(var i=0;i<targetLength;i++){
                if(rows[i]['affectedRows']!==1){
                    return Promise.reject(new Error('数据插入失败'));
                }
            }
            utils.normalInsert(rows[0],res);
            if(config.wechat.off===undefined||config.wechat.off===false){
                _weChatMessage(target,req.body.name)
                    .catch(function(error){
                        utils.handleError(error);
                    });
            }
        })
        .catch(function(error){
            utils.normalError(res);
            utils.handleError(error);
        });
};

var _publishLoader = function(req,res){
    // alert("111");
    // console.log("111");
    // console.log(req.body.st+" "+req.body.vid+" "+req.session.uid+" !");
    var st = req.body.st;
    var vid = req.body.vid;
    var uid = req.session.uid;
    _vendorPermission(uid,vid)
        .then(function(permission){
            if(permission===true){
                return _servicePermission(vid,st);
            }else{
                var err = new Error(uid+','+vid+'无操作权限');
                return Promise.reject(err);
            }
        }).then(function(permission){
        if(permission===true){
            return serviceType.getById(st,["actions"]);
        }else{
            var err = new Error(vid+','+st+'无操作权限');
            return Promise.reject(err);
        }
    }).then(function(rows){
        if(rows.length===1){
            var actions = utils.parserActions(rows[0]['actions']);
            utils.normalGet(actions[0],res,'action');
        }else{
            var err = new Error('无改st的serviceType'+st);
            return Promise.reject(err);
        }
    }).catch(function(error){
        utils.normalError(res);
        utils.handleError(error);
    });
};



var _roleVendorPermission = function(uid,vid){
    return userVendor.getAdmin(uid,['vid'])
        .then(function(rows){
            var length = rows.length;
            var fields = ['id'];
            var queue = [];
            for(var i=0;i<length;i++){
                queue.push(vendor.getChildren(rows[i]['vid'],fields));
            }
            return Promise.all(queue);
        })
        .then(function(data){
            var vData = utils.mergeVendor(data);
            for(var i =0;i<vData.length;i++){
                if(vData[i]['id']==vid){
                    return Promise.resolve(true);
                }
            }
            return Promise.resolve(false);
        })
};

var _vendorPermission = function(uid,vid){
    return userVendor.getRole(uid,vid).then(function(rows){
        if(rows.length===1
            && (rows[0]['role']==magic.ROLE_VENDOR||rows[0]['role']==magic.ROLE_ADMIN)){
            return Promise.resolve(true);
        }else{
            return Promise.resolve(false);
        }
    });
};

var _servicePermission = function(vid,st){
    return vendorServiceType.getByVidSt(vid,st).then(function(rows){
        if(rows.length===1){
            return Promise.resolve(true);
        }else{
            return Promise.resolve(false);
        }
    });
};


