/**
 * Created by jyl on 16-9-26.
 */
var path=require('path');
var log4js=require('log4js');
var config = require('../config/config.js');
log4js.configure(config.log);

/**
 * 多进程的日志配置
 * @param mode
 */
exports.configure = function(realpath){
    //if(mode == 'master'){
    //    log4js.configure(path.join(__dirname, "./log4js-master.json"));
    //}else{
    //    //多进程的配置项
    //    log4js.configure(path.join(__dirname, "./log4js-worker.json"));
        //单进程的配置项
     //   log4js.configure(path.join(__dirname, "../config/log4js.json"));
    //
}
/**
 * 暴露到应用的日志接口，调用该方法前必须确保configure过
 * @param name 制定log4js配置文件的category，依次找到对应的appender。
 *              如果没有category，则使用默认的category，可以有多个
 *
 * @returns {Logger}
 */
exports.logger = function(name){
    var dateFileLog = log4js.getLogger(name);
    dateFileLog.setLevel(log4js.levels.INFO);

    return dateFileLog;
}
/**
 * 用于express中间件， 调用该方法前必须确保configure过
 * @returns {Function|*}
 */
exports.useLog = function(){
    return log4js.connectLogger(log4js.getLogger("app"), {level: 'auto', format:':method :url'});
}
