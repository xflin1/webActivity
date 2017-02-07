var express = require('express');
var session = require('express-session');
var connectRedis = require('connect-redis');
var config = require('./config/config.js');
console.log("Load database configuration file ok...");
var path =require('path');

var app = express();
var RedisStore = connectRedis(session);
var sessionStore = new RedisStore(config.redisConf);
var sessionParser = session({
  secret: 'sessionSecret123456',
  maxAge:'10000',
  store: sessionStore,
  resave: true,
  saveUninitialized: true
});



console.log("Session init ok...");
app.use(express.static(path.join(__dirname, 'build/pages')));
app.use('/assets',express.static('assets'));
app.use('/img',express.static('images'));
var webpackMiddleware = require("webpack-dev-middleware");
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

app.use(webpackMiddleware(webpack(webpackConfig),{
  // publicPath is required, whereas all other options are optional

  noInfo: true,
  // display no info to console (only warnings and errors)

  quiet: true,
  // display nothing to the console

  lazy: false,
  // switch into lazy mode
  // that means no watching, but recompilation on every request

  watchOptions: {
    aggregateTimeout: 300,
    poll: true
  },
  // watch options (only lazy: false)

  publicPath: "/",
  // public path to bind the middleware to
  // use the same as in webpack

  index: "index.html",
  // the index path for web server

  headers: { "X-Custom-Header": "yes" },
  // custom headers

  stats: {
    colors: true
  },
  // options for formating the statistics

  reporter: null,
  // Provide a custom reporter to change the way how logs are shown.

  serverSideRender: false
  // Turn off the server-side rendering mode. See Server-Side Rendering part for more info.
}));

require('./controller/serverInit.js')(app,sessionParser,sessionStore);
/**
 *
 */

var multiparty = require('connect-multiparty');
var path = require('path');
var fs = require('fs-promise');
var multipartMiddleware = multiparty({uploadDir:config.upload.tmp});
var md5 = require('md5');
var md5file = require('md5-file');
app.post('/upload',multipartMiddleware,function(req,res){
  console.log(req.body, req.files);
  console.log(md5file.sync(req.files.file.path))
  if(req.body['_chunkNumber'] == 0){
    console.log(md5file.sync(req.files.file.path))
    fs.readFile(req.files.file.path).then(function(data){
      var array = [].slice.call(data)
      console.log('test'+md5(array));
    });
  }
  /*fs.rename(req.files.file.path,path.join(config.upload.tmp,'./test.jpg'+req.body._chunkNumber))
      .then(function(){
        res.json({code:0})
      }).catch(function(err){
      console.log(err);
  });*/
});
app.get('/ttt',function(req,res){
  var stream = fs.createReadStream(path.join(__dirname,'./tmp/test.jpg0'));
  stream.pipe(res);
  stream = fs.createReadStream(path.join(__dirname,'./tmp/test.jpg1'));
  stream.pipe(res);
});

require('./routes/handler.js')(app);
require('./controller/errorController.js')(app);
console.log("Init ok...");
