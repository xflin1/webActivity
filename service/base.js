var Promise = require('bluebird');
var getSqlConnection = require('../util/DBConnection.js');
var sqlCmd = require('./sqlCmd.json');
var utils = require('../util/utils.js');

module.exports = {
    /**
     * 查询满足多个(与)条件
     * @param {string} table          查询表名称
     * @param {object} condition      查询条件
     * @param {Array} [fields]        查询字段
     *
     * @returns {bluebird}
     *
     * @example
     * getBaseMulti('user',{id:1,pass,'123'},['nickname',name])
     *
     */
    getBaseMulti:function(table,condition,fields){
        var query = null;
        var format = null;
        if(fields==undefined){
            query = sqlCmd.getAllMulti;
            format = [table];
        }else{
            query = sqlCmd.getMulti;
            format = [fields,table];
        }
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                query = utils.addAndCondition(query,condition,connection);
                return connection.query(query,format)
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    },

    /**
     * 分页查询满足多个(与)条件
     * @param {string}  table          查询表名称
     * @param {object}  condition      查询条件
     * @param {number}  [limit]        单次查询条数
     * @param {number}  [start]        查询起始位置,默认为0
     * @param {Array}   [fields]       查询属性数组
     * @param {string}  [order]        order by 对象
     * @param {boolean} [asc]           是否升序
     *
     * @returns {bluebird}
     *
     * @example
     * findBaseMulti('user',{id:'1',name:'12'},['nickname'])
     *
     */
    findBaseMulti:function(table,condition,limit,start,fields,order,asc){
        limit = limit||10;
        start = start||0;
        var query = null;
        var format = null;
        if(fields==undefined){
            query = sqlCmd.getAllMulti;
            format = [table];
        }else{
            query = sqlCmd.getMulti;
            format = [fields,table];
        }
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                query = utils.addAndCondition(query,condition,connection,order,asc);
                query = query + ' LIMIT ' + start + ',' + limit;
                return connection.query(query,format)
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    },

    /**
     * 更新多(与)条件数据
     * @param {string}  table       更新表名
     * @param {object}  values      更新数据
     * @param {object}  condition   查询条件
     *
     * @returns {bluebird}
     *
     * @example
     * updateBaseMulti('user',{nickname:'test',...},{id:1)
     *
     */
    updateBaseMulti:function(table,values,condition){
        var query = sqlCmd.update;
        utils.exchangeValues(values);
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                query = utils.addAndCondition(query,condition,connection);
                return connection.query(query,[table,values])
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    },
    /**
     * 删除记录
     * @param {string}  table       表名
     * @param {object}  condition   条件
     *
     * @returns {bluebird}
     *
     * @example
     * deleteBaseMulti('user',{id:0});
     *
     */
    deleteBaseMulti:function(table,condition){
        var query = sqlCmd.delete;
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                query = utils.addAndCondition(query,condition,connection);
                return connection.query(query,table)
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    },
    /**
     *
     * 添加新数据
     * @param {string}  table    添加表名称
     * @param {object}  values   赋值
     *
     * @returns {bluebird}
     *
     * @example
     * - insertBase('user',{name:'name',nickname='nickname'})
     *
     */
    insertBase:function(table,values){
        var query = 'INSERT INTO ?? SET ?';
        utils.exchangeValues(values);
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                return connection.query(query,[table,values])
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    },
    /**
     *
     * @param {string} query    查询命令
     * @param {Array} format    需要填写的数据
     * @returns {bluebird}
     */
    baseQuery:function(query,format){
        return new Promise(function(resolve,reject){
            Promise.using(getSqlConnection(),function(connection){
                 return connection.query(query,format)
                    .then(function(rows){
                        resolve(rows);
                    }).catch(function(error){
                        reject(error);
                    });
            });
        });
    }
};
