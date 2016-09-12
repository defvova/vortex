/* eslint no-console: 0 */

import express from 'express'
import webpack from 'webpack'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

import config from './webpack.config.development'

const app = express(),
      compiler = webpack(config),
      PORT = process.env.PORT || 3000,
      wdm = webpackDevMiddleware(compiler, {
        publicPath: config.output.publicPath,
        stats: {
          colors: true
        }
      })

app.use(wdm)
app.use(webpackHotMiddleware(compiler))

const server = app.listen(PORT, 'localhost', (err) => { // eslint-disable-line one-var
  if (err) {
    console.error(err)
    return
  }

  console.log(`Listening at http://localhost:${PORT}`)
})

process.on('SIGTERM', () => {
  console.log('Stopping dev server')
  wdm.close()
  server.close(() => {
    process.exit(0)
  })
})
