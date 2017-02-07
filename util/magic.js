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
     * list单页获取条数
     */
    SIGNAL_PAGE:4,

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
    URL_ACTION_DELETE_SUCCESS:'/serviceAction/deleteSuccess',
    URL_ACTION_DELETE_FAIL:'/serviceAction/deleteFail',
    URL_ACTION_ADD_SUCCESS:'/serviceAction/addSuccess',
    URL_ACTION_ADD_FAIL:'/serviceAction/addFail',
    URL_ACTION_VIEW:'/serviceAction/list/:name',

    URL_TYPE_VIEW:'/serviceType/list/:id',
    URL_TYPE_LIST:'/serviceType/list',
    URL_TYPE_ADD:'/serviceType/add',
    URL_TYPE_DELETE:'/serviceType/delete/:id',
    URL_TYPE_UPDATE:'/serviceType/update/:id',
    URL_TYPE_ADD_SUCCESS:'/serviceType/addSuccess',
    URL_TYPE_ADD_FAIL:'/serviceType/addFail',
    URL_TYPE_DELETE_SUCCESS:'/serviceType/deleteSuccess',
    URL_TYPE_DELETE_FAIL:'/serviceType/deleteFail',
    URL_TYPE_UPDATE_SUCCESS:'/serviceType/updateSuccess',
    URL_TYPE_UPDATE_FAIL:'/serviceType/updateFail',

    URL_RESULT_ADD:'/serviceResult/add',
    URL_RESULT_LIST:'/serviceResult/list/:uid',
    URL_RESULT_DELETE:'/serviceResult/delete/:id',
    URL_RESULT_UPDATE:'/serviceResult/:id',

    URL_VENDOR_REGISTER:'/vendorRegister/main',
    URL_VENDOR_INDEX:'/vendor',
    URL_VENDOR_HOME:'/vendor/home',
    URL_REGISTER:'/student/register',

    URL_VENDOR_SETTING:'/vendor/setting',
    URL_VENDOR_UPDATE:'/vendor/update/:id',
    URL_VENDOR_SERVICEMANAGE:'/vendor/serviceManage',
    URL_VENDOR_SERVICEADD:'/vendor/serviceAdd',
    URL_VENDOR_ACTIONS:'/vendor/:id/actions',
    URL_VENDOR_SERVICEDATA:'/vendor/serviceData',
    URL_VENDOR_SERVICEDATA_UPDATE:'/vendor/serviceData/:id',
    URL_VENDOR_SERVICE_UPDATE:'/vendor/service/update/:id',
    URL_VENDOR_SERVICEADD_SUCCESS:'/vendor/serviceAddSuccess',
    URL_VENDOR_SERVICEADD_FAIL:'/vendor/serviceAddFail',
    URL_VENDOR_SERVICEUPDATE_SUCCESS:'/vendor/serviceUpdateSuccess',
    URL_VENDOR_SERVICEUPDATE_FAIL:'/vendor/serviceUpdateFail',
    URL_VENDOR_SERVICEDELETE_SUCCESS:'/vendor/serviceDeleteSuccess',
    URL_VENDOR_SERVICEDELETE_FAIL:'/vendor/serviceDeleteFail',
    URL_VENDOR_SERVICEVIEW:'/vendor/serviceView/:id',
    URL_VENDOR_SERVICEDELETE:'/vendor/serviceDelete/:id',


    URL_STUDENT_INDEX:'/student',
    URL_STUDENT_HOME:'/student/home',
    URL_STUDENT_REGISTER:'/student/vendorRegister',
    URL_STUDENT_SIGNED:'/student/signed',
    URL_STUDENT_NORMAL_ADD:'/student/normalAdd',
    URL_STUDENT_REGISTER_ADD: '/student/registerAdd',
    URL_STUDENT_MANAGE:'/student/manage',
    URL_STUDENT_MANAGE_VENDOR:'/student/manageVendor',
    URL_STUDENT_ADD_LIST:'/student/addList',

    /*URL_REGISTER_LIST:'/vendorRegister/list',*/
    URL_REGISTER_DETAIL:'/actionRegister/list/:id',
/*    URL_REGISTER_SIGN:'/vendorRegister/sign',
    URL_REGISTER_UN_SIGN:'/vendorRegister/unSign',
    URL_REGISTER_STATUS:'/vendorRegister/status',
    URL_REGISTER_SIGNED:'/vendorRegister/signed',*/

    URL_LOADER_INDEX:'/loader',
    URL_LOADER_ADD_INDEX:'/loader/addIndex',
    URL_LOADER:'/loader',
    URL_LOADER_SUBMIT:'/loader/submit',
    URL_LOADER_CANCEL:'/loader/cancel',
    URL_LOADER_LIST:'/loader/list',
    URL_LOADER_LIST_COMPLETE:'/loader/list/complete',
    URL_LOADER_ADD:'/loader/add',
    URL_LOADER_ADD_SUBMIT:'/loader/add/submit',
    URL_LOADER_MANAGE:'/loader/manage',



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
    NG_TYPE_ADD_SUCCESS:'/serviceType/addSuccess',
    NG_TYPE_ADD_FAIL:'/serviceType/addFail',
    NG_TYPE_VIEW:'/serviceType/list/:id',
    NG_TYPE_DELETE_SUCCESS:'/serviceType/deleteSuccess',
    NG_TYPE_DELETE_FAIL:'/serviceType/deleteFail',
    NG_TYPE_UPDATE:'/serviceType/update/:id',
    NG_TYPE_UPDATE_SUCCESS:'/serviceType/updateSuccess',
    NG_TYPE_UPDATE_FAIL:'/serviceType/updateFail',

    NG_VENDOR_HOME:'/',

    NG_VENDOR_SETTING:'/vendor/setting',
    NG_VENDOR_SERVICEMANAGE:'/vendor/serviceManage',
    NG_VENDOR_SERVICEADD:'/vendor/serviceAdd',
    NG_VENDOR_SERVICEUPDATE:'/vendor/serviceData/:id',
    NG_VENDOR_SERVICEADD_SUCCESS:'/vendor/serviceAddSuccess',
    NG_VENDOR_SERVICEADD_FAIL:'/vendor/serviceAddFail',
    NG_VENDOR_SERVICEUPDATE_SUCCESS:'/vendor/serviceUpdateSuccess',
    NG_VENDOR_SERVICEUPDATE_FAIL:'/vendor/serviceUpdateFail',
    NG_VENDOR_SERVICEDELETE_SUCCESS:'/vendor/serviceDeleteSuccess',
    NG_VENDOR_SERVICEDELETE_FAIL:'/vendor/serviceDeleteFail',
    NG_VENDOR_SERVICEVIEW:'/vendor/serviceView/:id',


    NG_STUDENT_HOME:'/',
    NG_STUDENT_SIGNED:'/signed',
    NG_STUDENT_LOADER:'/loader/:id',
    NG_STUDENT_LOADER_COMPLETE:'/signed/:id',
    NG_STUDENT_LOADER_ADD:'/loader/add/:vid',
    NG_STUDENT_MANAGE:'/manage',
    NG_STUDENT_MANAGE_VENDOR:'/manage/:vid',
    NG_STUDENT_ADD_LIST:'/manage/list/:vid',

    /**
     * component url;
     */
    COMPONENT_DROP_MENU:'/component/dropMenu',
    COMPONENT_UPLOADER:'/component/uploader'
};