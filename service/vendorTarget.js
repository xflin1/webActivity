var Promise = require('bluebird');
var base = require('./base.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'vendorTarget';
var TABLE_FIELDS = ['vid','target']; //表字段


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
     * @param vid
     * @param fields
     * @returns {*|bluebird}
     */
    getByVid:function(vid, fields){
        return base.getBaseMulti(TABLE,{vid:vid},fields);
    }
};

