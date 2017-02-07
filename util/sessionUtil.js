var Promise = require('bluebird');

module.exports = {
    /**
     * 根据session id获取session
     * @param {string}      id              session的id
     * @param {RedisStore}  sessionStore    redisStore实例
     *
     *
     * @returns {bluebird}
     */
    getSession:function(id,sessionStore){
        return new Promise(function(resolve,reject){
            sessionStore.get(id,function(err,session){
                if(err){
                    reject(err);
                }else if(session==undefined){
                    reject('session undefined');
                }else{
                    resolve([session,id,sessionStore]);
                }
            })
        });
    },
    /**
     *
     * @param {Session}     session         session对象
     * @param {string}      id              session的id
     * @param {RedisStore}  sessionStore    redisStore实例
     *
     * @returns {bluebird}
     */
    setSession:function(session,id,sessionStore){
        return new Promise(function(resolve,reject){
            sessionStore.set(id,session,function(err){
                if(err){
                    reject(err);
                }else{
                    resolve([id,sessionStore]);
                }
            })
        });
    },
    /**
     *
     * @param {Session}     session         session对象
     * @param {string}      id              session的id
     * @param {RedisStore}  sessionStore    redisStore实例
     *
     *
     * @returns {bluebird}
     */
    touchAsync:function(session,id,sessionStore){
        return new Promise(function(resolve,reject){
            sessionStore.touch(id,session,function(err){
                if(err){
                    reject(err);
                }else{
                    resolve([id,sessionStore]);
                }
            })
        });
    }

};
