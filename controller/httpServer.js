var debug = require('debug')('HttpServer:');
var config = require('../config/config.js');
var http = require('http');

var httpServer = function(app){
    var onError = function(error){
        if (error.syscall !== 'listen') {
            throw error;
        }
        var port=config.port;
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
    };

    var onListening = function(){
        var address = server.address();
        var bind = typeof address === 'string'
            ? 'pipe ' + address
            : 'port ' + address.port;
        debug('Listening on' + bind);
    };

    var server = http.createServer(app);
    server.listen(config.http.port);
    server.on('error',onError);
    server.on('listening',onListening);
    return server;
};

module.exports = httpServer;
