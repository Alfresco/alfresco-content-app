const path = require('path');
module.exports = {
  extends: ['../../.eslintrc.json', '../../.eslintrc.e2e.json'],
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: [path.join(__dirname, 'tsconfig.lib.json'), path.join(__dirname, 'tsconfig.spec.json')],
        createDefaultProgram: true
      },
      rules: {
        'no-console': ['error', {'allow': ['info', 'log', 'warn', 'error'] }],
        'playwright/no-raw-locators': 'off'
      }
    },
    {
      files: ['*.js'],
      rules: {
        '@typescript-eslint/no-floating-promises': 'off',
        '@typescript-eslint/no-misused-promises': 'off'
      }
    }
  ]
};
