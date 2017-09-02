const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
  template: path.resolve('src/index.html'),
  filename: 'index.html',
  inject: 'body'
});

const config = {

  entry: path.resolve('src/index.js'),
  output: {
    path: path.resolve('dist'),
    filename: 'index.js'
  },

  module: {
    rules: [
      {
        test: /.js$/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [ 'style-loader', 'css-loader', 'resolve-url-loader' ]
      },
      {
        test: /\.scss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" }
        ]
      },
      {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000' }
    ]
  },

  plugins: [
    HtmlWebpackPluginConfig,
    new CopyWebpackPlugin([
      { from: './src/data', to: "data" },
      { from: './.surgeignore', to: ".surgeignore", toType: "file" }
    ])
  ],

  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 9000
  }

};

module.exports = config;