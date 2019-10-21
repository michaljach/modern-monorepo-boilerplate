/* eslint-disable */
const path = require('path');
const fs = require('fs');
const { override, babelInclude } = require('customize-cra');

module.exports = (config, env) => {
  return Object.assign(
    config,
    override(
      /* Makes sure Babel compiles the stuff in the common folder */
      babelInclude([
        path.resolve('src'),
        fs.realpathSync('../components/src'), // THIS
      ]),
    )(config, env),
  );
};
