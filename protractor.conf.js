// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');

const projectRoot = path.resolve(__dirname);

exports.config = {
  allScriptsTimeout: 11000,
  specs: [
    './e2e/**/*.test.ts'
  ],
  capabilities: {
    'browserName': 'chrome',
    chromeOptions: {
        prefs: {
            'credentials_enable_service': false
        }
    }
  },
  directConnect: true,
  baseUrl: 'http://localhost:3000',
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000,
    print: function() {}
  },
  plugins: [{
      package: 'jasmine2-protractor-utils',
      disableHTMLReport: false,
      disableScreenshot: false,
      screenshotOnExpectFailure: true,
      screenshotOnSpecFailure: false,
      clearFoldersBeforeTest: true,
      htmlReportDir: `${projectRoot}/e2e-output/html-report/`,
      screenshotPath: `${projectRoot}/e2e-output/screenshots/`
  }],
  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));

    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: `${projectRoot}/e2e-output/junit-report`,
        filePrefix: 'junit.xml',
        useDotNotation: false,
        useFullTestName: false,
        reportFailedUrl: true
    }));
  }
};
