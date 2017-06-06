const webpackConfig = require('./webpack.config')
delete webpackConfig.entry
delete webpackConfig.output

const __WATCH__ = process.env.KARMA_WATCH

module.exports = (config)=> {
  config.set({
    files: [
      {
        pattern: 'test/**/*.spec.js', watched: false
      },
      'test/**/*.html'
    ],
    exclude: [
    ],
    preprocessors: {
      'test/**/*.js': ['webpack'],
      'test/**/*.html': ['html2js']
    },
    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    frameworks: ['mocha', 'fixture', 'sinon', 'power-assert'],
    reporters: ['mocha', 'coverage'],
    coverageReporter: {
      type: 'lcov',
      dir: './app/coverage',
      subdir: 'report',
      file : './app/coverage/report/lcov.info'
    },
    browsers: ['Chrome'],
    customLaunchers: {
      Chrome_travis_ci: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--disable-gpu',
          '--headless'
        ]
      }
    },
    captureTimeout: 60000
  })
  if(__WATCH__) {
    config.coverageReporter = {
      type: 'text-summary'
    }
  }
  if(process.env.TRAVIS){
    config.browsers = ['Chrome_travis_ci']
  }
}
