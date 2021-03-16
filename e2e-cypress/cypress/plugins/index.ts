// Since Cypress 4.4.0, there is better TypeScript out of the box support to have TypeScript files in the cypress folder
// Our new plugins index file can also be TypeScript without using a webpack preprocessor

// ...import plugin task functions

/**
 * @type {Cypress.PluginConfig}
 */
// export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
//   // No more webpack preprocessor here for TS support! Yay!

//   on('task', {
//     // Define task functions
//   });

//   return config;
// };

require('dotenv').config({ path: __dirname + `/../../../.env` });

module.exports = (on, config) => {
  config.baseUrl = process.env.E2E_HOST || 'http://localhost:4200';

  config.env.params = {
    config: {
      hostEcm: process.env.API_CONTENT_HOST || 'http://localhost:8080',
      providers: 'ECM',
      authType: 'BASIC'
    },
    ADMIN_USERNAME: process.env.ADMIN_EMAIL || 'admin',
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin',
    e2eRootPath: './'
  };

  return config;
};
