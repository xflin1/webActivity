/**
 *
 * @apiDefine groupAdmin 群管理员或创群者
 *
 * */

/**
 *
 * @apiDefine res 返回JSON
 *
 * */
/**
 *
 * @apiDefine Group 群处理
 *
 * */

/**
 *
 * @apiDefine Authentication 身份验证
 *
 * */

/**
 *
 * @apiDefine Activity 活动处理
 *
 * */
/**
 *
 * @apiDefine USER 用户处理
 *
 * */

/**
 *
 * @apiDefine Notice 公告处理
 *
 * */
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
 *  code:3,
 *  msg:'wrong password'
 * }
 * */

/**
 *
 * @api {get} /logout LOGOUT
 * @apiGroup Authentication
 * @apiVersion 1.0.0
 * @apiDescription 注销用户
 *
 *
 * */

/**
 *
 * @api {get} /user GetSelfUser
 * @apiGroup USER
 * @apiVersion 1.0.0
 * @apiDescription 获取用户自身信息
 *
 *
 * @apiSuccess (user) {number} id 用户唯一标识
 * @apiSuccess (user) {string} name 用户名(唯一)
 * @apiSuccess (user) {string} nickname 昵称
 * @apiSuccess (user) {number} photoId 头像id
 * @apiSuccess (user) {number} sex 性别:男[0]女[1]
 * @apiSuccess (user) {string} groupId 群id集
 * @apiSuccess (user) {string} qq qq号码
 * @apiSuccess (user) {string} weixin 微信号码
 * @apiSuccess (user) {string} phone 电话号码
 * @apiSuccess (user) {string} email 邮箱
 *
 * @apiSuccessExample {json} 成功
 * {
 *  id:'1',
 *  name:'abc',
 *  nickname:'昵称',
 *  photoId:1,
 *  sex:0,
 *  groupId:'1,2,3',
 *  qq:'123456',
 *  weixin:'123456',
 *  phone:'123456',
 *  email:'123456@...com'
 * }
 *
 *
 * */

/**
 *
 * @api {post} /user/id GetUsers
 * @apiGroup USER
 * @apiVersion 1.0.0
 * @apiDescription 获取对应id的用户信息
 *
 * @apiParam  {array} idArray 用户唯一标识数组
 * @apiParamExample {json}
 * {
 *  idArray:[1,2,3,...]
 * }
 *
 * @apiSuccess {array} users 用户信息*
 * @apiSuccess (user) {number} .id 用户唯一标识
 * @apiSuccess (user) {string} .nickname 昵称
 * @apiSuccess (user) {number} .photoId 头像id
 * @apiSuccess (user) {number} .sex 性别:男[0]女[1]
 * @apiSuccess (user) {string} .groupId 群id集
 * @apiSuccess (user) {string} .qq qq号码
 * @apiSuccess (user) {string} .weixin 微信号码
 * @apiSuccess (user) {string} .phone 电话号码
 * @apiSuccess (user) {string} .email 邮箱
 * @apiSuccessExample {json} 成功
 * {
 *  users:[
 *      {
 *      id:'1',
 *      nickname:'昵称',
 *      photoId:1,
 *      sex:0,
 *      groupId:'1,2,3',
 *      qq:'123456',
 *      weixin:'123456',
 *      phone:'123456',
 *      email:'123456@...com'
 *      },...]
 * }
 *
 *
 *
 * */

/**
 *
 * @api {post} /user/query QueryUsers
 * @apiGroup USER
 * @apiVersion 1.0.0
 * @apiDescription 模糊查询User信息
 *
 * @apiParam {number} limit 返回记录的数量
 * @apiParam {number} offset 返回记录开始的位置
 *
 * @apiParamExample {json}
 * {
 *  limit:10,
 *  offset:20
 * }
 *
 * @apiSuccess {array} users 用户信息
 * @apiSuccess (user) {number} .id 用户唯一标识
 * @apiSuccess (user) {string} .nickname 昵称
 * @apiSuccess (user) {number} .photoId 头像id
 * @apiSuccess (user) {number} .sex 性别:男[0]女[1]
 * @apiSuccessExample {json} 成功
 * {
 *  users:[
 *      {
 *      id:'1',
 *      nickname:'昵称',
 *      photoId:1,
 *      sex:0
 *      },...]
 * }
 *
 *
 *
 * */

/**
 *
 * @api {post} /Group GetGroup
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiDescription 获取所在群的信息,用于初始化前端本地缓存
 *
 *
 *
 * @apiSuccess {array} groups 群信息
 * @apiSuccess {number} id 群唯一标识
 * @apiSuccess {string} name 昵称
 * @apiSuccess {number} type 群类型
 * @apiSuccess {number}  photoId 图标id,
 * @apiSuccess {number} uid 管理员id
 * @apiSuccess {string} msgAttrs 群具体信息(?)
 * @apiSuccess {string} userIds 群内所有人id
 * @apiSuccessExample {json} 成功
 * {
 *  groups:[
 *      {
 *      id:'1',
 *      name:'群名',
 *      type:1,
 *      photoId:1,
 *      uid:1,
 *      msgAttrs:...//具体结构?
 *      },...]
 * }
 *
 *
 *
 * */

/**
 *
 * @api {post} /Group/details GetGroupDetails
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiDescription 根据群id获取群详细信息,可用于数据更新后更新前端缓存信息
 *
 * @apiParam  {number} id 群唯一标识
 *
 *
 * @apiSuccess {number} id 群唯一标识
 * @apiSuccess {string} name 群名
 * @apiSuccess {number} type 群类型
 * @apiSuccess {number} photoId 图标id
 * @apiSuccess {number} uid 管理员id
 * @apiSuccess {string} msgAttrs 群具体信息(?)
 * @apiSuccess {string} userIds 群内所有人id
 * @apiSuccessExample {json} 成功
 * {
 *  groups:[
 *      {
 *      id:'1',
 *      name:'群名',
 *      type:1,
 *      photoId:1,
 *      uid:1,
 *      msgAttrs:...//具体结构?
 *      },...]
 * }
 *
 *
 *
 * */

/**
 *
 *
 * @api {post} /Group/modifyName GroupModifyName
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiPermission groupAdmin
 * @apiDescription 修改群名
 *
 * @apiParam  {number} id 群唯一标识
 * @apiParam  {string} name 群名
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 修改成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 * @apiSuccessExample {json} 修改失败
 * {
 *  code:-1,
 *  msg:'修改失败'
 * }
 *
 * */

/**
 *
 *
 * @api {post} /Group/quit QuitGroup
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiPermission everyone
 * @apiDescription 退出群
 *
 * @apiParam  {number} id 群唯一标识
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */

/**
 *
 *
 * @api {post} /Group/reject GroupReject
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiPermission groupAdmin
 * @apiDescription 将某个用户踢出群
 *
 * @apiParam {number} id 群唯一标识
 * @apiParam {number} uid 被踢出用户唯一标识
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */

/**
 *
 *
 * @api {post} /Group/invite GroupInvite
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiPermission groupAdmin
 * @apiDescription 将某个用户邀请入群
 *
 * @apiParam {number} id 群唯一标识
 * @apiParam {number} uid 邀请进群用户id
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */

/**
 *
 *
 * @api {post} /Group/join GroupJoin
 * @apiGroup Group
 * @apiVersion 1.0.0
 * @apiPermission everyone
 * @apiDescription 加入群,主要用与报名帖的报名选项.
 *
 * @apiParam {number} id 群唯一标识
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */

/**
 *
 *
 * @api {post} /Notice GetNotice
 * @apiGroup Notice
 * @apiVersion 1.0.0
 * @apiPermission groupUser
 * @apiDescription 获取公告
 *
 * @apiParam {number} id 群唯一标识
 *
 * @apiSuccess {array} notice 所有公告对象
 * @apiSuccess {number} id 公告id
 * @apiSuccess {number} gid 活动登记群
 *
 * @apiSuccessExample {json} 成功
 * {
 *  notice:[
 *          {
 *           id:1
 *           gid:2
 *          },...]
 * }
 *
 *
 * */
/**
 *
 *
 * @api {post} /Activity/remove ActivityRemove
 * @apiGroup Activity
 * @apiVersion 1.0.0
 * @apiPermission groupAdmin
 * @apiDescription 加入群,主要用与报名帖的报名选项.
 *
 * @apiParam {number} id 群唯一标识
 * @apiParam {number} noticeId 公告唯一标识
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */

/**
 *
 *
 * @api {post} /Activity/join ActivityJoin
 * @apiGroup Activity
 * @apiVersion 1.0.0
 * @apiPermission groupUser
 * @apiDescription 报名加入活动群,与加入群操作相同.
 *
 * @apiParam {number} id 活动群唯一标识
 *
 * @apiSuccess (res){number} code 处理结果0为成功
 * @apiSuccess (res){string} msg  处理消息
 * @apiSuccessExample {json} 成功
 * {
 *  code:0,
 *  msg:'success'
 * }
 *
 *
 * */









