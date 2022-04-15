const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { POPUP_PATH, RECENT_PATH, OPTIONS_PATH } = require('./src/lib/constants');
const { FUNC_TYPE_INFOS } = require('./src/lib/browser-action/func-type');
const { version } = require('./package.json');
const manifest = require('./src/manifest.json');

module.exports = (env, argv) => {
  const mode = argv.mode || 'development';
  const minify =
    argv.mode === 'production'
      ? {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true,
        }
      : false;
  const commands = {};
  for (const item of FUNC_TYPE_INFOS) {
    if (item.commands) {
      commands[item.name] = item.commands;
    }
  }
  return {
    mode,
    entry: {
      background: './src/background.js',
      popup: './src/popup/popup.js',
      recent: './src/popup/recent.js',
      options: './src/options/options.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    devtool: mode === 'development' ? 'cheap-module-source-map' : false,
    plugins: [
      new GenerateJsonPlugin('manifest.json', {
        ...manifest,
        version,
        options_ui: { page: OPTIONS_PATH },
        commands,
      }),
      new HtmlWebpackPlugin({
        filename: POPUP_PATH,
        template: 'src/popup/popup.html',
        chunks: ['popup'],
        minify,
      }),
      new HtmlWebpackPlugin({
        filename: RECENT_PATH,
        template: 'src/popup/recent.html',
        chunks: ['recent'],
        minify,
      }),
      new HtmlWebpackPlugin({
        filename: OPTIONS_PATH,
        template: 'src/options/options.html',
        chunks: ['options'],
        minify,
      }),
      new CopyPlugin({
        patterns: [
          { from: 'src/_locales', to: '_locales', force: true },
          { from: 'src/assets/icons', to: 'assets/icons', force: true },
        ],
      }),
      new ESLintPlugin({ fix: true }),
    ],
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|eot|ttf|otf)$/,
          use: [
            {
              loader: 'file-loader',
              options: { outputPath: 'assets' },
            },
          ],
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
      ],
    },
  };
};
