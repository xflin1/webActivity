/**
 * 魔术字符串
 * @type {{MSG_PRIVATE: number, MSG_PUBLIC: number, TYPE_ROUTE: number, TYPE_SYS: number, TYPE_TEXT: number, TYPE_FILE: number}}
 */
module.exports={
    /**
     * _group:
     *  MSG_PRIVATE 私人消息
     *  MSG_PUBLIC  群消息
     */
    MSG_PRIVATE:0,
    MSG_PUBLIC:1,
    /**
     * _packType:
     *  TYPE_ROUTE  系统
     *  TYPE_TEXT   文本
     *  TYPE_FILE   文件
     */
    TYPE_ROUTE:0,
    TYPE_SYS:2,
    TYPE_TEXT:1,
    TYPE_FILE:3,
    /**
     * _payload.job
     */
    JOB_CONNECT:'connect',
    JOB_DISCONNECT:'disconnect',
    JOB_OFFLINE:'offline',
    JOB_CHAT:'chat',
    /**
     * job:chat
     *  chatType
     */
    CHAT_NORMAL:0,

    /**
     * url
     */
    URL_GROUP:'/group',
    URL_GROUP_BY_GID:'/group/detail',
    URL_GROUP_JOIN:'',
    URL_GROUP_QUIT:'',
    URL_GROUP_REJECT:'',
    URL_USER:'/user',
    URL_USER_SELF:'/user',
    URL_USER_BY_ID:'',
    URL_ACTION_LIST:'/serviceAction/list',
    URL_ACTION_ADD:'/serviceAction/add',
    URL_ACTION_UPDATE:'/serviceAction/update/:name',
    URL_ACTION_UPDATE_SUCCESS:'/serviceAction/updateSuccess',
    URL_ACTION_UPDATE_FAIL:'/serviceAction/updateFail',
    URL_ACTION_DELETE:'/serviceAction/delete/:name',
    URL_ACTION_ADD_SUCCESS:'/serviceAction/addSuccess',
    URL_ACTION_ADD_FAIL:'/serviceAction/addFail',
    URL_TYPE_LIST:'/serviceType/list',
    URL_TYPE_ADD:'/serviceType/add',
    URL_TYPE_ADD_SUCCESS:'/serviceType/addSuccess',
    URL_TYPE_ADD_FAIL:'/serviceType/addFail',


    /**
     * 前端路由地址
     */
    NG_ACTION_ADD:'/serviceAction/add',
    NG_ACTION_ADD_SUCCESS:'/serviceAction/addSuccess',
    NG_ACTION_ADD_FAIL:'/serviceAction/addFail',
    NG_ACTION_LIST:'/serviceAction/list',
    NG_ACTION_VIEW:'/serviceAction/list/:name',
    NG_ACTION_UPDATE:'/serviceAction/update/:name',
    NG_ACTION_UPDATE_SUCCESS:'/serviceAction/updateSuccess',
    NG_ACTION_UPDATE_FAIL:'/serviceAction/updateFail',
    NG_ACTION_DELETE_SUCCESS:'/serviceAction/deleteSuccess',
    NG_ACTION_DELETE_FAIL:'/serviceAction/deleteFail',
    NG_TYPE_LIST:'/serviceType/list',
    NG_TYPE_ADD:'/serviceType/add',
    NG_TYPE_ADD_FAIL:'/serviceType/addFail',
    NG_TYPE_ADD_SUCCESS:'/serviceType/addSuccess'


};