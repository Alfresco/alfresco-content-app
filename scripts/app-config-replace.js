#!/usr/bin/env node

const program = require('commander');
require('dotenv').config({ path: process.env.ENV_FILE });
const fs = require('fs');

const APP_CONFIG_ECM_HOST = process.env.APP_CONFIG_ECM_HOST;
const APP_CONFIG_BPM_HOST = process.env.APP_CONFIG_BPM_HOST;
const APP_CONFIG_OAUTH2_HOST = process.env.APP_CONFIG_OAUTH2_HOST || 'oauth-host-default-replaced-value';
const APP_CONFIG_IDENTITY_HOST = process.env.APP_CONFIG_IDENTITY_HOST || 'identity-host-default-replaced-value';
const APP_CONFIG_NOTIFICATION_LAST = parseInt(process.env.APP_CONFIG_NOTIFICATION_LAST, 10) || 2000;
const APP_CONFIG_PLUGIN_AOS = process.env.APP_CONFIG_PLUGIN_AOS || true;

const options = {
  apiHost: {
    flags: '-a, --api-host',
    description:
      'set bpmHost=APP_CONFIG_BPM_HOST, ecmHost=APP_CONFIG_ECM_HOST, aosHost = APP_CONFIG_ECM_HOST if present',
    set: (appConfig) => {
      appConfig.bpmHost = APP_CONFIG_BPM_HOST;
      appConfig.ecmHost = APP_CONFIG_ECM_HOST;
      appConfig.baseShareUrl = appConfig.baseShareUrl.replace('{protocol}//{hostname}{:port}', APP_CONFIG_ECM_HOST);
      appConfig.aosHost = appConfig.aosHost.replace('{protocol}//{hostname}{:port}', APP_CONFIG_ECM_HOST);
    }
  },
  identityHost: {
    flags: '-i, --identity-host',
    description: "set identityHost's value with APP_CONFIG_IDENTITY_HOST",
    set: (appConfig) => {
      appConfig.authType = 'OAUTH';
      appConfig.identityHost = APP_CONFIG_IDENTITY_HOST;
    }
  },
  oauthHost: {
    flags: '-o, --oauth-host',
    description: "set oauth2.host's value with APP_CONFIG_OAUTH2_HOST",
    set: (appConfig) => {
      appConfig.authType = 'OAUTH';
      appConfig.oauth2.host = APP_CONFIG_OAUTH2_HOST;
    }
  },
  notification: {
    flags: '-n, --notification',
    description: "set notificationDefaultDuration's value with <duration> and switch on showNotificationHistory",
    set: (appConfig) => {
      appConfig.showNotificationHistory = true;
      appConfig.notificationDefaultDuration = APP_CONFIG_NOTIFICATION_LAST;
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
