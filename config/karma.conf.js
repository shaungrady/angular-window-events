const { resolve } = require('path')

const preprocessors = {}
preprocessors[resolve(__dirname, '../src/index.js')] = ['webpack', 'sourcemap']
preprocessors[resolve(__dirname, '../test/index.js')] = ['webpack', 'sourcemap']

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      resolve(__dirname, '../node_modules/angular/angular.js'),
      resolve(__dirname, '../node_modules/angular-mocks/angular-mocks.js'),
      resolve(__dirname, '../src/index.js'),
      resolve(__dirname, '../test/*.js')
    ],
    exclude: [],

    preprocessors,

    webpack: {
      externals: {
        angular: 'angular'
      },
      module: {
        rules: [{
          test: /\.js$/,
          include: resolve(__dirname, '../src'),
          enforce: 'pre',
          use: ['babel-loader'],
          exclude: /node_modules/
        }, {
          test: /\.js$/,
          include: resolve(__dirname, '../src'),
          exclude: /node_modules/,
          enforce: 'post',
          loader: 'istanbul-instrumenter-loader'
        }]
      },
      devtool: 'inline-source-map'
    },
    webpackMiddleware: {
      stats: 'minimal'
    },

    ngHtml2JsPreprocessor: {
      moduleName: 'templates'
    },

    reporters: ['progress', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: resolve(__dirname, '../coverage/')
    },

    port: 9876,
    colors: true,
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,
    autoWatch: true,
    autoWatchBatchDelay: 1000,
    browsers: ['PhantomJS'],
    singleRun: true,
    concurrency: Infinity
  })
}
