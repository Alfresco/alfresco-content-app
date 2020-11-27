#!/usr/bin/env node

const program = require('commander');
require('dotenv').config({ path: process.env.ENV_FILE });
const fs = require('fs');

const API_HOST = process.env.API_HOST || null;
const API_CONTENT_HOST = process.env.API_CONTENT_HOST || API_HOST;
const API_PROCESS_HOST = process.env.API_PROCESS_HOST || API_HOST;
const API_AOS_HOST = process.env.API_AOS_HOST || API_HOST;
const OAUTH_HOST = process.env.OAUTH_HOST || 'oauth-host-default-replaced-value';
const IDENTITY_HOST = process.env.IDENTITY_HOST || 'identity-host-default-replaced-value';
const NOTIFICATION_LAST = parseInt(process.env.NOTIFICATION_LAST, 10) || 2000;

const options = {
  apiHost: {
    flags: '-a, --api-host',
    description:
      'set apiHost=API_HOST, bpmHost=API_PROCESS_HOST, ecmHost=API_CONTENT_HOST, aosHost = API_AOS_HOST if present or fall back to API_HOST in each case',
    set: (appConfig) => {
      appConfig.apiHost = API_HOST;
      appConfig.bpmHost = API_PROCESS_HOST;
      appConfig.ecmHost = API_CONTENT_HOST;
      appConfig.baseShareUrl = appConfig.baseShareUrl.replace('{protocol}//{hostname}{:port}', API_CONTENT_HOST);
      appConfig.aosHost = appConfig.aosHost.replace('{protocol}//{hostname}{:port}', API_AOS_HOST);
    }
  },
  identityHost: {
    flags: '-i, --identity-host',
    description: "set identityHost's value with IDENTITY_HOST",
    set: (appConfig) => {
      appConfig.authType = 'OAUTH';
      appConfig.identityHost = IDENTITY_HOST;
    }
  },
  oauthHost: {
    flags: '-o, --oauth-host',
    description: "set oauth2.host's value with OAUTH_HOST",
    set: (appConfig) => {
      appConfig.authType = 'OAUTH';
      appConfig.oauth2.host = OAUTH_HOST;
    }
  },
  notification: {
    flags: '-n, --notification',
    description: "set notificationDefaultDuration's value with <duration> and switch on showNotificationHistory",
    set: (appConfig) => {
      appConfig.showNotificationHistory = true;
      appConfig.notificationDefaultDuration = NOTIFICATION_LAST;
    }
  }
};

program.version('0.0.1').requiredOption('-c, --config <path>', 'path to the app.config.json to reset its values with env vars');

Object.keys(options).forEach((option) => {
  program.option(options[option].flags, options[option].description);
});

program.parse(process.argv);

fs.readFile(program.config, (err, appConfigString) => {
  if (err) {
    throw err;
  }

  const appConfig = JSON.parse(appConfigString);

  Object.keys(options).forEach((option) => {
    if (program[option]) {
      options[option].set(appConfig);
    }
  });

  const appConfigReplacedJson = JSON.stringify(appConfig, null, 4);
  fs.writeFileSync(program.config, appConfigReplacedJson);
});
