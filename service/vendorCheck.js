var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
const TABLE = 'vendorCheck';
var TABLE_FIELDS = ['vid','bl','extattrs','uid','result','updatetime','ts']; //表字段


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
     * 根据vid获取记录
     * @param vid
     * @param fields
     * @returns {*|bluebird}
     */
    getByVid:function(vid,fields){
        return base.getBaseMulti(TABLE,{vid:vid},fields);
    },

    updateByVid:function(vid, values){
        return base.updateBaseMulti(TABLE,values,{vid:vid});
    },

};
