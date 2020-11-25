// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const path = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const fs = require('fs');
const resolve = require('path').resolve;
const logger = require('./tools/helpers/logger');
const retry = require('protractor-retry-angular-cli').retry;
const {uploadScreenshot} = require('./e2e/e2e-config/utils/upload-output');

require('dotenv').config({path: process.env.ENV_FILE});

const SmartRunner = require('protractor-smartrunner');
const projectRoot = path.resolve(__dirname);
const downloadFolder = path.join(__dirname, 'e2e-downloads');
const screenshotsFolder = path.resolve(__dirname, 'e2e-output');
const e2eFolder = path.resolve(projectRoot, 'e2e');
const E2E_HOST = process.env.E2E_HOST || 'http://localhost:4200';
const BROWSER_RUN = !!process.env.BROWSER_RUN;
const width = 1366;
const height = 768;

const SAVE_SCREENSHOT = process.env.SAVE_SCREENSHOT === 'true';
const API_CONTENT_HOST = process.env.API_CONTENT_HOST || 'http://localhost:8080';
const MAXINSTANCES = process.env.MAXINSTANCES || 1;
const MAX_RETRIES = process.env.MAX_RETRIES || 1;

const appConfig = {
  hostEcm: API_CONTENT_HOST,
  providers: 'ECM',
  authType: 'BASIC'
};

exports.config = {
  allScriptsTimeout: 150000,

  params: {
    index_search: 15000,
    config: appConfig,
    downloadFolder: downloadFolder,
    ADMIN_USERNAME: process.env.ADMIN_EMAIL || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    e2eRootPath: e2eFolder
  },

  specs: [
    './e2e/suites/authentication/**/*test.ts',
    './e2e/suites/list-views/**/*test.ts',
    './e2e/suites/application/**/*test.ts',
    './e2e/suites/navigation/**/*test.ts',
    './e2e/suites/pagination/**/*test.ts',
    './e2e/suites/search/**/*test.ts',
    './e2e/suites/actions-available/**/**/*test.ts',
    './e2e/suites/actions/**/**/*test.ts',
    './e2e/suites/viewer/**/*test.ts',
    './e2e/suites/info-drawer/**/*test.ts',
    './e2e/suites/extensions/**/*test.ts'
  ],

  suites: {
    authentication: './e2e/suites/authentication/**/*test.ts',
    listViews: './e2e/suites/list-views/**/*test.ts',
    application: './e2e/suites/application/**/*test.ts',
    navigation: './e2e/suites/navigation/**/*test.ts',
    pagination: './e2e/suites/pagination/**/*test.ts',
    search: './e2e/suites/search/**/*test.ts',

    actionsAvailableFileFolder: './e2e/suites/actions-available/files-folders/**/**/*test.ts',
    actionsAvailableLibraries: './e2e/suites/actions-available/libraries/**/**/*test.ts',
    actionsAvailableSpecialPermissions: './e2e/suites/actions-available/special-permissions/**/**/*test.ts',

    actions: './e2e/suites/actions/**/*test.ts',
    createActions: './e2e/suites/create-actions/**/*test.ts',
    share: './e2e/suites/share/**/*test.ts',
    viewer: './e2e/suites/viewer/**/*test.ts',
    infoDrawer: './e2e/suites/info-drawer/**/*test.ts',
    extensions: './e2e/suites/extensions/**/*test.ts',
    favorite: './e2e/suites/favorite/**/*test.ts',
    delete: './e2e/suites/delete/**/*test.ts',
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
        credentials_enable_service: false,
        download: {
          prompt_for_download: false,
          directory_upgrade: true,
          default_directory: downloadFolder
        },
        browser: {
          setDownloadBehavior: {
            behavior: 'allow',
            downloadPath: downloadFolder
          }
        }
      },
      args: [
        `--window-size=${width},${height}`,
        '--disable-gpu',
        '--no-sandbox',
        '--disable-web-security',
        '--disable-browser-side-navigation',
        '--allow-running-insecure-content',
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
    defaultTimeoutInterval: 200000,
    includeStackTrace: true,
    print: function () {
    },
    ...SmartRunner.withOptionalExclusions(resolve(__dirname, './e2e/protractor.excludes.json'))
  },

  plugins: [
    {
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
    }
  ],

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
      SmartRunner.apply({outputDirectory, repoHash});
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

    browser.manage().window().setSize(width, height);

    jasmine.getEnv().addReporter(
      new SpecReporter({
        spec: {
          displayStacktrace: 'raw',
          displayDuration: true
        }
      })
    );

    browser.driver.sendChromiumCommand('Page.setDownloadBehavior', {
      behavior: 'allow',
      downloadPath: downloadFolder
    });
  },

  afterLaunch: async function (statusCode) {
    if (SAVE_SCREENSHOT && statusCode !== 0) {
      console.log(`Save screenshot is ${SAVE_SCREENSHOT}, trying to save screenshots.`);

      try {
        await uploadScreenshot(1);
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
