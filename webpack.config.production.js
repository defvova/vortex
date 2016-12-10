import webpack from 'webpack'
import validate from 'webpack-validator'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import purify from 'purifycss-webpack-plugin'
import merge from 'webpack-merge'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import baseConfig from './webpack.config.base'
import { productName } from './package.json'

export default validate(merge(baseConfig, {
  devtool: 'cheap-module-source-map',
  entry: [
    'babel-polyfill',
    './src/index'
  ],
  module: {
    loaders: [{
      test: /\.scss|\.css$/,
      loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader!postcss-loader')
    }]
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.OccurrenceOrderPlugin(true),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      beautify: false,
      comments: false,
      compress: {
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        warnings: false,
        drop_console: true,
        unsafe: true,
        dead_code: true,
        screw_ie8: true,
        conditionals: true,
        if_return: true,
        join_vars: true
      }
    }),
    new webpack.optimize.LimitChunkCountPlugin({ maxChunks: 15 }),
    new webpack.optimize.MinChunkSizePlugin({ minChunkSize: 10000 }),
    new webpack.optimize.CommonsChunkPlugin({
      children: true,
      async: true
    }),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.css', { allChunks: true }),
    new purify({
      basePath: __dirname,
      purifyOptions: {
        info: true,
        minify: true
      }
    }),
    new HtmlWebpackPlugin({
      title: productName,
      filename: 'app.html',
      template: 'src/app.template.ejs'
    })
  ],
  target: 'electron-renderer'
}))
