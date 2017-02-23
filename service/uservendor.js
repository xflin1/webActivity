var Promise = require('bluebird');
var base = require('./base.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'uservendor';
var TABLE_FIELDS = ['vid','uid','role']; //表字段
var magic = require('../util/magic.js');

module.exports = {
    /**
     * 添加记录
     * @param {object} values
     * @returns {bluebird}
     */
    insert:function(values){
        return base.insertBase(TABLE,values);
    },
    /**
     * 根据id删除记录
     * @param {string} id
     * @returns {bluebird}
     */
    deleteById:function(id){
        return base.deleteBaseMulti(TABLE,{id:id});
    },
    /**
     * 根据vid,uid删除记录,uid可省略
     * @param {string} vid
     * @param {string} [uid]
     * @returns {bluebird}
     */
    delete:function(vid,uid){
        var condition ={vid:vid};
        if(uid){
            condition['uid'] = uid;
        }
        return base.deleteBaseMulti(TABLE,condition);
    },
    /**
     * 根据id更新记录
     * @param {string} id
     * @param {object} values
     * @returns {bluebird}
     */
    updateById:function(id, values){
        return base.updateBaseMulti(TABLE,values,{id:id});
    },
    /**
     * 更新记录
     * @param {object} condition    记录条件
     * @param {object} values       更改值
     * @returns {bluebird}
     */
    update:function(condition, values){
        return base.updateBaseMulti(TABLE,values,condition);
    },
    /**
     * 根据id获取记录
     * @param {number} id
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getById:function(id, fields){
        return base.getBaseMulti(TABLE,{id:id},fields);
    },
    /**
     * 根据vid获取记录
     * @param {number} vid
     * @param {Array} [fields]      需要获的取字段
     * @returns {bluebird}
     */
    getByVid:function(vid, fields){
        return base.getBaseMulti(TABLE,{vid:vid},fields);
    },
    /**
     * 根据uid获取记录
     * @param {number} uid          用户id
     * @param {Array} [fields]      需要获的取字段
     * @returns {bluebird}
     */
    getByUid:function(uid, fields){
        return base.getBaseMulti(TABLE,{uid:uid},fields);
    },
    getAdmin:function(uid, fields){
        return base.getBaseMulti(TABLE,{uid:uid,role:magic.ROLE_ADMIN},fields);
    },
    /**
     *
     * @param {number}  uid
     * @param {Array}   [fields]
     * @returns {bluebird}
     */
    getVendorByUid:function(uid, fields){
        var query = sqlCmd.getVendorByUid;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [uid];

        }else{
            format = [fields,uid];
        }
        return base.baseQuery(query,format);
    },
    /**
     *
     * @param {number}  gid
     * @param {Array}   [fields]
     * @returns {bluebird}
     */
    getUserByVid:function(gid, fields){
        var query = sqlCmd.getUserByVid;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [gid];

        }else{
            format = [fields,gid];
        }
        return base.baseQuery(query,format);
    },
    /**
     * 判断是否有该vid的控制权限
     * @param uid
     * @param vid
     * @param [role]
     * @param [fields]
     * @returns {*|bluebird}
     */
    getByUidVid:function(uid,vid,role,fields){
        var condition = {
            uid:uid,
            vid:vid
        };
        if(role!==undefined){
            condition['role']=role;
        }
        return base.getBaseMulti(TABLE,condition,fields);
    },
    /**
     * 获取普通用户可控制的关联企业列表
     * @param uid
     * @param [fields]
     * @returns {*|bluebird}
     */
    getManageByUid:function (uid,fields) {
        var query = sqlCmd.getMangeByUid;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [uid];

        }else{
            format = [fields,uid];
        }
        return base.baseQuery(query,format);
    },
    /**
     * 根据uid和vid获取role
     * @param uid
     * @param vid
     * @returns {*|bluebird}
     */
    getRole:function(uid,vid){
        return base.getBaseMulti(TABLE,{uid:uid,vid:vid},['role']);
    },
    /**
     * 根据uid获取vid:1,2,3形式的所有vid
     * @param uid
     * @returns {*|bluebird}
     */
    getUserVendor:function(uid){
        var query = sqlCmd.getUserVendor;
        return base.baseQuery(query,uid)
    },
    /**
     *
     */
    getVendorList:function(uid,fields){
        var query = sqlCmd.getVendorList;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [uid];

        }else{
            format = [fields,uid];
        }
        return base.baseQuery(query,format);
    }
};


