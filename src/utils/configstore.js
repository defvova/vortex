const Configstore = require('configstore'),
      pkg = require('../../package.json')

module.exports = new Configstore(pkg.name)
