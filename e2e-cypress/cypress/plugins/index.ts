// Since Cypress 4.4.0, there is better TypeScript out of the box support to have TypeScript files in the cypress folder
// Our new plugins index file can also be TypeScript without using a webpack preprocessor

// ...import plugin task functions

/**
 * @type {Cypress.PluginConfig}
 */
export default (on: Cypress.PluginEvents, config: Cypress.PluginConfigOptions) => {
  // No more webpack preprocessor here for TS support! Yay!

  on('task', {
    // Define task functions
  });

  return config;
};
