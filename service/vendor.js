var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'vendor';
var TABLE_FIELDS = ['name','st','vc','logo','mobile','phone','address','remark','uid','ts']; //表字段


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
    },
    /**
     * 根据父id获取记录
     * @param pid
     * @param fields
     * @returns {*|bluebird}
     */
    getByPid:function(pid,fields){
        return base.getBaseMulti(TABLE,{parentId:pid},fields);
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
     * 根据uid获取记录
     * @param {int} uid
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getByUid:function(uid, fields){
        return base.getBaseMulti(TABLE,{uid:uid},fields);
    },
    /**
     * 获取子集
     * @param vid
     * @param fields
     * @returns {*|bluebird}
     */
    getChildren:function(vid, fields){
        var query = sqlCmd.getVendorChildren;
        return base.baseQuery(query,[fields,vid]);
    },
    /**
     * 根据vid获取其所有父集
     * @param {string} vidG vid集合如1,2,3
     * @returns {*|bluebird}
     */
    getFather:function(vidG){
        var query = sqlCmd.getVendorFather;
        return base.baseQuery(query,[vidG]);
    }
};
