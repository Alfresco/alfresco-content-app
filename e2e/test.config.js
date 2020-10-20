/**
 * Contains the default app deployment settings
 * @class config.test.config
 */

require('dotenv').config({path: process.env.ENV_FILE});

const HOST = process.env.E2E_HOST;

const LOG = process.env.LOG;

const API_CONTENT_HOST = process.env.API_CONTENT_HOST || 'api';
const API_PROCESS_HOST = process.env.API_PROCESS_HOST || 'api';
const OAUTH_HOST = process.env.OAUTH_HOST || 'keycloak';
const IDENTITY_HOST = process.env.IDENTITY_HOST || 'identity-host-default-replaced-value';
const PROVIDER = process.env.PROVIDER || 'ECM';

const AUTH_TYPE = process.env.AUTH_TYPE ? process.env.AUTH_TYPE : 'BASIC';

const OAUTH_CLIENT_ID = process.env.OAUTH_CLIENDID || 'alfresco';

const REDIRECT_URI = process.env.REDIRECT_URI || "/";
const REDIRECT_URI_LOGOUT = process.env.REDIRECT_URI_LOGOUT || "/logout";

const EXTERNAL_ACS_HOST = process.env.EXTERNAL_ACS_HOST;
const LOG_LEVEL = process.env.LOG_LEVEL || 'ERROR';

const appConfig = {
    "log": LOG_LEVEL,
    "ecmHost": API_CONTENT_HOST,
    "bpmHost": API_PROCESS_HOST,
    "identityHost": `${IDENTITY_HOST}/auth/admin/realms/alfresco`,
    "provider": PROVIDER,
    "authType": AUTH_TYPE,
    "oauth2": {
        "host": `${OAUTH_HOST}/auth/realms/alfresco`,
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

module.exports = {

    projectName: 'ACA',

    appConfig: appConfig,

    log: LOG,

    main: {
        rootPath: __dirname
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
