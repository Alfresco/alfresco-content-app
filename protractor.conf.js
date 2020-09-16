// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const { SpecReporter } = require('jasmine-spec-reporter');
const fs = require('fs');
const resolve = require('path').resolve;
const logger = require('./tools/helpers/logger');
const retry = require('protractor-retry-angular-cli').retry;
const { uploadScreenshot } = require('./e2e/e2e-config/utils/upload-output');

require('dotenv').config({ path: process.env.ENV_FILE });

const SmartRunner = require('protractor-smartrunner');
const projectRoot = path.resolve(__dirname);
const downloadFolder = path.join(__dirname, 'e2e-downloads');
const screenshotsFolder = path.resolve(__dirname, 'e2e-output')
const e2eFolder = path.resolve(projectRoot, 'e2e');
const E2E_HOST = process.env.E2E_HOST || 'http://localhost:4200';
const BROWSER_RUN = process.env.BROWSER_RUN;
const width = 1920;
const height = 1080;

const SAVE_SCREENSHOT = process.env.SAVE_SCREENSHOT === 'true';
const API_CONTENT_HOST = process.env.API_CONTENT_HOST || 'http://localhost:8080';
const MAXINSTANCES = process.env.MAXINSTANCES || 1;
const MAX_RETRIES = process.env.MAX_RETRIES || 1;

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
  allScriptsTimeout: 150000,

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

    loggingPrefs: {
      browser: 'ALL' // "OFF", "SEVERE", "WARNING", "INFO", "CONFIG", "FINE", "FINER", "FINEST", "ALL".
    },

    browserName: 'chrome',

    maxInstances: MAXINSTANCES,

    shardTestFiles: MAXINSTANCES > 1,

    chromeOptions: {
      prefs: {
        'credentials_enable_service': false,
        'download': {
          'prompt_for_download': false,
          'directory_upgrade': true,
          'default_directory': downloadFolder
        },
        'browser': {
          'setDownloadBehavior': {
            'behavior': 'allow',
            'downloadPath': downloadFolder
          }
        }
      },
      args: [
        '--incognito',
        `--window-size=${width},${height}`,
        '--disable-gpu',
        '--no-sandbox',
        '--disable-web-security',
        '--disable-browser-side-navigation',
        ...(BROWSER_RUN === true ? [] : ['--headless'])
      ]
    }
  },

  directConnect: true,

  baseUrl: E2E_HOST,

  getPageTimeout: 150000,

  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 150000,
    includeStackTrace: true,
    print: function () {
    },
    ...SmartRunner.withOptionalExclusions(resolve(__dirname, './e2e/protractor.excludes.json')),
  },

  plugins: [{
    package: 'protractor-screenshoter-plugin',
    screenshotPath: screenshotsFolder,
    screenshotOnExpect: 'failure',
    screenshotOnSpec: 'none',
    withLogs: true,
    writeReportFreq: 'end',
    imageToAscii: 'none',
    htmlOnExpect: 'none',
    htmlOnSpec: 'none',
    clearFoldersBeforeTest: true
  }],

  onCleanUp(results) {
    if (process.env.CI) {
      retry.onCleanUp(results);
    }
  },

  onPrepare() {
    if (process.env.CI) {
      retry.onPrepare();
      const repoHash = process.env.GIT_HASH || '';
      const outputDirectory = process.env.SMART_RUNNER_DIRECTORY;
      logger.info(`SmartRunner's repoHash : "${repoHash}"`);
      logger.info(`SmartRunner's outputDirectory: "${outputDirectory}"`);
      SmartRunner.apply({ outputDirectory, repoHash });
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

    if (process.env.CI) {
      browser.driver.manage().window().maximize();
    } else {
      browser.driver.manage().window().setSize(width, height);
    }

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

  afterLaunch: async function () {
    if (SAVE_SCREENSHOT) {
      console.log(`Save screenshot is ${SAVE_SCREENSHOT}, trying to save screenshots.`);

      try {
        await uploadScreenshot(1, 'ACA');
        console.log('Screenshots saved successfully.');
      } catch (e) {
        console.log('Error happened while trying to upload screenshots and test reports: ', e);
      }
    } else {
      console.log(`Save screenshot is ${SAVE_SCREENSHOT}, no need to save screenshots.`);
    }
    if (process.env.CI) {
      return retry.afterLaunch(MAX_RETRIES);
    }
  }
};
