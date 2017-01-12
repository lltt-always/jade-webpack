var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var publicPath = 'http://localhost:8880/';
var config = require('./config.js');
var glob = require('glob');


var files = glob.sync("./resources/js/*.js")
var entrys = {};
var pages = [];
files.forEach(function(val){
  var name = val.slice(15, -3);
  pages.push(name);
  entrys[name] = [val, hotMiddlewareScript];
})

var webpackConfig = {
  entry: entrys,
  /*{
    bundle: ['./main.js', hotMiddlewareScript]
  },*/
  output: {
    path: path.resolve(__dirname, 'static'),
    publicPath: publicPath,
    filename: 'js/[name].[hash:7].js',
  },
  module: {
    loaders: [
      { test: /\.jade$/, loader: 'jade' },
      {
        test: /\.scss$/,
        loaders: ["style-loader", "css-loader", "sass-loader"]
      }/*,
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
          publicPath: 'static'
        }
      }*/
    ]
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.optimize.CommonsChunkPlugin('common.js', pages)
    /*,
    new HtmlWebpackPlugin({
      filename: 'detail.html',
      template: './resources/tpl/detail.jade',
    }),
    new HtmlWebpackPlugin({
      filename: 'cheap.html',
      template: './resources/tpl/detail_cheap.jade',
    })*/
    //使用循环方式new HtmlWebpackPlugin
  ]
};

module.exports = webpackConfig;

pages.forEach(function(pathname) {
  var conf = {
    filename: pathname + '.html',
    template: './resources/tpl/' + pathname + '.jade'
  };
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
})