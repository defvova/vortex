import path from 'path'
import validate from 'webpack-validator'
import webpack from 'webpack'
import postcssFocus from 'postcss-focus'
import precss from 'precss'
import postcssUrl from 'postcss-url'
import postcssSimpleVars from 'postcss-simple-vars'
import postcssFontpath from 'postcss-fontpath'
import nodeExternals from 'webpack-node-externals'
import combineLoaders from 'webpack-combine-loaders'
import atImport from 'postcss-import'
import { dependencies as externals } from './package.json'

const isProduction = process.env.NODE_ENV === 'production'

export default validate({
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.(woff2|woff)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: combineLoaders([{
        loader: 'url-loader',
        query: {
          limit: 10000,
          mimetype: 'application/font-woff'
        }
      }])
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.(?:ico|gif|png|jpg|jpeg|webp)$/,
      loader: 'url-loader'
    }]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.js', '.jsx', '.json'],
    packageMains: ['webpack', 'browser', 'web', 'browserify', ['jam', 'main'], 'main']
  },
  plugins: [
    new webpack.DefinePlugin({ 'global.GENTLY': false }),
    new webpack.BannerPlugin(
      'require("source-map-support").install();',
      { raw: true, entryOnly: false }
    )
  ],
  node: {
    __dirname: true
  },
  postcss: () => {
    return [
      atImport({
        addDependencyTo: webpack,
        path: ['node_modules']
      }),
      postcssFontpath,
      postcssUrl,
      postcssFocus,
      precss,
      postcssSimpleVars
    ]
  },
  externals: isProduction ? [nodeExternals({ whitelist: Object.keys(externals || {}) })] : []
})
