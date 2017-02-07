/**
 * Created by xflin on 2015/12/30.
 * xflin@cellcom.com.cn
 */
//var TextEncoder = require("text-encoding");

//globe var start
INTERVALTIMERAUDIO = 15000;//ms
INTERVALTIMERVIDEO = 30000;//ms

//_packType p2p
TYPE_ROUTE  = 0x00;//int ·�ɰ�
TYPE_TEXT   = 0x01;//int �ı�payload
TYPE_FILE   = 0x02;//int �ļ�������������
TYPE_AUDIO  = 0x08;//int ������
TYPE_VIDEO  = 0x09;//int ��Ƶ��
TYPE_HB      = 0x7f;//int ������
//_packType p2group
TYPE_GROUTE  = 0x80;//int ·�ɰ�
TYPE_GTEXT   = 0x81;//int �ı�payload
TYPE_GFILE   = 0x82;//int �ļ�������������
TYPE_GAUDIO  = 0x88;//int ������
TYPE_GVIDEO  = 0x89;//int ��Ƶ��

MAX_SIZE_PACKET     = 2920;//:uint 1460;
MAX_SIZE_LENGTH     = 4;
MAX_SIZE_HEADER     = 20;
MAX_SIZE_PAYLOAD     = MAX_SIZE_PACKET - MAX_SIZE_HEADER;


var str2ab = function(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i<strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return buf;
};

/*
 * Pcket structure
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                             length                            |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |G|  packtype |                       reserve                   |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                             from                              |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                             to                                |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                             sequence                          |
 +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 |                             data....                          |
*/

function Packet(len) {
    _thisPacket = this;
    this._length = len;
    this.init();
}

Packet.prototype.init = function () {
    this._group = 0;//:1bit uint = 0;
    this._packType = 0;//:7bit uint = 0;
    this._reserve1 = 0;//:8bit uint = 0;
    this._reserve2 = 0;//:8bit uint = 0;
    this._reserve3 = 0;//:8bit uint = 0;
    this._from = 0;//:uint = 0;
    this._to = 0;//:uint = 0;
    this._seq = 0;//:uint = 0;
    this._ts = 0;//:uint = 0;

    //payload
   // var _payload;//Uint8Array|ArrayBuffer:ByteArray=new ByteArray();
    //var _payloadU8;
};
Packet.prototype.reset = function() {
    this._length = 0;//:uint = 0;
    this._group = 0;//:1bit uint = 0;
    this._packType = 0;//:uint = 0;
    this._reserve1 = 0;//byte
    this._reserve2 = 0;//byte
    this._reserve3 = 0;//byte
    this._from = 0;//:uint = 0;
    this._to = 0;//:uint = 0;
    this._seq = 0;//:uint = 0;
    this._ts = 0;//:uint = 0;

    this._payload = null;
};

Packet.prototype.toString = function() {
    return JSON.stringify(this.toJson());
};
Packet.prototype.toJson = function() {
    var output={};
    output._group = this._group;
    output._packType = this._packType;
    output._from = this._from;
    output._to = this._to;
    output._seq = this._seq;
    output._ts = this._ts;
    if(this._packType == 0x01)
        output._payload = this.getJsonPayload();
    else
        output._payload = this._payload;//toHexString(_payload);

    return output;
};


/*
 parse ArrayBuffer
 s --- ArrayBuffer
 return int
 0  --- parse success
 1 --- packet is null
 2 --- length is wrong
 3 --- packet's parameter wrong
 */
Packet.prototype.parseData = function(s) {
    if(!s) return 1;
    if(s.byteLength != this._length) return 2;

    var buf = new DataView(s);
    var idx = 0;
    var packetLen = buf.byteLength;
    if(packetLen < MAX_SIZE_HEADER) return 2;

    //console.log("parseData len="+packetLen);

    //rtp header
    var first = (buf.getUint8(idx++) & 0xff);
    this._group = (first & 0x80) >> 7;
    this._packType = (first & 0x7f);
    this._reserve1 = (buf.getUint8(idx++) & 0xff);
    this._reserve2 = (buf.getUint8(idx++) & 0xff);
    this._reserve3 = (buf.getUint8(idx++) & 0xff);

    this._from = buf.getUint32(idx);idx+=4;
    this._to = buf.getUint32(idx);idx+=4;
    this._seq = buf.getUint32(idx);idx+=4;
    this._ts = buf.getUint32(idx);idx+=4;

    if(idx < MAX_SIZE_HEADER) return 2;

    //_payload = s.slice(idx);
    var payloadLen = packetLen - idx;
    if( payloadLen > 0 ) {
        this._payload = new ArrayBuffer(payloadLen);
        this._payloadU8 = new Uint8Array(this._payload);
        var sU8 = new Uint8Array(s,idx);
        this._payloadU8.set(sU8);

        if((idx + this._payloadU8.length) != packetLen) {
            console.log("parseData sum:"+ (idx + this._payloadU8.length) + ",rcvSum:"+packetLen);
            return 3;
        }
    }

    return 0;
};

/*
 build ArrayBuffer,include size(TYPE_SIZE)
 return ArrayBuffer
 */
Packet.prototype.getByteArray = function() {
    var idx = 0;
    //this._length = MAX_SIZE_HEADER + (_payload ? _payload.byteLength:0);
    //console.log("getByteArray _length="+_length);

    if(!this._payload) return null;
    this._length = MAX_SIZE_HEADER + this._payload.byteLength;
    var buffer = new ArrayBuffer(this._length + MAX_SIZE_LENGTH);
    var buf = new DataView(buffer);

    buf.setUint32(idx,this._length); idx+=4;

    buf.setUint8(idx,((this._group & 0x01) << 7) | (this._packType & 0x7f)); idx++;
    buf.setUint8(idx,this._reserve1); idx++;
    buf.setUint8(idx,this._reserve2); idx++;
    buf.setUint8(idx,this._reserve3); idx++;
    buf.setUint32(idx,this._from);idx+=4;
    buf.setUint32(idx,this._to);idx+=4;
    buf.setUint32(idx,this._seq);idx+=4;
    buf.setUint32(idx,this._ts);idx+=4;

    if(this._payload) {
        //if(!this._payloadU8)
            this._payloadU8 = new Uint8Array(this._payload);

        //console.log("getByteArray _payload "+ _payloadU8.length);
        if((idx + this._payload.byteLength) == (MAX_SIZE_LENGTH + this._length)) {
            var bufU8 = new Uint8Array(buffer);
            bufU8.set(this._payloadU8,idx);
        } else {
            console.log("getByteArray payload length something wrong:"+this._length+"!="+idx+"+"+this._payload.byteLength);
            return null;
        }
    }

    //console.log("getByteArray "+ bufU8.length);
    return buffer;
};

Packet.prototype.getPackSize = function(){
    return MAX_SIZE_PACKET;
};

Packet.prototype.getPayload = function() {//:Uint8Array
    return this._payload;
};
//payload
Packet.prototype.setPayload = function(param){//:ArrayBuffer
    if(param) {
        this._payload = new ArrayBuffer(param.byteLength);
        this._payloadU8 = new Uint8Array(this._payload);
        var paramU8 = new Uint8Array(param);
        this._payloadU8.set(paramU8);

        //toHexString(_payload);
    }
};

Packet.prototype.getJsonPayload = function() {//:josn obj
    if(this._payload) {
        //return JSON.parse((new TextDecoder("utf-8")).decode(_payloadU8));
        return JSON.parse(String.fromCharCode.apply(null, new Uint16Array(this._payload)));//utf8
    }
    return this._payload;
};
//payload
Packet.prototype.setJsonPayload = function(param){//:josn obj
    if(param) {
        var str = JSON.stringify(param);
        //_payloadU8 = (new TextEncoder("utf-8")).encode(str);
        //_payload = _payloadU8.buffer;

        this._payload = str2ab(str);
        //if(u16)
        //    this._payload = u16;

        //toHexString(_payload);
    }
};

Packet.prototype.setLength = function(param){
    this._length = param;
};
Packet.prototype.setGroup = function(param){
    this._group = param;
};
Packet.prototype.setPackType = function(param){
    this._packType = param;
};
Packet.prototype.setReserve1 = function(param){
    this._reserve1 = param;
};
Packet.prototype.setReserve2 = function(param){
    this._reserve2 = param;
};
Packet.prototype.setReserve3 = function(param){
    this._reserve3 = param;
};
Packet.prototype.setFrom = function(param){
    this._from = param;
};
Packet.prototype.setTo = function(param){
    this._to = param;
};
Packet.prototype.setSequence = function(param){
    this._seq = param;
};
Packet.prototype.setTs = function(param){
    this._ts = param;
};

Packet.prototype.getLength = function(){
    return this._length;
};
Packet.prototype.getGroup = function(){
    return this._group;
};
Packet.prototype.getPackType = function(){
    return this._packType;
};
Packet.prototype.getReserve1 = function(){
    return this._reserve1;
};
Packet.prototype.getReserve2 = function(){
    return this._reserve2;
};
Packet.prototype.getReserve3 = function(){
    return this._reserve3;
};
Packet.prototype.getFrom = function(){
    return this._from;
};
Packet.prototype.getTo = function(){
    return this._to;
};
Packet.prototype.getSequence = function(){
    return this._seq;
};
Packet.prototype.getTs = function(){
    return this._ts;
};



/*
var Packet;
Packet = (function (len) {
    var _this = this;
    var _length = 0;//:uint = 0;
    var _group = 0;//:1bit uint = 0;
    var _packType = 0;//:7bit uint = 0;
    var _reserve1 = 0;//:8bit uint = 0;
    var _reserve2 = 0;//:8bit uint = 0;
    var _reserve3 = 0;//:8bit uint = 0;
    var _from = 0;//:uint = 0;
    var _to = 0;//:uint = 0;
    var _seq = 0;//:uint = 0;

    //payload
    var _payload;//Uint8Array|ArrayBuffer:ByteArray=new ByteArray();
    var _payloadU8;

    var init = function(len) {
        _length = len;
    }

    _this.reset = function() {
        _length = 0;//:uint = 0;
        _group = 0;//:1bit uint = 0;
        _packType = 0;//:uint = 0;
        _reserve1 = 0;//byte
        _reserve2 = 0;//byte
        _reserve3 = 0;//byte
        _from = 0;//:uint = 0;
        _to = 0;//:uint = 0;
 _seq = 0;//:uint = 0;

        _payload = null;
    };

    _this.toString = function() {
        return JSON.stringify(_this.toJson());
    };
    _this.toJson = function() {
        var output={};
        output.group = _group;
        output.packType = _packType;
        output._from = _from;
        output.to = _to;
        if(_packType == 0x01)
            output.payload = _this.getJsonPayload();
        else
            output.payload = _payload;//toHexString(_payload);

        return output;
    };

    _this.parseData = function(s) {
        if(!s) return 1;
        if(s.byteLength != _length) return 2;

        var buf = new DataView(s);
        var idx = 0;
        var packetLen = buf.byteLength;
        if(packetLen < MAX_SIZE_HEADER) return 2;

        //console.log("parseData len="+packetLen);

        //rtp header
        var first = (buf.getUint8(idx++) & 0xff);
        _group = (first & 0x80) >> 7;
        _packType = (first & 0x7f);
        _reserve1 = (buf.getUint8(idx++) & 0xff);
        _reserve2 = (buf.getUint8(idx++) & 0xff);
        _reserve3 = (buf.getUint8(idx++) & 0xff);

        _from = buf.getUint32(idx);idx+=4;
        _to = buf.getUint32(idx);idx+=4;
 _seq = buf.getUint32(idx);idx+=4;

        if(idx < MAX_SIZE_HEADER) return 2;

        //_payload = s.slice(idx);
        var payloadLen = packetLen - idx;
        if( payloadLen > 0 ) {
            _payload = new ArrayBuffer(payloadLen);
            _payloadU8 = new Uint8Array(_payload);
            var sU8 = new Uint8Array(s,idx);
            _payloadU8.set(sU8);

            if((idx + _payloadU8.length) != packetLen) {
                console.log("parseData sum:"+ (idx + _payloadU8.length) + ",rcvSum:"+packetLen);
                return 3;
            }
        }

        return 0;
    };

    _this.getByteArray = function() {
        var idx = 0;
        //this._length = MAX_SIZE_HEADER + (_payload ? _payload.byteLength:0);
        //console.log("getByteArray _length="+_length);

        _this._length = MAX_SIZE_HEADER + _payload.byteLength;
        var buffer = new ArrayBuffer(_this._length + MAX_SIZE_LENGTH);
        var buf = new DataView(buffer);

        buf.setUint32(idx,_this._length); idx+=4;

        buf.setUint8(idx,((_group & 0x01) << 7) | (_packType & 0x7f)); idx++;
        buf.setUint8(idx,_reserve1); idx++;
        buf.setUint8(idx,_reserve2); idx++;
        buf.setUint8(idx,_reserve3); idx++;
        buf.setUint32(idx,_from);idx+=4;
        buf.setUint32(idx,_to);idx+=4;
        buf.setUint32(idx,_seq);idx+=4;

        if(_payload && _payloadU8) {
            //console.log("getByteArray _payload "+ _payloadU8.length);
            if((idx + _payload.byteLength) == (MAX_SIZE_LENGTH + _this._length)) {
                var bufU8 = new Uint8Array(buffer);
                bufU8.set(_payloadU8,idx);
            } else {
                console.log("getByteArray payload length something wrong:"+_this._length+"!="+idx+"+"+_payload.byteLength);
                return null;
            }
        }

        //console.log("getByteArray "+ bufU8.length);
        return buffer;
    };

    _this.setLength = function(param){
        _length = param;
    };
    _this.setGroup = function(param){
        _group = param;
    };
    _this.setPackType = function(param){
        _packType = param;
    };
    _this.setReserve1 = function(param){
        _reserve1 = param;
    };
    _this.setReserve2 = function(param){
        _reserve2 = param;
    };
    _this.setReserve3 = function(param){
        _reserve3 = param;
    };
    _this.setFrom = function(param){
        _from = param;
    };
    _this.setTo = function(param){
        _to = param;
    };
    _this.setSequence = function(param){
 _seq = param;
    };


    _this.getPackSize = function(){
        return MAX_SIZE_PACKET;
    };
    _this.getLength = function(){
        return _length;
    };
    _this.getGroup = function(){
        return _group;
    };
    _this.getPackType = function(){
        return _packType;
    };
    _this.getReserve1 = function(){
        return _reserve1;
    };
    _this.getReserve2 = function(){
        return _reserve2;
    };
    _this.getReserve3 = function(){
        return _reserve3;
    };
    _this.getFrom = function(){
        return _from;
    };
    _this.getTo = function(){
        return _to;
    };
    _this.getSequence = function(){
        return _seq;
    };

    _this.getPayload = function() {//:Uint8Array
        return _payload;
    };
    //payload
    _this.setPayload = function(param){//:ArrayBuffer
        if(param) {
            _payload = new ArrayBuffer(param.byteLength);
            _payloadU8 = new Uint8Array(_payload);
            var paramU8 = new Uint8Array(param);
            _payloadU8.set(paramU8);

            //toHexString(_payload);
        }
    };

    _this.getJsonPayload = function() {//:josn obj
        if(_payload) {
            //return JSON.parse((new TextDecoder("utf-8")).decode(_payloadU8));
            return JSON.parse(String.fromCharCode.apply(null, new Uint16Array(_payload)));//utf8
        }
        return _payload;
    };
    //payload
    _this.setJsonPayload = function(param){//:josn obj
        if(param) {
            var str = JSON.stringify(param);
            //_payloadU8 = (new TextEncoder("utf-8")).encode(str);
            //_payload = _payloadU8.buffer;

            _payload = str2ab(str).buffer;

            //toHexString(_payload);
        }
    };

    var toHexString = function(buf) {
        if(buf) {
            var buffer = "";
            var bufV = new DataView(buf);

            for (var i=0 ; i < bufV.byteLength &&  i < 512;i++) {
                var b = bufV.getUint8(i);
                buffer += (b<=0x0f?"0":"") + b.toString(16) + " ";
                //buffer.appendData((b<=0x0f?"0":"") + b.toString(16) + " ");
            }
            //console.log(buffer);
            return buffer;
        }
        return null;
    }

    init(len);
});
*/
module.exports = Packet;