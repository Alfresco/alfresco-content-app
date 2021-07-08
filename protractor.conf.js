// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

require('dotenv').config({path: process.env.ENV_FILE});
const path = require('path');
const {SpecReporter} = require('jasmine-spec-reporter');
const retry = require('protractor-retry-angular-cli').retry;
const {saveScreenshots} = require('./e2e/e2e-config/utils/upload-output');
const smartRunnerFactory = require('./e2e/smartrunner-factory');
const argv = require('yargs').argv;

const projectRoot = path.resolve(__dirname);
const downloadFolder = path.join(__dirname, 'e2e-downloads');
const screenshotsFolder = path.resolve(__dirname, 'e2e-output');
const e2eFolder = path.resolve(projectRoot, 'e2e');
const E2E_HOST = process.env.E2E_HOST || 'http://localhost:4200';
const BROWSER_RUN = !!process.env.BROWSER_RUN;
const width = 1366;
const height = 768;

const SAVE_SCREENSHOT = process.env.SAVE_SCREENSHOT === 'true';
const APP_CONFIG_ECM_HOST = process.env.APP_CONFIG_ECM_HOST || 'http://localhost:8080';
const MAXINSTANCES = process.env.MAXINSTANCES || 1;
const E2E_LOG_LEVEL = process.env.E2E_LOG_LEVEL || 'ERROR';


const appConfig = {
  hostEcm: APP_CONFIG_ECM_HOST,
  providers: 'ECM',
  authType: 'BASIC'
};

exports.config = {
  allScriptsTimeout: 150000,

  params: {
    index_search: 25000,
    config: appConfig,
    downloadFolder: downloadFolder,
    ADMIN_USERNAME: process.env.ADMIN_EMAIL || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    e2eRootPath: e2eFolder,
    testConfig: {
      appConfig: {
        log: E2E_LOG_LEVEL
      }
    }
  },

  specs: [
    './e2e/suites/actions/**/**/*test.ts',
    './e2e/suites/actions-available/**/**/*test.ts',
    './e2e/suites/application/**/*test.ts',
    './e2e/suites/authentication/**/*test.ts',
    './e2e/suites/extensions/**/*test.ts',
    './e2e/suites/info-drawer/**/*test.ts',
    './e2e/suites/list-views/**/*test.ts',
    './e2e/suites/navigation/**/*test.ts',
    './e2e/suites/pagination/**/*test.ts',
    './e2e/suites/search/**/*test.ts',
    './e2e/suites/viewer/**/*test.ts'
  ],

  suites: {
    copyMoveActions: './e2e/suites/actions/copy-move/**/**/*test.ts',
    createActions: './e2e/suites/actions/create/**/**/*test.ts',
    deleteActions: './e2e/suites/actions/delete/**/**/*test.ts',
    editActions: './e2e/suites/actions/edit/**/**/*test.ts',
    favoriteActions: './e2e/suites/actions/favorite/**/**/*test.ts',
    libraryActions: './e2e/suites/actions/library/**/**/*test.ts',
    shareActions: './e2e/suites/actions/share/**/**/*test.ts',
    uploadDownloadActions: './e2e/suites/actions/upload-download/**/**/*test.ts',

    actionsAvailableFilesFolders: './e2e/suites/actions-available/files-folders/**/**/*test.ts',
    actionsAvailableLibraries: './e2e/suites/actions-available/libraries/**/**/*test.ts',
    actionsAvailableSpecialPermissions: './e2e/suites/actions-available/special-permissions/**/**/*test.ts',
    actionsAvailableNewMenu: './e2e/suites/actions-available/new-menu/**/**/*test.ts',

    application: './e2e/suites/application/**/*test.ts',
    authentication: './e2e/suites/authentication/**/*test.ts',
    extensions: './e2e/suites/extensions/**/*test.ts',
    infoDrawer: './e2e/suites/info-drawer/**/*test.ts',
    listViews: './e2e/suites/list-views/**/*test.ts',
    navigation: './e2e/suites/navigation/**/*test.ts',
    pagination: './e2e/suites/pagination/**/*test.ts',
    search: './e2e/suites/search/**/*test.ts',
    viewer: './e2e/suites/viewer/**/*test.ts'
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
    ...(process.env.CI ? smartRunnerFactory.applyExclusionFilter() : {})
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
      smartRunnerFactory.getInstance().onPrepare();
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
      console.log(`Status code is ${statusCode}, trying to save screenshots.`);

      let retryCount = 1;
      if (argv.retry) {
        retryCount = ++argv.retry;
      }

      try {
        await saveScreenshots(retryCount, (process.env.FOLDER || ''));
        console.log('Screenshots saved successfully.');
      } catch (e) {
        console.log('Error happened while trying to upload screenshots and test reports: ', e);
      }
    } else {
      console.log(`Status code is ${statusCode}, no need to save screenshots.`);
    }

    if (process.env.CI) {
      return retry.afterLaunch(process.env.RETRY_COUNT || 4, statusCode);
    }
  }
};
