/* Constants */
const isChild = Boolean(module.parent);
const env = process.env.NODE_ENV || 'development';
const argv = process.argv;
const isOpen = argv.includes('--open');
const isDevServer = argv.includes('--dev-server');

/* Dependencies */
const { log, logError } = require('./porter-logger.js');
const webpackConfigBuilder = require('./webpack.config.js');
const server = require('./server.js');
const openPage = require('./open-page.js');
const Webpack = require('webpack');
const DevServer = require('webpack-dev-server');


const webpackConfig = webpackConfigBuilder(env);
const webpackCompiler = Webpack(webpackConfig);

if (env !== 'production' && isDevServer) {
    launcher = runDevServer;
} else {
    launcher = build;
}

if (isChild) {
    module.exports = () => launcher(webpackCompiler, webpackConfig);
} else {
    launcher(webpackCompiler, webpackConfig);
}


/* Run webpack dev server */
function runDevServer(compiler, config) {
    const port = '8080';
    const host = '127.0.0.1';
    const url = `http://${host}:${port}`;
    const successMessage = `Dev server started successfully at ${url}`;
    const server = new DevServer(compiler, config.devServer);

    return new Promise((resolve) => {
        server.listen(port, host, () => {
            log(successMessage);
            isOpen && openPage(url);
            resolve();
        });
    });
}
/* Build */
function build(compiler) {
    const successMessage = `Webpack has finished compilation successfully!`;
    const errorMessage = `Webpack has failed compilation. Something went wrong...`;

    return new Promise((resolve, reject) => {
        compiler.run((err, stats) => {
            const error = err || stats.hasErrors();

            if (error) {
                logError(errorMessage);
                return reject();
            }
            log(successMessage);
            isOpen && server(env, true);
            resolve();
        });
    });
}
