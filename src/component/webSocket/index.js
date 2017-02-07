var webSocket = require('./websocket.js');
var magic = require('../magic');
module.exports=function(App){
    App.service('ws',[function(){
        var client = null;
        var id = null;
        var createData = function(group,packType,to,payload){
            return {
                _group:group,
                _packType:packType,
                _to:to,
                _payload:payload
            };
        };
        return {
            init: function(packetParser){
                client = new webSocket(function(packet){
                    if(id==null){
                        id = packet._to;
                    }else{
                        packetParser(packet)
                    }
                 });
                client.connect({token:'test'});
            },
            sendToUser: function(uid,payload){
                if(client.connected){
                    client.send(createData(magic.MSG_PRIVATE,magic.TYPE_TEXT,uid,payload));
                }
            },
            sendToGroup: function(gid,payload){
                if(client.connected){
                    client.send(createData(magic.MSG_PUBLIC,magic.TYPE_TEXT,gid,payload));
                }
            },
            getId: function(){
                return id;
            }
        };
    }]);
};