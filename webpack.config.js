/* Constants */
const isChild = Boolean(module.parent);
const env = process.env.NODE_ENV || 'development';
const dist = 'dist';

/* Dependencies */
const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');


function configBuilder(en = 'development') {
  let postfix = '';
  let mode = en;
  const entry = {
    porter: './src/porter.ts',
  };

  if (mode === 'test') {
    mode = 'production';
    postfix = '_test';
  } else {
    entry.index = './src/index.js';
  }
  // Base configuration object
  const config = {
    mode,
    entry,
    devtool: mode === 'development' ? 'inline-source-map' : 'source-map',
    output: {
      path: path.resolve(__dirname, dist),
      filename: `[name]${postfix}.js`,
      library: 'porter',
      libraryExport: 'default',
      libraryTarget: 'umd',
      globalObject: `(function() {
        if (typeof self !== 'undefined') {
          return self;
        } else if (typeof window !== 'undefined') {
          return window;
        } else if (typeof global !== 'undefined') {
          return global;
        } else {
          return Function('return this')();
        }
      }())`,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.ejs',
        templateParameters: {
          title: 'Porter Test Page',
          testvar: 'Test works',
        },
        favicon: './src/favicon.ico',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.ts$/,
          use: 'ts-loader',
          exclude: '/node_modules/',
        },
        {
          test: /\.md$/,
          exclude: '/node_modules/',
          use: [
            { loader: 'html-loader' },
            { loader: 'markdown-loader' },
          ],
        },
      ],
    },
    resolve: {
      extensions: ['.ts', '.js', '.md'],
    },
    devServer: {
      contentBase: `./${dist}`,
      watchOptions: {
        poll: true,
      },
    },
  };
  return config;
}

module.exports = isChild
  // In case file used as a module, return config builder function
  ? configBuilder
  // Otherwise return config object
  : configBuilder(env);
