var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var sqlCmd = require('./sqlCmd.json');
var base = require('./base.js');
const TABLE = 'uOfflineMsg';
var TABLE_FIELDS = ['_group','_packType','_from','_to','_seq',
    '_payload','_ts']; //表字段


module.exports = {
    /**
     * 添加记录
     * @param {object} values
     *
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
     * 根据uid删除所有记录
     * @param uid
     * @returns {*|bluebird}
     */
    deleteByUid:function(uid){
        return base.deleteBaseMulti(TABLE,{_to:uid});
    },
    /**
     * 根据id获取记录
     * @param {string} id
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getById:function(id, fields){
        return base.getBaseMulti(TABLE,{id:id},fields);
    },
    /**
     * 获取大于等于ts的记录
     * @param to
     * @param ts
     * @param [fields]
     * @returns {*|bluebird}
     */
    getByTs:function(to,ts, fields){
        fields = fields||'*';
        var query = sqlCmd.getByTs;
        return base.baseQuery(query,[fields,TABLE,ts,to]);
    }
};

