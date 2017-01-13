var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var publicPath = './';
var config = require('./config.js');
var glob = require("glob");

var webpackConfig = {
  entry: {
    detail: './main.js'
  },
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
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules!sass-loader'),
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

var pages = entries('./resources/tpl/*.debug.jade');//config.pages;

function entries (globPath, tree) {
    var files = glob.sync(globPath);
    var entries = {page:[]}, entry, dirname, basename;

    for (var i = 0; i < files.length; i++) {
        entry = files[i];
        //dirname = path.dirname(entry);//获取路径中的目录名
        basename = path.basename(entry, '.jade');//获取路径中文件名,后缀是可选的，如果加，请使用'.ext'方式来匹配，则返回值中不包括后缀名
        projectName = basename;
        entries.page.push(basename);
    }
    return entries;
};

for(var j = 0; j < pages.page.length; j++){
  var conf = {
    filename: path.basename(pages.page[j], '.debug') + '.html',
    template: './resources/tpl/' + pages.page[j] + '.jade'
  };
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
};

/*var pages = config.pages;
pages.forEach(function(pathname) {
  var conf = {
    filename: pathname + '.html',
    template: './resources/tpl/' + pathname + '.jade'
  };
  webpackConfig.plugins.push(new HtmlWebpackPlugin(conf))
})*/