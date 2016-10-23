import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import purify from 'purifycss-webpack-plugin'
import merge from 'webpack-merge'
import baseConfig from './webpack.config.base'
import CleanWebpackPlugin from 'clean-webpack-plugin'

const config = merge(baseConfig, {
  devtool: 'cheap-module-source-map',

  entry: [
    'babel-polyfill',
    './app/index'
  ],

  output: {
    publicPath: '../dist/'
  },

  module: {
    loaders: [
      {
        test: /\.global\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader!postcss-loader',
          'sass'
        )
      },

      {
        test: /^((?!\.global).)*\.scss$/,
        loader: ExtractTextPlugin.extract(
          'style-loader',
          'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader',
          'sass'
        )
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['dist', 'release'], {
      root: __dirname,
      verbose: true
    }),
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
    new ExtractTextPlugin('[name].css', { allChunks: true }),
    new purify({
      basePath: __dirname,
      purifyOptions: {
        info: true,
        minify: true
      }
    })
  ],

  target: 'electron-renderer'
})

export default config
