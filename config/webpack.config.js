const { resolve } = require('path')
const webpack = require('webpack')

// Banner
const bannerTemplate = require(resolve(__dirname, 'banner.js'))
const banner = bannerTemplate.replace('<module_format>', 'CommonJS')

// Export config
module.exports = {
  entry: resolve(__dirname, '../src/'),
  output: {
    path: resolve(__dirname, '../lib'),
    filename: 'index.js',
    library: 'window-events',
    libraryTarget: 'commonjs2'
  },
  module: {
    rules: [{
      test: /\.js$/,
      use: ['babel-loader'],
      exclude: /node_modules/
    }]
  },
  plugins: [
    new webpack.BannerPlugin({ banner, raw: true, entryOnly: true })
  ],
  target: 'web',
  externals: {
    angular: 'angular'
  },
  node: {
    process: false,
    Buffer: false,
    setImmediate: false
  }
}
