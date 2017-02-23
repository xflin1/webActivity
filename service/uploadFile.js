var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
const TABLE = 'uploadFile';
var TABLE_FIELDS = ['fid','[ath','type','name',
        'fsize','fspace','uid','hits','ts']; //表字段


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
     * 根据fid删除记录
     * @param {string} fid
     * @returns {bluebird}
     */
    deleteByFid:function(fid){
        return base.deleteBaseMulti(TABLE,{fid:fid});
    },
    /**
     * 根据fid,uid删除记录
     * @param fid
     * @param uid
     * @returns {*|bluebird}
     */
    deleteByFidUid:function(fid,uid){
        return base.deleteBaseMulti(TABLE,{fid:fid,uid:uid});
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
     * 根据fid更新记录
     * @param {string} fid
     * @param {object} values
     * @returns {bluebird}
     */
    updateByfid:function(fid, values){
        return base.updateBaseMulti(TABLE,values,{fid:fid});
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
     * 根据fid获取记录
     * @param {string} fid
     * @param {Array} [fields]      需要获的取字段
     * @returns {bluebird}
     */
    getByFid:function(fid, fields){
        return base.getBaseMulti(TABLE,{fid:fid},fields);
    }
};
