const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const GenerateJsonPlugin = require('generate-json-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { POPUP_PATH, OPTIONS_PATH } = require('./src/lib/constants');
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
  return {
    mode,
    entry: {
      background: './src/background.js',
      popup: './src/popup/popup.js',
      options: './src/options/options.js',
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, 'dist'),
    },
    devtool: mode === 'development' ? 'cheap-module-source-map' : false,
    plugins: [
      new CleanWebpackPlugin(),
      new GenerateJsonPlugin('manifest.json', {
        ...manifest,
        version,
        options_ui: { page: OPTIONS_PATH },
      }),
      new HtmlWebpackPlugin({
        filename: POPUP_PATH,
        template: 'src/popup/popup.html',
        chunks: ['popup'],
        minify,
      }),
      new HtmlWebpackPlugin({
        filename: OPTIONS_PATH,
        template: 'src/options/options.html',
        chunks: ['options'],
        minify,
      }),
      new CopyPlugin([
        { from: 'src/_locales', to: '_locales', force: true },
        { from: 'src/assets/icons', to: 'assets/icons', force: true },
      ]),
    ],
    module: {
      rules: [
        {
          test: /\.(png|svg|jpg|gif|woff|woff2|eot|ttf|otf)$/,
          loader: 'file-loader',
          options: { outputPath: 'assets' },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          enforce: 'pre',
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            fix: true,
          },
        },
      ],
    },
  };
};
