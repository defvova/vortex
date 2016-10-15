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
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        screw_ie8: true,
        warnings: false
      }
    }),
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
