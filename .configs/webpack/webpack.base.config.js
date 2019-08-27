const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const autoprefixer = require('autoprefixer');
const webpack = require('webpack');

module.exports = {
    entry: [
      '@babel/polyfill',
      path.join(__dirname, '../../src/app.js'),
    ],
    module: {
      rules: [
        {
          test: [/.js$/],
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env'
              ]
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        '@js': path.resolve(__dirname, '../src/assets/scripts'),
        '@': path.resolve(__dirname, '../src'),
      },
      modules: [
        'node_modules',
        path.resolve(__dirname, '../src')
      ],
      extensions: ['.js'],
    },
    plugins: [
      new webpack.ProvidePlugin({
        _: 'underscore',
        Promise: 'es6-promise',
      })
    ]
};
