require('dotenv').config();

const API_CONTENT_HOST = process.env.API_CONTENT_HOST || 'http://0.0.0.0:8080';

module.exports = {
  '/alfresco': {
    target: API_CONTENT_HOST,
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
    target: API_CONTENT_HOST,
    secure: false,
    changeOrigin: true
  }
};
