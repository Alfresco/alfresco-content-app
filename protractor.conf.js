// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const CDP = require('chrome-remote-interface');

const projectRoot = path.resolve(__dirname);
const downloadFolder = `${projectRoot}/e2e-downloads`;

const width = 1366;
const height = 768;

var fs = require('fs');

function rmDir(dirPath) {
  try {
    var files = fs.readdirSync(dirPath);
  } catch (e) {
    return;
  }
  if (files.length > 0)
    for (var i = 0; i < files.length; i++) {
      var filePath = dirPath + '/' + files[i];
      if (fs.statSync(filePath).isFile()) fs.unlinkSync(filePath);
      else rmDir(filePath);
    }
  fs.rmdirSync(dirPath);
}

exports.config = {
  allScriptsTimeout: 50000,

  params: {
    downloadFolder: downloadFolder
  },

  specs: [
    './e2e/suites/authentication/*.test.ts',
    './e2e/suites/list-views/*.test.ts',
    './e2e/suites/application/*.test.ts',
    './e2e/suites/navigation/*.test.ts',
    './e2e/suites/pagination/*.test.ts',
    './e2e/suites/search/*.test.ts',
    './e2e/suites/actions/*.test.ts',
    './e2e/suites/viewer/*.test.ts',
    './e2e/suites/info-drawer/*.test.ts',
    './e2e/suites/extensions/*.test.ts'
  ],

  SELENIUM_PROMISE_MANAGER: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      prefs: {
        credentials_enable_service: false,
        download: {
          prompt_for_download: false,
          default_directory: downloadFolder
        }
      },
      args: [
        '--incognito',
        '--headless',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-sandbox'
      ]
    }
  },

  directConnect: true,

  // baseUrl: 'http://localhost:4000',
  getPageTimeout: 50000,

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000,
    print: function() {}
  },

  plugins: [
    {
      package: 'protractor-screenshoter-plugin',
      screenshotPath: `${projectRoot}/e2e-output/report`,
      screenshotOnExpect: 'failure',
      screenshotOnSpec: 'none',
      withLogs: true,
      writeReportFreq: 'end',
      imageToAscii: 'none',
      htmlOnExpect: 'none',
      htmlOnSpec: 'none',
      clearFoldersBeforeTest: true
    }
  ],

  onPrepare() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });

    browser
      .manage()
      .window()
      .setSize(width, height);

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: true,
          displayDuration: true
        }
      })
    );

    jasmine.getEnv().addReporter(
      new jasmineReporters.JUnitXmlReporter({
        consolidateAll: true,
        savePath: `${projectRoot}/e2e-output/junit-report`,
        filePrefix: 'results.xml',
        useDotNotation: false,
        useFullTestName: false,
        reportFailedUrl: true
      })
    );

    rmDir(downloadFolder);

    CDP()
      .then(client => {
        client.send('Page.setDownloadBehavior', {
          behavior: 'allow',
          downloadPath: downloadFolder
        });
      })
      .catch(err => {
        console.log(err);
      });
  }
};
