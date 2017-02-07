var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var debug = require('debug')('RestApi:server');
var http = require('http');
var config = require('../config/config.js');

var serverInit = function(app,sessionParser,sessionStore){

    //Template directory setting
    app.set('views','./build/pages');
    //Template engine setting
    app.set('view engine', 'jade');

    app.locals.pretty = true;
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(cookieParser());
    app.use(sessionParser);
    app.set('port',config.http.port);
    var httpServer = require('./httpServer.js')(app);
    var wsServer = require('./wsServer.js')(httpServer,sessionParser,sessionStore);
   /* var httpServer = http.createServer(app);
    httpServer.listen(config.http.port);
    httpServer.on('error',function(error){
        if (error.syscall !== 'listen') {
            throw error;
        }

        var bind = typeof port === 'string'
            ? 'Pipe ' + port
            : 'Port ' + port;
        switch (error.code) {
            case 'EACCES':
                console.error(bind + ' requires elevated privileges');
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(bind + ' is already in use');
                process.exit(1);
                break;
            default:
                throw error;
        }
    });
    httpServer.on('listening',function(){
        var address = httpServer.address();
        var bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port ' + address.port;
        debug('Listening on' + bind);
    });*/
};

module.exports = serverInit;