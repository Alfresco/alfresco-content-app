// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular/cli'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular/cli/plugins/karma')
    ],
    files: [
        { pattern: './node_modules/hammerjs/hammer.js', watched: false },
        { pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css', watched: false },
        { pattern: './node_modules/ng2-alfresco-*/bundles/assets/ng2-alfresco-*/i18n/en.json', watched: false, served: true, included: false },
    ],
    proxies: {
        '/assets/ng2-alfresco-core/i18n/en.json': '/base/node_modules/ng2-alfresco-core/bundles/assets/ng2-alfresco-core/i18n/en.json',
        '/assets/ng2-alfresco-datatable/i18n/en.json': '/base/node_modules/ng2-alfresco-datatable/bundles/assets/ng2-alfresco-datatable/i18n/en.json',
        '/assets/ng2-alfresco-documentlist/i18n/en.json': '/base/node_modules/ng2-alfresco-documentlist/bundles/assets/ng2-alfresco-documentlist/i18n/en.json',
        '/assets/ng2-alfresco-login/i18n/en.json': '/base/node_modules/ng2-alfresco-login/bundles/assets/ng2-alfresco-login/i18n/en.json',
        '/assets/ng2-alfresco-upload/i18n/en.json': '/base/node_modules/ng2-alfresco-upload/bundles/assets/ng2-alfresco-upload/i18n/en.json',
        '/assets/ng2-alfresco-search/i18n/en.json': '/base/node_modules/ng2-alfresco-search/bundles/assets/ng2-alfresco-search/i18n/en.json'
    },
    client:{
      clearContext: false // leave Jasmine Spec Runner output visible in browser
    },
    coverageIstanbulReporter: {
      reports: [ 'html', 'lcovonly' ],
      fixWebpackSourcePaths: true
    },
    angularCli: {
      environment: 'dev'
    },
    reporters: ['progress', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    customLaunchers: {
      ChromeNoSandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox']
      }
    },
    singleRun: false,

    captureTimeout: 180000,
    browserDisconnectTimeout: 180000,
    browserDisconnectTolerance: 3,
    browserNoActivityTimeout: 300000
  });
};
