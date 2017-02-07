var Promise = require('bluebird');
var base = require('./base.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'usergroup';
var TABLE_FIELDS = ['gid','uid','role']; //表字段


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
     * 根据gid,uid删除记录,uid可省略
     * @param {string} gid
     * @param {string} [uid]
     * @returns {bluebird}
     */
    delete:function(gid,uid){
        var condition ={gid:gid};
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
     * 根据gid获取记录
     * @param {number} gid          群id
     * @param {Array} [fields]      需要获的取字段
     * @returns {bluebird}
     */
    getByGid:function(gid, fields){
        return base.getBaseMulti(TABLE,{gid:gid},fields);
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
    /**
     *
     * @param {number}  uid
     * @param {Array}   [fields]
     * @returns {bluebird}
     */
    getGroupByUid:function(uid, fields){
        fields = fields||'*';
        var query = sqlCmd.getGroupByUid;
        return base.baseQuery(query,[fields,uid]);
    },
    /**
     *
     * @param {number}  gid
     * @param {Array}   [fields]
     * @returns {bluebird}
     */
    getUserByGid:function(gid, fields){
        fields = fields||'*';
        var query = sqlCmd.getUserByGid;
        return base.baseQuery(query,[fields,gid]);
    }
};

