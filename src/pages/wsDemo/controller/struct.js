var util = require('./util');
var magic = require('component/magic.js');
var Promise = require('bluebird');
module.exports=function(App){
    App.service('ws',['$http',function($http){
        var _selfInfo = {
            id:undefined,
            nickname:undefined,
            name:undefined,
            sex:0,
            weixin:undefined,
            qq:undefined,
            email:undefined,
            phone:undefined,
            photoId:undefined,
            extattrs:undefined,
            userIds:undefined
        };
        var _group = {};
        var _user = {};
        var _groupRecord = {};
        var _userRecord = {};
        /**
         * 读取本地的聊天记录
         * @private
         */
        var _loadFromLocal = function(){
            if(window.localStorage.hasOwnProperty('record'+selfInfo.id)){
                var obj =  JSON.parse(window.localStorage['record'+selfInfo.id]);
                util.mixinObject(_userRecord,obj['user']);
                util.mixinObject(_groupRecord,obj['group']);
            }
        };
        /**
         * 存储聊天记录到本地
         * @private
         */
        var _writeToLocal = function(){
            var obj =
            {
                user:_userRecord,
                group:_groupRecord
            };
            window.localStorage['record'+selfInfo.id] = JSON.stringify(obj);
        };
        /**
         * 建立单个group对象的模板
         * @returns {{name: undefined, uid: undefined, type: undefined, msgAttrs: undefined}}
         * @private
         */
        var _createGroupTemplate = function(){
            return {
                name:undefined,
                uid:undefined,
                type:undefined,
                msgAttrs:undefined
            };
        };
        /**
         * 建立单个user对象的模板
         * @returns {{photoId: undefined, nickname: undefined, sid: undefined, id: undefined}}
         * @private
         */
        var _createUserTemplate = function(){
            return {
                photoId:undefined,
                nickname:undefined,
                sid:undefined,
                id:undefined
            };
        };
        /**
         * 建立单条聊天的模板
         * @param chatType
         * @returns {{chatType: number, msg: undefined, from: undefined, ts: undefined}}
         * @private
         */
        var _createRecordTemplate = function(chatType){
            if(chatType==magic.CHAT_NORMAL){
                return{
                    chatType:magic.CHAT_NORMAL,
                    msg:undefined,
                    from:undefined,
                    ts:undefined
                }
            }
        };
        /**
         * 根据url和body 获取http post结果
         * @param url
         * @param [body]
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getBase = function(url,body){
            body=body|{};
            return new Promise(function(resolve,reject){
                $http.post(url,body).success(function(data){
                    resolve(data);
                }).error(function(error){
                    reject(error);
                })
            });
        };
        /**
         * 获取自己所有所在群信息
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getGroup = function(){
            return _getBase(magic.URL_GROUP);
        };
        /**
         * 根据gid获取群信息
         * @param gid
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getGroupByGid =function(gid){
            return _getBase(magic.URL_GROUP_BY_GID,{id:gid});
        };
        /**
         * 加入指定gid群
         * @param gid
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _joinGroup = function(gid){
            return _getBase(magic.URL_GROUP_JOIN,{id:gid});
        };
        /**
         * 离开指定群
         * @param gid
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _quitGroup = function(gid){
            return _getBase(magic.URL_GROUP_QUIT,{id:gid});

        };
        /**
         * 剔除指定gid中uid用户___(群管理员权限)
         * @param gid   群id
         * @param uid   用户id
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _rejectGroup = function(gid,uid){
            return _getBase(magic.URL_GROUP_REJECT,{gid:gid,uid:uid});
        };
        /**
         * 获取个人信息
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getUserSelf = function(){
            return _getBase(magic.URL_USER_SELF);
        };
        /**
         * 获取所有加入群的user信息
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getUser = function(){
            return _getBase(magic.URL_USER);
        };
        /**
         *获取指定ids的user信息
         * @param {array} ids 所需要获取user的id数组集合[1,2,...]
         * @returns {bluebird|exports|module.exports}
         * @private
         */
        var _getUserById = function(ids){
            return _getBase(magic.URL_USER_BY_ID,{ids:ids});
        };
        /**
         * 刷新或初始化所有所在group信息
         * @private {bluebird}
         */
        var _refreshGroup = function(){
             return _getGroup().then(function(data){
                 var length = data.group.length;
                 util.objectClear(_group);
                 for(var i=0;i<length;i++){
                     var obj = _createGroupTemplate();
                     util.objectAssignment(data.group[i],obj);
                     _group[data.group[i].id] = obj;
                 }
             });
        };
        /**
         * 刷新指定gid的详细信息
         * @param gid
         * @returns {bluebird}
         * @private
         */
        var _refreshGroupByGid = function(gid){
            return _getGroupByGid(gid).then(function(data){
                var obj = _createGroupTemplate();
                util.objectAssignment(data.group[i],obj);
                _group[data.group[i].id] = obj;
            });
        };
        /**
         * 刷新和初始化个人信息
         * @returns {bluebird}
         * @private
         */
        var _refreshSelfInfo = function(){
            return _getUserSelf().then(function(data){
                util.objectAssignment(data.user,_selfInfo);
            });
        };
        /**
         * 刷新或初始化所有已经加入群的用户信息
         * @returns {*}
         * @private
         */
        var _refreshUser = function(){
            return _getUser().then(function(data){
                var length = data.user.length;
                for(var i=0;i<length;i++){
                    var obj = _createUserTemplate();
                    util.objectAssignment(data.user[i],obj);
                    _user[data.user[i].id] = obj;
                }
            });
        };
        /**
         * 刷新或初始化指定ids的用户信息
         * @param ids
         * @returns {*}
         * @private
         */
        var _refreshUserById = function(ids){
            return _getUserById(ids).then(function(data){
                var length = data.user.length;
                for(var i=0;i<length;i++){
                    var obj = _createUserTemplate();
                    util.objectAssignment(data.user[i],obj);
                    _user[data.user[i].id] = obj;
                }
            });
        };
        return {
            selfInfo:_selfInfo,
            group:_group,
            user:_user,
            groupRecord:_groupRecord,
            userRecord:_userRecord,
            /**
             * 初始化基础信息
             * @returns {bluebird}
             */
            init:function(){
                return _refreshSelfInfo().then(function(){
                    var queue = [_refreshGroup(),_refreshUser()];
                    return Promise.all(queue);
                }).then(function(){
                    _loadFromLocal();
                });
            },
            /**
             * 刷新或初始化指定gid的详细信息
             * @param gid
             * @returns {bluebird}
             */
            refreshGroupByGid:function(gid){
                return _refreshGroupByGid(gid);
            },
            /**
             * 刷新或初始化指定ids的用户信息
             * @param ids
             * @returns {*}
             */
            refreshUserById:function(ids){
                return _refreshUserById(ids);
            },
            /**
             * 加入指定gid的群
             * @param gid
             */
            joinGroup:function(gid){
                _joinGroup(gid).then(function(data){
                    if(data.code==0){
                        return Promise.all([_refreshGroupByGid(gid),_refreshSelfInfo()])
                            .then(function(){
                                /**
                                 * 处理成功放回code为0
                                 */
                                return {code:0}
                            })
                    }else{
                        return {code:-1,msg:'加入群失败'}
                    }
                })
            },
            /**
             * 离开指定gid的群
             * @param gid
             * @returns {bluebird}
             */
            quitGroup:function(gid){
                return _quitGroup(gid).then(function(data){
                    if(data.code==0){
                        return Promise.all([_refreshGroupByGid(gid),_refreshSelfInfo()])
                            .then(function(){
                                /**
                                 * 处理成功放回code为0
                                 */
                                return {code:0}
                            })
                    }else{
                        return data;
                    }
                })
            },
            /**
             * 剔除指定用户___(群管理员权限)
             * @param gid
             * @param uid
             * @returns {*}
             */
            rejectGroup:function(gid,uid){
                if(_group[gid].uid==_selfInfo.id){
                    return _rejectGroup(gid,uid).then(function(data){
                        if(data.code==0){
                            return _refreshGroupByGid(gid).then(function(){
                                /**
                                 * 处理成功返回code为0
                                 */
                                return {code:0}
                            })
                        }else{
                            return data;
                        }
                    })
                }else{
                    return Promise.resolve({code:-1,msg:'非该群管理员'});
                }
            }
        }
    }]);
};
