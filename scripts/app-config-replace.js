#!/usr/bin/env node

const program = require('commander');
require('dotenv').config({ path: process.env.ENV_FILE });
const fs = require('fs');

const API_HOST = process.env.API_HOST || 'api';
const OAUTH_HOST = process.env.OAUTH_HOST || 'keycloak';

const options = {
  apiHost: {
    flags: '-a, --api-host',
    description: "set apiHost's and ecmHost's value with API_HOST",
    set: appConfig => {
      appConfig.ecmHost = API_HOST;
      appConfig.aosHost = API_HOST + '/alfresco/aos';
    }
  },
  oauthHost: {
    flags: '-o, --oauth-host',
    description: "set oauth2.host's value with OAUTH_HOST",
    set: appConfig => {
      appConfig.authType = 'OAUTH';
      appConfig.oauth2.host = OAUTH_HOST;
    }
  }
};

program
  .version('0.0.1')
  .requiredOption(
    '-c, --config <path>',
    'path to the app.config.json to reset its values with env vars'
  );

Object.keys(options).forEach(option => {
  program.option(options[option].flags, options[option].description);
});

program.parse(process.argv);

fs.readFile(program.config, (err, appConfigString) => {
  if (err) throw err;
  let appConfig = JSON.parse(appConfigString);

  Object.keys(options).forEach(option => {
    if (program[option]) {
      options[option].set(appConfig);
    }
  });

  let appConfigReplacedJson = JSON.stringify(appConfig);
  fs.writeFileSync(program.config, appConfigReplacedJson);
});
