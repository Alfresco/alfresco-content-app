require('@alfresco/adf-cli/tooling').dotenvConfig({ path: process.env.ENV_FILE });

const { BASE_URL } = process.env;

module.exports = {
    "/alfresco": {
        "target": BASE_URL,
        "secure": false,
        "pathRewrite": {
            "^/alfresco/alfresco": ""
        },
        "changeOrigin": true,
        'logLevel': 'debug',
        onProxyReq: function(request) {
          if(request["method"] !== "GET")
          request.setHeader("origin", BASE_URL);
        },
        // workaround for REPO-2260
        onProxyRes: function (proxyRes) {
          const header = proxyRes.headers['www-authenticate'];
          if (header?.startsWith('Basic')) {
              proxyRes.headers['www-authenticate'] = 'x' + header;
          }
      }
    }
};
