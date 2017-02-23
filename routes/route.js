/**
 * Created by jyl on 16-9-22.
 */
var magic = require('../util/magic.js');
/**
 *
 * controllerName:{
 *  method: POST,GET,USE
 *  path: 项目名后的全路径
 * }
 *
 * @type {{home: {path: string}, chat: {path: string}, index: {path: string}, register: {path: string}, registerMain: {path: string}, logout: {path: string}, alertBar: {path: string}, chat_group: {path: string}, chat_config: {path: string}, chat_login: {path: string}, login: {method: string, path: string}, chat_home: {method: string, path: string}}}
 */
module.exports = {
    /**
     * validate
     */
    validate_vendorGet:{
      path:'/vendor/*'
    },
    validate_userNameCheck:{
        path:"/userName/check/:userName"
    },
    common_index:{
        path:'/'
    },
    common_login:{
        path:'/login'
    },
    common_register:{
        path:'/register'
    },
    common_uiToast:{
        path:'/login/uiToast'
    },
    common_uiDropMenu:{
        path:magic.COMPONENT_DROP_MENU
    },
    common_uiUploader:{
        path:magic.COMPONENT_UPLOADER
    },
    common_uiCarousel:{
        path:magic.COMPONENT_CAROUSEL
    },
    common_uiAccordion:{
        path:magic.COMPONENT_ACCORDION
    },
    common_wsDemo:{
        path:'/wsDemo'
    },
    /**
     *
     * @api {post} /uFile uploadFile
     * @apiGroup File
     * @apiVersion 1.0.0
     * @apiDescription 上传文件
     *
     * @apiSuccess {number} code 0上传成功 -1上传失败
     * @apiSuccess {string} id     文件id
     * @apiSuccess {string} fid  文件名
     * @apiSuccessExample success
     * {
     *  code:0,
     *  id:id,
     *  fid:fid
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * */
/*    file_uFile:{
        path:'/uFile',
        method:'POST'
    },
    /!**
     *
     * @api {post} /uFile/safe uploadFileOnSafe
     * @apiGroup File
     * @apiVersion 1.0.0
     * @apiDescription 上传文件安全保存
     *
     * @apiSuccess {number} code 0上传成功 -1上传失败
     * @apiSuccess {string} id     文件id
     * @apiSuccess {string} fid  文件名
     * @apiSuccessExample success
     * {
     *  code:0,
     *  id:id,
     *  fid:fid
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * *!/
    file_extUFile:{
        path:'/uFile/:level',
        method:'POST'
    },
    file_tFile:{
        path:'/tFile'
    },
    /!**
     *
     * @api {get} /sFile/id searchFileById
     * @apiGroup File
     * @apiVersion 1.0.0
     * @apiDescription 通过文件id查询文件信息
     *
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array} [list]     数据
     * @apiSuccess {string} [msg] 返回错误信息
     * @apiSuccess (list) {string} id    文件ID
     * @apiSuccess (list) {string} fid  文件名
     * @apiSuccess (list) {string} type  文件类型，如image/jpeg
     * @apiSuccess (list) {string} name  文件原名
     * @apiSuccessExample success
     * {
     *  code:0,
     *  msg:'success'/'no record!'
     *  list:[{
     *          id:id
     *          fid:fid
     *          type:type
     *          name:name
     *          uid:uid
     *          ts:ts
     *        },...]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * *!/
    file_sFile:{
        path:'/sFile/:id'
    },
    /!**
     *
     * @api {get,post} /sFile/:fid searchFileByFid
     * @apiGroup File
     * @apiVersion 1.0.0
     * @apiDescription 通过文件名称查询文件信息
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array} [list]     数据
     * @apiSuccess {string} [msg] 返回错误信息
     * @apiSuccess (list) {string} id    文件ID
     * @apiSuccess (list) {string} fid  文件名
     * @apiSuccess (list) {string} type  文件类型，如image/jpeg
     * @apiSuccess (list) {string} name  文件原名
     * @apiSuccessExample success
     * {
     *  code:0,
     *  msg:'success'/'no record!'
     *  list:[{
     *          id:id
     *          fid:fid
     *          type:type
     *          name:name
     *          uid:uid
     *          ts:ts
     *        },...]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * *!/
   /!* file_fsFile:{
        path:'/sFile/:fid'
    },*!/
    /!**
     *
     * @api {get} /dFile/:id downloadFileById
     * @apiGroup fileOperation
     * @apiVersion 1.0.0
     * @apiDescription 下载文件
     * *!/
    file_dFile:{
        path:'/dFile/:id'
    },
    /!**
     *
     * @api {get} /dFile/:fid downloadFileByFid
     * @apiGroup fileOperation
     * @apiVersion 1.0.0
     * @apiDescription 下载文件
     * *!/
    file_dfFile:{
        path:'/dFile/:fid'
    },*/
    /**
     *
     * @api {post} /login LOGIN
     * @apiGroup Authentication
     * @apiVersion 1.0.0
     * @apiDescription 登录验证
     *
     * @apiParam {string}  name 用户名
     * @apiParam {string}  pass 密码
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 验证成功
     * {
     *  code:0,
     *  msg:'success'
     * }
     *
     * @apiSuccessExample {json} 验证失败
     * {
     *  code:-1,
     *  msg:'wrong password'
     * }
     * */
    user_login:{
        path:'/login',
        method:'POST'
    },
    /**
     *
     * @api {get} /logout LOGOUT
     * @apiGroup Authentication
     * @apiVersion 1.0.0
     * @apiDescription 注销用户
     *
     *
     * */
    user_logout:{
        path:'/logout'
    },
    user_register:{
        path:'/register',
        method:'POST'
    },
    user_registerMain:{
        path:'/register/main'
    },
    user_registerSuccess:{
        path:'/register/success'
    },
    user_userInfo:{
        path:magic.URL_USER_SELF,
        method:'POST'
    },
    user_userInfoUpdate:{
        path:magic.URL_USER_INFO
    },
    user_passwordUpdate:{
        path:magic.URL_USER_PASSWORD
    },
    user_userInfoModify:{
        path:magic.URL_USER_MODIFY,
        method:'POST'
    },
    user_adminInfo:{
        path:magic.URL_ADMINUSER
    },
    user_vendorInfo:{
        path:magic.URL_VENDORUSER
    },
    home_index:{
        path:'/index'
    },
    home_list:{
        path:'/index/list'
    },
    home_add:{
        path:'/index/add'
    },
    serviceAction_list:{
        path:'/serviceAction/list'
    },
    serviceAction_add:{
        path:'/serviceAction/add'
    },
    /**
     *
     * @api {post} /serviceAction/add ServiceActionAdd
     * @apiGroup serviceAction
     * @apiVersion 1.0.0
     * @apiDescription 服务字段添加
     *
     * @apiParam {string}  name 字段名称
     * @apiParam {string}  remark 字段描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 添加成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 添加失败
     * {
     *  code:-1,
     *  msg:'failed'
     * }
     * */
    serviceAction_addPost:{
        path:'/serviceAction/add',
        method:'POST'
    },
    serviceAction_addSuccess:{
        path:'/serviceAction/addSuccess'
    },
    serviceAction_addFail:{
        path:'/serviceAction/addFail'
    },
    serviceAction_view:{
        path:'/serviceAction/list/:name'
    },
    /**
     *
     * @api {post} /serviceAction/delete/:name ServiceActionDelete
     * @apiGroup serviceAction
     * @apiVersion 1.0.0
     * @apiDescription 服务字段删除
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 删除成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 删除失败
     * {
     *  code:1,
     *  msg:'不存在'
     * }
     * */
    serviceAction_delete:{
        path:'/serviceAction/delete/:name',
        method:'POST'
    },
    serviceAction_deleteSuccess:{
        path:'/serviceAction/deleteSuccess'
    },
    serviceAction_deleteFail:{
        path:'/serviceAction/deleteFail'
    },
    serviceAction_update:{
        path:'/serviceAction/update/:name'
    },
    /**
     *
     * @api {post} /serviceAction/update/:name ServiceActionUpdate
     * @apiGroup serviceAction
     * @apiVersion 1.0.0
     * @apiDescription 服务字段更新
     *
     * @apiParam {string}  name 字段名称
     * @apiParam {string}  remark 字段描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 更新成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 更新失败
     * {
     *  code:-1,
     *  msg:'更新失败'
     * }
     * */
    serviceAction_updatePost:{
    path:'/serviceAction/update/:name',
        method:"POST"
    },
    serviceAction_updateSuccess:{
        path:'/serviceAction/updateSuccess'
    },
    serviceAction_updateFail:{
        path:"/serviceAction/updateFail"
    },
    serviceAction_nameCheck:{
        path:"/serviceAction/check/:name"
    },
    /**
     *
     * @api {post} /serviceAction/actionList GetActionList
     * @apiGroup serviceAction
     * @apiVersion 1.0.0
     * @apiDescription 获取服务字段列表
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array} [list]     数据
     * @apiSuccess {string} [msg] 返回错误信息
     * @apiSuccess (list) {string} name    字段名
     * @apiSuccess (list) {string} remark  字段注释
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *          name:name
     *          remark:remark
     *          uid:uid
     *          ts:ts
     *        },...]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * */
    serviceAction_actionList:{
        path:'/serviceAction/list',
        method:'POST'
    },
    /**
     * serviceType
     */
    serviceType_list:{
        path:"/serviceType/list"
    },
    serviceType_add:{
        path:"/serviceType/add"
    },
    serviceType_addSuccess:{
        path:'/serviceType/addSuccess'
    },
    serviceType_addFail:{
        path:'/serviceType/addFail'
    },
    /**
     *
     * @api {post} /serviceType/add ServiceTypeAdd
     * @apiGroup serviceType
     * @apiVersion 1.0.0
     * @apiDescription 服务类型添加
     *
     * @apiParam {string}  name 服务类型名称
     * @apiParam {string}  actions 服务类型包含的操作字段,格式形如:[chat,Register]
     * @apiParam {string}  remark 服务类型描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 添加成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 添加失败
     * {
     *  code:-1,
     *  msg:'failed'
     * }
     * */
    serviceType_addPost:{
        path:"/serviceType/add",
        method:"POST"
    },
    /**
     *
     * @api {post} /serviceType/delete/:id ServiceTypeDelete
     * @apiGroup serviceType
     * @apiVersion 1.0.0
     * @apiDescription 服务类型删除
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 删除成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 删除失败
     * {
     *  code:1,
     *  msg:'不存在'
     * }
     * */
    serviceType_deletePost:{
        path:magic.URL_TYPE_DELETE,
        method:'POST'
    },
    serviceType_update:{
        path:magic.URL_TYPE_UPDATE
    },
    serviceType_updateSuccess:{
        path:'/serviceType/updateSuccess'
    },
    serviceType_updateFail:{
        path:"/serviceType/updateFail"
    },
    /**
     *
     * @api {post} /serviceType/update/:id ServiceTypeUpdate
     * @apiGroup serviceType
     * @apiVersion 1.0.0
     * @apiDescription 服务类型更新
     *
     * @apiParam {string}  name 服务类型名称
     * @apiParam {string}  actions 服务类型包含的操作字段,格式形如:[chat,Register]
     * @apiParam {string}  remark 服务类型描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 更新成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 更新失败
     * {
     *  code:-1,
     *  msg:'更新失败'
     * }
     * */
    serviceType_updatePost:{
        path:magic.URL_TYPE_UPDATE,
        method:'POST'
    },
    /**
     *
     * @api {post} /serviceType/list GetServiceTypeList
     * @apiGroup serviceType
     * @apiVersion 1.0.0
     * @apiDescription 获取服务类型列表
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array} [list]     数据
     * @apiSuccess {string} [msg] 返回错误信息
     * @apiSuccess (list) {number} id    记录id
     * @apiSuccess (list) {string} name  服务类型名称
     * @apiSuccess (list) {string} actions    服务类型包含的操作字段
     * @apiSuccess (list) {string} remark  字段注释
     * @apiSuccess (list) {number} uid    数据录入者id
     * @apiSuccess (list) {number} ts  录入时间时间戳
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[{
     *          id:id
     *          name:name
     *          actions:actions
     *          remark:remark
     *          uid:uid
     *          ts:ts
     *        },...]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:'failed'
     * }
     * */
    serviceType_listPost:{
        path:magic.URL_TYPE_LIST,
        method:'POST'
    },
    serviceType_view:{
        path:'/serviceType/list/:id'
    },
    serviceType_deleteSuccess:{
        path:'/serviceType/deleteSuccess'
    },
    serviceType_deleteFail:{
        path:'/serviceType/deleteFail'
    },
    /**
     * serviceResult
     */
    serviceResult_listPost:{
        path:magic.URL_RESULT_LIST,
        method:'POST'
    },
    serviceResult_deletePost:{
        path:magic.URL_RESULT_DELETE,
        method:'POST'
    },
    serviceResult_updatePost:{
        path:magic.URL_RESULT_UPDATE,
        method:'POST'
    },
    serviceResult_addPost:{
        path:magic.URL_RESULT_ADD,
        method:'POST'
    },
    /**
     * register
     */
    student_userRegister:{
        path:magic.URL_REGISTER,
        method:'POST'
    },
    /**
     * vendor
     */
    vendor_registerIndex:{
        path:'/vendorRegister'
    },
    vendor_register:{
        path:magic.URL_VENDOR_REGISTER
    },
    /**
     *
     * @api {post} /vendorRegister/main vendorRegister
     * @apiGroup vendor
     * @apiVersion 1.0.0
     * @apiDescription 企业注册
     *
     * @apiParam {string}  userName 企业管理员帐号
     * @apiParam {string}  userPassword 企业管理员密码
     * @apiParam {string}  name 企业名称
     * @apiParam {number}  st 服务类型id
     * @apiParam {string}  mobile 企业联系手机
     * @apiParam {string}  phone 企业联系座机
     * @apiParam {string}  remark 企业描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     * @apiSuccess {string} data 返回信息
     *
     * @apiSuccessExample {json} 添加成功
     * {
     *  code:0,
     *  msg:'success',
     *  data:data
     * }
     *
     * */
    vendor_registerPost:{
        path:magic.URL_VENDOR_REGISTER,
        method:"POST"
    },
    vendor_registerSuccess:{
        path:'/vendorRegister/success'
    },
    vendor_index:{
        path:magic.URL_VENDOR_INDEX
    },
    vendor_home     :{
        path:magic.URL_VENDOR_HOME
    },
    vendor_setting:{
        path:magic.URL_VENDOR_SETTING
    },
    /**
     *
     * @api {post} /vendor/setting getVendorInfo
     * @apiGroup vendor
     * @apiVersion 1.0.0
     * @apiDescription 获取公司信息
     *
     * @apiSuccess {number} code 处理结果1为成功
     * @apiSuccess {string} msg  处理消息
     * @apiSuccess {string} data  公司数据
     *
     * @apiSuccessExample {json} 获取成功
     * {
     *  code:0,
     *  msg = 'success',
     *  data = data;
     * }
     *
     * @apiSuccessExample {json} 获取失败
     * {
     *  code:0,
     *  msg:'no record!'
     * }
     * */
    vendor_settingPost:{
        path:magic.URL_VENDOR_SETTING,
        method:"POST"
    },
    /**
     *
     * @api {post} /vendor/update/:id vendorUpdate
     * @apiGroup vendor
     * @apiVersion 1.0.0
     * @apiDescription 公司信息更新
     *
     * @apiParam {string}  name 企业名称
     * @apiParam {string}  logo 企业logo图片地址
     * @apiParam {string}  mobile 企业联系手机
     * @apiParam {string}  phone 企业联系座机
     * @apiParam {string}  address 企业地址
     * @apiParam {string}  remark 企业描述
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 更新成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 更新失败
     * {
     *  code:-1,
     *  msg:'更新失败'
     * }
     * */
    vendor_update:{
        path:magic.URL_VENDOR_UPDATE,
        method:"POST"
    },
    vendor_serviceManage:{
        path:magic.URL_VENDOR_SERVICEMANAGE
    },
    vendor_serviceAdd:{
        path:magic.URL_VENDOR_SERVICEADD
    },
    /**
     *
     * @api {post} /vendor/serviceAdd serviceDataAdd
     * @apiGroup serviceData
     * @apiVersion 1.0.0
     * @apiDescription 发布服务
     *
     * @apiParam {string}  name 服务主题
     * @apiParam {string}  description 服务描述
     * @apiParam {string}  content 服务内容
     * @apiParam {string}  image 缩略图
     * @apiParam {string}  msgAttrs 附加信息,形如:{"attrs":{name:...},...,limits:100}
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 发布成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 发布失败
     * {
     *  code:-1,
     *  msg:'更新失败'
     * }
     * */
    vendor_serviceAddPost:{
        path:magic.URL_VENDOR_SERVICEADD,
        method:"POST"
    },
    vendor_actions:{
        path:magic.URL_VENDOR_ACTIONS
    },
    vendor_serviceData:{
        path:magic.URL_VENDOR_SERVICEDATA
    },
    vendor_serviceDataUpdate:{
        path:magic.URL_VENDOR_SERVICEDATA_UPDATE
    },
    /**
     *
     * @api {post} /vendor/serviceData/:id getServiceData
     * @apiGroup serviceData
     * @apiVersion 1.0.0
     * @apiDescription 获取已发布服务
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 获取成功
     * {
     *  code:0,
     *  msg = 'success',
     *  data = data;
     * }
     *
     * @apiSuccessExample {json} 获取失败
     * {
     *  code:0,
     *  msg:'no record!'
     * }
     * */
    vendor_serviceDataUpdatePost:{
        path:magic.URL_VENDOR_SERVICEDATA_UPDATE,
        method:"POST"
    },
    /**
     *
     * @api {post} /vendor/service/update/:id serviceDataUpdate
     * @apiGroup serviceData
     * @apiVersion 1.0.0
     * @apiDescription 更新已发布服务
     *
     * @apiParam {string}  name 服务主题
     * @apiParam {string}  description 服务描述
     * @apiParam {string}  content 服务内容
     * @apiParam {string}  image 缩略图
     * @apiParam {string}  msgAttrs 附加信息,形如:{"attrs":{name:...},...,limits:100}
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 更新成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 更新失败
     * {
     *  code:-1,
     *  msg:'更新失败'
     * }
     * */
    vendor_serviceUpdatePost:{
        path:magic.URL_VENDOR_SERVICE_UPDATE,
        method:"POST"
    },
    vendor_serviceAddSuccess:{
        path:magic.URL_VENDOR_SERVICEADD_SUCCESS
    },
    vendor_serviceAddFail:{
        path:magic.URL_VENDOR_SERVICEADD_FAIL
    },
    vendor_serviceUpdateSuccess:{
        path:magic.URL_VENDOR_SERVICEUPDATE_SUCCESS
    },
    vendor_serviceUpdateFail:{
        path:magic.URL_VENDOR_SERVICEUPDATE_FAIL
    },
    vendor_serviceDeleteSuccess:{
        path:magic.URL_VENDOR_SERVICEDELETE_SUCCESS
    },
    vendor_serviceDeleteFail:{
        path:magic.URL_VENDOR_SERVICEDELETE_FAIL
    },
    vendor_serviceView:{
        path:magic.URL_VENDOR_SERVICEVIEW
    },
    /**
     *
     * @api {post} /vendor/serviceDelete/:id serviceDataDelete
     * @apiGroup serviceData
     * @apiVersion 1.0.0
     * @apiDescription 已发布服务删除
     *
     * @apiSuccess {number} code 处理结果0为成功
     * @apiSuccess {string} msg  处理消息
     *
     * @apiSuccessExample {json} 删除成功
     * {
     *  code:0
     * }
     *
     * @apiSuccessExample {json} 删除失败
     * {
     *  code:1,
     *  msg:'不存在'
     * }
     * */
    vendor_serviceDelete: {
        path: magic.URL_VENDOR_SERVICEDELETE,
        method: "POST"
    },
    /**
     * student
     */
    student_index:{
        path:magic.URL_STUDENT_INDEX
    },
    student_home:{
        path:magic.URL_STUDENT_HOME
    },
    student_register:{
        path:magic.URL_STUDENT_REGISTER
    },
    student_signedList:{
        path:magic.URL_STUDENT_SIGNED
    },
    student_normalAdd:{
        path:magic.URL_STUDENT_NORMAL_ADD
    },
    student_registerAdd:{
        path:magic.URL_STUDENT_REGISTER_ADD
    },
    student_manage:{
        path:magic.URL_STUDENT_MANAGE
    },
    student_manageVendor:{
        path:magic.URL_STUDENT_MANAGE_VENDOR
    },
    student_addList:{
       path:magic.URL_STUDENT_ADD_LIST
    },
    student_info:{
        path:magic.URL_STUDENT_INFO
    },

    /**
     * 报名帖
     */
/*    register_list:{
        path:magic.URL_REGISTER_LIST,
        method:'POST'
    },*/
    register_register:{
        path:magic.URL_REGISTER_DETAIL,
        method:'POST'
    },
/*    register_sign:{
        path:magic.URL_REGISTER_SIGN,
        method:'POST'
    },
    register_unSign:{
        path:magic.URL_REGISTER_UN_SIGN,
        method:'POST'
    },*/
/*    register_signStatus:{
        path:magic.URL_REGISTER_STATUS,
        method:'POST'
    },*/
/*    register_signedList:{
        path:magic.URL_REGISTER_SIGNED,
        method:'POST'
    },*/
    /**
     * loader
     */
    loader_index:{
        path:magic.URL_LOADER_INDEX
    },
    loader_addIndex:{
        path:magic.URL_LOADER_ADD_INDEX
    },
    loader_adminIndex:{
        path:magic.URL_LOADER_ADMIN
    },
    loader_manageIndex:{
        path:magic.URL_LOADER_MANAGE_INDEX
    },
    /**
     *
     * @api {post} /loader Loader
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 根据serviceDateId加载服务
     *
     * @apiParam  {number} id serviceDateId
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array}  loader  当前服务状态
     * @apiSuccess (loader) {string} action  当前sd状态处于的action
     * @apiSuccess (loader) {number} length  serviceType的actions的长度
     * @apiSuccess (loader) {status} status  serviceData的状态
     * @apiSuccessExample success
     * {
     *  code:0,
     *  loader:{
     *          action:'Register',
     *          length:2,
     *          status:0
     *        }
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * */
    loader_loader:{
        path:magic.URL_LOADER,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/submit submitData
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 提交指定sd服务action的操作数据
     *
     * @apiParam  {number} sd      serviceDateId
     * @apiParam  {string} action  当前action
     * @apiParam  {object} data    action操作所需数据
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_submitData:{
        path:magic.URL_LOADER_SUBMIT,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/cancel cancelData
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 取消对应服务
     *
     * @apiParam  {number} sd      serviceDateId
     * @apiParam  {string} action  当前action
     * @apiParam  {object} data    action操作所需数据
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_cancelData:{
        path:magic.URL_LOADER_CANCEL,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/list findDataList
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 获取指定服务列表
     *
     * @apiParam  {number} st      serviceTypeId
     * @apiParam  {string} start   页码
     * @apiParam  {number} [vid]   限定企业同时限定uid
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccess {array} list 服务列表
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_findDataList:{
        path:magic.URL_LOADER_LIST,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/list/complete findCompleteDataList
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 获取本用户参加的服务
     *
     * @apiParam  {string} start   页码
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccess {array} list 服务列表
     * @apiSuccessExample success
     * {
     *  code:0,
     *  list:[]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_findCompleteDataList:{
        path:magic.URL_LOADER_LIST_COMPLETE,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/add LoaderAdd
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 根据vid获取指定企业的服务的actions
     *
     * @apiParam  {number} vid 企业id
     *
     * @apiSuccess {number} code 0获取成功 -1获取失败
     * @apiSuccess {array}  actions
     * @apiSuccessExample success
     * {
     *  code:0,
     *  actions:[]
     * }
     * @apiSuccessExample error
     * {
     *  code:-1,
     *  msg:msg
     * }
     * */
    loader_loaderAdd:{
        path:magic.URL_LOADER_ADD,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/add/submit addSubmitData
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 提交添加服务信息
     *
     * @apiParam  {object} data    服务添加所需信息
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_addSubmitData:{
        path:magic.URL_LOADER_ADD_SUBMIT,
        method:'POST'
    },
    /**
     *
     * @api {post} /loader/manage manageList
     * @apiGroup Loader
     * @apiVersion 1.0.0
     * @apiDescription 获取user相关有授权操作的企业列表
     *
     *
     * @apiSuccess {number} code 0成功 -1失败
     * @apiSuccess {array} list
     * @apiSuccessExample success
     * {
     *  code:0
     * }
     * @apiSuccessExample error
     * {
     *  code:-1
     * }
     * */
    loader_manageList:{
        path:magic.URL_LOADER_MANAGE,
        method:'POST'
    },
    common_sregister:{
        path:'/sreg'
    }
};