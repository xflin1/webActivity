/*var weChat = require('../util/wechat-promise.js');*/
var User = require('../service/user.js');
var vendor = require('../service/vendor.js');
var userVendor = require('../service/uservendor.js');
var vendorServiceType = require('../service/vendorServiceType.js');
var vendorTarget = require('../service/vendorTarget.js');
var utils = require('../util/utils.js');
var Promise = require('bluebird');

/*User.getAll(['name','weixin','weStatus'])
    .then(function(rows){
        var length = rows.length;
        for(var i=0;i<length;i++)
        {
            if(rows[i]['weixin']&&rows[i]['weixin']!=''&&rows[i]['weStatus']==0) {
                var values = {
                    userid: rows[i]['name'],
                    name: rows[i]['name'],//用户名
                    department: [1,2],
                    weixinid: rows[i]['weixin']//微信号
                };
                weChat.createUser(values)
                    .then(function (data) {
                        User.updateByName(data[1],{weStatus:1});
                        console.log(data[0]);
                    })
                    .catch(function (error) {
                        console.log(error.code, error.message)
                    });
            }
        }

    })
    .catch(function(error){

    });*/
/*
var values = {
    userid:'cellcom',//用户名
    name:'zzd550510593',//用户名
    department:[1],
    weixinid:'zzd550510593'//微信号
};
weChat.createUser(values)
    .then(function(res){
        console.log(res);
    })
    .catch(function(error){
        if(error.code===60108){
            console.log(values);

        }
        console.log(error)
    });*/

/**
 * user
 *
 */
(function(){
    var data=[
        {
            vendor:'总经理室',
            user:[
                {
                    name:'zhangyu',
                    id:'zhangyuzyzy'
                },
                {
                    name:'guoweiqiang',
                    id:'wxid_odubu9ml72z321'
                },
                {
                    name:'zhuyunyin',
                    id:'zhugg2251'
                }
            ]
        },
        {
            vendor:'人事行政部',
            user:[
                {
                    name:'wangbo',
                    id:'qiuyuwangbo'
                },
                {
                    name:'zhangrongjian',
                    id:'zrj668866'
                },
                {
                    name:'panhuiyu',
                    id:'wxid_7z9kpwliwxk312'
                }
            ]
        },
        {
            vendor:'财务部',
            user:[
                {
                    name:'chensheng',
                    id:'huasheng15097867'
                },
                {
                    name:'maishunhao',
                    id:'wxid_h5qptdievjq621'
                },
                {
                    name:'guoyali',
                    id:'ylguo1'
                },
                {
                    name:'kejingli',
                    id:'kechuangbin'
                }
            ]
        },
        {
            vendor:'产品一部',
            user:[
                {
                    name:'zhongkai',
                    id:'zhongkai009'
                },
                {
                    name:'zhaifurong',
                    id:'frchak'
                },
                {
                    name:'jiangwenxu',
                    id:'Firelifeview'
                },
                {
                    name:'zhangwentao',
                    id:'tao692480'
                },
                {
                    name:'gaofeihao',
                    id:'gaofei211510'
                },
                {
                    name:'yangjun',
                    id:'awesty2015'
                },
                {
                    name:'chenyuecheng',
                    id:'CherryChan_YPao'
                },
                {
                    name:'linliming',
                    id:'llylam'
                },
                {
                    name:'wuminbo',
                    id:'dear-zhuzai'
                },
                {
                    name:'huanghuirong',
                    id:'wxid_od908tusr5g22'
                },
                {
                    name:'huangguiquan',
                    id:'H-346419865'
                }
            ]
        },
        {
            vendor:'技术部',
            user:[
                {
                    name:'zhengbo',
                    id:'bozheng1978'
                },
                {
                    name:'guanjianchuang',
                    id:'wxid-le9as4uzdpgs11'
                },
                {
                    name:'shenhuaikun',
                    id:'hkshen-9'
                },
                {
                    name:'meibin',
                    id:'lovelyboygg'
                },
                {
                    name:'yezhongzhong',
                    id:'yzz360'
                },
                {
                    name:'linxingfeng',
                    id:'xflin_'
                },
                {
                    name:'liangjiangyun',
                    id:'junang1986'
                },
                {
                    name:'lijunyang',
                    id:'elegous1'
                },
                {
                    name:'liangweisheng',
                    id:'lws_LLL'
                },
                {
                    name:'xiangzeqing',
                    id:'haifen_xs'
                },
                {
                    name:'liwenjie',
                    id:'fsliwenjie'
                },
                {
                    name:'wangshenghui',
                    id:'WSHSHIWBB'
                }
            ]
        },
        {
            vendor:'项目管理部',
            user:[
                {
                    name:'wangyanfen',
                    id:'wxid_yptt23n9gt9u22'
                },
                {
                    name:'jinhuihui',
                    id:'jin0huihui'
                },
                {
                    name:'fanyacong',
                    id:'nanfangdewoniu'
                },
                {
                    name:'chenweishu',
                    id:'cweishu'
                }
            ]
        }
    ];
    var dataLength = data.length;
    var cp = '华工信元';
    var cpId;
    var tmp = {name:cp,vc:0,st:1};
    utils.addTimeStamp(tmp);
    vendor.insert(tmp)
        .then(function(rows){
            cpId=rows.insertId;
            for (var i=0;i<dataLength;i++){
                var values = {
                    parentId:cpId,
                    name:data[i]['vendor'],
                    vc:0,
                    st:1
                };
                utils.addTimeStamp(values);
                _insert(data[i],values);
            }
        })
        .then(function(){
            var vs = {
                vid:cpId,
                st:1
            };
            return vendorServiceType.insert(vs);
        })

})();

var _insert = function(data,values){
    var cpId = values.parentId;
    console.log(cpId);
    vendor.insert(values)
        .then(function(rows){
            var vid = rows.insertId;
            for(var j=0;j<data.user.length;j++){
                var u = {
                    name:data.user[j].name,
                    nickname:data.user[j].name,
                    weixin:data.user[j].id,
                    pass:'123456'
                };
                User.insertBase(u)
                    .then(function(rows){
                        var uid = rows.insertId;
                        var uv = {
                            vid:vid,
                            uid:uid,
                            role:"ROLE_VENDOR"
                        };
                        return userVendor.insert(uv)
                            .then(function(){
                                console.log(uid);
                            })
                    })
                    .catch(function(error){
                        console.log(error);
                    });
            }
            return Promise.resolve(vid);
        })
        .then(function(vid){
            var vs = {
                vid:vid,
                st:1
            };
            return vendorServiceType.insert(vs)
                .then(function(){
                   return Promise.all([vendorTarget.insert({
                       vid:vid,
                       target:0,
                       type:1
                   }),vendorTarget.insert({
                       vid:vid,
                       target:cpId,
                       type:1
                   })]);
                });
        })
        .catch(function(error){
            console.log(error);
        });

};