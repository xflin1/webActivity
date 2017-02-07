var mysql = require('promise-mysql');
var config = require('../config/config.js');
var pool = null;
if(global.hasOwnProperty('sqlConnectionPool')&&
    global['sqlConnectionPool']!=null){
    pool = global['sqlConnectionPool'];
}else{
    pool = mysql.createPool(config.mysql);
    global['sqlConnectionPool'] = pool;
}


var getSqlConnection = function(){
    return pool.getConnection().disposer(function(connection) {
        pool.releaseConnection(connection);
    });
};

module.exports = getSqlConnection;