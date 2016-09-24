if (process.env.NODE_ENV === 'production') {
  require('electron-cookies')
  const ua = require('universal-analytics')

  window.settings = {}
  window.settings.appVersion = '0.10.0'
  window.settings.visitor = ua('UA-60364279-2')
}
