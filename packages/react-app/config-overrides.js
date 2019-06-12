const { override } = require('customize-cra');

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
};