const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  target: 'node',
  entry: './src/webpack-s3-uploader.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'webpack-s3-uploader.js',
    libraryTarget: 'commonjs2'
  },
  externals: [nodeExternals()],
  devtool: false,
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  resolve: {
    extensions: ['.js']
  }
};
