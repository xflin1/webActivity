var Promise = require('bluebird');
var User = require('../service/user.js');
var UserGroup = require('../service/usergroup.js');
var GOfflineMsg = require('../service/gOfflineMsg.js');
var UOfflineMsg = require('../service/uOfflineMsg.js');
var MG = require('./magic.js');
/**
 * 根据id储存ws对像
 * @type {object}
 */
var connections = null;

(function(){
    if(global.hasOwnProperty('wsConnections')&&
        global['wsConnections']!=null){
        connections = global['wsConnections'];
    }else{
        connections = {};
        global['wsConnections'] = connections;
    }
})();

module.exports  = {
    /**
     * 设置在线状态,并储存ws对象
     * @param ws
     * @param id
     * @returns {bluebird}
     */
    setConnection:function(ws,id){
        var _this = this;
        return new Promise(function(resolve,reject){
            if(connections.hasOwnProperty(id)){
                _this.closeConnection(id);
                connections[id] = ws;
                return resolve();
            }else{
               return User.updateById(id,{'online':1})
                        .then(function(rows){
                            if(rows['affectedRows']==0){
                                var err = new Error('更新在线状态失败');
                                reject(err);
                            }else{
                                connections[id] = ws;
                                resolve();
                            }
                        }).catch(function(error){
                            reject(error);
                        });
            }
        });
    },
    /**
     * 根据id获取ws对象
     * @param id
     * @returns {*}
     */
    getConnectionById:function(id){
        if(connections.hasOwnProperty(id)){
            return connections[id];
        }else{
            return null;
        }
    },
    /**
     * 发送数据包
     * @param msg
     */
    sendMsg:function(msg){
        if(!msg || !msg._to) return;
        var id = msg._to;
        var ws = this.getConnectionById(id);
        if(ws){
            ws.send(JSON.stringify(msg));
        }
    },
    /**
     * 通过id发送消息给用户
     * @param pack  数据包
     * @param id   发送用户id
     */
    sendToUser:function(pack,id){
        var _this = this;
        return new Promise(function(resolve,reject){
            if(pack){
                var ws = _this.getConnectionById(id);
                if(ws){
                    resolve(_this.sendBinary(pack,ws));
                }else if(pack.getGroup()==MG.MSG_PRIVATE){
                    /**
                     * 无连接,且为私人消息,储存离线消息
                     */
                    resolve(_this.offline(pack));
                }
            }
            var error = new Error('[sendToUser] id='+id);
            reject(error);
        });

    },
    /**
     *
     * @param pack  数据包
     * @param gid   群id
     * @returns {bluebird}
     */
    sendToGroup:function(pack,gid){
        var _this =this;
        this.groupOffline(pack)
            .catch(function(error){
               console.log(error);
            });
        return new Promise(function(resolve,reject){
            return UserGroup.getByGid(gid,['uid'])
                    .then(function(rows){
                        var length = rows.length;
                        for(var i=0;i<length;i++){
                            _this.sendToUser(pack,rows[i].uid)
                                .catch(function(error){
                                    console.log('[sendToGroup]'+error.msg);
                                });
                        }
                        resolve();
                    }).catch(function(error){
                        reject(error)
                    });
        });
    },
    /**
     * 发送到指定uid用户的所有群
     * @param pack  数据包
     * @param uid   用户id
     * @returns {bluebird}
     */
    sendToOwnGroup:function(pack,uid){
        var _this = this;
        return new Promise(function(resolve,reject){
            return UserGroup.getByUid(uid,['gid'])
                .then(function(rows){
                    var length = rows.length;
                    for(var i=0;i<length;i++){
                        _this.sendToGroup(pack,rows[i].gid)
                            .catch(function(error){
                               console.log('[sendToEveryGroup]'+error.msg);
                            });
                    }
                    resolve();
                }).catch(function(error){
                    reject(error);
                })
        });

    },
    /**
     * 将二进制数据发送给指定连接
     * @param pack  数据包
     * @param ws    发送ws连接
     */
    sendBinary:function(pack,ws){
        var buf = pack.getByteArray();
        var size = pack.getPackSize();
        if(buf) {
            if(buf.byteLength > size) {
                var count = Math.ceil(buf.byteLength/size);
                for(var i=0;i < count;i++) {
                    if( i==count-1)
                        ws.send(buf.slice(i*size));
                    else
                        ws.send(buf.slice(i*size,(i+1)*size));
                }
            } else {
                ws.send(buf);
            }
        }
    },
    /**
     *
     * @param pack  数据包
     */
    offline:function(pack){
        return new Promise(function(resolve,reject){
            if(pack.getPackType()==MG.TYPE_TEXT){
                var values = {
                    _group:pack.getGroup(),
                    _packType:pack.getPackType(),
                    _from:pack.getFrom(),
                    _to:pack.getTo(),
                    _seq:pack.getSequence(),
                    _ts:pack.getTs(),
                    _payload:pack.getJsonPayload()
                };
                UOfflineMsg.insert(values)
                    .then(function(rows){
                        if(rows['affectedRows']==0){
                            var err = new Error('插入uOfflineMsg失败');
                            reject(err);
                        }
                        resolve();
                    }).catch(function(error){
                    reject(error);
                })
            }else{
                resolve();
            }
        });
    },
    /**
     *
     * @param pack
     * @returns {bluebird|exports|module.exports}
     */
    groupOffline:function(pack){
        return new Promise(function(resolve,reject){
            if(pack.getPackType()==MG.TYPE_TEXT){
                var values = {
                    _group:pack.getGroup(),
                    _packType:pack.getPackType(),
                    _from:pack.getFrom(),
                    _to:pack.getTo(),
                    _seq:pack.getSequence(),
                    _ts:pack.getTs(),
                    _payload:pack.getJsonPayload()
                };
                GOfflineMsg.insert(values)
                    .then(function(rows){
                        if(rows['affectedRows']==0){
                            var err = new Error('插入gOfflineMsg失败');
                            reject(err);
                        }
                        resolve();
                    }).catch(function(error){
                        reject(error);
                    });
            }else{
                resolve();
            }
        });
    },
    /**
     * 根据id(和sid)关闭ws连接
     * @param id
     * @param [sid]
     */
    closeConnection:function(id,sid){
        var ws = connections[id];
        if(ws){
            if(sid==undefined||ws.sid==undefined){
                delete connections[id];
                ws.close();
            }else if(sid==ws.sid){
                delete connections[id];
            }
        }
    }
};

