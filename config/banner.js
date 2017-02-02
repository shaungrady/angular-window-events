const { resolve } = require('path')
const packageData = require(resolve(__dirname, '../package.json'))

module.exports = `/**
 * ${packageData.name} v${packageData.version}
 * ${packageData.author}, ${new Date().getFullYear()}
 * ${packageData.homepage}
 * Module Format: <module_format>
 * License: ${packageData.license}
 */\n`
