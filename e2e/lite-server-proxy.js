let fallback = require('connect-history-api-fallback');
require('@alfresco/adf-cli/tooling').dotenvConfig();
var proxyMiddleware = require('http-proxy-middleware');

function getProxy(contentHost) {
  return {
      '/alfresco': {
          target: contentHost,
          secure: false,
          changeOrigin: true,
          // workaround for REPO-2260
          onProxyRes: function (proxyRes, req, res) {
              const header = proxyRes.headers['www-authenticate'];
              if (header && header.startsWith('Basic')) {
                  proxyRes.headers['www-authenticate'] = 'x' + header;
              }
          },
      }
  }
}

function getMiddleWares() {
  var counter = 0;
  const proxies = {
      ...getProxy(process.env.APP_CONFIG_ECM_HOST),
  };
  const appMiddlewares = Object.keys(proxies).reduce((accumulator, proxyName) => {
      counter++;
      return {
          ...accumulator,
          [counter]: proxyMiddleware(proxyName, proxies[proxyName]),
      }
  }, {});
  counter++;

  return {
      ...appMiddlewares,
      [counter]: fallback({ index: '/index.html', verbose: true }),
  };
}
module.exports = {
  injectChanges: false, // workaround for Angular 2 styleUrls loading
  files: ['./**/*.{html,htm,css,js}'],
  watchOptions: {
    ignoreInitial: true,
    ignored: '*'
  },
  ghostMode: false,
  port: 4200,
  open: false,
  server: {
    middleware: getMiddleWares(),
  }
};