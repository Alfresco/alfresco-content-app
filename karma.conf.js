// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const { join } = require('path');
const { constants } = require('karma');

module.exports = () => {
  return {
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-mocha-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    files: [
      {
        pattern: './node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
        watched: false,
        served: true,
        included: false
      },
      {
        pattern: './node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json',
        watched: false,
        served: true,
        included: false
      }
    ],
    proxies: {
      '/assets/adf-core/i18n/en-GB.json': '/base/node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
      '/assets/adf-core/i18n/en.json': '/base/node_modules/@alfresco/adf-core/bundles/assets/adf-core/i18n/en.json',
      '/assets/adf-content-services/i18n/en.json':
        '/base/node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json',
      '/assets/adf-content-services/i18n/en-GB.json':
        '/base/node_modules/@alfresco/adf-content-services/bundles/assets/adf-content-services/i18n/en.json'
    },
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
      },
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    jasmineHtmlReporter: {
      suppressAll: true // removes the duplicated traces
    },

    coverageReporter: {
      dir: join(__dirname, './coverage'),
      subdir: '.',
      reporters: [{ type: 'html' }, { type: 'text-summary' }, { type: 'text-summary', subdir: '.', file: 'summary.txt' }],
      check: {
        global: {
          statements: 75,
          branches: 65,
          functions: 69,
          lines: 74
        }
      }
    },

    reporters: ['mocha', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: constants.LOG_INFO,
    autoWatch: true,
    browsers: ['ChromeHeadless'],
    customLaunchers: {
      ChromeHeadless: {
        base: 'Chrome',
        flags: ['--no-sandbox', '--headless', '--disable-gpu', '--remote-debugging-port=9222']
      }
    },
    singleRun: true,
    restartOnFileChange: true,
    // workaround for alfresco-js-api builds
    webpack: { node: { fs: 'empty' } }
  };
};
