var initGlobal  = function(rootScope){
    rootScope.STATUS = {
        CONNECT:false,
        LOGIN:false
    };

    rootScope.TYPE = {
        GROUP:0x1,
        PRIVATE:0x0
    };

    rootScope.groupType = {
        PUBLIC: 0,
        PRIVATE: 1,
        RESULT: 2
    };

    rootScope.CHATTYPE = {
        NORMAL: 'normal',
        NOTICE: 'notice'
    };

    rootScope.EVENT = {

    };

    rootScope.JOB = {
        CONNECT:'connect',
        DISCONNECT:'disconn',
        JOIN: 'join',
        INVITE: 'invite',
        LEAVE: 'leave',
        GROUP:'group',
        AGROUP:'agroup',
        RGROUP: 'rgroup',
        MGROUP: 'mgroup',
        BBS: 'bbs',
        ABBS: 'abbs',
        RBBS: 'rbbs',
        MBBS: 'mbbs',
        REG: 'reg',
        AREG: 'areg',
        RREG: 'rreg',
        MREG: 'mreg',
        CHAT: 'chat',
        UPDATE: 'update',
        USER: 'user',
        USERFILE: 'userfile',
        FILE: 'file',
        AFILE: 'afile',
        RFILE: 'rfile'

    };

    rootScope.selfInfo = {
        sid:undefined,
        id:undefined,
        nickname:undefined,
        name:undefined,
        sex:0,
        qq:undefined,
        email:undefined,
        phone:undefined,
        photoId:undefined,
        groupId:undefined
    };
    rootScope.client = null;

    rootScope.recentChatArray = [];
    rootScope.userHashMap = {};
    rootScope.groupHashMap = {};
    rootScope.voteInfamation = null;

    rootScope._loadFromLocal = function(){
        if(window.localStorage.hasOwnProperty('record'+rootScope.selfInfo.id)){
            var obj =  JSON.parse(window.localStorage['record'+rootScope.selfInfo.id]);
            rootScope.recentChatArray = obj['recent'];
            rootScope.userHashMap = obj['user'];
            rootScope.groupHashMap = obj['group'];
        }
    };

    rootScope._writeToLocal = function(){
        var obj =
        {
            recent:rootScope.recentChatArray,
            user:rootScope.userHashMap,
            group:rootScope.groupHashMap
        };
        window.localStorage['record'+rootScope.selfInfo.id] = JSON.stringify(obj);
    };

    rootScope._objectAssignment =  function(from,to){
        if(from != null){
            for(var key in from){
                if(from.hasOwnProperty(key)&&
                    to.hasOwnProperty(key)){
                    if(typeof(from[key])=='object'){
                        rootScope._objectAssignment(from[key],to[key])
                    }else{
                        to[key] = from[key];
                    }
                }
            }
        }
    };

    rootScope._createUserTemplate = function(){
        return {
            record: [],
            photoId:undefined,
            nickname:undefined,
            sid:undefined,
            id:undefined
        };
    };

    rootScope._createGroupTemplate = function(){
        return {
            record:[],
            name:undefined,
            uid:undefined,
            type:undefined,
            tsEnd:undefined,
            tsStart:undefined,
            userids:undefined,
            msgAttrs:undefined
        };
    };

    rootScope._createRecordTemplate = function(job){
        if(job == rootScope.JOB.CHAT){
            return {
                chatType:rootScope.CHATTYPE.NORMAL,
                msg:undefined,
                from:undefined
            };
        }else if(job == rootScope.JOB.ABBS){
            return {
                chatType:rootScope.CHATTYPE.NOTICE,
                gidOwn:undefined,
                msgAttrs:undefined,
                uid:undefined
            };
        }
        return null;
    };

    rootScope._createRecentChatTemplate = function(){
        return {
            type:undefined,
            id:undefined
        }
    };

    rootScope._checkRecentChat = function(){
        var length = rootScope.recentChatArray.length;
        var i=0;
        for(;i<length;i++){
            if(rootScope.recentChatArray[i].type ==
                rootScope.TYPE.GROUP){
                var id = rootScope.recentChatArray[i].id;
                if(!rootScope.groupHashMap.hasOwnProperty(id)||
                    !rootScope._checkGroupId(id)){
                    rootScope.recentChatArray.splice(i,1);
                    length--;
                    i--;
                }
            }
            /**添加user的处理
             * */
        }
    };

    rootScope._checkGroupId = function(id){
        var groupId = rootScope.selfInfo.groupId.split(',');
        for(var i=0;i<groupId.length;i++){
            if(id==groupId[i]){
                return true;
            }
        }
        return false;
    };

    rootScope._setRecentChat  = function(type,id){
        if(type==rootScope.TYPE.GROUP&&
            rootScope._checkGroupId(id)==false){
            return;
        }
        var length = rootScope.recentChatArray.length;
        var i = 0;
        for(;i<length;i++){
            var obj = rootScope.recentChatArray[i];
            if(obj.type == type && obj.id==id){
                rootScope.recentChatArray.splice(i,1);
                rootScope.recentChatArray.unshift(obj);
                break;
            }
        }
        if(i==length){
            var chat  = rootScope._createRecentChatTemplate();
            chat.type = type;
            chat.id = id;
            rootScope.recentChatArray.unshift(chat);
        }
    };

    rootScope._checkGroupHashMap = function(groups){
        for(var id in rootScope.groupHashMap){
            if(rootScope.groupHashMap.hasOwnProperty(id)){
                var has = false;
                for(var i=0;i<groups.length;i++){
                    if(groups[i]['id']== id)
                    {
                        has=true;
                        break;
                    }
                }
                if(has===false){
                    delete rootScope.groupHashMap[id];
                }
            }
        }
    };

    rootScope._setGroupHashMap= function(data,gid){
        if(rootScope.groupHashMap.hasOwnProperty(gid)){
            rootScope._objectAssignment(
                data,
                rootScope.groupHashMap[gid]
            );
        }else{
            var groupTemplate = rootScope._createGroupTemplate();
            rootScope._objectAssignment(
                data,
                groupTemplate
            );
            rootScope.groupHashMap[gid] = groupTemplate;
        }
    };

    rootScope._setUserHashMap = function(data,uid){
        if(rootScope.userHashMap.hasOwnProperty(uid)){
            rootScope._objectAssignment(
                data,
                rootScope.userHashMap[uid]
            );
        }else{
            var userTemplate = rootScope._createUserTemplate();
            rootScope._objectAssignment(
                data,
                userTemplate
            );
            rootScope.userHashMap[uid] = userTemplate;
        }
    };

    rootScope._setGroupRecord = function(data,gid){
        if(rootScope.groupHashMap.hasOwnProperty(gid)){
            var recordTemplate =
                rootScope._createRecordTemplate(data.job);
            rootScope._objectAssignment(data,recordTemplate);
            rootScope.groupHashMap[gid].record.push(recordTemplate);
        }
    };

    rootScope._setUserRecord = function(data,uid){
        if(rootScope.groupHashMap.hasOwnProperty(uid)){
            var recordTemplate =
                rootScope._createRecordTemplate(data.job);
            rootScope._objectAssignment(data,recordTemplate);
            rootScope.userHashMap[uid].record.push(recordTemplate);
        }
    };

    rootScope._setSelfInfo = function(data){
        rootScope._objectAssignment(data,rootScope.selfInfo);
    };

    rootScope._handleChat = function(packet){
        if(packet._group == rootScope.TYPE.GROUP){
            rootScope._setGroupRecord(
                packet._payload,
                packet._payload.gid);/**gid获取待更改***/
            rootScope._setRecentChat(
                packet._group,
                packet._payload.gid);
        }
        else if(packet._group == rootScope.TYPE.PRIVATE){
            rootScope._setUserRecord(
                packet._payload,
                packet._payload.from);/**from获取待更改***/
            rootScope._setRecentChat(
                packet._group,
                packet._payload.from);
        }
        rootScope._writeToLocal();
    };

    rootScope._handleNoticeChat = function(packet){
        if(packet._group == rootScope.TYPE.GROUP){
            if(packet)
            rootScope._setGroupRecord(
                packet._payload,
                packet._to);
            rootScope._setRecentChat(
                packet._group,
                packet._to);
        }
        rootScope._writeToLocal();
    };

    rootScope._handleUser = function(data){
        rootScope._loadFromLocal();
        if(data.hasOwnProperty('groups')){
            rootScope._checkGroupHashMap(data.groups);
            rootScope._checkRecentChat();
            for(var i=0;i<data.groups.length;i++){
                rootScope._setGroupHashMap(
                    data.groups[i],
                    data.groups[i].id
                );
                if(data.groups[i].hasOwnProperty('users')){
                    for(var k=0; k<data.groups[i].users.length;k++){
                        rootScope._setUserHashMap(
                            data.groups[i].users[k],
                            data.groups[i].users[k].id
                        );
                    }
                }
                rootScope._setRecentChat(
                    rootScope.TYPE.GROUP,
                    data.groups[i].id
                );
            }
        }
        rootScope._writeToLocal();
    };

    rootScope._handleAddGroup = function(data){
        data.gid = data.id;
        rootScope._handleJoin(data);
    };

    rootScope._handleGroup = function(data){
        if(data.hasOwnProperty('result')){
            rootScope._setGroupHashMap(
                data.result,
                data.result.id
            );
            var length = rootScope.recentChatArray.length;
            var i = 0;
            for(;i<length;i++){
                var obj = rootScope.recentChatArray[i];
                if(obj.type == rootScope.TYPE.GROUP && obj.id==data.result.id){
                    break;
                }
            }
            if(i==length){
                rootScope._setRecentChat(
                    rootScope.TYPE.GROUP,
                    data.result.id
                );
            }
        }
    };

    rootScope._handleJoin = function(data){
        if(!rootScope._checkGroupId(data.gid)&&
            data.uid == rootScope.selfInfo.id)
        {
            rootScope.selfInfo.groupId += (','+data.gid);
            var payload = {
                job: 'group',
                id: data.gid
            };
            rootScope.sendData(0,rootScope.selfInfo.sid,payload);
        }
    };

    rootScope._handleLeave = function(data){
        if(rootScope._checkGroupId(data.gid)&&
            data.uid == rootScope.selfInfo.id)
        {
            var temp = rootScope.selfInfo.groupId.split(',');
            for(var i=0;i<temp.length;i++){
                if(temp[i] == data.gid){
                    temp.splice(i,1);
                    break;
                }
            }
            rootScope.selfInfo.groupId = temp.join(',');
            rootScope._checkRecentChat();
        }
    };
    rootScope._handleDisconnect = function(packet){
        if(packet.id == rootScope.selfInfo.id){
            window.location = '/';
        }
    };

    rootScope._initWebSocket = function(){
        rootScope.client = new Wsclient(rootScope._handlePacket);
        rootScope.client.connect({token:'test'});
    };

    rootScope._handlePacket = function(packet){
        if(packet.hasOwnProperty('_payload')){
            var _job = packet._payload.job;
            var JOB = rootScope.JOB;
            if(_job == JOB.CONNECT){
                if(packet._payload.id == rootScope.client.id){
                    rootScope._setSelfInfo(packet._payload);
                    rootScope.STATUS.CONNECT = true;
                    rootScope.STATUS.LOGIN = true;
                    rootScope.$apply(function(){
                        rootScope.$broadcast('event.login.success');
                    });
                }
            }else if(_job == JOB.USER){
                if(packet._payload.id == rootScope.client.id) {
                    rootScope.$apply(function(){
                        rootScope._setSelfInfo(packet._payload);
                        rootScope._handleUser(packet._payload);
                    });
                }
            }else if(_job == JOB.BBS){
                rootScope.$apply(function(){
                    rootScope.$broadcast('event.notice.get',packet);
                });
            }else if(_job == JOB.ABBS){
                rootScope.$apply(function(){
                    rootScope._handleNoticeChat(packet);
                    rootScope.$broadcast('event.notice.add',packet);
                });
            }else if(_job== JOB.CHAT) {
                rootScope.$apply(function(){
                    rootScope._handleChat(packet);
                });
            }else if(_job.indexOf(JOB.REG) >= 0){
                rootScope.$apply(function(){
                    rootScope.$broadcast('event.chat',packet);
                });
            }else if(_job.indexOf(JOB.FILE)>= 0){
                rootScope.$apply(function(){
                    rootScope.$broadcast('event.upload',packet);
                });
            }else if(_job == JOB.AGROUP){
                rootScope.$apply(function(){
                    rootScope._handleAddGroup(packet._payload);
                    rootScope.$broadcast('event.group.add',packet);
                });
            }else if(_job == JOB.GROUP){
                rootScope.$apply(function(){
                   rootScope._handleGroup(packet._payload);
                });
            }else if(_job== JOB.JOIN){
                rootScope.$apply(function(){
                    rootScope._handleJoin(packet._payload);
                });
            }else if(_job== JOB.LEAVE){
                rootScope.$apply(function(){
                    rootScope.$broadcast('event.group.leave',packet);
                    rootScope._handleLeave(packet._payload);
                });
            }else if(_job== JOB.INVITE){
                rootScope.$apply(function(){
                    if(packet._from == rootScope.selfInfo.sid){
                        rootScope.$broadcast('event.group.invite',packet);
                    }
                });
            }else if(_job == JOB.DISCONNECT||
                _job == 'disconnect'){
                rootScope.$apply(function(){
                    rootScope._handleDisconnect(packet);
                });
            }
        }
    };

    rootScope.sendData = function(type,to,payload,packType){
        var data = {
            _group:type,
            _packType:packType||1,
            _to:to,
            _payload:payload
        };
        if(rootScope.client){
            rootScope.client.send(data);
        }
    };
};