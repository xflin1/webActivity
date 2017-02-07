var wsConnection = require('../util/wsConnection.js');
var MG = require('../util/magic.js');

/**
 * webSocket消息解析
 * @param {Packet} packet
 */
var packetParser = function(packet){
    var packType = packet.getPackType();
    var group = packet.getGroup();
    var payload = packet.getJsonPayload();
    if(packType==MG.TYPE_TEXT){
        if(group == MG.MSG_PUBLIC){
            if(payload.job==MG.JOB_CHAT){
                wsConnection.sendToGroup(packet,packet.getTo());
            }
        }else if(group == MG.MSG_PRIVATE){
            if(payload.job==MG.JOB_CHAT){
                wsConnection.sendToUser(packet,packet.getTo());
            }
        }
    }

};

module.exports=packetParser;