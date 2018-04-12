const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

let useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

const env = process.env.IONIC_ENV;

let baseAliases = {
  '@components': path.resolve('./src/components/'),
  '@providers': path.resolve('./src/providers/'),
  '@modals': path.resolve('./src/modals/'),
  '@directives': path.resolve('./src/directives/'),
  '@pipes': path.resolve('./src/pipes/'),
  '@root': path.resolve('./'),
};

useDefaultConfig[env].resolve.alias = baseAliases;

if (env === 'prod') {
  useDefaultConfig.prod.resolve.alias['@app/env'] = path.resolve(
    environmentPath('prod')
  );
}

if (env === 'dev') {
  useDefaultConfig.dev.resolve.alias['@app/env'] = path.resolve(
    environmentPath('dev')
  );
}

if (env !== 'prod' && env !== 'dev') {
  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias['@app/env'] = path.resolve(
    environmentPath(env)
  );
}

function environmentPath(env) {
  var filePath =
    './src/environments/environment' +
    (env === 'prod' ? '' : '.' + env) +
    '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

module.exports = function() {
  return useDefaultConfig;
};
