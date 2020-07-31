// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const afterLaunch = require('./e2e/e2e-config/hooks/after-launch');
const fs = require('fs');
const resolve = require('path').resolve;

require('dotenv').config({ path: process.env.ENV_FILE });

const SmartRunner = require('protractor-smartrunner');
const projectRoot = path.resolve(__dirname);
const downloadFolder = `${projectRoot}/e2e-downloads`;
const e2eFolder = path.resolve(projectRoot, 'e2e');
const E2E_HOST = process.env.E2E_HOST || 'http://localhost:4200';
const BROWSER_RUN = process.env.BROWSER_RUN;
const width = 1366;
const height = 768;

const API_CONTENT_HOST =
  process.env.API_CONTENT_HOST || 'http://localhost:8080';

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
  hostEcm: API_CONTENT_HOST,
  providers: 'ECM',
  authType: 'BASIC'
};

exports.config = {
  allScriptsTimeout: 50000,

  params: {
    config: appConfig,
    downloadFolder: downloadFolder,
    ADMIN_USERNAME: process.env.ADMIN_EMAIL || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    e2eRootPath: e2eFolder
  },

  specs: [
    './e2e/suites/authentication/*.test.ts',
    './e2e/suites/list-views/*.test.ts',
    './e2e/suites/application/*.test.ts',
    './e2e/suites/navigation/*.test.ts',
    './e2e/suites/pagination/*.test.ts',
    './e2e/suites/search/*.test.ts',
    './e2e/suites/actions-available/**/*.test.ts',
    './e2e/suites/actions/**/*.test.ts',
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
      './e2e/suites/actions/create-folder-from-template.test.ts',
      './e2e/suites/actions/create-library.test.ts',
      './e2e/suites/actions/create-file-from-template.test.ts',
      './e2e/suites/actions/upload-file.test.ts',
      './e2e/suites/actions/upload-new-version.test.ts',
      './e2e/suites/actions/delete-undo-delete.test.ts',
      './e2e/suites/actions/permanently-delete.test.ts',
      './e2e/suites/actions/restore.test.ts',
      './e2e/suites/actions/download.test.ts'
    ],
    manageContent: [
      './e2e/suites/actions/copy-move/*.test.ts',
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
      prefs: {
        credentials_enable_service: false,
        download: {
          prompt_for_download: false,
          default_directory: downloadFolder
        }
      },
      args: [
        '--incognito',
        ...(BROWSER_RUN === 'true' ? [] : ['--headless']),
        '--disable-web-security',
        '--remote-debugging-port=9222',
        '--disable-gpu',
        '--no-sandbox'
      ]
    }
  },

  directConnect: true,

  baseUrl: E2E_HOST,

  getPageTimeout: 50000,

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 100000,
    print: function() {},
    ...SmartRunner.withOptionalExclusions(
      resolve(__dirname, './e2e/protractor.excludes.json'),
    )
  },

  plugins: [
    {
      package: 'jasmine2-protractor-utils',
      disableScreenshot: false,
      screenshotOnExpectFailure: true,
      screenshotOnSpecFailure: false,
      clearFoldersBeforeTest: true,
      screenshotPath: path.resolve(__dirname, 'e2e-output/screenshots/')
    }
  ],

  onPrepare() {

    browser.baseUrl=E2E_HOST;
    if (process.env.CI) {
      SmartRunner.apply({repoHash: process.env.GIT_HASH || ''});
    }

    const tsConfigPath = path.resolve(e2eFolder, 'tsconfig.e2e.json');
    const tsConfig = require(tsConfigPath);

    require('ts-node').register({
      project: tsConfigPath,
      compilerOptions: {
        paths: tsConfig.compilerOptions.paths
      }
    });

    require('tsconfig-paths').register({
      project: tsConfigPath,
      baseUrl: e2eFolder,
      paths: tsConfig.compilerOptions.paths
    });

    browser
      .manage()
      .window()
      .setSize(width, height);

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: 'pretty',
          displayDuration: true
        }
      })
    );

    rmDir(downloadFolder);

    browser.driver.sendChromiumCommand('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadFolder
    });

  },
  afterLaunch
};
