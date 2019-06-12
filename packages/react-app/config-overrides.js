const { override } = require('customize-cra');
const fs = require('fs');
const proxy = require('http-proxy-middleware');
const errorOverlayMiddleware = require('react-dev-utils/errorOverlayMiddleware');
const evalSourceMapMiddleware = require('react-dev-utils/evalSourceMapMiddleware');
const noopServiceWorkerMiddleware = require('react-dev-utils/noopServiceWorkerMiddleware');

const certs = {
  cert: fs.readFileSync('./certs/localhost.cer'),
  key: fs.readFileSync('./certs/localhost.key'),
};

const protocol = process.env.HTTPS === 'true' ? 'https' : 'http';
const host = process.env.HOST || '0.0.0.0';

const prod = process.argv.includes('--prod');
const uat = process.argv.includes('--uat');

let url = 'https://net.ig.com';

if (uat) {
  url = 'https://web.ig.com';
} else if (prod) {
  url = 'https://www.ig.com';
}

function onProxyRes(proxyRes) {
  proxyRes.headers['Access-Control-Allow-Origin'] = '*';
}

const proxySetup = function (app) {
  app.use(proxy('/*/myig/api/**', {
    changeOrigin: true,
    onProxyRes,
    secure: false,
    target: url,
  }));

  app.use(proxy('/static-content-bootstrap/**', {
    changeOrigin: true,
    secure: false,
    target: url,
  }));

  app.use(proxy('/*/myig/ast/**', {
    changeOrigin: true,
    onProxyRes,
    secure: false,
    target: url,
  }));
};


// override
module.exports = {
  webpack: override(
    (config) => {
      // This is HMR config, I spent 3 days to discover this and fix CRA dynamic TS imports
      delete config.module.rules[1].include;
      config.module.rules[1].exclude = /node_modules/;
      delete config.module.rules[2].oneOf[1].include;
      config.module.rules[2].oneOf[1].exclude = /node_modules/;
      return config;
    },
  ),

  jest: config => {
    return config;
  },

  devServer: configFunction => (proxy, allowedHost) => {
    const config = configFunction(proxy, allowedHost);
    config.host = host;
    config.https = protocol === 'https' ? certs : false,
    config.before = (app, server) => {
      proxySetup(app);

      // This lets us fetch source contents from webpack for the error overlay
      app.use(evalSourceMapMiddleware(server));
      // This lets us open files from the runtime error overlay.
      app.use(errorOverlayMiddleware());

      // This service worker file is effectively a 'no-op' that will reset any
      // previous service worker registered for the same host:port combination.
      // We do this in development to avoid hitting the production cache if
      // it used the same host and port.
      // https://github.com/facebook/create-react-app/issues/2272#issuecomment-302832432
      app.use(noopServiceWorkerMiddleware());
    };
    return config;
  },

  paths: (paths, env) => {
    return paths;
  }
};