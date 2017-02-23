var path = require('path');
module.exports={
    redisConf:{
        host:'127.0.0.1',
        port:'6379',
        db:2
    },
    mysql:{

        connectionLimit : 10,
        multipleStatements: true,
        host: '127.0.0.1',
        user: 'root',
        password: '123456',
        database:'service',
        port: 3306,
        limit: 10
    },
    http:{
        port:8080,
        uploadDir: "uploads"
    },
    log:{
        "appenders":[
            {
                "type":"console"
            },
            {
                "type": "dateFile",
                "filename": path.resolve(__dirname,'../log/restapi.log'),
                "pattern": "-yyyy-MM-dd",
                "alwaysIncludePattern": true,
                "pollInterval": 1
            }
        ]
    },
    upload:{
        tmp:path.join(__dirname,'../uploads/tmp'),
        save:path.join(__dirname,'../uploads/user'),
        thumbnails:path.join(__dirname,'../uploads/thumbnail')
    },
    wechat:{
        corpid : "wx3348d8d51353fb39",
        corpsecret : "74wx3s8E6LHBYYbxS6mj_QMlzlBncTM-fej0R8YqeHK5PerhCaRYks7_6V28Q5Hw",
        agentid:"4",
        off:true //是否发消息到wechat是的开关,false为打开
    }


};