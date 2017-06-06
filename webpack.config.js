const webpack = require('webpack')
const path = require('path')
const entries = require('./webpack.entries')
const WebpackNotifierPlugin = require('webpack-notifier');

const __DEV__  = process.env.NODE_ENV != 'production'
const __TEST__ = process.env.NODE_ENV === 'test'
const __PRD__  = process.env.NODE_ENV === 'production'

const webpackConfig = {
  devtool: __DEV__ ? 'inline-source-map' : false,
  entry: entries,
  resolve: {
    modules: [
      path.join(__dirname, "./src/js"),
      'node_modules'
    ]
  },
  output: {
    path: path.join(__dirname + '/app/js'),
    filename: '[name].js',
    publicPath: __DEV__ ? '/js/': ''
  },
  module: {
    exprContextCritical: false,
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ].concat(!__TEST__ && !__PRD__ ? [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        exclude: /node_modules/
      }
    ]:[])
  },
  plugins: (()=>{
    if(__PRD__){
      return [
        new webpack.DefinePlugin({
          'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
        }),
        new webpack.optimize.UglifyJsPlugin({minimize: true})
      ]
    } else {
      new WebpackNotifierPlugin()
    }
  })()
}

module.exports = webpackConfig
