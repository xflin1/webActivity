module.exports = (function(){
    /**
     * author : xflin 20160712
     * ws client
     */
//importScripts("Packet.js");
//importScripts("BufferQueue.js");

    var seq=0;

    function Wsclient(recall) {
        this.recall = recall;
        this.queue = new BufferQueue(8192*1000,recall);
        this.connected = false;
        this.sid = 0;
        this.id = 0;
        //this.func = recall;
    };

    Wsclient.prototype.connect = function(cfg) {
        var param;
        if(cfg.token)
            param = cfg.token;
        else if(cfg.name && cfg.pass)
            param = cfg.name +'&'+cfg.pass;
        else
            return false;

        var protocol =  window.document.location.protocol;
        var host = window.document.location.host;//.replace(/:.*/, '');
        //var host = window.document.location.host.replace(/:.*/, '');
        var url;// = new WebSocket('ws://' + host + ':8080/userawre');
        //var ws = new WebSocket('wss://' + host + ':443/userawre');
        if(protocol.indexOf('https')>=0) {
            url = 'wss://' + host + '/' + param;
        } else{
            url = 'ws://' + host + '/' + param;
        }

        //var url = "ws://" + document.URL.substr(7).split('/')[0] + "/" + param;

        var wsCtor = window['MozWebSocket'] ? MozWebSocket : WebSocket;
        this.socket = new wsCtor(url, 'cellcom-chat');
        //this.socket = new wsCtor(url);

        this.socket.binaryType = "arraybuffer";
        this.socket.onmessage = this.handleWebsocketMessage.bind(this);
        this.socket.onclose = this.handleWebsocketClose.bind(this);

        //this.addCanvasEventListeners();
    };

    Wsclient.prototype.destroy = function() {
        if(this.socket) {
            this.socket.close
        }
        this.socket = null;

        if(this.queue)
            this.queue.clear();

        this.queue = null;

    };

    /**
     * send {}
     * @param obj : {_to:xxx,_grooup:0|1,_packType:0-10,data:{job:xxx,to:xx,from:xxx,msg:xxxxx,...}}
     */
    Wsclient.prototype.send = function(obj) {
        var pack = new Packet(0);
        pack.setFrom(this.sid);
        pack.setTo(obj._to);
        pack.setGroup(obj._group);
        pack.setPackType(obj._packType);
        pack.setSequence(++seq);
        pack.setTs(Math.ceil((new Date()).getTime()/1000));
        if(obj._packType == 0x01)
            pack.setJsonPayload(obj._payload);
        else
            pack.setPayload(obj._payload);

        this.sendPack(pack);
    };

    Wsclient.prototype.sendPack = function(pack) {
        if(!pack) return;
        if(!this.connected) return;

        var sid = pack.getTo();
        var buf = pack.getByteArray();
        var size = pack.getPackSize();
        if(this.socket && buf) {
            if(buf.byteLength > size) {
                var count = Math.ceil(buf.byteLength/size);
                for(var i=0;i < count;i++) {
                    if( i==count-1)
                        this.sendBinary(buf.slice(i*size));
                    else
                        this.sendBinary(buf.slice(i*size,(i+1)*size));
                }
            } else {
                this.sendBinary(buf);
            }
        }
    };

    Wsclient.prototype.sendBinary = function(buffer) {
        if(!buffer) return;
        if(!this.socket || !this.socket.readyState) return;
        //this.socket.binaryType = "arraybuffer";
        this.socket.send(buffer);
    };
    /**
     * send ascii
     * @param msg : {_to:xxx,_grooup:0|1,_packType:0-10,_payload:{job:xxx,to:xx,from:xxx,msg:xxxxx,...}}
     */
    Wsclient.prototype.sendMsg = function(msg) {
        if(!msg) return;
        if(!this.socket || !this.socket.readyState) return;
        this.socket.send(JSON.stringify(msg));
    }

    Wsclient.prototype.handleWebsocketClose = function() {
        console.log(this.sid + " WebSocket Connection Closed.");
        if(this.recall)
            this.recall({_payload:{job:'disconnect',sid: this.sid}});
    };

    Wsclient.prototype.handleWebsocketMessage = function(message) {
        //toHexString(message);
        var data = message.data;
        console.log("handleWebsocketMessage data type:",data.constructor);
        if(data.constructor === String) {
            if(!this.connected) {
                var obj = JSON.parse(data);
                //if(obj.code == 0 && obj.sid) {
                if(obj._to) {
                    this.connected = true;
                    this.sid = obj._to;
                    this.id = obj._payload.id;

                    if(this.recall)
                        this.recall(obj);
                }
            }
        } else if(data.constructor === ArrayBuffer) {
            if(!this.connected) return;
            if(this.queue) {
                this.queue.writeBytes(data);
            } else {
                //console.log("onMessage:no queue defined");
            }
        } else if(data.constructor === Blob){
            console.log("Blob data type:",data.constructor);
        } else {
            console.log("onMessage:un-support data type:",data.constructor);
        }
    };

    Wsclient.prototype.buildFile = function(file,uid) {
        var theClient = this;
        var data = {
            job: 'afile',
            from: uid,
            to: 0,
            name: file.name,
            type: file.type,
            fsize: file.size
        };

        var xhr = new ajax();
        var result = xhr.post("/api/file/ad", JSON.stringify( data ), 'application/json', function (result) {
            console.log(result);
            result = JSON.parse(result);
            if(result && result.code == 0) {
                theClient.upFile(file,result);
            }
            xhr = null;
        });
    };

    Wsclient.prototype.readFile = function(file,start,end,callback) {
        var reader = new FileReader();
        reader.onloadstart = function() {
            // 这个事件在读取开始时触发
            console.log("onloadstart");
            //document.getElementById("bytesTotal").textContent = file.size;
        }
        reader.onprogress = function(p) {
            // 这个事件在读取进行中定时触发
            console.log("onprogress:" + p.loaded);
            //document.getElementById("bytesRead").textContent = p.loaded;
        }
        reader.onload = function() {
            // 这个事件在读取成功结束后触发
            console.log("load complete");
        }
        reader.onloadend = function() {
            // 这个事件在读取结束后，无论成功或者失败都会触发
            if (reader.error) {
                console.log(reader.error);
            } else {
                if(callback)
                    callback(reader.result);
            }
            reader = null;
        }

        //reader.readAsBinaryString(file);
        //reader.readAsArrayBuffer(file);
        var blob;
        if(file.slice) {  //Blob中的方法
            //blob = file.webkitSlice(start, end + 1, 'text/plain;charset=UTF-8');
            blob = file.slice(start, end);
        } else if(file.webkitSlice) {  //Blob中的方法
            //blob = file.webkitSlice(start, end + 1, 'text/plain;charset=UTF-8');
            blob = file.webkitSlice(start, end);
        } else if(file.mozSlice) {
            blob = file.mozSlice(start, end);
        }
        reader.readAsArrayBuffer(blob);

    };

    Wsclient.prototype.upFile = function(file,record) {
        var theClient = this;
        var maxsize = 2920 * 10;

        var start = file.size - record.fspace;
        var end = record.fspace >= maxsize ? (file.size - record.fspace + maxsize) : file.size;
        this.readFile(file,start,end,function(fdata){
            var xhr = new ajax();
            //xhr.responseType = "arraybuffer";
            var data = xhr.post("/api/file/up/" + record.id, fdata, "application/octet-stream", function (data) {
                console.log(data);
                data = JSON.parse(data);
                if(data && data.code == 0) {
                    if(data.fspace > 0)
                        theClient.upFile(file,data);
                    else {
                    }
                }
                xhr = null;
            });
        });
    };

    /**
     * Created by xflin on 2015/12/30.
     * xflin@cellcom.com.cn
     */
//var util = require('util');
//var EventEmitter = require('events').EventEmitter;

//rcv queue
    MAX_BUFFER_SIZE = 8192*1000;

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
    };

    function BufferQueue(size,func) {
//    EventEmitter.call(this);
        _thisBufferQueue = this;
        this._size = size | MAX_BUFFER_SIZE;
        this._callback = func;
        this.init();
    }
//util.inherits(BufferQueue, EventEmitter);

    BufferQueue.prototype.init = function () {
        this._idxWrite = 0;
        this._idxRead = 0;
        this._loopCountWrite = 0;
        this._loopCountRead = 0;
        this._buffer = new ArrayBuffer(this._size);
        if (this._buffer.byteLength === this._size) {
            console.log("BufferQueue init ArrayBuffer size "+this._size);
        } else {
            this._size = this._buffer.byteLength;
            console.log("BufferQueue init ArrayBuffer size fail."+this._size);
        }
        this._bufferU8 = new Uint8Array(this._buffer);
        this._bufferView = new DataView(this._buffer);
    };

    BufferQueue.prototype.clear = function () {
        this._idxRead = 0;
        this._idxWrite = 0;
        this._loopCountRead = 0;
        this._loopCountWrite = 0;
        //_bufferU8.();
    };

    BufferQueue.prototype.getWritedCount = function () {
        return (this._loopCountWrite * this._size + this._idxWrite);
    };

    BufferQueue.prototype.getReadCount = function() {
        return (this._loopCountRead * this._size + this._idxRead);
    };

    BufferQueue.prototype.IsFull =  function(len) {
        return ((this.getLength()+len) > this._size);
    };

    BufferQueue.prototype.IsWriteEnd =  function(len) {
        return ((this._idxWrite+len) > this._size);
    };

    BufferQueue.prototype.IsReadEnd =  function(len) {
        return ((this._idxRead+len) > this._size);
    };

    BufferQueue.prototype.getFreeLength = function() {
        return ( this._size - (this._idxWrite - this._idxRead)) % this._size;
    }

    BufferQueue.prototype.getLength = function() {
        return (this._idxWrite - this._idxRead  + this._size) % this._size;
    }

    BufferQueue.prototype.nextWriteIdx = function(offset) {
        if(this._idxWrite+offset >= this._size)
            this._loopCountWrite++;

        this._idxWrite = ((this._idxWrite+offset) % this._size);
        //console.log("_idxWrite="+this._idxWrite+"["+offset+"]");
    };

    BufferQueue.prototype.nextReadIdx = function(offset) {
        if(this._idxRead+offset >= this._size)
            this._loopCountRead++;

        this._idxRead = ((this._idxRead + offset) % this._size);
        //console.log("_idxRead="+this._idxRead+"["+offset+"]");
    };

    /*
     value -- int
     b --- boolean,true littleEndian;false bigEndian
     */
    BufferQueue.prototype.writeInt = function (value,b) {
        if(!this.IsWriteEnd()) {
            this._bufferView.setInt32(this._idxWrite, value, b);
            this.nextWriteIdx(4);
        } else {

        }
    };

    /*
     write queue buffer
     s --- ArrayBuffer
     */
    BufferQueue.prototype.writeBytes = function(s) {
        if(!s || s.byteLength===0) return;

        var frameLen = s.byteLength;
        if(!this._bufferU8)
            this._bufferU8 = new Uint8Array(this._buffer);

        var bufU8 = new Uint8Array(s);
        if(this.IsWriteEnd(frameLen)) {
            //var buffer1 = s.slice(0, (_size - _idxWrite));
            //var buffer2 = s.slice((_size - _idxWrite));
            var data1 = bufU8.subarray(0,(this._size - this._idxWrite));//new Uint8Array(s,0,(_size - _idxWrite));
            var data2 = bufU8.subarray(data1.length);//new Uint8Array(s,(_size - _idxWrite));

            this._bufferU8.set(data1,this._idxWrite);
            this._bufferU8.set(data2);
            //console.log("_idxWrite 0" + ": " + this._bufferU8[0]);
            this.nextWriteIdx(frameLen);
        } else {
            var data = new Uint8Array(s);
            this._bufferU8.set(data,this._idxWrite);
            this.nextWriteIdx(frameLen);
        }

        //console.log("writeBytes:_idxWrite=",this._idxWrite,",writeLen=",frameLen,","+toHexString(s));

        var output;
        output = this.readBytes();
        while(output) {
            var pack = new Packet(output.byteLength);
            if(pack) {
                var ret = pack.parseData(output);
                if (ret == 0) {
                    if(this._callback)
                        this._callback(pack.toJson());
                    else
                        this.emit(pack.from, pack);
                } else {
                    console.log("parseData failed:" + ret + ",len=" + output.byteLength);
                }
            }
            output = this.readBytes();
        }
    };

    /*
     read from queue buffer
     return
     ArrayBuffer(frame)
     */
    BufferQueue.prototype.readBytes = function() {
        var frameLen=0;
        var buf;
        var bufU8;

        if(!this._bufferView)
            this._bufferView = new DataView(this._buffer);

        if(this._bufferView && this.getLength() > 4) {
            //frameLen=_bufferView.getUint32(_idxRead,true);
            frameLen=this._bufferView.getUint32(this._idxRead);
            if( this.getLength() >= (frameLen+4)) {
                this.nextReadIdx(4);
                //console.log("readBytes:"+frameLen);
                if (frameLen > 0) {
                    buf = new ArrayBuffer(frameLen);
                    bufU8 = new Uint8Array(buf);
                    if(this.IsReadEnd(frameLen)) {
                        var data1 = this._bufferU8.subarray(this._idxRead);//new Uint8Array(_buffer,_idxRead);
                        var data2 = this._bufferU8.subarray(0,(frameLen - data1.length));//new Uint8Array(_buffer,0,(frameLen - data1.length));

                        bufU8.set(data1,0);
                        bufU8.set(data2,data1.length);
                    } else {
                        //buf = _buffer.slice(_idxRead, _idxRead + frameLen);
                        var data3 = this._bufferU8.subarray(this._idxRead,this._idxRead + frameLen);
                        bufU8.set(data3);
                    }
                    this.nextReadIdx(frameLen);
                }
                //console.log("readBytes:_idxRead=",this._idxRead,",readLen=",frameLen,","+toHexString(buf));
            }
        }
        return buf;
    };

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
        if(this._packType == 0x01||this._packType == 0x02)
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

    return Wsclient;
})();



