/* Constants */
const isChild = Boolean(module.parent);
const env = process.env.NODE_ENV || 'development';
const { argv } = process;
const isOpen = argv.includes('--open');
const isDevServer = argv.includes('--dev-server');

/* Dependencies */
const Webpack = require('webpack');
const DevServer = require('webpack-dev-server');
const { log, logError } = require('./porter-logger.js');
const webpackConfigBuilder = require('./webpack.config.js');
const server = require('./server.js');
const openPage = require('./open-page.js');

/* Run webpack dev server */
const runDevServer = (compiler, config) => {
  const port = '8080';
  const host = '127.0.0.1';
  const url = `http://${host}:${port}`;
  const successMessage = `Dev server started successfully at ${url}`;
  const devServer = new DevServer(compiler, config.devServer);

  return new Promise((resolve) => {
    devServer.listen(port, host, () => {
      log(successMessage);

      if (isOpen) {
        openPage(url);
      }
      resolve();
    });
  });
};

/* Build */
const build = (compiler) => {
  const successMessage = 'Webpack has finished compilation successfully!';
  const errorMessage = 'Webpack has failed compilation. Something went wrong...';

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      const error = err || stats.hasErrors();

      if (error) {
        logError(errorMessage);
        reject();
        return;
      }
      log(successMessage);

      if (isOpen) {
        server(env, true);
      }
      resolve();
    });
  });
};
const webpackConfig = webpackConfigBuilder(env);
const webpackCompiler = Webpack(webpackConfig);
const launcher = env !== 'production' && isDevServer
  ? runDevServer
  : build;


if (isChild) {
  module.exports = () => launcher(webpackCompiler, webpackConfig);
} else {
  launcher(webpackCompiler, webpackConfig);
}
