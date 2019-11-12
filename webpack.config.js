/* Constants */
const isChild = Boolean(module.parent);
const env = process.env.NODE_ENV || 'development';

/* Dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = isChild
    // In case file used as a module, return config builder function
    ? configBuilder
    // Otherwise return config object
    : configBuilder(env);



function configBuilder(mode = 'development') {
    // Base configuration object
    const config = {
        mode: mode,
        devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
        entry: './src/porter.ts',
        output: {
            path: path.resolve(__dirname, 'dist'),
            filename: 'porter.js'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: './src/index.ejs',
                templateParameters: {
                    'title': 'Porter Test Page',
                    'testvar': 'Test works',
                },
                favicon: './src/favicon.ico',
            }),
        ],
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    use: 'ts-loader',
                    exclude: '/node_modules/'
                },
            ],
        },
        resolve: {
            extensions: ['.ts', '.js']
        },
    };
    return config;
}
