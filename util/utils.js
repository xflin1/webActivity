var fs  = require('fs');
var path  = require('path');
var log = require('./log.js');
module.exports = {
    createJson:function(array,src,des){
        var length = array.length;
        for(var i=0;i<length;i++){
            if(src.hasOwnProperty(array[i])){
                des[array[i]] = src[array[i]];
            }else{
                des[array[i]] = undefined;
            }
        }
    },
    /**
     * 给语句添加与条件
     * @param {string} cmd          原始命令语句
     * @param {object} condition    所需添加条件对象
     * @param {object} connection   mysql connection对象
     * @param {string} [order]      order by 对象
     * @param {boolean}   [asc]        是否升序
     *
     * @returns {string}            返回处理之后的命令语句
     */

    addAndCondition:function(cmd,condition,connection,order,asc){
        var first = true;
        if(asc==undefined){
            asc = true;
        }
        for(var key in condition){
            if(condition.hasOwnProperty(key)){
                if(first){
                    first = false;
                    cmd = cmd + key
                        + '=' + connection.escape(condition[key]);
                }else{
                    cmd = cmd +'&&'+ key
                        + '=' + connection.escape(condition[key]);
                }
            }
        }
        if(first==true){
            cmd = cmd + '1';
        }
        if(order!=undefined){
            cmd = cmd + ' ORDER BY `'+ order;
            if(asc){
                cmd=cmd+ '` ASC';
            }else{
                cmd = cmd + '` DESC';
            }
        }
        return cmd;
    },
    /**
     * 检测是否登录,且上次超时是否超时
     * @param session
     * @returns {boolean}
     */
    checkSessionDate:function(session){
        var MAXAGE = 600000;//ms
        var now = new Date().getTime();
        if(now > session.timeStamp &&
            now - session.timeStamp < MAXAGE){
            session.timeStamp = now;
            return true;
        }else{
            return false;
        }
    },
    /**
     * 检测webSocket是否登录
     * @param  ws   ws对象
     * @returns {boolean}
     */
    checkWsLogin:function(ws){
        return ws.session.hasOwnProperty('name');
    },
    /**
     * 将values 下的对象转为string类型
     * @param {object} values
     */
    exchangeValues:function(values){
        for(var key in values){
            if(values.hasOwnProperty(key)){
                if(typeof values[key]=='object'){
                    values[key] = JSON.stringify(values[key]);
                }
            }
        }
    },

    /**
     * 对比password
     * @param client    客户端发来的password
     * @param server    服务器的password
     * @returns {boolean}
     */
    checkPassword:function(client,server){
        return client==server;
    },
    /**
     * 错误统一处理
     * @param error
     */
    handleError:function(error){
        log.logger('util').error(error.stack);
    },
    /**
     * 给对象添加时间戳
     * @param data
     */
    addTimeStamp:function(data){
        data['ts'] = Math.ceil((new Date()).getTime()/1000);
    },
    /**
     * insert之后的通用回复处理
     * @param data
     * @param res
     */
    normalInsert:function(data,res){
        if(data['affectedRows']==1){
            res.json({
                code:0
            });
        }else{
            res.json({
                code:-1,
                msg:'failed'
            });
        }
    },
    /**
     * insert之后的返回自增ID处理
     * @param data
     * @param res
     */
    returnIdInsert:function(data,res){
        if(data['affectedRows']==1){
            res.json({
                code:0,
                id:data.insertId
            });
        }else{
            res.json({
                code:-1,
                msg:'failed'
            });
        }
    },
    /**
     * 查询之后通用回复处理
     * @param data  数据
     * @param res
     * @param [keyName]   数据存放对象的key名
     */
    normalGet:function(data,res,keyName){
        var resData = {
            code:0
        };
        if(keyName!=undefined){
            resData[keyName] = data;
        }
        res.json(resData);
    },
    /**
     * 删除之后的通用回复处理
     * @param data
     * @param res
     */
    normalDelete:function(data,res){
        if(data['affectedRows']>=1){
            res.json({
                code:0
            });
        }else{
            res.json({
                code:1,
                msg:'不存在'
            });
        }
    },
    /**
     * 更新之后的通用回复处理
     * @param data
     * @param res
     */
    normalUpdate:function(data,res){
        if(data['affectedRows']==1){
            res.json({
                code:0
            });
        }else{
            res.json({
                code:-1,
                msg:'更新失败'
            });
        }
    },
    /**
     * 查询出错的通用回复处理
     * @param res
     */
    normalError:function(res){
        res.json({
            code:-1,
            msg:'failed'
        });
    },
    /**
     * 删除除fields外values中多余的对象
     * 用于insert和updates数据过滤
     * @param values
     * @param fields
     */
    valuesFilter:function(values,fields){
        for(var key in values){
            if(values.hasOwnProperty(key)){
                if(fields.indexOf(key)==-1){
                    delete values[key];
                }
            }

        }
    },
    /**
     * 将数据库中msgAttrs或extattrs属性转换成对象
     * @param rows
     */
    analyseExtra:function(rows){
        var length = rows.length;
        for(var i=0;i<length;i++){
            if(rows[i]['msgAttrs']!==undefined
                &&rows[i]['msgAttrs']!==""
                &&rows[i]['msgAttrs']!==null){
                rows[i]['msgAttrs'] = JSON.parse(rows[i]['msgAttrs']);
            }
            if(rows[i].hasOwnProperty('extattrs')){
                if(rows[i]['extattrs']!==undefined
                    &&rows[i]['extattrs']!==""
                    &&rows[i]['extattrs']!==null)
                rows[i]['extattrs'] = JSON.parse(rows[i]['extattrs']);
            }
        }
    },
    /**
     * 解析actions为数组
     * @param actions
     * @returns {Array}
     */
    parserActions:function(actions){
        return actions.split('[')[1].split(']')[0].split(',');
    },
    /**
     * 根据路径新建文件夹,中间不存则递归新建
     * @param dirPath
     */
    mkdir: function(dirPath){
        if(!fs.existsSync(dirPath)){
            this.mkdir(path.dirname(dirPath));
            fs.mkdirSync(dirPath);
        }
    },
    /**
     * 合并重复数据,理论应该不会出现重复数据
     * @param data
     * @returns {Array}
     */
    mergeVendor:function(data){
        var dataLength = data.length;
        var tmpObject = {};
        var tmpArray = [];
        var rowsLength;
        var rows;
        var id;
        for(var i =0;i<dataLength;i++){
            rows=data[i];
            rowsLength=rows.length;
            for(var j=0;j<rowsLength;j++){
                id = rows[j]['id'];
                if(!tmpObject.hasOwnProperty(id)){
                    tmpObject[id]=rows[j];
                }
            }
        }

        for(var key in tmpObject){
            if(tmpObject.hasOwnProperty(key)){
                tmpArray.push(tmpObject[key]);
            }
        }

        return tmpArray;
    },
    /**
     * 检测参数是否完整
     * @param req
     * @param res
     * @param params
     * @returns {boolean}
     */
    checkParam:function(req,res,params){
        var length = params.length;
        for(var i=0;i<length;i++){
            if(req.body[params[i]]===undefined){
                res.json({
                    code:-1,
                    msg:'参数异常'
                });
                return false;
            }
        }
        return true;
    }
};