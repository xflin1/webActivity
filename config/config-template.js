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
    }

};