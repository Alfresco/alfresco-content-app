// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
// process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      {
        pattern:
          './node_modules/@angular/material/prebuilt-themes/indigo-pink.css',
        watched: false
      },
      {
        pattern:
          './node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
        watched: false,
        served: true,
        included: false
      },
      {
        pattern:
          './node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json',
        watched: false,
        served: true,
        included: false
      }
    ],
    proxies: {
      '/assets/adf-core/i18n/en-GB.json':
        '/base/node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
      '/assets/adf-core/i18n/en.json':
        '/base/node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
      '/assets/adf-content-services/i18n/en.json':
        '/base/node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json',
      '/assets/adf-content-services/i18n/en-GB.json':
        '/base/node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json'
    },
    client: {
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, 'coverage'),
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true
    },

    reporters: ['mocha', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          // '--headless',
          '--disable-gpu',
          '--remote-debugging-port=9222'
        ]
      }
    },
    singleRun: true,

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000,

    // workaround for alfresco-js-api builds
    webpack: { node: { fs: 'empty' } }
  });
};
