import webpack from 'webpack'
import validate from 'webpack-validator'
import merge from 'webpack-merge'
import formatter from 'eslint-formatter-pretty'
import baseConfig from './webpack.config.base'
import DashboardPlugin from 'webpack-dashboard/plugin'

const port = process.env.PORT || 3000

export default validate(merge(baseConfig, {
  debug: true,

  devtool: 'inline-source-map',

  entry: [
    `webpack-hot-middleware/client?path=http://localhost:${port}/__webpack_hmr`,
    'babel-polyfill',
    './src/index'
  ],

  module: {
    loaders: [{
      test: /\.scss|\.css$/,
      loader: 'style!css!sass!postcss'
    }]
  },

  output: {
    publicPath: `http://localhost:${port}/dist/`
  },

  eslint: {
    formatter
  },

  plugins: [
    new DashboardPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    })
  ],

  target: 'electron-renderer'
}))
