const path = require('path');

// Plugins
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env, options) => {
  const config = {
    target: 'node',
    entry: {
      'webpack-s3-uploader': './src/webpack-s3-uploader.js'
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[name].js',
      libraryTarget: 'commonjs2'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          loader: 'babel-loader',
          exclude: /node_modules/
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(['./dist'])
    ],
    resolve: {
      extensions: ['.js']
    }
  };

  return config;
};