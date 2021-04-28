require('dotenv').config();

const APP_CONFIG_ECM_HOST = process.env.APP_CONFIG_ECM_HOST || 'http://0.0.0.0:8080';

module.exports = {
  '/alfresco': {
    target: APP_CONFIG_ECM_HOST,
    secure: false,
    changeOrigin: true,
    // workaround for REPO-2260
    onProxyRes: function (proxyRes) {
      const header = proxyRes.headers['www-authenticate'];
      if (header && header.startsWith('Basic')) {
        proxyRes.headers['www-authenticate'] = 'x' + header;
      }
    }
  },
  '/auth': {
    target: APP_CONFIG_ECM_HOST,
    secure: false,
    changeOrigin: true
  }
};
