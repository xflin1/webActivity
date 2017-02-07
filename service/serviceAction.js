var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
const TABLE = 'serviceAction';
var TABLE_FIELDS = ['name','actions','remark','uid','ts']; //表字段


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
     * 根据name删除记录
     * @param {string} name
     * @returns {bluebird}
     */
    deleteByName:function(name){
        return base.deleteBaseMulti(TABLE,{name:name});
    },
    /**
     * 根据name更新记录
     * @param {string} name
     * @param {object} values
     * @returns {bluebird}
     */
    updateByName:function(name, values){
        return base.updateBaseMulti(TABLE,values,{name:name});
    },
    /**
     * 根据name获取记录
     * @param {string} name
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getByName:function(name, fields){
        return base.getBaseMulti(TABLE,{name:name},fields);
    },
    /**
     * 获取所有记录
     * @param [fields]
     * @returns {*|bluebird}
     */
    getAll:function(fields){
        return base.getBaseMulti(TABLE,{},fields);
    }
};
