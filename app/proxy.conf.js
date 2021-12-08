require('@alfresco/adf-cli/tooling').dotenvConfig({ path: process.env.ENV_FILE });

const APP_CONFIG_ECM_HOST = process.env.APP_CONFIG_ECM_HOST;

module.exports = {
    "/alfresco": {
        "target": APP_CONFIG_ECM_HOST,
        "secure": false,
        "pathRewrite": {
            "^/alfresco/alfresco": ""
        },
        "changeOrigin": true,
        'logLevel': 'debug'
    }
};
