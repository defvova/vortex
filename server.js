/* eslint no-console: 0 */

import express from 'express'
import webpack from 'webpack'
import compression from 'compression'
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'
import { spawn } from 'child_process'

import config from './webpack.config.development'
const argv = require('minimist')(process.argv.slice(2)),
      app = express(),
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
app.use(compression())

const server = app.listen(PORT, 'localhost', (err) => { // eslint-disable-line one-var
  if (err) {
    return console.error(err)
  }

  if (argv['start-hot']) {
    spawn('npm', ['run', 'start-hot'], { shell: true, env: process.env, stdio: 'inherit' }).
      on('close', code => process.exit(code)).
      on('error', spawnError => console.error(spawnError))
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
