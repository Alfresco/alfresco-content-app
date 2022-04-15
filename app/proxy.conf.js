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
        'logLevel': 'debug',
        onProxyReq: function(request) {
          if(request["method"] !== "GET")
          request.setHeader("origin", APP_CONFIG_ECM_HOST);
        },
        // workaround for REPO-2260
        onProxyRes: function (proxyRes) {
          const header = proxyRes.headers['www-authenticate'];
          if (header && header.startsWith('Basic')) {
              proxyRes.headers['www-authenticate'] = 'x' + header;
          }
      }
    }
};
