/**
 * Created by zheor on 16-9-28.
 */
var Packet  = require('./Packet.js');
var gOfflineMsg = require('../service/gOfflineMsg.js');
var uOfflineMsg = require('../service/uOfflineMsg.js');
var userGroup = require('../service/usergroup.js');
var MG = require('./magic.js');

/**
 * 包序列
 * @type {number}
 */
if(!global.hasOwnProperty('packetSeq')){
    global.packetSeq = 0;
}


module.exports ={
    /**
     * 系统私聊包结构
     * @param to
     * @param payload
     * @returns {Packet}
     */
    privateSys:function(to,payload){
        return this.createPacket(MG.MSG_PRIVATE,MG.TYPE_SYS,0,to,payload);
    },
    /**
     * 系统群发包结构
     * @param to
     * @param payload
     * @returns {Packet}
     */
    groupSys:function(to,payload){
        return this.createPacket(MG.MSG_PUBLIC,MG.TYPE_SYS,0,to,payload);
    },
    /**
     * 普通私聊包结构
     * @param from
     * @param to
     * @param payload
     * @returns {Packet}
     */
    privateText:function(from,to,payload){
        return this.createPacket(MG.MSG_PRIVATE,MG.TYPE_TEXT,from,to,payload);
    },
    /**
     * 普通群发包结构
     * @param from
     * @param to
     * @param payload
     * @returns {Packet}
     */
    groupText:function(from,to,payload){
        return this.createPacket(MG.MSG_PUBLIC,MG.TYPE_TEXT,from,to,payload);
    },
    /**
     * 根据packet基础结构生产Packet对象
     * @param {number} group
     * @param {number} packType
     * @param {number} from
     * @param {number} to
     * @param {object} payload
     * @returns {Packet}
     */
    createPacket:function(group,packType,from,to,payload){
        var ts = Math.ceil((new Date()).getTime()/1000);
        var pack= new Packet(0);
        pack.setGroup(group);
        pack.setPackType(packType);
        pack.setFrom(from);
        pack.setTo(to);
        pack.setSequence(++global.packetSeq);
        pack.setTs(ts);
        pack.setJsonPayload(payload);
        return pack;
    },
    /**
     * 根据packet基础结构生产object
     * @param {number} group
     * @param {number} packType
     * @param {number} from
     * @param {number} to
     * @param {object} payload
     * @returns {{_group: *, _packTYpe: *, _from: *, _to: *, _payload: *}}
     */
    createStrPacket:function(group,packType,from,to,payload){
        var ts = Math.ceil((new Date()).getTime()/1000);
        return {
            _group:group,
            _packType:packType,
            _from:from,
            _to:to,
            _payload:payload,
            _seq:++global.packetSeq,
            _ts:ts
        };
    },
    /**
     * 生成连接成功的包
     * @param id
     * @returns {{_group: *, _packTYpe: *, _from: *, _to: *, _payload: *}}
     */
    connectPacket:function(id){
        return this.createStrPacket(MG.MSG_PRIVATE,MG.TYPE_SYS,0,id,{
            job:MG.JOB_CONNECT,
            code:0
        });
    },
    /**
     * 获取ts之前的所有离线消息并打包成packet
     * @param uid 用户id
     * @param ts 时间戳
     * @returns {bluebird}
     */
    getOfflinePacket:function(uid,ts){
        var _this = this;
        return new Promise(function(resolve,reject){
            /**
             * 根据id获取用户在的所有gid
             */
            userGroup.getByUid(uid,['gid'])
                .then(function(rows){
                    var queue =[];
                    queue.push(uOfflineMsg.getByTs(uid,ts));
                    for(var i=0;i<rows.length;i++){
                        queue.push(gOfflineMsg.getByTs(rows[i].gid,ts));
                    }
                    return Promise.all(queue)
                }).then(function(result){
                        var data = result[0];
                        for(var i=1;i<result.length;i++){
                            data.push.apply(data,result[i])
                        }
                        resolve(_this.privateSys(uid,{
                            job: MG.JOB_OFFLINE,
                            data:data
                        }));
                }).catch(function(error){
                    reject(error);
                });
        });
    }
};