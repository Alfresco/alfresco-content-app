module.exports = {
  globalSetup: './config/setup.js',
  globalTeardown: './config/teardown.js',
  testEnvironment: './config/puppeteer_environment.js',

  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testRegex: '(/specs/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  rootDir: './tests'
};
