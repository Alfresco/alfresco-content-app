const { BASE_URL } = process.env;
console.log('Using backend URL: ' + (BASE_URL || 'unknown'));

module.exports = {
  '/alfresco': {
    target: BASE_URL,
    secure: false,
    pathRewrite: {
      '^/alfresco/alfresco': ''
    },
    changeOrigin: true,
    onProxyReq: (request) => {
      if (request['method'] !== 'GET') {
        request.setHeader('origin', BASE_URL);
      }
    }
  }
};
