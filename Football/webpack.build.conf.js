var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var publicPath = './';
var config = require('./config.js')
var glob = require('glob');


var files = glob.sync("./resources/js/*.js")
var entrys = {};
files.forEach(function(val){
  var name = val.slice(15, -3);
  entrys[name] = val;
})


var webpackConfig = {
  entry: entrys,
  /*{
    detail: './main.js'
  },*/
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: publicPath,
    filename: 'js/[name].[hash:7].js',
    chunkFilename: 'js/[name].[chunkhash:7].js'
  },
  module: {
    loaders: [
      { 
        test: /\.jade$/, 
        loader: 'jade-loader',
        query: {
          pretty: true //不压缩html文件
        }
      },
      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
      }/*,
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url',
        query: {
          limit: 100,
          name: 'img/[name].[hash:7].[ext]',
          publicPath: 'static'
        }
      }*/
    ]
  },
  devtool: '#eval-source-map',
  sassLoader: {
    includePaths: [path.resolve(__dirname, "./dist/css")]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        drop_debugger: true,
        drop_console: false
      }
    }),
    new webpack.optimize.OccurenceOrderPlugin(), //通过计算模块次数来分配模块
    new webpack.HotModuleReplacementPlugin(),
/*    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './resources/tpl/detail.jade',
      title: 'Jade demo',
      minify: false //不压缩html文件
    }),*/
    new ExtractTextPlugin('css/custom.[hash:7].css')
  ]
};

module.exports = webpackConfig

var pages = config.pages;
pages.forEach(function(pathname) {
  var conf = {
    filename: pathname + '.html',
    template: './resources/tpl/' + pathname + '.jade',
    minify: false
  };
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
})