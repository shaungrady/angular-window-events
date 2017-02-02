const { resolve } = require('path')
const packageData = require(resolve(__dirname, '../package.json'))

module.exports = `// ${packageData.name} v${packageData.version} - ${packageData.homepage}`
