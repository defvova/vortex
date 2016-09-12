/* eslint strict: 0, no-shadow: 0, no-unused-vars: 0, no-console: 0 */
'use strict'

require('babel-polyfill')
const os = require('os'),
      webpack = require('webpack'),
      electronCfg = require('./webpack.config.electron'),
      cfg = require('./webpack.config.production'),
      packager = require('electron-packager'),
      del = require('del'),
      exec = require('child_process').exec,
      argv = require('minimist')(process.argv.slice(2)),
      pkg = require('./package.json'),
      deps = Object.keys(pkg.dependencies),
      devDeps = Object.keys(pkg.devDependencies),
      appName = argv.name || argv.n || pkg.productName,
      shouldUseAsar = argv.asar || argv.a || false,
      shouldBuildAll = argv.all || false,
      DEFAULT_OPTS = {
        dir: './',
        name: appName,
        asar: shouldUseAsar,
        ignore: [
          '^/test($|/)',
          '^/release($|/)',
          '^/main.development.js'
        ].concat(devDeps.map((name) => `/node_modules/${name}($|/)`)).
        concat(
          deps.filter((name) => !electronCfg.externals.includes(name)).
          map((name) => `/node_modules/${name}($|/)`)
        )
      },
      icon = argv.icon || argv.i || 'app/app',
      version = argv.version || argv.v

if (icon) {
  DEFAULT_OPTS.icon = icon
}

if (version) {
  DEFAULT_OPTS.version = version
  startPack()
} else {
  // use the same version as the currently-installed electron-prebuilt
  exec('npm list electron --dev', (err, stdout) => {
    if (err) {
      DEFAULT_OPTS.version = '1.2.0'
    } else {
      DEFAULT_OPTS.version = stdout.split('electron@')[1].replace(/\s/g, '')
    }

    startPack()
  })
}

function build(cfg) {
  return new Promise((resolve, reject) => {
    webpack(cfg, (err, stats) => {
      if (err) {
        return reject(err)
      }
      resolve(stats)
    })
  })
}

async function startPack() {
  console.log('start pack...')

  try {
    await build(electronCfg)
    await build(cfg)
    const paths = await del('release')

    if (shouldBuildAll) {
      // build for all platforms
      const archs = ['ia32', 'x64'],
            platforms = ['linux', 'win32', 'darwin']

      platforms.forEach((plat) => {
        archs.forEach((arch) => {
          pack(plat, arch, log(plat, arch))
        })
      })
    } else {
      // build for current platform only
      pack(os.platform(), os.arch(), log(os.platform(), os.arch()))
    }
  } catch (error) {
    console.error(error)
  }
}

function pack(plat, arch, cb) {
  // there is no darwin ia32 electron
  if (plat === 'darwin' && arch === 'ia32') {
    return
  }

  const iconObj = {
          icon: DEFAULT_OPTS.icon + (() => {
            let extension = '.png'

            if (plat === 'darwin') {
              extension = '.icns'
            } else if (plat === 'win32') {
              extension = '.ico'
            }
            return extension
          })()
        },
        opts = Object.assign({}, DEFAULT_OPTS, iconObj, {
          platform: plat,
          arch,
          prune: true,
          'app-version': pkg.version || DEFAULT_OPTS.version,
          out: `release/${plat}-${arch}`
        })

  packager(opts, cb)
}

function log(plat, arch) {
  return (err, filepath) => {
    if (err) {
      return console.error(err)
    }
    console.log(`${plat}-${arch} finished!`)
  }
}
