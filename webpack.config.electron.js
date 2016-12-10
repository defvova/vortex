import webpack from 'webpack'
import merge from 'webpack-merge'
import validate from 'webpack-validator'
import CleanWebpackPlugin from 'clean-webpack-plugin'
import baseConfig from './webpack.config.base'

export default validate(merge(baseConfig, {
  devtool: 'source-map',

  entry: [
    'babel-polyfill',
    './src/main'
  ],

  output: {
    filename: 'main.js'
  },

  plugins: [
    new CleanWebpackPlugin(['dist', 'release'], {
      root: __dirname,
      verbose: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  target: 'electron-main',

  node: {
    __dirname: false,
    __filename: false
  }
}))
