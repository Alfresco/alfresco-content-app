module.exports = {
  '/alfresco': {
    target: 'http://0.0.0.0:8080',
    secure: false,
    changeOrigin: true,
    // workaround for REPO-2260
    onProxyRes: function(proxyRes, req, res) {
      const header = proxyRes.headers['www-authenticate'];
      if (header && header.startsWith('Basic')) {
        proxyRes.headers['www-authenticate'] = 'x' + header;
      }
    }
  }
};
