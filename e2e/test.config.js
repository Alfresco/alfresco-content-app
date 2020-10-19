/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.E2E_HOST;

const LOG = process.env.LOG;

const HOST_ECM = process.env.PROXY_HOST_ADF || HOST || 'ecm';
const HOST_BPM = process.env.PROXY_HOST_ADF || HOST || 'bpm';

const AUTH_TYPE = process.env.AUTH_TYPE ? process.env.AUTH_TYPE : 'BASIC';

const HOST_SSO = process.env.HOST_SSO || process.env.PROXY_HOST_ADF || HOST || 'oauth';
const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || 'alfresco';

const REDIRECT_URI = process.env.REDIRECT_URI || "/";
const REDIRECT_URI_LOGOUT = process.env.REDIRECT_URI_LOGOUT || "/logout";

const EXTERNAL_ACS_HOST = process.env.EXTERNAL_ACS_HOST;
const LOG_LEVEL = process.env.LOG_LEVEL || 'ERROR';

const appConfig = {
    "log": LOG_LEVEL,
    "ecmHost": HOST_ECM,
    "bpmHost": HOST_BPM,
    "identityHost": `${HOST_SSO}/auth/admin/realms/alfresco`,
    "provider": "ECM",
    "authType": AUTH_TYPE,
    "oauth2": {
        "host": `${HOST_SSO}/auth/realms/alfresco`,
        "clientId": OAUTH_CLIENT_ID,
        "scope": "openid",
        "secret": "",
        "implicitFlow": true,
        "silentLogin": true,
        "redirectUri": REDIRECT_URI,
        "redirectUriLogout": REDIRECT_URI_LOGOUT,
        "redirectSilentIframeUri": `${HOST}/assets/silent-refresh.html`,
        "publicUrls": [
            "**/logout",
            "**/preview/s/*",
            "**/settings"
        ]
    }
};

if (LOG) {
    console.log('======= test.config.js hostBPM ====== ');
    console.log('hostBPM : ' + HOST_ECM);
    console.log('hostECM : ' + HOST_BPM);
    console.log('HOST : ' + HOST);
    console.log('ADMIN : ' + ADMIN_USERNAME + ' PASSWORD_ADF : ' + ADMIN_PASSWORD);
    console.log('IDENTITY_ADMIN_EMAIL : ' + IDENTITY_USERNAME+ ' IDENTITY_ADMIN_PASSWORD : ' + IDENTITY_ADMIN_PASSWORD);
}

module.exports = {

    projectName: 'ACA',

    appConfig: appConfig,

    log: LOG,

    main: {
        rootPath: __dirname
    },

  admin: {
    email: process.env.ADMIN_USERNAME,
    password: process.env.ADMIN_PASSWORD
  },

    users: {
      admin: {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD
      },
      identityAdmin: {
        username: process.env.IDENTITY_ADMIN_USERNAME,
        password: process.env.IDENTITY_ADMIN_PASSWORD
      },
    },

    adf_external_acs: {
        /**
         * @config main.protocol {String}
         */
        host: EXTERNAL_ACS_HOST,
    },

    timeouts: {
        visible_timeout: 20000,
        no_visible_timeout: 20000,
        index_search: 25000
    }

};
