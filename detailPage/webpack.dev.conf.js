var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var webpack = require('webpack');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';
var publicPath = 'http://localhost:8880';

module.exports = {
  entry: {
    detail: ['./main.js', hotMiddlewareScript]
  },
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
/*      favicon: 'favicon.ico',*/
      template: './resources/tpl/detail.jade',
      title: 'Jade demo'
    })
  ]
};