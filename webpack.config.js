const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const nodeModules = {};
fs.readdirSync('node_modules')
  .filter(mod => {
    return ['.bin'].indexOf(mod) === -1;
  })
  .forEach(mod => {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './src/server.js',
  target: 'node',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'server.js',
    sourceMapFilename: 'server.js.map',
  },
  devtool: '#source-map',
  externals: nodeModules,
  plugins: [
    new webpack.BannerPlugin('require("source-map-support").install();', {
      raw: true,
      entryOnly: true,
    }),
  ],
  module: {
    preLoaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'eslint',
      },
    ],
    loaders: [
      {
        test: /\.jsx?/,
        exclude: /node_modules/,
        loader: 'babel',
      },
    ],
  },
};