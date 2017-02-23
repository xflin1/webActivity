var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
var utils = require('../util/utils.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'serviceResult';
var TABLE_FIELDS = ['sd','uid','error','msgAttrs','ts','status']; //表字段

module.exports = {
    /**
     * 添加记录
     * @param {object} values
     *
     * @returns {bluebird}
     */
    insert:function(values){
        utils.valuesFilter(values,TABLE_FIELDS);
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
     * 根据uid,sd删除记录
     * @param uid
     * @param sd
     * @returns {*|bluebird}
     */
    deleteByUidSd:function(uid,sd){
        return base.deleteBaseMulti(TABLE,{uid:uid,sd:sd});
    },
    /**
     * 根据id更新记录
     * @param {object} condition
     * @param {object} values
     * @returns {bluebird}
     */
    update:function(condition, values){
        utils.valuesFilter(values,TABLE_FIELDS);
        return base.updateBaseMulti(TABLE,values,condition);
    },
    /**
     * 根据uid获取记录
     * @param {string} uid
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getByUid:function(uid, fields){
        return base.getBaseMulti(TABLE,{uid:uid},fields);
    },
    /**
     * 根据uid和sd获取
     * @param uid
     * @param sd
     * @param [fields]
     * @returns {*|bluebird}
     */
    getByUidSd:function(uid,sd,fields){
        return base.getBaseMulti(TABLE,{uid:uid,sd:sd},fields);
    },
    getRegisterUser:function(sd,status,fields){
        var query = sqlCmd.getRegisterUser;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [sd,status];

        }else{
            format = [fields,sd,status];
        }
        return base.baseQuery(query,format);
    }
};
