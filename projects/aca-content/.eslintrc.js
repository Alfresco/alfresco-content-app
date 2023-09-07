const path = require('path');
module.exports = {
  extends: '../../.eslintrc.json',
  ignorePatterns: ['!**/*'],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: [path.join(__dirname, 'tsconfig.lib.json'), path.join(__dirname, 'tsconfig.spec.json')],
        createDefaultProgram: true
      },
      rules: {}
    }
  ]
};
