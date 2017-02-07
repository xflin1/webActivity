var sessionUtil = require('../util/sessionUtil.js');
var Promise = require('bluebird');
var utils = require('../util/utils');
var wsConnection = require('../util/wsConnection.js');
var BufferQueue = require('../util/BufferQueue.js');
var wsPacket = require('../util/wsPacket.js');
var uOfflineMsg = require('../service/uOfflineMsg.js');
var User = require('../service/user.js');
var packetParser = require('./packetParser.js');

var WebSocketServer = require('ws').Server;

var _idConnectUser = 0;//sid生成器
var _sessionParser = null;
var _sessionStore = null;


var wsServer = function(httpServer,sessionParser,sessionStore){
    var wss = new WebSocketServer({server: httpServer});
    _sessionParser = sessionParser;
    _sessionStore = sessionStore;
    wss.on('connection',onConnection);
    return wss;
};

var onConnection = function(ws){
    var sessionParserAsync = Promise.promisify(_sessionParser);
    sessionParserAsync(ws['upgradeReq'],{}).then(function(){
        return sessionUtil.getSession(ws['upgradeReq'].session.id,_sessionStore);
    })/*.spread(function(session,id,store){
        return new Promise(function(resolve,reject){
            if (false == utils.checkSessionDate(session)) {
                store.destroy(id, function (err) {
                    console.log('destroy' + err);
                });
                ws.close();
                var Error = new Error('未登录');
                reject(Error);
            } else {
                resolve([session,id,store]);
            }
        });
    })*/.spread(function(session,id,store){
        ws.session = session;
        ws.sessionId = id;
        ws.sessionStore = store;
        ws.sid = ++_idConnectUser;
        onWsConnect(ws);
    }).catch(function(error){
        console.log('wsServer.js,onConnection'+error.code);
        ws.close();
    });
};

/**
 * webSocket连接之后的处理
 * @param {object} ws webSocket对象
 */

var onWsConnect = function(ws){
    var wsUser = null;
    var wsUid = null;
    var wsSid = null;
    /**
     * 通过session检查是否登录并且获取连接用户信息
     */
    if(utils.checkWsLogin(ws)){
        wsUser = ws.session.name;
        wsUid = ws.session.uid;
        wsSid = ws.sid;
    }else{
        console.log('未登录');
        ws.close();
        return null;
    }

    /**
     * 初始化用户，建立收包队列和事件处理函数------------------(同帐号已经在线如何处理?)
     */
    wsConnection.setConnection(ws,wsUid)
        .then(function(){
            ws.queue = new BufferQueue(undefined,packetParser);
            /**
             * 回复用户连接验证成功
             */
            wsConnection.sendMsg(wsPacket.connectPacket(wsUid));
            /**
             * 回复连接成功,并通知所有群用户------------是否需要通知
             */
            /*测试:wsPacket.getOfflinePacket(wsUid,0).then(function(pack){
                wsConnection.sendToGroup(pack,2);
            });*/


            /**
             *获取上次登出时间并获取offline信息---------在user表加入登录时间
             */
            User.getById(wsUid,['last'])
                .then(function(rows){
                    return wsPacket.getOfflinePacket(wsUid,rows[0].last);
                }).then(function(packet){
                wsConnection.sendToUser(packet,wsUid);
            }).catch(function(error){
                console.log(error);
            });
        });
    /**
     * 绑定ws关闭处理
     */
    onWsClose(ws,wsUid,wsSid);

    /**
     * 绑定ws收包处理
     */
    onWsMessage(ws);

};
/**
 * webSocket断开事件处理
 * @param ws
 * @param uid
 * @param sid
 */
var onWsClose = function(ws,uid,sid){
    ws.on('close',function(){
        /**
         * 通知离线.-------是否需要有离线通知.
         * 更新登出时间.
         */
        var ts = Math.ceil((new Date()).getTime()/1000);
        User.updateById(uid,{last:ts})
            .catch(function(error){
                console.log(error);
            });
        uOfflineMsg.deleteByUid(uid)
            .catch(function(error){
                console.log(error);
            });
        wsConnection.closeConnection(uid,sid);

        console.log("disconnected:sid=" + sid + ",id="+uid);

        /**
         * 删除user离线消息
         */
    });
};
/**
 * webSocket消息事件处理
 * @param ws
 */
var onWsMessage = function(ws){
  ws.on('message',function(data,flags){
      /**
       * 更新session
       */
      sessionUtil.getSession(ws.sessionId,ws.sessionStore)
          .then(function(session){
              ws.session = session;
              /**
               * 将消息写入相应队列
               */
              var queue = ws.queue;
              if (flags.binary){
                  console.log("rcv:   "+ws.sid+" "+data.byteLength + ' bytes');
                  var buffer = new ArrayBuffer(data.length);
                  var bufU8 = new Uint8Array(buffer);
                  bufU8.set(data);
                  queue.writeBytes(buffer);
              }else{
                  console.log("rcv:   "+ws.sid+" "+data);
              }

          }).catch(function(error){
            console.log(error.message);
      });


  });
};

module.exports = wsServer;
