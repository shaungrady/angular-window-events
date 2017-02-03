const { resolve } = require('path')
const webpack = require('webpack')
const config = require(resolve(__dirname, 'webpack.config.browser.js'))
const banner = require(resolve(__dirname, 'banner-min.js'))

// Modify plugins for minification
config.output.filename = 'angular-window-events.min.js'
config.devtool = 'source-map'
config.plugins = [
  new webpack.optimize.UglifyJsPlugin({ sourceMap: true }),
  new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
]

module.exports = config
