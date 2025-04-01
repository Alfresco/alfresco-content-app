// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html
const { join } = require('path');
const getBaseKarmaConfig = require('../../karma.conf');

module.exports = function (config) {
  const baseConfig = getBaseKarmaConfig();
  config.set({
    ...baseConfig,
    coverageReporter: {
      ...baseConfig.coverageReporter,
      dir: join(__dirname, '../../coverage/aca-content'),
    },
    files: [
      '../../node_modules/katex/dist/katex.min.js',
      '../../node_modules/katex/dist/contrib/auto-render.min.js',
      '../../node_modules/katex/dist/katex.min.css',
      '../../node_modules/mermaid/dist/mermaid.min.js'
    ]
  });
};
