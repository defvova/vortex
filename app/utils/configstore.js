import Configstore from 'configstore'
import pkg from '../../package.json'

module.exports = new Configstore(pkg.name)
