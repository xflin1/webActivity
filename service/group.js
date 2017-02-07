var Promise = require('bluebird');
var base = require('./base.js');
var utils = require('../util/utils.js');
const TABLE = 'group';
var TABLE_FIELDS = ['parentId','name','limits','sequence','depth',
                    'uid','type','tsStart','tsEnd','ts']; //表字段
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
     * 根据id更新记录
     * @param {string} id
     * @param {object} values
     * @returns {bluebird}
     */
    updateById:function(id, values){
        return base.updateBaseMulti(TABLE,values,{id:id});
    },
    /**
     * 根据id获取记录
     * @param {string} id
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getById:function(id, fields){
        return base.getBaseMulti(TABLE,{id:id},fields);
    }
};