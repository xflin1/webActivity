/**
 * Created by xflin on 2015/12/30.
 * xflin@cellcom.com.cn
 */
var util = require('util');
var EventEmitter = require('events').EventEmitter;
var Packet = require("../util/Packet");

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
    EventEmitter.call(this);
    _thisBufferQueue = this;
    this._size = size | MAX_BUFFER_SIZE;
    this._callback = func;
    this.init();
}
util.inherits(BufferQueue, EventEmitter);

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
                if(pack.getTs() == 0)
                    pack.setTs(Math.ceil((new Date()).getTime()/1000));

                if(this._callback)
                    this._callback(pack);
                else
                    this.emit(pack._from, pack);
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


/*
//Uint8ClampedArray
var BufferQueue;
BufferQueue = (function (size) {
    EventEmitter.call(this);
    var _this = this;
    var _size;
    var _buffer;
    var _bufferU8;
    var _bufferView;
    var _idxWrite;
    var _idxRead;
    var _loopCountWrite;//:uint=0;
    var _loopCountRead;//:uint=0;

    var init = function () {
        util.inherits(BufferQueue, EventEmitter);
        _idxWrite = 0;
        _idxRead = 0;
        _loopCountWrite = 0;
        _loopCountRead = 0;
        _size = size | MAX_BUFFER_SIZE;
        _buffer = new ArrayBuffer(_size);
        if (_buffer.byteLength === _size) {
            console.log("BufferQueue init ArrayBuffer size "+_size);
        } else {
            _size = _buffer.byteLength;
            console.log("BufferQueue init ArrayBuffer size fail."+_size);
        }
        _bufferU8 = new Uint8Array(_buffer);
        _bufferView = new DataView(_buffer);
    };

    _this.clear = function () {
        _idxRead = 0;
        _idxWrite = 0;
        _loopCountRead = 0;
        _loopCountWrite = 0;
        //_bufferU8.();
    };

    var getWritedCount = function () {
        return (_loopCountWrite * _size + _idxWrite);
    };

    var getReadCount = function() {
        return (_loopCountRead * _size + _idxRead);
    };

    var IsFull =  function(len) {
        return ((_this.getLength()+len) > size);
    };

    var IsWriteEnd =  function(len) {
        return ((_idxWrite+len) > size);
    };

    var IsReadEnd =  function(len) {
        return ((_idxRead+len) > size);
    };

    _this.getFreeLength = function() {
        return ( _size - (_idxWrite - _idxRead)) % _size;
    }

    _this.getLength = function() {
        return (_idxWrite - _idxRead  + _size) % _size;
    }

    var nextWriteIdx = function(offset) {
        if(_idxWrite+offset >= _size)
            _loopCountWrite++;

        _idxWrite = ((_idxWrite+offset) % _size);
        //console.log("_idxWrite="+_idxWrite+"["+offset+"]");
    };

    var nextReadIdx = function(offset) {
        if(_idxRead+offset >= _size)
            _loopCountRead++;

        _idxRead = ((_idxRead + offset) % _size);
        //console.log("_idxRead="+_idxRead+"["+offset+"]");
    };

    _this.writeInt = function (value,b) {
        if(!IsWriteEnd()) {
            _bufferView.setInt32(_idxWrite, value, b);
            nextWriteIdx(4);
        } else {

        }
    };

    _this.writeBytes = function(s) {
        if(!s || s.byteLength===0) return;

        var frameLen = s.byteLength;
        if(!_bufferU8)
            _bufferU8 = new Uint8Array(_buffer);

        var bufU8 = new Uint8Array(s);
        if(IsWriteEnd(frameLen)) {
            //var buffer1 = s.slice(0, (_size - _idxWrite));
            //var buffer2 = s.slice((_size - _idxWrite));
            var data1 = bufU8.subarray(0,(_size - _idxWrite));//new Uint8Array(s,0,(_size - _idxWrite));
            var data2 = bufU8.subarray(data1.length);//new Uint8Array(s,(_size - _idxWrite));

            _bufferU8.set(data1,_idxWrite);
            _bufferU8.set(data2);
            console.log("_idxWrite 0" + ": " + _bufferU8[0]);
            nextWriteIdx(frameLen);
        } else {
            var data = new Uint8Array(s);
            _bufferU8.set(data,_idxWrite);
            nextWriteIdx(frameLen);
        }

        //console.log("writeBytes:_idxWrite=",_idxWrite,",writeLen=",frameLen,","+toHexString(s));

        var output;
        output = _this.readBytes();
        while(output) {
            var pack = new Packet(output.byteLength);
            if(pack) {
                var ret = pack.parseData(output);
                if (ret == 0)
                    _this.emit(pack.from, pack);
                else
                    console.log("parseData failed:" + ret + ",len=" + output.byteLength);
            }
            output = _this.readBytes();
        }
    };

    _this.readBytes = function() {
        var frameLen=0;
        var buf;
        var bufU8;

        if(!_bufferView)
            _bufferView = new DataView(_buffer);

        if(_bufferView && _this.getLength() > 4) {
            //frameLen=_bufferView.getUint32(_idxRead,true);
            frameLen=_bufferView.getUint32(_idxRead);
            if( _this.getLength() >= (frameLen+4)) {
                nextReadIdx(4);
                //console.log("readBytes:"+frameLen);
                if (frameLen > 0) {
                    buf = new ArrayBuffer(frameLen);
                    bufU8 = new Uint8Array(buf);
                    if(IsReadEnd(frameLen)) {
                        var data1 = _bufferU8.subarray(_idxRead);//new Uint8Array(_buffer,_idxRead);
                        var data2 = _bufferU8.subarray(0,(frameLen - data1.length));//new Uint8Array(_buffer,0,(frameLen - data1.length));

                        bufU8.set(data1,0);
                        bufU8.set(data2,data1.length);
                    } else {
                        //buf = _buffer.slice(_idxRead, _idxRead + frameLen);
                        var data3 = _bufferU8.subarray(_idxRead,_idxRead + frameLen);
                        bufU8.set(data3);
                    }
                    nextReadIdx(frameLen);
                }
                //console.log("readBytes:_idxRead=",_idxRead,",readLen=",frameLen,","+toHexString(buf));
            }
        }
        return buf;
    };

    _this.readSampleBytes = function(byteLength) {
        var frameLen=0;
        var buf;
        var bufU8;

        if(!_bufferView)
            _bufferView = new DataView(_buffer);

        if(_bufferView && _this.getLength() >= byteLength) {
            buf = new ArrayBuffer(byteLength);
            bufU8 = new Uint8Array(buf);
            if(IsReadEnd(byteLength)) {
                var data1 = _bufferU8.subarray(_idxRead);//new Uint8Array(_buffer,_idxRead);
                var data2 = _bufferU8.subarray(0,(byteLength - data1.length));//new Uint8Array(_buffer,0,(frameLen - data1.length));

                bufU8.set(data1,0);
                bufU8.set(data2,data1.length);
            } else {
                //buf = _buffer.slice(_idxRead, _idxRead + frameLen);
                var data3 = _bufferU8.subarray(_idxRead,_idxRead + frameLen);
                bufU8.set(data3);
            }
            nextReadIdx(frameLen);
        }
        return buf;
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
    };


    init();
});
*/
module.exports = BufferQueue;