var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var base = require('./base.js');
var utils = require('../util/utils.js');
var sqlCmd = require('./sqlCmd.json');
const TABLE = 'serviceData';
var TABLE_FIELDS = ['vid','st','name','description','content','image','msgAttrs','uid','ts']; //表字段


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
     * 根据id更新记录
     * @param {string} id
     * @param {object} values
     * @returns {bluebird}
     */
    updateById:function(id, values){
        utils.valuesFilter(values,TABLE_FIELDS);
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
     * 根据vid获取记录
     * @param {string} vid
     * @param {Array} [fields]      需要获取的字段
     * @returns {bluebird}
     */
    getByVid:function(vid, fields) {
        return base.getBaseMulti(TABLE, {vid: vid}, fields);
    },
    /**
     *
     * @param condition
     * @param limit
     * @param start
     * @param fields
     * @param order
     * @param asc
     * @returns {*|bluebird}
     */
    find:function(condition,limit,start,fields,order,asc){
        return base.findBaseMulti(TABLE,condition,limit,start,fields,order,asc);
    },
    /**
     *
     * @param uid
     * @param limit
     * @param start
     * @param [fields]
     * @returns {*|bluebird}
     */
    findSigned:function(uid,limit,start,fields){
        var query = null;
        var format=null;
        if(fields==undefined){
            query = sqlCmd.findAllSignedByUid;
            format = [uid,start,limit];
        }else{
            query = sqlCmd.findSignedByUid;
            format = [fields,uid,start,limit];
        }
        return base.baseQuery(query,format);
    },
    findComplete:function(uid,limit,start,fields){
        var query = null;
        var format=null;
        if(fields==undefined){
            query = sqlCmd.findAllSignedByUid;
            format = [uid,start,limit];
        }else{
            query = sqlCmd.findSignedByUid;
            format = [fields,uid,start,limit];
        }
        return base.baseQuery(query,format);
    },
    /**
     * 根据vid集合获取数据列表
     * @param {string} vidG vid的集合
     * @param limit
     * @param start
     * @param fields
     * @param order
     * @param asc
     * @param [st]
     * @returns {*|bluebird}
     */
    findData:function(vidG,limit,start,fields,order,asc,st){
        var query ;
        var format;
        if(st===undefined){
            query = sqlCmd.getDataTarget;
            format = [fields,vidG];
        }else{
            query = sqlCmd.getDataTargetBySt;
            format = [fields,st,vidG];
        }
        if(order!=undefined){
            query = query + ' ORDER BY `'+ order;
            if(asc){
                query=query+ '` ASC';
            }else{
                query = query + '` DESC';
            }
        }
        query = query + ' LIMIT ' + start + ',' + limit;
        return base.baseQuery(query,format);
    },
    /**
     * 获取可见范围内指定的sd的详情
     * @param vidG 可见范围vid集合
     * @param sd
     * @param fields
     * @returns {*|bluebird}
     */
    getDataBySd:function(vidG,sd,fields){
        var query  = sqlCmd.getDataBySd;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [vidG,sd];

        }else{
            format = [fields,vidG,sd];
        }
        return base.baseQuery(query,format);
    },
    /**
     * 根据在serviceResult中status获取匹配的记录
     * @param uid
     * @param status
     * @param st
     * @param limit
     * @param start
     * @param fields
     * @param order
     * @param asc
     * @returns {*|bluebird}
     */
    findDataByStatusSt:function(uid,status,st,limit,start,fields,order,asc){
        var query = sqlCmd.findDataByStatusSt;
        if(order!=undefined){
            query = query + ' ORDER BY `'+ order;
            if(asc){
                query=query+ '` ASC';
            }else{
                query = query + '` DESC';
            }
        }
        query = query + ' LIMIT ' + start + ',' + limit;
        return base.baseQuery(query,[fields,uid,status,st]);
    },
    getAdminData:function(sd,uid,fields){
        var query = sqlCmd.getAdminData;
        var format;
        if(fields===undefined){
            query = query.replace('??','*');
            format = [sd,uid];

        }else{
            format = [fields,sd,uid];
        }
        return base.baseQuery(query,format);
    }
};
