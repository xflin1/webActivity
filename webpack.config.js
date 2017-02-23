var webpack = require('webpack');
var Ex = require("extract-text-webpack-plugin");
var UglifyJsPlugin = require('uglify-js-plugin');
var path = require('path');
var fs = require('fs');
var root = './src/pages/';
var entry = {

};
var dirObj = fs.readdirSync(root);

dirObj.forEach(function (d) {
    entry[d] = path.resolve(root+d+'/main.js');
});
module.exports = {
    entry:entry,
    output:{
        path:path.resolve('./build/pages'),
        filename:'[name]/index.bundle.js',
        publicPath:'/'
    },
    module:{
        loaders : [
            {test:/\.css$/, loader: Ex.extract("style-loader", "css-loader")},
            {test: /\.scss$/, loader: Ex.extract("style-loader", "css-loader",'sass-loader')},
            {test: require.resolve('jquery'), loader: 'expose?jQuery!expose?$'},
            {test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=./asset/woff/[hash].[ext]&limit=10000&mimetype=application/font-woff'},
            {test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=./asset/ttf/[hash].[ext]&limit=10000&mimetype=application/octet-stream'},
            {test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, loader: 'file?name=./asset/eot/[hash].[ext]'},
            {test: /\.jade$/, loader: 'file?name=[name]/[name].[ext]'},
            {test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, loader: 'url-loader?name=./asset/svg/[hash].[ext]&limit=10000&mimetype=image/svg+xml'},
            {test:/.(png)|(jpg)$/, loader: "url?name=./asset/png/[hash].[ext]&limit=50000"}
        ]
    },
     plugins: [
         new Ex("[name]/style.css")/*,
         new UglifyJsPlugin({
          compress: true, //default 'true', you can pass 'false' to disable this plugin
          debug: true //default 'false', it will display some information in console
          }),
         new webpack.optimize.UglifyJsPlugin({
             compress: {
                 warnings: false
             }
         })*/

     ],
    resolve:{
        root:[
            path.resolve('./config'),
            path.resolve('./src')
        ]
    }
};

