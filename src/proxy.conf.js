require('dotenv').config();

const API_HOST_CONTENT =
  process.env.API_HOST_CONTENT || 'http://adfdev.envalfresco.com';

module.exports = {
  '/alfresco': {
    target: API_HOST_CONTENT,
    secure: false,
    changeOrigin: true,
    // workaround for REPO-2260
    onProxyRes: function(proxyRes, req, res) {
      const header = proxyRes.headers['www-authenticate'];
      if (header && header.startsWith('Basic')) {
        proxyRes.headers['www-authenticate'] = 'x' + header;
      }
    }
  },
  '/auth': {
    target: API_HOST_CONTENT,
    secure: false,
    changeOrigin: true
  }
};
