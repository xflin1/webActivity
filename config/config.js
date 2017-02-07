var path = require('path');
module.exports={
    redisConf:{
        host:'183.62.251.18',
        port:'6379',
        auth_pass:'redis1234',
        db:3
    },
    mysql:{

        connectionLimit : 10,
        multipleStatements: true,
        host: '183.62.251.18',
        user: 'root',
        password: 'cellcom',
        database:'service',
        port: 3306,
        limit: 10
    },
    http:{
        port:8090
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