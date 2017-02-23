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
  maxAge:'2592000000',
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
require('./controller/api.js')(app);
require('./controller/service.js')(app);
require('./controller/fileUpload.js')(app);
require('./routes/handler.js')(app);
require('./controller/errorController.js')(app);
console.log("Init ok...");
