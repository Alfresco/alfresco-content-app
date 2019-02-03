module.exports = {
  globalSetup: './config/setup.js',
  globalTeardown: './config/teardown.js',
  testEnvironment: './config/puppeteer_environment.js',
  rootDir: './tests',

  preset: 'ts-jest',

  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  }
};
