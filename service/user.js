var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'user';
var TABLE_FIELDS = ['name','nickname','pass','sex','role', 'groupId',
        'weixin', 'qq','email','phone','photoId','extattrs','last']; //表字段


module.exports = {
    /**
     * 添加记录
     * @param {string} name         用户名
     * @param {string} nickname     昵称
     * @param {string} pass         密码
     * @returns {bluebird}
     */
    insert:function(name,nickname,pass){
        var values = {
            'name':name,
            'nickname':nickname,
            'pass':pass
        };
        return base.insertBase(TABLE,values);
    },
    insertV:function (name,nickname,pass,role) {
        var values = {
            'name':name,
            'nickname':nickname,
            'pass':pass,
            'role':role
        };
        return base.insertBase(TABLE,values);
    },

    insertBase:function(values){
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
     * 根据name删除记录
     * @param {string} name
     * @returns {bluebird}
     */
    deleteByName:function(name){
        return base.deleteBaseMulti(TABLE,{name:name});
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
     * 根据name更新记录
     * @param {string} name
     * @param {object} values
     * @returns {bluebird}
     */
    updateByName:function(name, values){
        return base.updateBaseMulti(TABLE,values,{name:name});
    },
    /**
     * 根据id获取记录
     * @param {int} id
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getById:function(id, fields){
        return base.getBaseMulti(TABLE,{id:id},fields);
    },
    /**
     * 根据name获取记录
     * @param {string} name
     * @param {Array} [fields]      需要获的取字段
     * @returns {bluebird}
     */
    getByName:function(name, fields){
        return base.getBaseMulti(TABLE,{name:name},fields);
    },
    getAll:function(fields){
        return base.getBaseMulti(TABLE,{},fields);
    },
    /**
     * 获取制定vidG内的所有用户
     * @param vidG
     * @param fields
     * @returns {*|bluebird}
     */
    getWeChatTarget:function(vidG,fields){
        var query = sqlCmd.getWeChatTarget;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [vidG];

        }else{
            format = [fields,vidG];
        }
        return base.baseQuery(query,format);
    }
};
