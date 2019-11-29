// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const jasmineReporters = require('jasmine-reporters');
const CDP = require('chrome-remote-interface');
const fs = require('fs');

const projectRoot = path.resolve(__dirname);
const downloadFolder = `${projectRoot}/e2e-downloads`;

const width = 1366;
const height = 768;

const REPO_API_HOST = process.env.REPO_API_HOST || 'http://localhost:8080';

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

const appConfig = {
  ecmHost: REPO_API_HOST,
  providers: 'ECM',
  authType: 'BASIC'
};

exports.config = {
  allScriptsTimeout: 50000,

  params: {
    config: appConfig,
    downloadFolder: downloadFolder
  },

  specs: [
    './e2e/suites/authentication/*.test.ts',
    './e2e/suites/list-views/*.test.ts',
    './e2e/suites/application/*.test.ts',
    './e2e/suites/navigation/*.test.ts',
    './e2e/suites/pagination/*.test.ts',
    './e2e/suites/search/*.test.ts',
    './e2e/suites/actions-available/**/*.test.ts',
    './e2e/suites/actions/*.test.ts',
    './e2e/suites/viewer/*.test.ts',
    './e2e/suites/info-drawer/*.test.ts',
    './e2e/suites/extensions/*.test.ts'
  ],

  suites: {
    authentication: './e2e/suites/authentication/*.test.ts',
    listViews: './e2e/suites/list-views/*.test.ts',
    application: './e2e/suites/application/*.test.ts',
    navigation: './e2e/suites/navigation/*.test.ts',
    pagination: './e2e/suites/pagination/*.test.ts',
    search: './e2e/suites/search/*.test.ts',
    actionsAvailable: './e2e/suites/actions-available/**/*.test.ts',
    addRemoveContent: [
      './e2e/suites/actions/new-menu.test.ts',
      './e2e/suites/actions/create-folder.test.ts',
      './e2e/suites/actions/create-library.test.ts',
      './e2e/suites/actions/upload-file.test.ts',
      './e2e/suites/actions/upload-new-version.test.ts',
      './e2e/suites/actions/delete-undo-delete.test.ts',
      './e2e/suites/actions/permanently-delete.test.ts',
      './e2e/suites/actions/restore.test.ts',
      './e2e/suites/actions/download.test.ts'
    ],
    manageContent: [
      './e2e/suites/actions/copy.test.ts',
      './e2e/suites/actions/move.test.ts',
      './e2e/suites/actions/library-actions.test.ts',
      './e2e/suites/actions/edit-folder.test.ts',
      './e2e/suites/actions/edit-offline.test.ts'
    ],
    sharingContent: [
      './e2e/suites/actions/mark-favorite.test.ts',
      './e2e/suites/actions/share-file.test.ts',
      './e2e/suites/actions/unshare-file-search-results.test.ts',
      './e2e/suites/actions/unshare-file.test.ts'
    ],
    viewer: './e2e/suites/viewer/*.test.ts',
    infoDrawer: './e2e/suites/info-drawer/*.test.ts',
    extensions: './e2e/suites/extensions/*.test.ts'
  },

  SELENIUM_PROMISE_MANAGER: false,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      binary: require('puppeteer').executablePath(),
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

  // baseUrl: 'http://localhost:8080',
  getPageTimeout: 50000,

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
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
